"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { stages } from "@/data/stages";
import { dialogueMap } from "@/data/dialogues";
import { DialogueChoice } from "@/data/dialogue";
import HpBar from "./HpBar";
import DamageEffect from "./DamageEffect";
import EducationPanel from "./EducationPanel";

const NPC_EMOTIONS: Record<string, string> = {
  neutral: "😐",
  angry: "😠",
  happy: "😊",
  confused: "😕",
};

function shuffleChoices(choices: DialogueChoice[]): DialogueChoice[] {
  const shuffled = [...choices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ChatRoom() {
  const {
    currentStageId,
    messages,
    hp,
    hintCount,
    isLoading,
    isGameOver,
    isStageCleared,
    currentStepId,
    completedMilestones,
    currentEducation,
    showEducation,
    addMessage,
    takeDamage,
    useHint,
    clearStage,
    resetStage,
    setLoading,
    selectStage,
    setCurrentStep,
    addMilestone,
    setEducation,
    toggleEducation,
  } = useGameStore();

  const [shuffledChoices, setShuffledChoices] = useState<DialogueChoice[]>([]);
  const [damageEffect, setDamageEffect] = useState<{
    damage: number;
    feedback: string;
    isNatural: boolean;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [autoTts, setAutoTts] = useState(true);
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const stage = stages.find((s) => s.id === currentStageId);
  const dialogue = currentStageId ? dialogueMap[currentStageId] : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, shuffledChoices]);

  // TTS 프리로드
  const preloadTts = useCallback((text: string) => {
    if (ttsCacheRef.current.has(text)) return;
    fetch(`${API_URL}/api/tts`, {
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
        ttsCacheRef.current.set(text, url);
      })
      .catch(() => {});
  }, []);

  // TTS 재생 (캐시 우선)
  const playTts = (messageId: string, text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isTtsLoading) { resolve(); return; }

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
      setIsTtsLoading(true);

      const playFromUrl = (url: string) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setPlayingId(null);
          setIsTtsLoading(false);
          audioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          setPlayingId(null);
          setIsTtsLoading(false);
          resolve();
        };
        audio.play().catch(() => {
          setPlayingId(null);
          setIsTtsLoading(false);
          resolve();
        });
      };

      const cached = ttsCacheRef.current.get(text);
      if (cached) {
        playFromUrl(cached);
        return;
      }

      fetch(`${API_URL}/api/tts`, {
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
          ttsCacheRef.current.set(text, url);
          playFromUrl(url);
        })
        .catch(() => {
          setPlayingId(null);
          setIsTtsLoading(false);
          resolve();
        });
    });
  };

  // 초기화: 스크립트에서 첫 스텝 로드
  const initConversation = useCallback(() => {
    if (!stage || !dialogue || initialized) return;
    setInitialized(true);

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

    const firstStep = dialogue.steps.find(
      (s) => s.id === dialogue.initialStepId
    );
    if (!firstStep) return;

    setCurrentStep(firstStep.id);

    const npcId = `npc-${Date.now()}`;
    addMessage({
      id: npcId,
      role: "npc",
      content: firstStep.npcLine,
      pronunciation: firstStep.npcLinePronunciation,
      npcEmotion: firstStep.npcEmotion,
      feedback: firstStep.npcLineKo,
    });

    setShuffledChoices(shuffleChoices(firstStep.choices));
    setEducation(firstStep.education);

    // 선택지 TTS 프리로드
    firstStep.choices.forEach((c) => preloadTts(c.text));

    if (autoTts) {
      playTts(npcId, firstStep.npcLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, dialogue, initialized]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // 선택지 클릭
  const selectChoice = async (choice: DialogueChoice) => {
    if (isLoading || !stage || !dialogue) return;
    setLoading(true);

    const userMsgId = `user-${Date.now()}`;
    addMessage({
      id: userMsgId,
      role: "user",
      content: choice.text,
      pronunciation: choice.pronunciation,
      feedback: choice.textKo,
    });

    setShuffledChoices([]);

    // 내 대사 TTS
    if (autoTts) {
      await playTts(userMsgId, choice.text);
    }

    // 데미지 처리
    if (choice.damage > 0 || choice.feedback) {
      setDamageEffect({
        damage: choice.damage,
        feedback: choice.feedback,
        isNatural: choice.damage === 0,
      });
      if (choice.damage > 0) {
        takeDamage(choice.damage);
      }
    }

    // 현재 스텝에서 milestone 체크
    const currentStep = dialogue.steps.find((s) => s.id === currentStepId);
    if (
      currentStep?.isMilestone &&
      currentStep.milestoneTag &&
      choice.quality !== "bad"
    ) {
      addMilestone(currentStep.milestoneTag);
    }

    // 교육 콘텐츠 설정
    if (currentStep) {
      setEducation(currentStep.education);
    }

    // 미션 완료 체크
    const allMilestones = [...completedMilestones];
    if (
      currentStep?.isMilestone &&
      currentStep.milestoneTag &&
      choice.quality !== "bad" &&
      !allMilestones.includes(currentStep.milestoneTag)
    ) {
      allMilestones.push(currentStep.milestoneTag);
    }
    const missionComplete = dialogue.requiredMilestones.every((m) =>
      allMilestones.includes(m)
    );

    if (missionComplete && choice.nextStepId === "END") {
      const npcId = `npc-${Date.now()}`;
      addMessage({
        id: npcId,
        role: "npc",
        content: dialogue.successNpcLine,
        pronunciation: dialogue.successNpcLinePronunciation,
        npcEmotion: "happy",
        feedback: dialogue.successNpcLineKo,
        missionStatus: "success",
      });
      if (autoTts) await playTts(npcId, dialogue.successNpcLine);
      clearStage();
      setLoading(false);
      return;
    }

    // 다음 스텝 로드
    const nextStepId = choice.nextStepId === "END" ? null : choice.nextStepId;
    if (!nextStepId) {
      // END인데 미션 미완료 → 마지막 NPC 대사 후 종료
      const npcId = `npc-${Date.now()}`;
      addMessage({
        id: npcId,
        role: "npc",
        content: dialogue.successNpcLine,
        pronunciation: dialogue.successNpcLinePronunciation,
        npcEmotion: "happy",
        feedback: dialogue.successNpcLineKo,
        missionStatus: "success",
      });
      if (autoTts) await playTts(npcId, dialogue.successNpcLine);
      clearStage();
      setLoading(false);
      return;
    }

    const nextStep = dialogue.steps.find((s) => s.id === nextStepId);
    if (!nextStep) {
      setLoading(false);
      return;
    }

    setCurrentStep(nextStep.id);

    const npcMsgId = `npc-${Date.now()}`;
    addMessage({
      id: npcMsgId,
      role: "npc",
      content: nextStep.npcLine,
      pronunciation: nextStep.npcLinePronunciation,
      npcEmotion: choice.npcEmotion,
      feedback: nextStep.npcLineKo,
    });

    setShuffledChoices(shuffleChoices(nextStep.choices));
    setEducation(nextStep.education);
    // 다음 선택지 TTS 프리로드
    nextStep.choices.forEach((c) => preloadTts(c.text));

    if (autoTts) {
      await playTts(npcMsgId, nextStep.npcLine);
    }

    setLoading(false);
  };

  // 힌트
  const handleHint = async () => {
    if (!useHint() || !stage) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hint",
          stageId: stage.id,
          currentStepId,
        }),
      });
      const data = await res.json();
      addMessage({
        id: `hint-${Date.now()}`,
        role: "system",
        content: `🧪 파파고 물약 사용!\n\n💡 ${data.hint || "가장 자연스러운 표현을 골라보세요!"}`,
      });
    } catch {
      // fallback: 스크립트에서 best choice feedback
      const currentStep = dialogue?.steps.find((s) => s.id === currentStepId);
      const best = currentStep?.choices.find((c) => c.quality === "best");
      addMessage({
        id: `hint-${Date.now()}`,
        role: "system",
        content: `🧪 파파고 물약 사용!\n\n💡 ${best?.feedback || "가장 자연스러운 표현을 골라보세요!"}`,
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
    setShuffledChoices([]);
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
                      {msg.pronunciation && (
                        <p className="text-purple-400 text-xs mt-1">
                          ({msg.pronunciation})
                        </p>
                      )}
                      <AnimatePresence>
                        {showTranslation === msg.id && msg.feedback && (
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
                    </div>
                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={() => playTts(msg.id, msg.content)}
                        disabled={playingId === msg.id || isTtsLoading}
                        className={`text-xs transition ${
                          playingId === msg.id
                            ? "text-blue-400"
                            : isTtsLoading
                            ? "text-gray-600 cursor-not-allowed"
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
                    {msg.pronunciation && (
                      <p className="text-blue-200 text-xs mt-0.5">
                        ({msg.pronunciation})
                      </p>
                    )}
                    {msg.feedback && (
                      <p className="text-blue-200 text-xs mt-1">
                        {msg.feedback}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => playTts(msg.id, msg.content)}
                    disabled={playingId === msg.id || isTtsLoading}
                    className={`mt-1 text-xs flex items-center gap-1 transition justify-end w-full ${
                      playingId === msg.id
                        ? "text-blue-400"
                        : isTtsLoading
                        ? "text-gray-600 cursor-not-allowed"
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
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
                      setShuffledChoices([]);
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
                    setShuffledChoices([]);
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

      {/* 교육 패널 */}
      {currentEducation && !isGameOver && !isStageCleared && (
        <EducationPanel
          education={currentEducation}
          show={showEducation}
          onToggle={toggleEducation}
        />
      )}

      {/* 선택지 */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3 shrink-0 max-h-[45vh] overflow-y-auto">
        {shuffledChoices.length > 0 && !isGameOver && !isStageCleared ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">답변을 선택하세요</p>
              <button
                onClick={handleHint}
                disabled={hintCount <= 0 || isLoading}
                className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition"
              >
                🧪 힌트 ({hintCount})
              </button>
            </div>
            {shuffledChoices.map((choice, idx) => (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => selectChoice(choice)}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border border-gray-700 hover:border-gray-500 rounded-xl transition disabled:opacity-50"
              >
                <p className="text-white text-sm font-medium">{choice.text}</p>
                <p className="text-purple-400 text-xs mt-0.5">
                  ({choice.pronunciation})
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{choice.textKo}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          !isGameOver &&
          !isStageCleared && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">
                {isLoading ? "처리 중..." : ""}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
