# Certification Prep Feature — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add certification prep paths with linear study domains, multiple-choice quizzes, and a gap-tracking dashboard for 12 cloud certifications across AWS, GCP, and Azure.

**Architecture:** Static Next.js 16 App Router with `output: "export"`. All certification content lives in TypeScript files under `src/lib/certifications/`. Quiz and progress components are client-side (`"use client"`) with localStorage persistence. Routes follow `[certId]/[domainId]` dynamic segments with `generateStaticParams`.

**Tech Stack:** Next.js 16.2.1, React 19, TypeScript 5, Tailwind CSS 4, Lucide React icons, localStorage for state.

---

## File Structure Overview

### New Files to Create

```
src/lib/certifications/
├── types.ts                           → Certification, CertDomain, QuizQuestion, CertProgress types
├── index.ts                           → getCert(), getAllCerts(), getCertsByCloud() helpers + aggregation
├── aws-saa-c03.ts                     → AWS Solutions Architect Associate content + quiz
├── aws-dva-c02.ts                     → AWS Developer Associate content + quiz
├── aws-soa-c02.ts                     → AWS SysOps Administrator Associate content + quiz
├── aws-sap-c02.ts                     → AWS Solutions Architect Professional content + quiz
├── aws-dop-c02.ts                     → AWS DevOps Engineer Professional content + quiz
├── gcp-ace.ts                         → GCP Associate Cloud Engineer content + quiz
├── gcp-pca.ts                         → GCP Professional Cloud Architect content + quiz
├── gcp-pcd.ts                         → GCP Professional Cloud Developer content + quiz
├── azure-az104.ts                     → Azure Administrator Associate content + quiz
├── azure-az204.ts                     → Azure Developer Associate content + quiz
├── azure-az305.ts                     → Azure Solutions Architect Expert content + quiz
└── azure-az400.ts                     → Azure DevOps Engineer Expert content + quiz

src/hooks/
└── useCertProgress.ts                 → localStorage cert progress hook

src/components/
├── QuizRunner.tsx                     → Client: question flow, answer feedback, scoring
├── CertProgressBar.tsx                → Linear progress bar for domain completion
├── DomainScoreGrid.tsx                → Color-coded score grid for dashboard
├── ConfidenceRating.tsx               → 1-5 star self-rating per domain
├── ExamInfoCard.tsx                   → Exam format details (questions, time, cost)
└── DomainNav.tsx                      → Prev/next domain navigation

src/app/certifications/
├── page.tsx                           → Hub: all certs grouped by cloud
├── [certId]/
│   ├── page.tsx                       → Cert overview: exam info, domain list, progress
│   ├── dashboard/
│   │   └── page.tsx                   → Gap tracker dashboard
│   └── [domainId]/
│       ├── page.tsx                   → Domain study page
│       └── quiz/
│           └── page.tsx               → Quiz page
```

### Files to Modify

```
src/components/Navbar.tsx              → Add "Certifications" nav link
src/app/page.tsx                       → Add certification CTA section
src/app/sitemap.ts                     → Add certification routes
```

---

### Task 1: Types and Data Helpers

**Files:**
- Create: `src/lib/certifications/types.ts`
- Create: `src/lib/certifications/index.ts`

- [ ] **Step 1: Create certification types**

```typescript
// src/lib/certifications/types.ts
import type { TopicSection } from "../content";

export type CertCloud = "aws" | "gcp" | "azure";
export type CertLevel = "Associate" | "Professional" | "Expert";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CertDomain {
  id: string;
  title: string;
  weight: string;
  order: number;
  summary: string;
  keyConceptsForExam: string[];
  examTips: string[];
  relatedTopics: { cloud: CertCloud; topicId: string; title: string }[];
  sections: TopicSection[];
  quiz: QuizQuestion[];
}

export interface Certification {
  id: string;
  title: string;
  code: string;
  cloud: CertCloud;
  level: CertLevel;
  description: string;
  examFormat: {
    questions: number;
    duration: string;
    passingScore: string;
    cost: string;
  };
  domains: CertDomain[];
}

export interface QuizResult {
  score: number;
  total: number;
  lastAttempt: string;
  answers: Record<string, number>;
}

export interface CertProgress {
  completedDomains: string[];
  quizResults: Record<string, QuizResult>;
  confidence: Record<string, number>;
}
```

- [ ] **Step 2: Create index with helpers**

