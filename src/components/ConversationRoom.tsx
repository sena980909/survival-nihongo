"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useLearningStore,
  ChatMessage,
  BookmarkedExpression,
} from "@/store/learningStore";
import { scenarios } from "@/data/scenarios";
import {
  conversationFlows,
  ConversationChoice,
} from "@/data/conversationFlows";
import CorrectionCard from "./CorrectionCard";
import KanjiCard from "./KanjiCard";
import ConversationComplete from "./ConversationComplete";
import ProgressDots from "./ProgressDots";

interface DisplayChoice {
  text: string;
  text_ko: string;
  text_pronunciation: string;
  quality: "best" | "acceptable" | "poor";
  _originalIndex: number;
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
    setLoading,
  } = useLearningStore();

  const [choices, setChoices] = useState<DisplayChoice[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [autoTts, setAutoTts] = useState(true);
  const [ttsVolume, setTtsVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find((s) => s.id === currentScenarioId);
  const flow = currentScenarioId
    ? conversationFlows[currentScenarioId]
    : undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, choices]);

  // 선택지 랜덤 셔플
  const shuffleChoices = (
    original: ConversationChoice[]
  ): DisplayChoice[] => {
    const indexed = original.map((c, i) => ({
      text: c.text,
      text_ko: c.textKo,
      text_pronunciation: c.textPronunciation,
      quality: c.quality,
      _originalIndex: i,
    }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    return indexed;
  };

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
          audio.volume = ttsVolume;
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

  // 대화 시작 (로컬 데이터 사용)
  const initConversation = useCallback(() => {
    if (!scenario || !flow || initialized) return;
    setInitialized(true);
    setCurrentNodeIndex(0);

    addMessage({
      id: `sys-${Date.now()}`,
      role: "system",
      content: scenario.description,
    });

    addMessage({
      id: `obj-${Date.now() + 1}`,
      role: "system",
      content: `📚 학습 목표: ${scenario.learningObjectives.join(", ")}`,
    });

    // 첫 번째 NPC 메시지
    const firstNode = flow[0];
    const npcId = `npc-${Date.now() + 2}`;
    addMessage({
      id: npcId,
      role: "npc",
      content: firstNode.npcMessage,
      contentKo: firstNode.npcMessageKo,
      contentPronunciation: firstNode.npcMessagePronunciation,
      npcEmotion: firstNode.npcEmotion,
    });

    setChoices(shuffleChoices(firstNode.choices));

    if (autoTts) {
      playTts(npcId, firstNode.npcMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, flow, initialized]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // 선택지 클릭 (로컬 데이터 사용)
  const selectChoice = async (choice: DisplayChoice) => {
    if (isLoading || !scenario || !flow) return;

    const currentNode = flow[currentNodeIndex];
    const originalChoice = currentNode.choices[choice._originalIndex];

    // 유저 메시지 추가
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

    // TTS 재생
    if (autoTts) {
      await playTts(userMsgId, choice.text);
    }

    // 약간의 지연으로 자연스러운 느낌
    await new Promise((r) => setTimeout(r, 500));

    // 교정 피드백 포함 NPC 메시지
    const npcMsgId = `npc-${Date.now()}`;
    const npcMessage: ChatMessage = {
      id: npcMsgId,
      role: "npc",
      content: currentNode.npcMessage,
      contentKo: currentNode.npcMessageKo,
      contentPronunciation: currentNode.npcMessagePronunciation,
      npcEmotion: currentNode.npcEmotion,
      correction: {
        wasCorrect: originalChoice.correction.wasCorrect,
        explanation: originalChoice.correction.explanation,
        betterExpression: originalChoice.correction.betterExpression,
        betterExpressionKo: originalChoice.correction.betterExpressionKo,
        betterExpressionPronunciation:
          originalChoice.correction.betterExpressionPronunciation,
        grammarPoint: originalChoice.correction.grammarPoint,
      },
    };

    if (currentNode.kanjiNote) {
      npcMessage.kanjiNote = currentNode.kanjiNote;
      addLearnedKanji(currentNode.kanjiNote.kanji);
    }

    // 다음 노드로 이동
    const nextIndex = currentNodeIndex + 1;

    if (currentNode.isLast || nextIndex >= flow.length) {
      // 마지막 노드: 교정 메시지만 추가하고 대화 완료
      // NPC 메시지를 교정 카드용으로 조정
      npcMessage.content = "";
      npcMessage.contentKo = undefined;
      npcMessage.contentPronunciation = undefined;
      addMessage(npcMessage);
      setLoading(false);
      completeConversation();
      return;
    }

    // 다음 NPC 메시지 표시
    const nextNode = flow[nextIndex];

    // 교정 피드백 (현재 노드 기반)
    const correctionMsgId = `correction-${Date.now()}`;
    const correctionMsg: ChatMessage = {
      id: correctionMsgId,
      role: "npc",
      content: nextNode.npcMessage,
      contentKo: nextNode.npcMessageKo,
      contentPronunciation: nextNode.npcMessagePronunciation,
      npcEmotion: nextNode.npcEmotion,
      correction: {
        wasCorrect: originalChoice.correction.wasCorrect,
        explanation: originalChoice.correction.explanation,
        betterExpression: originalChoice.correction.betterExpression,
        betterExpressionKo: originalChoice.correction.betterExpressionKo,
        betterExpressionPronunciation:
          originalChoice.correction.betterExpressionPronunciation,
        grammarPoint: originalChoice.correction.grammarPoint,
      },
    };

    if (currentNode.kanjiNote) {
      correctionMsg.kanjiNote = currentNode.kanjiNote;
    }

    addMessage(correctionMsg);

    setCurrentNodeIndex(nextIndex);
    setChoices(shuffleChoices(nextNode.choices));
    setLoading(false);

    if (autoTts) {
      playTts(correctionMsgId, nextNode.npcMessage);
    }
  };

  // 도움말 (로컬 — 각 선택지의 뉘앙스를 보여줌)
  const handleHelp = () => {
    if (!flow || isLoading) return;

    const currentNode = flow[currentNodeIndex];
    const hints = currentNode.choices
      .map((c) => {
        const label =
          c.quality === "best"
            ? "⭐"
            : c.quality === "acceptable"
            ? "🔵"
            : "🔴";
        return `${label} "${c.text}" (${c.textPronunciation}) — ${c.textKo}`;
      })
      .join("\n");

    addMessage({
      id: `help-${Date.now()}`,
      role: "system",
      content: `💡 각 선택지의 뜻을 참고하세요:\n${hints}\n\n⭐ 가장 적절 | 🔵 괜찮음 | 🔴 부적절`,
    });
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
      setCurrentNodeIndex(0);
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

  const totalSteps = flow ? flow.length : 5;

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
          <div className="relative flex items-center gap-1">
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
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
              title="음량 조절"
            >
              ▾
            </button>
            {showVolumeSlider && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-20 w-36">
                <p className="text-xs text-gray-500 mb-2">음량 {Math.round(ttsVolume * 100)}%</p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsVolume}
                  onChange={(e) => setTtsVolume(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <ProgressDots
            current={Math.min(currentNodeIndex, totalSteps)}
            total={totalSteps}
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
                    {msg.content && (
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
                    )}

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

                    {msg.content && (
                      <div className="flex gap-3 mt-1.5">
                        <button
                          onClick={() => playTts(msg.id, msg.content)}
                          className={`text-xs flex items-center gap-1 transition ${
                            playingId === msg.id
                              ? "text-indigo-500"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {playingId === msg.id
                            ? "🔊 재생 중..."
                            : "🔈 듣기"}
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
                    )}
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
              </motion.button>
            ))}
          </div>
        ) : (
          !isConversationComplete && (
            <div className="text-center py-2">
              <p className="text-gray-400 text-sm">
                {isLoading
                  ? "응답을 기다리는 중..."
                  : "선택지를 기다리는 중..."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
