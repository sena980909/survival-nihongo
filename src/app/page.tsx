"use client";

import { useLearningStore } from "@/store/learningStore";
import ScenarioSelect from "@/components/ScenarioSelect";
import ConversationRoom from "@/components/ConversationRoom";
import ConversationReview from "@/components/ConversationReview";
import BookmarkList from "@/components/BookmarkList";

export default function Home() {
  const { currentView } = useLearningStore();

  switch (currentView) {
    case "conversation":
      return <ConversationRoom />;
    case "review":
      return <ConversationReview />;
    case "bookmarks":
      return <BookmarkList />;
    default:
      return <ScenarioSelect />;
  }
}
