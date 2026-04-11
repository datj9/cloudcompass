"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export function MarkAsReadButton({ topicId }: { topicId: string }) {
  const { isRead, markRead, markUnread } = useProgress();
  const read = isRead(topicId);

  return (
    <button
      onClick={() => (read ? markUnread(topicId) : markRead(topicId))}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "10px",
        border: read ? "1px solid rgba(74,222,128,0.4)" : "1px solid #334155",
        backgroundColor: read ? "rgba(74,222,128,0.1)" : "#1B2336",
        color: read ? "#4ade80" : "#94A3B8",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {read ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      {read ? "Marked as read" : "Mark as read"}
    </button>
  );
}
