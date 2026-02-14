"use client";

import { useEffect, useState } from "react";
import { useLearningStore } from "@/store/learningStore";
import ScenarioSelect from "@/components/ScenarioSelect";
import ConversationRoom from "@/components/ConversationRoom";
import ConversationReview from "@/components/ConversationReview";
import BookmarkList from "@/components/BookmarkList";
import Onboarding from "@/components/Onboarding";
import ReviewQuiz from "@/components/ReviewQuiz";
import LearningStats from "@/components/LearningStats";

export default function Home() {
  const { currentView, hasSeenOnboarding } = useLearningStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">로딩 중...</div>
      </div>
    );
  }

  if (!hasSeenOnboarding) {
    return <Onboarding />;
  }

  switch (currentView) {
    case "conversation":
      return <ConversationRoom />;
    case "review":
      return <ConversationReview />;
    case "bookmarks":
      return <BookmarkList />;
    case "quiz":
      return <ReviewQuiz />;
    case "stats":
      return <LearningStats />;
    default:
      return <ScenarioSelect />;
  }
}
