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
