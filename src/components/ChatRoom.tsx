"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, ChatMessage } from "@/store/gameStore";
import { stages } from "@/data/stages";
import HpBar from "./HpBar";
import DamageEffect from "./DamageEffect";

interface Choice {
  text: string;
  text_ko: string;
  is_best: boolean;
}

const NPC_EMOTIONS: Record<string, string> = {
  neutral: "😐",
  angry: "😠",
  happy: "😊",
  confused: "😕",
};

export default function ChatRoom() {
  const {
    currentStageId,
    messages,
    hp,
    hintCount,
    isLoading,
    isGameOver,
    isStageCleared,
    addMessage,
    takeDamage,
    useHint,
    clearStage,
    resetStage,
    setLoading,
    selectStage,
  } = useGameStore();

  const [choices, setChoices] = useState<Choice[]>([]);
  const [damageEffect, setDamageEffect] = useState<{
    damage: number;
    feedback: string;
    isNatural: boolean;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [autoTts, setAutoTts] = useState(true);
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stage = stages.find((s) => s.id === currentStageId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, choices]);

  // TTS 재생 (Promise로 완료까지 대기 가능)
  const playTts = (messageId: string, text: string): Promise<void> => {
    return new Promise((resolve) => {
      // 이미 재생 중이면 중지
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

  // NPC 첫 인사
  const initConversation = useCallback(async () => {
    if (!stage || initialized) return;
    setInitialized(true);
    setLoading(true);

    addMessage({
      id: `sys-${Date.now()}`,
      role: "system",
      content: stage.description,
    });

    addMessage({
      id: `mission-${Date.now()}`,
      role: "system",
      content: `🎯 미션: ${stage.mission}`,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: stage.id,
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
        npcEmotion: data.npc_emotion,
        feedback: data.npc_reply_ko,
        missionStatus: data.mission_status,
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
        content: "⚠️ NPC 연결에 실패했습니다. 다시 시도해주세요.",
      });
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, initialized]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const selectChoice = async (choice: Choice) => {
    if (isLoading || !stage) return;

    const userMsgId = `user-${Date.now()}`;
    addMessage({
      id: userMsgId,
      role: "user",
      content: choice.text,
      feedback: choice.text_ko,
    });

    setChoices([]);
    setLoading(true);

    try {
      // 내 대사 TTS + API 호출을 동시에 시작
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
          stageId: stage.id,
          messages: chatHistory,
        }),
      }).then((res) => res.json());

      // 내 대사 TTS 재생 (autoTts일 때만)
      if (autoTts) {
        await playTts(userMsgId, choice.text);
      }

      // 내 TTS 끝난 뒤 API 응답 대기
      const data = await apiPromise;

      // 데미지 이펙트
      if (data.damage > 0 || data.feedback) {
        setDamageEffect({
          damage: data.damage || 0,
          feedback: data.feedback || "",
          isNatural: !data.damage || data.damage === 0,
        });

        if (data.damage > 0) {
          takeDamage(data.damage);
        }
      }

      const npcMsgId = `npc-${Date.now()}`;
      addMessage({
        id: npcMsgId,
        role: "npc",
        content: data.npc_reply,
        npcEmotion: data.npc_emotion,
        damage: data.damage,
        feedback: data.npc_reply_ko,
        missionStatus: data.mission_status,
      });

      // NPC 대사 TTS 재생 (내 대사 끝난 뒤 순차 실행)
      if (autoTts && data.npc_reply) {
        await playTts(npcMsgId, data.npc_reply);
      }

      if (data.choices) {
        setChoices(data.choices);
      }

      if (data.mission_status === "success") {
        clearStage();
      }
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: "system",
        content: "⚠️ 응답을 받지 못했습니다.",
      });
    }

    setLoading(false);
  };

  const handleHint = async () => {
    if (!useHint() || !stage) return;
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
          stageId: stage.id,
          messages: chatHistory,
          useHint: true,
        }),
      });

      const data = await res.json();

      addMessage({
        id: `hint-${Date.now()}`,
        role: "system",
        content: `🧪 파파고 물약 사용!\n\n💡 ${data.feedback || "가장 자연스러운 표현을 골라보세요!"}`,
      });
    } catch {
      addMessage({
        id: `err-${Date.now()}`,
        role: "system",
        content: "⚠️ 힌트를 가져오지 못했습니다.",
      });
    }

    setLoading(false);
  };

  const goBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setInitialized(false);
    setChoices([]);
    useGameStore.setState({ currentStageId: null, messages: [] });
  };

  if (!stage) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* 데미지 이펙트 */}
      {damageEffect && (
        <DamageEffect
          damage={damageEffect.damage}
          feedback={damageEffect.feedback}
          isNatural={damageEffect.isNatural}
          onComplete={() => setDamageEffect(null)}
        />
      )}

      {/* 상단 바 */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-white transition text-sm"
          >
            ← 나가기
          </button>
          <div className="flex-1 text-center">
            <span className="text-lg font-bold text-white">
              {stage.emoji} {stage.name}
            </span>
            <span className="text-gray-400 text-sm ml-2">{stage.nameJa}</span>
          </div>
          <button
            onClick={() => setAutoTts(!autoTts)}
            className={`text-sm px-2 py-1 rounded-lg transition ${
              autoTts
                ? "bg-blue-600/30 text-blue-400"
                : "bg-gray-800 text-gray-500"
            }`}
            title="자동 음성 재생"
          >
            {autoTts ? "🔊" : "🔇"}
          </button>
          <div className="text-sm text-gray-400">🧪 ×{hintCount}</div>
        </div>
        <HpBar />
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
                <div className="bg-gray-800/60 rounded-xl px-4 py-2 max-w-[85%] text-center">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : msg.role === "npc" ? (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="text-2xl mt-1">
                    {NPC_EMOTIONS[msg.npcEmotion || "neutral"]}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {stage.npcName}
                    </p>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="text-white text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      {/* 한국어 번역 토글 */}
                      {msg.feedback && (
                        <AnimatePresence>
                          {showTranslation === msg.id && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700"
                            >
                              🇰🇷 {msg.feedback}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={() => playTts(msg.id, msg.content)}
                        className={`text-xs flex items-center gap-1 transition ${
                          playingId === msg.id
                            ? "text-blue-400"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        {playingId === msg.id ? "🔊 재생 중..." : "🔈 듣기"}
                      </button>
                      {msg.feedback && (
                        <button
                          onClick={() =>
                            setShowTranslation(
                              showTranslation === msg.id ? null : msg.id
                            )
                          }
                          className="text-xs text-gray-500 hover:text-gray-300 transition"
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
                  <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-white text-sm">{msg.content}</p>
                    {msg.feedback && (
                      <p className="text-blue-200 text-xs mt-1">
                        {msg.feedback}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => playTts(msg.id, msg.content)}
                    className={`mt-1 text-xs flex items-center gap-1 transition justify-end w-full ${
                      playingId === msg.id
                        ? "text-blue-400"
                        : "text-gray-500 hover:text-gray-300"
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
            <div className="bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 게임 오버 / 클리어 */}
      <AnimatePresence>
        {(isGameOver || isStageCleared) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`p-8 rounded-3xl text-center mx-4 max-w-sm w-full ${
                isStageCleared
                  ? "bg-green-950/90 border border-green-700"
                  : "bg-red-950/90 border border-red-700"
              }`}
            >
              <div className="text-5xl mb-4">
                {isStageCleared ? "🎉" : "💀"}
              </div>
              <h2 className="text-2xl font-black text-white mb-2">
                {isStageCleared ? "STAGE CLEAR!" : "GAME OVER"}
              </h2>
              <p className="text-gray-300 text-sm mb-2">
                {isStageCleared
                  ? `${stage.name} 스테이지를 클리어했습니다!`
                  : "멘탈이 0이 되었습니다..."}
              </p>
              <p className="text-gray-400 text-xs mb-6">
                {isStageCleared
                  ? `남은 HP: ${hp}/100`
                  : "다시 도전해보세요!"}
              </p>
              <div className="space-y-2">
                {isStageCleared && currentStageId && currentStageId < 5 && (
                  <button
                    onClick={() => {
                      setInitialized(false);
                      setChoices([]);
                      selectStage(currentStageId + 1);
                    }}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition"
                  >
                    다음 스테이지 →
                  </button>
                )}
                <button
                  onClick={() => {
                    setInitialized(false);
                    setChoices([]);
                    resetStage();
                    if (currentStageId) selectStage(currentStageId);
                  }}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition"
                >
                  다시 도전
                </button>
                <button
                  onClick={goBack}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition"
                >
                  스테이지 선택으로
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선택지 영역 */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 shrink-0">
        {choices.length > 0 && !isGameOver && !isStageCleared ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">답변을 선택하세요</p>
              <button
                onClick={handleHint}
                disabled={
                  hintCount <= 0 || isLoading
                }
                className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition"
              >
                🧪 힌트 ({hintCount})
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
                className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 hover:border-gray-500 rounded-xl transition disabled:opacity-50"
              >
                <p className="text-white text-sm font-medium">
                  {choice.text}
                </p>
                <p className="text-gray-400 text-xs mt-1">{choice.text_ko}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          !isGameOver &&
          !isStageCleared && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">
                {isLoading ? "NPC가 대답하는 중..." : "선택지를 기다리는 중..."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
