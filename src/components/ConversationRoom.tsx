"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLearningStore,
  ChatMessage,
  BookmarkedExpression,
} from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";
import CorrectionCard from "./CorrectionCard";
import KanjiCard from "./KanjiCard";
import ConversationComplete from "./ConversationComplete";
import ProgressDots from "./ProgressDots";

interface Choice {
  text: string;
  text_ko: string;
  text_pronunciation: string;
  quality: "best" | "acceptable" | "poor";
}

const NPC_EMOTIONS: Record<string, string> = {
  neutral: "😐",
  happy: "😊",
  confused: "😕",
  encouraging: "😄",
};

export default function ConversationRoom() {
  const {
    currentScenarioId,
    messages,
    isLoading,
    isConversationComplete,
    bookmarkedExpressions,
    addMessage,
    completeConversation,
    toggleBookmark,
    addLearnedKanji,
    goToScenarioList,
    resetConversation,
    setLoading,
  } = useLearningStore();

  const [choices, setChoices] = useState<Choice[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [autoTts, setAutoTts] = useState(true);
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const [conversationStep, setConversationStep] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find((s) => s.id === currentScenarioId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, choices]);

  // TTS 재생
  const playTts = (messageId: string, text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        if (playingId === messageId) {
          setPlayingId(null);
          resolve();
          return;
        }
      }

      setPlayingId(messageId);

      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("TTS failed");
          return res.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            setPlayingId(null);
            audioRef.current = null;
            URL.revokeObjectURL(url);
            resolve();
          };

          audio.onerror = () => {
            setPlayingId(null);
            audioRef.current = null;
            URL.revokeObjectURL(url);
            resolve();
          };

          audio.play().catch(() => {
            setPlayingId(null);
            resolve();
          });
        })
        .catch(() => {
          setPlayingId(null);
          resolve();
        });
    });
  };

  // 대화 시작
  const initConversation = useCallback(async () => {
    if (!scenario || initialized) return;
    setInitialized(true);
    setLoading(true);

    addMessage({
      id: `sys-${Date.now()}`,
      role: "system",
      content: scenario.description,
    });

    addMessage({
      id: `obj-${Date.now()}`,
      role: "system",
      content: `📚 학습 목표: ${scenario.learningObjectives.join(", ")}`,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: [],
          isInitial: true,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const npcId = `npc-${Date.now()}`;
      addMessage({
        id: npcId,
        role: "npc",
        content: data.npc_reply,
        contentKo: data.npc_reply_ko,
        contentPronunciation: data.npc_reply_pronunciation,
        npcEmotion: data.npc_emotion,
      });

      if (data.choices) {
        setChoices(data.choices);
      }

      if (autoTts && data.npc_reply) {
        playTts(npcId, data.npc_reply);
      }
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: "system",
        content: "연결에 실패했습니다. 다시 시도해주세요.",
      });
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, initialized]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // 선택지 클릭
  const selectChoice = async (choice: Choice) => {
    if (isLoading || !scenario) return;

    const userMsgId = `user-${Date.now()}`;
    addMessage({
      id: userMsgId,
      role: "user",
      content: choice.text,
      contentKo: choice.text_ko,
      contentPronunciation: choice.text_pronunciation,
    });

    setChoices([]);
    setLoading(true);
    setConversationStep((prev) => prev + 1);

    try {
      const chatHistory = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "npc" ? "assistant" : "user",
          content: m.content,
        }));
      chatHistory.push({ role: "user", content: choice.text });

      const apiPromise = fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: chatHistory,
        }),
      }).then((res) => res.json());

      if (autoTts) {
        await playTts(userMsgId, choice.text);
      }

      const data = await apiPromise;

      const npcMsgId = `npc-${Date.now()}`;
      const npcMessage: ChatMessage = {
        id: npcMsgId,
        role: "npc",
        content: data.npc_reply,
        contentKo: data.npc_reply_ko,
        contentPronunciation: data.npc_reply_pronunciation,
        npcEmotion: data.npc_emotion,
      };

      if (data.correction) {
        npcMessage.correction = {
          wasCorrect: data.correction.was_correct,
          explanation: data.correction.explanation,
          betterExpression: data.correction.better_expression,
          betterExpressionKo: data.correction.better_expression_ko,
          betterExpressionPronunciation:
            data.correction.better_expression_pronunciation,
          grammarPoint: data.correction.grammar_point,
        };
      }

      if (data.kanji_note) {
        npcMessage.kanjiNote = {
          kanji: data.kanji_note.kanji,
          reading: data.kanji_note.reading,
          pronunciation: data.kanji_note.pronunciation,
          meaning: data.kanji_note.meaning,
          explanation: data.kanji_note.explanation,
        };
        addLearnedKanji(data.kanji_note.kanji);
      }

      addMessage(npcMessage);

      if (autoTts && data.npc_reply) {
        await playTts(npcMsgId, data.npc_reply);
      }

      if (data.choices) {
        setChoices(data.choices);
      }

      if (data.conversation_status === "completed") {
        completeConversation();
      }
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: "system",
        content: "응답을 받지 못했습니다.",
      });
    }

    setLoading(false);
  };

  // 도움말 요청
  const handleHelp = async () => {
    if (!scenario || isLoading) return;
    setLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "npc" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: chatHistory,
          requestHelp: true,
        }),
      });

      const data = await res.json();

      addMessage({
        id: `help-${Date.now()}`,
        role: "system",
        content: `💡 ${data.correction?.explanation || data.npc_reply_ko || "각 선택지를 잘 비교해보세요!"}`,
      });
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: "system",
        content: "도움말을 가져오지 못했습니다.",
      });
    }

    setLoading(false);
  };

  // 나가기
  const goBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setInitialized(false);
    setChoices([]);
    goToScenarioList();
  };

  // 다시 연습 (resetConversation 이후 재시작)
  useEffect(() => {
    if (messages.length === 0 && initialized && !isConversationComplete) {
      setInitialized(false);
      setConversationStep(0);
    }
  }, [messages.length, initialized, isConversationComplete]);

  const handleBookmarkFromCorrection = (msg: ChatMessage) => {
    if (!msg.correction || !currentScenarioId) return;
    const expr: BookmarkedExpression = {
      id: `bm-${msg.id}`,
      japanese: msg.correction.betterExpression || msg.content,
      korean: msg.correction.betterExpressionKo || msg.contentKo || "",
      pronunciation:
        msg.correction.betterExpressionPronunciation ||
        msg.contentPronunciation ||
        "",
      scenarioId: currentScenarioId,
      grammarNote: msg.correction.grammarPoint,
    };
    toggleBookmark(expr);
  };

  if (!scenario) return null;

  const estimatedTotalSteps = 5;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 대화 완료 모달 */}
      {isConversationComplete && (
        <ConversationComplete messages={messages} />
      )}

      {/* 상단 바 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-gray-700 transition text-sm"
          >
            ← 나가기
          </button>
          <div className="flex-1 text-center">
            <span className="text-base font-bold text-gray-900">
              {scenario.emoji} {scenario.name}
            </span>
            <span className="text-gray-400 text-sm ml-2">
              {scenario.nameJa}
            </span>
          </div>
          <button
            onClick={() => setAutoTts(!autoTts)}
            className={`text-sm px-2 py-1 rounded-lg transition ${
              autoTts
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-400"
            }`}
            title="자동 음성 재생"
          >
            {autoTts ? "🔊" : "🔇"}
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <ProgressDots
            current={Math.min(conversationStep, estimatedTotalSteps)}
            total={estimatedTotalSteps}
          />
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : msg.role === "system"
                  ? "justify-center"
                  : "justify-start"
              }`}
            >
              {msg.role === "system" ? (
                <div className="bg-gray-100 rounded-xl px-4 py-2 max-w-[85%] text-center">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : msg.role === "npc" ? (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="text-2xl mt-1">
                    {NPC_EMOTIONS[msg.npcEmotion || "neutral"]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">
                      {scenario.npcName}
                    </p>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                      <p className="text-gray-900 text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {msg.contentPronunciation && (
                        <p className="text-xs text-gray-400 mt-1">
                          ({msg.contentPronunciation})
                        </p>
                      )}
                      {/* 한국어 번역 토글 */}
                      <AnimatePresence>
                        {showTranslation === msg.id && msg.contentKo && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100"
                          >
                            🇰🇷 {msg.contentKo}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 교정 카드 */}
                    {msg.correction && (
                      <CorrectionCard
                        correction={msg.correction}
                        onBookmark={() => handleBookmarkFromCorrection(msg)}
                        isBookmarked={bookmarkedExpressions.some(
                          (b) => b.id === `bm-${msg.id}`
                        )}
                      />
                    )}

                    {/* 한자 카드 */}
                    {msg.kanjiNote && <KanjiCard kanjiNote={msg.kanjiNote} />}

                    <div className="flex gap-3 mt-1.5">
                      <button
                        onClick={() => playTts(msg.id, msg.content)}
                        className={`text-xs flex items-center gap-1 transition ${
                          playingId === msg.id
                            ? "text-indigo-500"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {playingId === msg.id ? "🔊 재생 중..." : "🔈 듣기"}
                      </button>
                      {msg.contentKo && (
                        <button
                          onClick={() =>
                            setShowTranslation(
                              showTranslation === msg.id ? null : msg.id
                            )
                          }
                          className="text-xs text-gray-400 hover:text-gray-600 transition"
                        >
                          {showTranslation === msg.id
                            ? "🇰🇷 번역 숨기기"
                            : "🇰🇷 번역 보기"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%]">
                  <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                    <p className="text-white text-sm">{msg.content}</p>
                    {msg.contentPronunciation && (
                      <p className="text-indigo-200 text-xs mt-0.5">
                        ({msg.contentPronunciation})
                      </p>
                    )}
                    {msg.contentKo && (
                      <p className="text-indigo-200 text-xs mt-0.5">
                        {msg.contentKo}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => playTts(msg.id, msg.content)}
                    className={`mt-1 text-xs flex items-center gap-1 transition justify-end w-full ${
                      playingId === msg.id
                        ? "text-indigo-500"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {playingId === msg.id ? "🔊 재생 중..." : "🔈 듣기"}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">{NPC_EMOTIONS.neutral}</span>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 선택지 영역 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
        {choices.length > 0 && !isConversationComplete ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">답변을 선택하세요</p>
              <button
                onClick={handleHelp}
                disabled={isLoading}
                className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-600 rounded-lg text-xs font-medium transition"
              >
                💡 도움말
              </button>
            </div>
            {choices.map((choice, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => selectChoice(choice)}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-indigo-50 active:bg-indigo-100 border border-gray-200 hover:border-indigo-300 rounded-xl transition disabled:opacity-50"
              >
                <p className="text-gray-900 text-sm font-medium">
                  {choice.text}
                </p>
                {choice.text_pronunciation && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    ({choice.text_pronunciation})
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-0.5">
                  {choice.text_ko}
                </p>
              </motion.button>
            ))}
          </div>
        ) : (
          !isConversationComplete && (
            <div className="text-center py-2">
              <p className="text-gray-400 text-sm">
                {isLoading ? "응답을 기다리는 중..." : "선택지를 기다리는 중..."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