```typescript
// src/lib/certifications/index.ts
import type { Certification, CertCloud } from "./types";
export type { Certification, CertDomain, CertCloud, CertLevel, QuizQuestion, QuizResult, CertProgress } from "./types";

// Import all certifications (will be added as cert files are created)
import { awsSaaC03 } from "./aws-saa-c03";
import { awsDvaC02 } from "./aws-dva-c02";
import { awsSoaC02 } from "./aws-soa-c02";
import { awsSapC02 } from "./aws-sap-c02";
import { awsDopC02 } from "./aws-dop-c02";
import { gcpAce } from "./gcp-ace";
import { gcpPca } from "./gcp-pca";
import { gcpPcd } from "./gcp-pcd";
import { azureAz104 } from "./azure-az104";
import { azureAz204 } from "./azure-az204";
import { azureAz305 } from "./azure-az305";
import { azureAz400 } from "./azure-az400";

export const certifications: Certification[] = [
  awsSaaC03,
  awsDvaC02,
  awsSoaC02,
  awsSapC02,
  awsDopC02,
  gcpAce,
  gcpPca,
  gcpPcd,
  azureAz104,
  azureAz204,
  azureAz305,
  azureAz400,
];

export const certMap: Record<string, Certification> = Object.fromEntries(
  certifications.map((c) => [c.id, c])
);

export function getCert(id: string): Certification | undefined {
  return certMap[id];
}

export function getAllCerts(): Certification[] {
  return certifications;
}

export function getCertsByCloud(cloud: CertCloud): Certification[] {
  return certifications.filter((c) => c.cloud === cloud);
}

export function getDomain(certId: string, domainId: string) {
  const cert = getCert(certId);
  if (!cert) return undefined;
  return cert.domains.find((d) => d.id === domainId);
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npx tsc --noEmit src/lib/certifications/types.ts`
Expected: No errors (though index.ts will fail until cert files exist — that's OK)

- [ ] **Step 4: Commit**

```bash
git add src/lib/certifications/types.ts src/lib/certifications/index.ts
git commit -m "feat(certs): add certification types and data helpers"
```

---

### Task 2: Progress Hook

**Files:**
- Create: `src/hooks/useCertProgress.ts`

- [ ] **Step 1: Create the useCertProgress hook**

Model after `src/hooks/useProgress.ts` pattern. Key differences: stores structured `CertProgress` objects keyed by certId, supports quiz results and confidence ratings.

```typescript
// src/hooks/useCertProgress.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { CertProgress, QuizResult } from "@/lib/certifications/types";

const STORAGE_KEY = "cc_cert_progress";

type AllProgress = Record<string, CertProgress>;

function emptyProgress(): CertProgress {
  return { completedDomains: [], quizResults: {}, confidence: {} };
}

function loadFromStorage(): AllProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as AllProgress;
  } catch {
    return {};
  }
}

function saveToStorage(data: AllProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

export function useCertProgress(certId: string) {
  const [allProgress, setAllProgress] = useState<AllProgress>({});

  useEffect(() => {
    setAllProgress(loadFromStorage());
  }, []);

  const progress = allProgress[certId] ?? emptyProgress();

  const update = useCallback(
    (fn: (prev: CertProgress) => CertProgress) => {
      setAllProgress((all) => {
        const prev = all[certId] ?? emptyProgress();
        const next = { ...all, [certId]: fn(prev) };
        saveToStorage(next);
        return next;
      });
    },
    [certId]
  );

  const markDomainComplete = useCallback(
    (domainId: string) => {
      update((prev) => ({
        ...prev,
        completedDomains: prev.completedDomains.includes(domainId)
          ? prev.completedDomains
          : [...prev.completedDomains, domainId],
      }));
    },
    [update]
  );

  const markDomainIncomplete = useCallback(
    (domainId: string) => {
      update((prev) => ({
        ...prev,
        completedDomains: prev.completedDomains.filter((d) => d !== domainId),
      }));
    },
    [update]
  );

  const isDomainComplete = useCallback(
    (domainId: string) => progress.completedDomains.includes(domainId),
    [progress.completedDomains]
  );

  const saveQuizResult = useCallback(
    (domainId: string, result: QuizResult) => {
      update((prev) => ({
        ...prev,
        quizResults: { ...prev.quizResults, [domainId]: result },
      }));
    },
    [update]
  );

  const getQuizResult = useCallback(
    (domainId: string): QuizResult | undefined => progress.quizResults[domainId],
    [progress.quizResults]
  );

  const setConfidence = useCallback(
    (domainId: string, level: number) => {
      update((prev) => ({
        ...prev,
        confidence: { ...prev.confidence, [domainId]: level },
      }));
    },
    [update]
  );

  const getConfidence = useCallback(
    (domainId: string): number => progress.confidence[domainId] ?? 0,
    [progress.confidence]
  );

  const completedCount = progress.completedDomains.length;

  return {
    progress,
    markDomainComplete,
    markDomainIncomplete,
    isDomainComplete,
    saveQuizResult,
    getQuizResult,
    setConfidence,
    getConfidence,
    completedCount,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCertProgress.ts
git commit -m "feat(certs): add useCertProgress localStorage hook"
```

---

### Task 3: UI Components

**Files:**
- Create: `src/components/ExamInfoCard.tsx`
- Create: `src/components/CertProgressBar.tsx`
- Create: `src/components/DomainNav.tsx`
- Create: `src/components/ConfidenceRating.tsx`
- Create: `src/components/DomainScoreGrid.tsx`
- Create: `src/components/QuizRunner.tsx`

- [ ] **Step 1: Create ExamInfoCard**

```typescript
// src/components/ExamInfoCard.tsx
import { Clock, HelpCircle, Target, DollarSign } from "lucide-react";

interface ExamInfoCardProps {
  questions: number;
  duration: string;
  passingScore: string;
  cost: string;
}

export function ExamInfoCard({ questions, duration, passingScore, cost }: ExamInfoCardProps) {
  const items = [
    { icon: HelpCircle, label: "Questions", value: String(questions) },
    { icon: Clock, label: "Duration", value: duration },
    { icon: Target, label: "Passing", value: passingScore },
    { icon: DollarSign, label: "Cost", value: cost },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
      }}
    >
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          style={{
            backgroundColor: "#1B2336",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <Icon size={18} color="#4ade80" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC" }}>{value}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create CertProgressBar**

```typescript
// src/components/CertProgressBar.tsx
interface CertProgressBarProps {
  completed: number;
  total: number;
  color?: string;
}

export function CertProgressBar({ completed, total, color = "#22C55E" }: CertProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#94A3B8" }}>
          {completed} of {total} domains
        </span>
        <span style={{ fontSize: "12px", fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          backgroundColor: "#272F42",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "3px",
            backgroundColor: color,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create DomainNav**

```typescript
// src/components/DomainNav.tsx
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface DomainNavProps {
  certId: string;
  prevDomain: { id: string; title: string } | null;
  nextDomain: { id: string; title: string } | null;
}

export function DomainNav({ certId, prevDomain, nextDomain }: DomainNavProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {prevDomain ? (
        <Link
          href={`/certifications/${certId}/${prevDomain.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 18px",
            borderRadius: "10px",
            border: "1px solid #334155",
            backgroundColor: "#1B2336",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} color="#94A3B8" />
          <div>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Previous</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>
              {prevDomain.title}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {nextDomain && (
        <Link
          href={`/certifications/${certId}/${nextDomain.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "16px 18px",
            borderRadius: "10px",
            border: "1px solid #334155",
            backgroundColor: "#1B2336",
            textDecoration: "none",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Next</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>
              {nextDomain.title}
            </div>
          </div>
          <ArrowRight size={16} color="#94A3B8" />
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create ConfidenceRating**

```typescript
// src/components/ConfidenceRating.tsx
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
        <button
          key={level}
          onClick={() => onChange(level === value ? 0 : level)}
          aria-label={`Rate confidence ${level} of 5`}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            display: "flex",
          }}
        >
          <Star
            size={18}
            fill={level <= value ? "#F59E0B" : "transparent"}
            color={level <= value ? "#F59E0B" : "#475569"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create DomainScoreGrid**

```typescript
// src/components/DomainScoreGrid.tsx
"use client";

import Link from "next/link";
import type { CertDomain, QuizResult } from "@/lib/certifications/types";
import { ConfidenceRating } from "./ConfidenceRating";

interface DomainScoreGridProps {
  certId: string;
  domains: CertDomain[];
  quizResults: Record<string, QuizResult>;
  confidence: Record<string, number>;
  completedDomains: string[];
  onConfidenceChange: (domainId: string, level: number) => void;
}

function scoreColor(score: number, total: number): string {
  if (total === 0) return "#475569";
  const pct = (score / total) * 100;
  if (pct >= 80) return "#22C55E";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export function DomainScoreGrid({
  certId,
  domains,
  quizResults,
  confidence,
  completedDomains,
  onConfidenceChange,
}: DomainScoreGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {domains.map((domain) => {
        const result = quizResults[domain.id];
        const conf = confidence[domain.id] ?? 0;
        const completed = completedDomains.includes(domain.id);
        const color = result ? scoreColor(result.score, result.total) : "#475569";

        return (
          <div
            key={domain.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderRadius: "10px",
              border: `1px solid ${completed ? "rgba(74,222,128,0.3)" : "#334155"}`,
              backgroundColor: completed ? "rgba(74,222,128,0.05)" : "#1B2336",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ flex: "1 1 200px" }}>
              <Link
                href={`/certifications/${certId}/${domain.id}`}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#E2E8F0",
                  textDecoration: "none",
                }}
              >
                {domain.title}
              </Link>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                Weight: {domain.weight}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              {/* Quiz score */}
              <div style={{ textAlign: "center", minWidth: "60px" }}>
                {result ? (
                  <>
                    <div style={{ fontSize: "16px", fontWeight: 700, color }}>
                      {result.score}/{result.total}
                    </div>
                    <div style={{ fontSize: "10px", color: "#64748B" }}>
                      {new Date(result.lastAttempt).toLocaleDateString()}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: "12px", color: "#475569" }}>No quiz</div>
                )}
              </div>

              {/* Confidence */}
              <ConfidenceRating value={conf} onChange={(l) => onConfidenceChange(domain.id, l)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 6: Create QuizRunner**

```typescript
// src/components/QuizRunner.tsx
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
      onComplete({
        score,
        total: questions.length,
        lastAttempt: new Date().toISOString(),
        answers,
      });
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

  const handleRetryMissed = useCallback(() => {
    // This would filter to missed questions — for simplicity, retry all
    handleRetry();
  }, [handleRetry]);

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: passed ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `2px solid ${passed ? "#22C55E" : "#EF4444"}`,
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 800, color: passed ? "#22C55E" : "#EF4444" }}>
            {pct}%
          </span>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC", marginBottom: "8px" }}>
          {passed ? "Great job!" : "Keep studying!"}
        </h2>
        <p style={{ fontSize: "15px", color: "#94A3B8", marginBottom: "24px" }}>
          You scored {score} out of {questions.length} ({pct}%)
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleRetryMissed}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "1px solid #334155",
              backgroundColor: "#1B2336",
              color: "#E2E8F0",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <span style={{ fontSize: "13px", color: "#64748B" }}>
          Question {currentIdx + 1} of {questions.length}
        </span>
        <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 600 }}>
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          borderRadius: "2px",
          backgroundColor: "#272F42",
          marginBottom: "24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((currentIdx + 1) / questions.length) * 100}%`,
            backgroundColor: "#4ade80",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Question */}
      <h3
        style={{
          fontSize: "17px",
          fontWeight: 600,
          color: "#F8FAFC",
          lineHeight: 1.6,
          marginBottom: "20px",
        }}
      >
        {q.question}
      </h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrectOption = i === q.correctIndex;
          let borderColor = "#334155";
          let bgColor = "#1B2336";

          if (showFeedback) {
            if (isCorrectOption) {
              borderColor = "#22C55E";
              bgColor = "rgba(34,197,94,0.1)";
            } else if (isSelected && !isCorrectOption) {
              borderColor = "#EF4444";
              bgColor = "rgba(239,68,68,0.1)";
            }
          } else if (isSelected) {
            borderColor = "#4ade80";
            bgColor = "rgba(74,222,128,0.1)";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showFeedback}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "10px",
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: "#E2E8F0",
                fontSize: "14px",
                lineHeight: 1.5,
                textAlign: "left",
                cursor: showFeedback ? "default" : "pointer",
                transition: "all 0.15s ease",
                width: "100%",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  border: `1px solid ${borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#64748B",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "10px",
            border: `1px solid ${isCorrect ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            backgroundColor: isCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              color: isCorrect ? "#22C55E" : "#EF4444",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <p style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6 }}>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 24px",
            borderRadius: "10px",
            backgroundColor: "#22C55E",
            color: "#0F172A",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          {currentIdx < questions.length - 1 ? (
            <>
              Next <ArrowRight size={14} />
            </>
          ) : (
            "See Results"
          )}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Commit components**

