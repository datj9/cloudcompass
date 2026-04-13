"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion, QuizResult } from "@/lib/certifications/types";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
}

export function QuizRunner({ questions, onComplete }: QuizRunnerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[currentIdx];
  const isCorrect = selectedAnswer === q?.correctIndex;

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (showFeedback) return;
      setSelectedAnswer(optIdx);
      setShowFeedback(true);
      const correct = optIdx === q.correctIndex;
      const newScore = correct ? score + 1 : score;
      const newAnswers = { ...answers, [q.id]: optIdx };
      setScore(newScore);
      setAnswers(newAnswers);
    },
    [showFeedback, q, score, answers]
  );

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      onComplete({ score, total: questions.length, lastAttempt: new Date().toISOString(), answers });
    }
  }, [currentIdx, questions.length, onComplete, score, answers]);

  const handleRetry = useCallback(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers({});
    setScore(0);
    setFinished(false);
  }, []);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: passed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `2px solid ${passed ? "#22C55E" : "#EF4444"}` }}>
          <span style={{ fontSize: "28px", fontWeight: 800, color: passed ? "#22C55E" : "#EF4444" }}>{pct}%</span>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC", marginBottom: "8px" }}>{passed ? "Great job!" : "Keep studying!"}</h2>
        <p style={{ fontSize: "15px", color: "#94A3B8", marginBottom: "24px" }}>You scored {score} out of {questions.length} ({pct}%)</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleRetry} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#1B2336", color: "#E2E8F0", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", color: "#64748B" }}>Question {currentIdx + 1} of {questions.length}</span>
        <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>Score: {score}</span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", backgroundColor: "#272F42", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((currentIdx + 1) / questions.length) * 100}%`, backgroundColor: "#4ade80", transition: "width 0.3s ease" }} />
      </div>
      <h3 style={{ fontSize: "17px", fontWeight: 600, color: "#F8FAFC", lineHeight: 1.6, marginBottom: "20px" }}>{q.question}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrectOption = i === q.correctIndex;
          let borderColor = "#334155";
          let bgColor = "#1B2336";
          if (showFeedback) {
            if (isCorrectOption) { borderColor = "#22C55E"; bgColor = "rgba(34,197,94,0.1)"; }
            else if (isSelected && !isCorrectOption) { borderColor = "#EF4444"; bgColor = "rgba(239,68,68,0.1)"; }
          } else if (isSelected) { borderColor = "#4ade80"; bgColor = "rgba(74,222,128,0.1)"; }
          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={showFeedback} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", borderRadius: "10px", border: `1px solid ${borderColor}`, backgroundColor: bgColor, color: "#E2E8F0", fontSize: "14px", lineHeight: 1.5, textAlign: "left", cursor: showFeedback ? "default" : "pointer", transition: "all 0.15s ease", width: "100%" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "6px", border: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", fontWeight: 600, color: "#64748B" }}>{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div style={{ padding: "16px 20px", borderRadius: "10px", border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, backgroundColor: isCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: isCorrect ? "#22C55E" : "#EF4444", fontSize: "14px", fontWeight: 600 }}>
            {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6 }}>{q.explanation}</p>
        </div>
      )}
      {showFeedback && (
        <button onClick={handleNext} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 24px", borderRadius: "10px", backgroundColor: "#22C55E", color: "#0F172A", fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "none" }}>
          {currentIdx < questions.length - 1 ? (<>Next <ArrowRight size={14} /></>) : "See Results"}
        </button>
      )}
    </div>
  );
}
