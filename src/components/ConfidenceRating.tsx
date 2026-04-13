"use client";

import { Star } from "lucide-react";

interface ConfidenceRatingProps {
  value: number;
  onChange: (level: number) => void;
}

export function ConfidenceRating({ value, onChange }: ConfidenceRatingProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((level) => (
        <button key={level} onClick={() => onChange(level === value ? 0 : level)} aria-label={`Rate confidence ${level} of 5`} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}>
          <Star size={18} fill={level <= value ? "#F59E0B" : "transparent"} color={level <= value ? "#F59E0B" : "#475569"} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