```bash
git add src/components/ExamInfoCard.tsx src/components/CertProgressBar.tsx src/components/DomainNav.tsx src/components/ConfidenceRating.tsx src/components/DomainScoreGrid.tsx src/components/QuizRunner.tsx
git commit -m "feat(certs): add certification UI components — quiz, progress, dashboard"
```

---

### Task 4: First Certification Content — AWS SAA-C03

**Files:**
- Create: `src/lib/certifications/aws-saa-c03.ts`

This is the template that all other certification files will follow. AWS Solutions Architect Associate has 4 domains:
1. Design Secure Architectures (30%)
2. Design Resilient Architectures (26%)
3. Design High-Performing Architectures (24%)
4. Design Cost-Optimized Architectures (20%)

- [ ] **Step 1: Create AWS SAA-C03 content with all 4 domains and quiz questions**

Each domain should have:
- `summary`: 2-3 paragraph exam-specific overview
- `keyConceptsForExam`: 6-8 critical concepts
- `examTips`: 3-5 test-taking strategies
- `relatedTopics`: links to existing `/learn` topic IDs
- `sections`: 2-3 TopicSection content blocks
- `quiz`: 15 multiple-choice questions with explanations

The file will be ~700-800 lines. Write the full content with real, accurate exam-relevant material based on the official SAA-C03 exam guide. Each quiz question must have 4 options, a correct answer index, and a clear explanation.

