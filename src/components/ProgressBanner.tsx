"use client";

import { useProgress } from "@/hooks/useProgress";

export function ProgressBanner({ topicIds, color }: { topicIds: string[]; color: string }) {
  const { isRead } = useProgress();
  const readCount = topicIds.filter((id) => isRead(id)).length;
  const total = topicIds.length;
  const pct = total > 0 ? Math.round((readCount / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: "12px",
        backgroundColor: "#1B2336",
        border: "1px solid #334155",
        marginBottom: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#94A3B8" }}>Your progress</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color }}>
          {readCount} / {total} topics
        </span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "999px",
          backgroundColor: "#272F42",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "999px",
            backgroundColor: color,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
