"use client";

import { useGameStore } from "@/store/gameStore";
import StageSelect from "@/components/StageSelect";
import ChatRoom from "@/components/ChatRoom";

export default function Home() {
  const { currentStageId } = useGameStore();

  if (currentStageId) {
    return <ChatRoom />;
  }

  return <StageSelect />;
}