```typescript
// src/lib/certifications/aws-saa-c03.ts
import type { Certification } from "./types";

export const awsSaaC03: Certification = {
  id: "aws-saa-c03",
  title: "AWS Solutions Architect Associate",
  code: "SAA-C03",
  cloud: "aws",
  level: "Associate",
  description: "Validate your ability to design distributed systems on AWS. Covers compute, storage, networking, databases, security, and cost optimization.",
  examFormat: {
    questions: 65,
    duration: "130 minutes",
    passingScore: "720/1000",
    cost: "$150 USD",
  },
  domains: [
    // Domain 1: Design Secure Architectures (30%)
    // Domain 2: Design Resilient Architectures (26%)
    // Domain 3: Design High-Performing Architectures (24%)
    // Domain 4: Design Cost-Optimized Architectures (20%)
    // ... full content with quiz questions per domain
  ],
};
```

Write the complete file with all 4 domains, each containing 15 quiz questions, exam tips, key concepts, related topics, and content sections.

- [ ] **Step 2: Verify file compiles**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/certifications/aws-saa-c03.ts
git commit -m "feat(certs): add AWS Solutions Architect Associate (SAA-C03) content"
```

---

### Task 5: Remaining 11 Certification Content Files

**Files:**
- Create: `src/lib/certifications/aws-dva-c02.ts`
- Create: `src/lib/certifications/aws-soa-c02.ts`
- Create: `src/lib/certifications/aws-sap-c02.ts`
- Create: `src/lib/certifications/aws-dop-c02.ts`
- Create: `src/lib/certifications/gcp-ace.ts`
- Create: `src/lib/certifications/gcp-pca.ts`
- Create: `src/lib/certifications/gcp-pcd.ts`
- Create: `src/lib/certifications/azure-az104.ts`
- Create: `src/lib/certifications/azure-az204.ts`
- Create: `src/lib/certifications/azure-az305.ts`
- Create: `src/lib/certifications/azure-az400.ts`

Follow the exact same structure as `aws-saa-c03.ts`. Each file exports a single `Certification` object with domains and quiz questions matching the official exam guide for that certification.

These can be created in parallel across multiple agents. Each file should:
- Use accurate domain names, weights, and question counts from the official exam guide
- Include 15 quiz questions per domain
- Include exam-specific tips and key concepts
- Reference related `/learn` topic IDs where applicable

- [ ] **Step 1: Create all 11 cert files** (can be parallelized — one agent per 2-3 certs)

Commit each batch:

```bash
# AWS certs
git add src/lib/certifications/aws-dva-c02.ts src/lib/certifications/aws-soa-c02.ts src/lib/certifications/aws-sap-c02.ts src/lib/certifications/aws-dop-c02.ts
git commit -m "feat(certs): add remaining AWS certification content (DVA, SOA, SAP, DOP)"

# GCP certs
git add src/lib/certifications/gcp-ace.ts src/lib/certifications/gcp-pca.ts src/lib/certifications/gcp-pcd.ts
git commit -m "feat(certs): add GCP certification content (ACE, PCA, PCD)"

# Azure certs
git add src/lib/certifications/azure-az104.ts src/lib/certifications/azure-az204.ts src/lib/certifications/azure-az305.ts src/lib/certifications/azure-az400.ts
git commit -m "feat(certs): add Azure certification content (AZ-104, AZ-204, AZ-305, AZ-400)"
```

- [ ] **Step 2: Verify all imports resolve in index.ts**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npx tsc --noEmit`
Expected: No type errors

---

### Task 6: Route Pages — Hub and Cert Overview

**Files:**
- Create: `src/app/certifications/page.tsx`
- Create: `src/app/certifications/[certId]/page.tsx`

- [ ] **Step 1: Create the certifications hub page**

