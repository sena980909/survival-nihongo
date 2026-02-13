"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, ChatMessage } from "@/store/gameStore";
import { stages } from "@/data/stages";
import HpBar from "./HpBar";
import DamageEffect from "./DamageEffect";

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

  const [input, setInput] = useState("");
  const [damageEffect, setDamageEffect] = useState<{
    damage: number;
    feedback: string;
    isNatural: boolean;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [autoTts, setAutoTts] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stage = stages.find((s) => s.id === currentStageId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // NPC 첫 인사
  const initConversation = useCallback(async () => {
    if (!stage || initialized) return;
    setInitialized(true);
    setLoading(true);

    // 스테이지 설명 시스템 메시지
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
          messages: [
            { role: "user", content: "（韓国人旅行客が目の前に現れました。NPCとして最初の一言を言ってください。）" },
          ],
        }),
      });

      const data = await res.json();

      const npcId = `npc-${Date.now()}`;
      addMessage({
        id: npcId,
        role: "npc",
        content: data.npc_reply,
        npcEmotion: data.npc_emotion,
        missionStatus: data.mission_status,
      });

      // 자동 TTS
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
  }, [stage, initialized, setLoading, addMessage, autoTts]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !stage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    addMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = [
        ...messages.filter((m) => m.role !== "system"),
        userMsg,
      ].map((m) => ({
        role: m.role === "npc" ? "assistant" : "user",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: stage.id,
          messages: chatHistory,
        }),
      });

      const data = await res.json();

      // 데미지 이펙트 표시
      if (data.damage > 0 || data.feedback) {
        setDamageEffect({
          damage: data.damage,
          feedback: data.feedback,
          isNatural: data.user_evaluation?.is_natural ?? true,
        });

        if (data.damage > 0) {
          takeDamage(data.damage);
        }
      }

      // NPC 응답 추가
      const npcMsgId = `npc-${Date.now()}`;
      addMessage({
        id: npcMsgId,
        role: "npc",
        content: data.npc_reply,
        npcEmotion: data.npc_emotion,
        damage: data.damage,
        feedback: data.feedback,
        isNatural: data.user_evaluation?.is_natural,
        grammarError: data.user_evaluation?.grammar_error,
        politenessLevel: data.user_evaluation?.politeness_level,
        missionStatus: data.mission_status,
      });

      // 자동 TTS
      if (autoTts && data.npc_reply) {
        playTts(npcMsgId, data.npc_reply);
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
        content: `🧪 파파고 물약 사용! \n\n💡 모범 답안:\n${data.feedback}`,
      });

      addMessage({
        id: `npc-${Date.now()}`,
        role: "npc",
        content: data.npc_reply,
        npcEmotion: data.npc_emotion,
        missionStatus: data.mission_status,
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

  const playTts = async (messageId: string, text: string) => {
    // 이미 재생 중이면 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      if (playingId === messageId) {
        setPlayingId(null);
        return;
      }
    }

    setPlayingId(messageId);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayingId(null);
        audioRef.current = null;
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch {
      setPlayingId(null);
    }
  };

  const goBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setInitialized(false);
    useGameStore.setState({ currentStageId: null, messages: [] });
  };

  if (!stage) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* 데미지 이펙트 오버레이 */}
      {damageEffect && (
        <DamageEffect
          damage={damageEffect.damage}
          feedback={damageEffect.feedback}
          isNatural={damageEffect.isNatural}
          onComplete={() => setDamageEffect(null)}
        />
      )}

      {/* 상단 바 */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
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
          <div className="text-sm text-gray-400">
            🧪 ×{hintCount}
          </div>
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
                    </div>
                    <button
                      onClick={() => playTts(msg.id, msg.content)}
                      className={`mt-1 text-xs flex items-center gap-1 transition ${
                        playingId === msg.id
                          ? "text-blue-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {playingId === msg.id ? "🔊 재생 중..." : "🔈 듣기"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-[80%]">
                  <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
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

      {/* 게임 오버 / 클리어 오버레이 */}
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
                isStageCleared ? "bg-green-950/90 border border-green-700" : "bg-red-950/90 border border-red-700"
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

      {/* 입력 영역 */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={handleHint}
            disabled={hintCount <= 0 || isLoading || isGameOver || isStageCleared}
            className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition shrink-0"
            title="파파고 물약 (모범 답안 보기)"
          >
            🧪
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="일본어로 대답하세요..."
            disabled={isLoading || isGameOver || isStageCleared}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || isGameOver || isStageCleared}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-xl font-bold transition shrink-0"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