```typescript
// src/app/certifications/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAllCerts } from "@/lib/certifications";
import type { CertCloud } from "@/lib/certifications";
import { ArrowRight, Award, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certification Prep",
  description: "Prepare for AWS, GCP, and Azure cloud certifications with structured study paths, practice quizzes, and gap tracking.",
};

const cloudMeta: Record<CertCloud, { color: string; bg: string; border: string; displayName: string }> = {
  aws: { color: "#FF9900", bg: "rgba(255,153,0,0.08)", border: "rgba(255,153,0,0.25)", displayName: "AWS" },
  gcp: { color: "#4285F4", bg: "rgba(66,133,244,0.08)", border: "rgba(66,133,244,0.25)", displayName: "GCP" },
  azure: { color: "#0078D4", bg: "rgba(0,120,212,0.08)", border: "rgba(0,120,212,0.25)", displayName: "Azure" },
};

const levelColor: Record<string, string> = {
  Associate: "#22C55E",
  Professional: "#F59E0B",
  Expert: "#EF4444",
};

export default function CertificationsPage() {
  const certs = getAllCerts();
  const grouped: Record<CertCloud, typeof certs> = { aws: [], gcp: [], azure: [] };
  for (const cert of certs) {
    grouped[cert.cloud].push(cert);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <main>
        {/* Header */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 48px" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4ade80", marginBottom: "12px" }}>
            Certification Prep
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.8px", marginBottom: "16px" }}>
            Get certified across all three clouds
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", maxWidth: "620px" }}>
            Structured study paths with practice quizzes and knowledge gap tracking. Pick a certification and start your journey.
          </p>
        </section>

        {/* Cert cards grouped by cloud */}
        {(["aws", "gcp", "azure"] as CertCloud[]).map((cloud) => {
          const meta = cloudMeta[cloud];
          const cloudCerts = grouped[cloud];
          if (cloudCerts.length === 0) return null;

          return (
            <section key={cloud} style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 56px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: meta.color, marginBottom: "16px", letterSpacing: "-0.3px" }}>
                {meta.displayName} Certifications
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                {cloudCerts.map((cert) => (
                  <Link
                    key={cert.id}
                    href={`/certifications/${cert.id}`}
                    style={{
                      backgroundColor: meta.bg,
                      border: `1px solid ${meta.border}`,
                      borderRadius: "16px",
                      padding: "24px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Award size={18} color={meta.color} />
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFC" }}>{cert.code}</span>
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px",
                        backgroundColor: `${levelColor[cert.level]}20`, color: levelColor[cert.level],
                      }}>
                        {cert.level}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#E2E8F0", lineHeight: 1.4 }}>
                      {cert.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>
                      {cert.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "8px", borderTop: `1px solid ${meta.border}` }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748B" }}>
                        <BookOpen size={12} /> {cert.domains.length} domains
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748B" }}>
                        {cert.domains.reduce((sum, d) => sum + d.quiz.length, 0)} questions
                      </span>
                    </div>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 600, color: meta.color }}>
                      Start prep <ArrowRight size={13} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create the cert overview page**

```typescript
// src/app/certifications/[certId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert, getAllCerts } from "@/lib/certifications";
import { ExamInfoCard } from "@/components/ExamInfoCard";
import { ChevronRight, ArrowRight, CheckCircle2, Circle, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ certId: string }> }): Promise<Metadata> {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) return {};
  return { title: `${cert.title} — Cert Prep`, description: cert.description };
}

export function generateStaticParams() {
  return getAllCerts().map((c) => ({ certId: c.id }));
}

const cloudColor: Record<string, string> = { aws: "#FF9900", gcp: "#4285F4", azure: "#0078D4" };

export default async function CertOverviewPage({ params }: { params: Promise<{ certId: string }> }) {
  const { certId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();

  const color = cloudColor[cert.cloud] ?? "#4ade80";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px" }}>
          <Link href="/certifications" style={{ color: "#64748B", textDecoration: "none" }}>Certifications</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{cert.code}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}>
              {cert.cloud.toUpperCase()}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px", backgroundColor: "rgba(74,222,128,0.1)", color: "#4ade80" }}>
              {cert.level}
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: "14px", lineHeight: 1.2 }}>
            {cert.title}
          </h1>
          <p style={{ fontSize: "16px", color: "#94A3B8", lineHeight: 1.7 }}>{cert.description}</p>
        </div>

        {/* Exam info */}
        <div style={{ marginBottom: "40px" }}>
          <ExamInfoCard {...cert.examFormat} />
        </div>

        {/* Domain list */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC" }}>Study Domains</h2>
            <Link
              href={`/certifications/${cert.id}/dashboard`}
              style={{ fontSize: "13px", color: "#4ade80", textDecoration: "none", fontWeight: 600 }}
            >
              View Dashboard →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {cert.domains.map((domain, idx) => (
              <Link
                key={domain.id}
                href={`/certifications/${cert.id}/${domain.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "8px", border: "1px solid #334155",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700, color: "#64748B",
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0" }}>{domain.title}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Weight: {domain.weight} · {domain.quiz.length} questions</div>
                  </div>
                </div>
                <ArrowRight size={16} color="#475569" />
              </Link>
            ))}
          </div>
        </div>

        {/* Start button */}
        <Link
          href={`/certifications/${cert.id}/${cert.domains[0].id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 28px",
            borderRadius: "10px",
            backgroundColor: "#22C55E",
            color: "#0F172A",
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Start Domain 1 <ArrowRight size={16} />
        </Link>
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npm run build`
Expected: Build succeeds (pages may fail if cert content files don't exist yet — that's expected if running out of order)

- [ ] **Step 4: Commit**

```bash
git add src/app/certifications/page.tsx src/app/certifications/\[certId\]/page.tsx
git commit -m "feat(certs): add certifications hub and cert overview pages"
```

---

### Task 7: Route Pages — Domain Study and Quiz

**Files:**
- Create: `src/app/certifications/[certId]/[domainId]/page.tsx`
- Create: `src/app/certifications/[certId]/[domainId]/quiz/page.tsx`

- [ ] **Step 1: Create domain study page**

Follow the pattern from `src/app/learn/[cloud]/[topic]/page.tsx` for content rendering (reuse `BodyText` and `renderInline` patterns). Add:
- Key Concepts callout box
- Exam Tips callout box
- Related Topics links
- "Take Quiz" button at bottom
- DomainNav for prev/next

```typescript
// src/app/certifications/[certId]/[domainId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert, getAllCerts, getDomain } from "@/lib/certifications";
import { DomainNav } from "@/components/DomainNav";
import { CodeBlock } from "@/components/CodeBlock";
import { ChevronRight, Lightbulb, Target, BookOpen, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ certId: string; domainId: string }> }): Promise<Metadata> {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  const domain = cert ? getDomain(certId, domainId) : undefined;
  if (!cert || !domain) return {};
  return { title: `${domain.title} — ${cert.code}`, description: domain.summary };
}

export function generateStaticParams() {
  const params: { certId: string; domainId: string }[] = [];
  for (const cert of getAllCerts()) {
    for (const domain of cert.domains) {
      params.push({ certId: cert.id, domainId: domain.id });
    }
  }
  return params;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#F8FAFC" }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{ background: "#272F42", padding: "2px 6px", borderRadius: "4px", fontSize: "13px", color: "#4ade80", fontFamily: "var(--font-mono, monospace)" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function BodyText({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {text.split("\n").map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={i} />;
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || /^\|/.test(trimmed);
        return (
          <p key={i} style={{ margin: 0, fontSize: "15px", color: "#CBD5E1", lineHeight: 1.8, paddingLeft: isBullet ? "4px" : "0" }}>
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

const cloudColor: Record<string, string> = { aws: "#FF9900", gcp: "#4285F4", azure: "#0078D4" };

export default async function DomainStudyPage({ params }: { params: Promise<{ certId: string; domainId: string }> }) {
  const { certId, domainId } = await params;
  const cert = getCert(certId);
  if (!cert) notFound();
  const domain = getDomain(certId, domainId);
  if (!domain) notFound();

  const idx = cert.domains.findIndex((d) => d.id === domainId);
  const prev = idx > 0 ? cert.domains[idx - 1] : null;
  const next = idx < cert.domains.length - 1 ? cert.domains[idx + 1] : null;
  const color = cloudColor[cert.cloud] ?? "#4ade80";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px", flexWrap: "wrap" }}>
          <Link href="/certifications" style={{ color: "#64748B", textDecoration: "none" }}>Certifications</Link>
          <ChevronRight size={14} />
          <Link href={`/certifications/${certId}`} style={{ color: "#64748B", textDecoration: "none" }}>{cert.code}</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>{domain.title}</span>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", backgroundColor: `${color}20`, color, border: `1px solid ${color}30` }}>
              {cert.code}
            </span>
            <span style={{ fontSize: "12px", color: "#64748B" }}>Domain {domain.order} · Weight: {domain.weight}</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: "14px", lineHeight: 1.2 }}>
            {domain.title}
          </h1>
          <p style={{ fontSize: "15px", color: "#94A3B8", lineHeight: 1.7 }}>{domain.summary}</p>
        </div>

        {/* Key Concepts */}
        <div style={{ backgroundColor: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Lightbulb size={16} color="#4ade80" />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#4ade80" }}>Key Concepts for the Exam</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {domain.keyConceptsForExam.map((concept, i) => (
              <li key={i} style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6 }}>{renderInline(concept)}</li>
            ))}
          </ul>
        </div>

        {/* Exam Tips */}
        <div style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Target size={16} color="#F59E0B" />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>Exam Tips</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {domain.examTips.map((tip, i) => (
              <li key={i} style={{ fontSize: "14px", color: "#CBD5E1", lineHeight: 1.6 }}>{renderInline(tip)}</li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginBottom: "40px" }}>
          {domain.sections.map((section, i) => (
            <div key={i}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC", marginBottom: "14px", letterSpacing: "-0.2px" }}>
                {section.heading}
              </h2>
              <BodyText text={section.body} />
              {section.code && <CodeBlock snippet={section.code.snippet} lang={section.code.lang} label={section.code.label} />}
            </div>
          ))}
        </div>

        {/* Related Topics */}
        {domain.relatedTopics.length > 0 && (
          <div style={{ marginBottom: "40px", padding: "20px 24px", borderRadius: "12px", border: "1px solid #334155", backgroundColor: "#1B2336" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <BookOpen size={16} color="#94A3B8" />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0" }}>Deep Dive — Related Topics</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {domain.relatedTopics.map((rt, i) => (
                <Link
                  key={i}
                  href={`/learn/${rt.cloud}/${rt.topicId}`}
                  style={{ fontSize: "13px", color: "#4ade80", textDecoration: "none" }}
                >
                  → {rt.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Take Quiz CTA */}
        <div style={{ padding: "32px", borderRadius: "16px", border: "1px solid rgba(74,222,128,0.2)", backgroundColor: "rgba(74,222,128,0.04)", textAlign: "center", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC", marginBottom: "8px" }}>Ready to test your knowledge?</h3>
          <p style={{ fontSize: "14px", color: "#94A3B8", marginBottom: "16px" }}>{domain.quiz.length} questions covering this domain</p>
          <Link
            href={`/certifications/${certId}/${domainId}/quiz`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "10px", backgroundColor: "#22C55E",
              color: "#0F172A", fontSize: "14px", fontWeight: 700, textDecoration: "none",
            }}
          >
            Take Quiz <ArrowRight size={14} />
          </Link>
        </div>

        {/* Prev/Next */}
        <DomainNav
          certId={certId}
          prevDomain={prev ? { id: prev.id, title: prev.title } : null}
          nextDomain={next ? { id: next.id, title: next.title } : null}
        />
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create quiz page**

```typescript
// src/app/certifications/[certId]/[domainId]/quiz/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert, getDomain, getAllCerts } from "@/lib/certifications";
import type { QuizResult } from "@/lib/certifications";
import { QuizRunner } from "@/components/QuizRunner";
import { useCertProgress } from "@/hooks/useCertProgress";
import { ChevronRight } from "lucide-react";

// Note: generateStaticParams must be in a separate server file for static export.
// For a "use client" page, we handle params via `use()`.

export default function QuizPage({ params }: { params: Promise<{ certId: string; domainId: string }> }) {
  const { certId, domainId } = use(params);
  const cert = getCert(certId);
  const domain = cert ? getDomain(certId, domainId) : undefined;
  const { saveQuizResult, markDomainComplete } = useCertProgress(certId);

  if (!cert || !domain) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
        <Navbar />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F8FAFC" }}>Quiz not found</h1>
        </div>
      </div>
    );
  }

  const handleComplete = (result: QuizResult) => {
    saveQuizResult(domainId, result);
    if (result.score / result.total >= 0.7) {
      markDomainComplete(domainId);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px", flexWrap: "wrap" }}>
          <Link href="/certifications" style={{ color: "#64748B", textDecoration: "none" }}>Certifications</Link>
          <ChevronRight size={14} />
          <Link href={`/certifications/${certId}`} style={{ color: "#64748B", textDecoration: "none" }}>{cert.code}</Link>
          <ChevronRight size={14} />
          <Link href={`/certifications/${certId}/${domainId}`} style={{ color: "#64748B", textDecoration: "none" }}>{domain.title}</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>Quiz</span>
        </nav>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F8FAFC", marginBottom: "8px" }}>
          {domain.title} — Quiz
        </h1>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px" }}>
          {domain.quiz.length} questions · Score 70%+ to mark domain complete
        </p>

        <QuizRunner questions={domain.quiz} onComplete={handleComplete} />
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
```

**Important note about the quiz page:** Since it uses `"use client"` with `use(params)` for the promise params pattern, and we need `generateStaticParams` for static export, we need to create a separate wrapper. However, in Next.js 16 with `output: "export"`, client pages with dynamic routes work when `generateStaticParams` is defined. We may need to split this into a server layout + client component pattern. If the build fails, refactor by extracting `QuizRunner` usage into a client wrapper and keeping the page as a server component that passes data as props.

- [ ] **Step 3: Commit**

```bash
git add src/app/certifications/\[certId\]/\[domainId\]/page.tsx src/app/certifications/\[certId\]/\[domainId\]/quiz/page.tsx
git commit -m "feat(certs): add domain study and quiz route pages"
```

---

### Task 8: Dashboard Page

**Files:**
- Create: `src/app/certifications/[certId]/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

This is a client page that reads from `useCertProgress` and displays the `DomainScoreGrid` with an overall readiness score.

```typescript
// src/app/certifications/[certId]/dashboard/page.tsx
"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getCert } from "@/lib/certifications";
import { DomainScoreGrid } from "@/components/DomainScoreGrid";
import { CertProgressBar } from "@/components/CertProgressBar";
import { useCertProgress } from "@/hooks/useCertProgress";
import { ChevronRight, BarChart2, AlertTriangle } from "lucide-react";

const cloudColor: Record<string, string> = { aws: "#FF9900", gcp: "#4285F4", azure: "#0078D4" };

export default function DashboardPage({ params }: { params: Promise<{ certId: string }> }) {
  const { certId } = use(params);
  const cert = getCert(certId);
  const { progress, setConfidence, completedCount } = useCertProgress(certId);

  if (!cert) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
        <Navbar />
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#F8FAFC" }}>Certification not found</h1>
        </div>
      </div>
    );
  }

  const color = cloudColor[cert.cloud] ?? "#4ade80";

  // Calculate weak areas
  const weakDomains = cert.domains.filter((d) => {
    const result = progress.quizResults[d.id];
    if (!result) return true;
    return (result.score / result.total) < 0.7;
  });

  // Overall readiness
  const totalQuestions = Object.values(progress.quizResults).reduce((sum, r) => sum + r.total, 0);
  const totalCorrect = Object.values(progress.quizResults).reduce((sum, r) => sum + r.score, 0);
  const readiness = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 24px 96px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748B", marginBottom: "32px", flexWrap: "wrap" }}>
          <Link href="/certifications" style={{ color: "#64748B", textDecoration: "none" }}>Certifications</Link>
          <ChevronRight size={14} />
          <Link href={`/certifications/${certId}`} style={{ color: "#64748B", textDecoration: "none" }}>{cert.code}</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#94A3B8" }}>Dashboard</span>
        </nav>

        {/* Header */}
        <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.5px", marginBottom: "8px" }}>
          {cert.code} — Your Progress
        </h1>
        <p style={{ fontSize: "15px", color: "#94A3B8", marginBottom: "32px" }}>{cert.title}</p>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: readiness >= 70 ? "#22C55E" : readiness >= 50 ? "#F59E0B" : "#EF4444" }}>
              {readiness}%
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Exam Readiness</div>
          </div>
          <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color }}>
              {completedCount}/{cert.domains.length}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Domains Complete</div>
          </div>
          <div style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B" }}>
              {weakDomains.length}
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Need Review</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "32px" }}>
          <CertProgressBar completed={completedCount} total={cert.domains.length} color={color} />
        </div>

        {/* Weak areas */}
        {weakDomains.length > 0 && (
          <div style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px", padding: "20px 24px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <AlertTriangle size={16} color="#F59E0B" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F59E0B" }}>Areas to Review</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {weakDomains.map((d) => (
                <Link
                  key={d.id}
                  href={`/certifications/${certId}/${d.id}`}
                  style={{ fontSize: "13px", color: "#CBD5E1", textDecoration: "none" }}
                >
                  → {d.title} ({d.weight})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Domain score grid */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <BarChart2 size={18} color="#94A3B8" />
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC" }}>Domain Breakdown</h2>
          </div>
          <DomainScoreGrid
            certId={certId}
            domains={cert.domains}
            quizResults={progress.quizResults}
            confidence={progress.confidence}
            completedDomains={progress.completedDomains}
            onConfidenceChange={setConfidence}
          />
        </div>
      </div>

      <footer style={{ borderTop: "1px solid #334155", backgroundColor: "#1B2336", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ color: "#64748B", fontSize: "13px" }}>© 2025 CloudCompass. Built for engineers learning the cloud.</div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/certifications/\[certId\]/dashboard/page.tsx
git commit -m "feat(certs): add certification dashboard with gap tracking"
```

---

### Task 9: Navigation, Sitemap, and Home Page Integration

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add Certifications to Navbar**

In `src/components/Navbar.tsx`, add the `Award` icon import and add a new entry to `navLinks` array between Learn and Compare:

```typescript
// Add to imports:
import { Cloud, BookOpen, GitCompare, Zap, Search, Menu, X, Award } from "lucide-react";

// Update navLinks to:
const navLinks = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/certifications", label: "Certify", icon: Award },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/practice", label: "Practice", icon: Zap },
  { href: "/search", label: "Search", icon: Search },
];
```

- [ ] **Step 2: Update sitemap**

In `src/app/sitemap.ts`, add imports for certifications and generate routes:

```typescript
// Add import:
import { getAllCerts } from "@/lib/certifications";

// Add to staticRoutes array:
{ url: `${BASE_URL}/certifications`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },

// Add after labRoutes:
const certRoutes: MetadataRoute.Sitemap = getAllCerts().flatMap((cert) => [
  { url: `${BASE_URL}/certifications/${cert.id}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  { url: `${BASE_URL}/certifications/${cert.id}/dashboard`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  ...cert.domains.flatMap((domain) => [
    { url: `${BASE_URL}/certifications/${cert.id}/${domain.id}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/certifications/${cert.id}/${domain.id}/quiz`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ]),
]);

// Update return:
return [...staticRoutes, ...cloudRoutes, ...topicRoutes, ...labRoutes, ...certRoutes];
```

- [ ] **Step 3: Add certification section to home page**

In `src/app/page.tsx`, add a certification CTA section before the final CTA. Import `Award` icon:

```typescript
// Add to imports:
import { Award } from "lucide-react";

// Add this section before the "Ready to master all three clouds?" CTA section:
{/* Certification Prep */}
<section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 80px" }}>
  <div style={{ borderRadius: "20px", border: "1px solid rgba(74,222,128,0.2)", background: "linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(245,158,11,0.06) 100%)", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
    <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
      <Award size={24} color="#4ade80" />
    </div>
    <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#F8FAFC", letterSpacing: "-0.3px", marginBottom: "12px" }}>
      Get Cloud Certified
    </h2>
    <p style={{ color: "#94A3B8", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px" }}>
      Structured study paths with practice quizzes and gap tracking for 12 AWS, GCP, and Azure certifications.
    </p>
    <Link href="/certifications" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "10px", backgroundColor: "#22C55E", color: "#0F172A", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
      Start Certification Prep <ArrowRight size={16} />
    </Link>
  </div>
</section>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/app/sitemap.ts src/app/page.tsx
git commit -m "feat(certs): integrate certifications into navbar, sitemap, and home page"
```

---

### Task 10: Build Verification and Fix

- [ ] **Step 1: Run full build**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npm run build`
Expected: Build succeeds with all certification pages generated

- [ ] **Step 2: Fix any build errors**

Common issues to watch for:
- Missing `generateStaticParams` on client pages (quiz, dashboard) — may need to extract to server wrapper + client component pattern
- Import resolution for certification modules
- TypeScript type mismatches

If quiz page fails due to `"use client"` + `generateStaticParams` conflict:
- Create a server component wrapper that imports the client quiz component
- Move `generateStaticParams` to the server wrapper
- Pass cert/domain data as props to the client component

- [ ] **Step 3: Run dev server and verify pages render**

Run: `cd /Users/datnguyen/Documents/Projects/myself/cloud-migration && npm run dev`
Test URLs:
- http://localhost:3000/certifications
- http://localhost:3000/certifications/aws-saa-c03
- http://localhost:3000/certifications/aws-saa-c03/domain-1
- http://localhost:3000/certifications/aws-saa-c03/domain-1/quiz
- http://localhost:3000/certifications/aws-saa-c03/dashboard

- [ ] **Step 4: Commit fixes if any**

```bash
git add -A
git commit -m "fix(certs): resolve build issues for certification pages"
```

---

### Task 11: Deploy

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

This triggers the existing GitHub Actions workflow which:
1. Builds the site
2. Uploads to S3
3. Invalidates CloudFront

- [ ] **Step 2: Verify deployment**

Check: https://cloudcompass.finaldivision.com/certifications

- [ ] **Step 3: Verify key pages load**
- Hub: `/certifications`
- A cert overview: `/certifications/aws-saa-c03`
- A domain study: `/certifications/aws-saa-c03/domain-1`
- A quiz: `/certifications/aws-saa-c03/domain-1/quiz`
- Dashboard: `/certifications/aws-saa-c03/dashboard`
