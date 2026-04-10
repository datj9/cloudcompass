"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cc_progress";

function loadFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // storage unavailable — ignore
  }
}

export function useProgress() {
  const [readTopics, setReadTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadTopics(loadFromStorage());
  }, []);

  const markRead = useCallback((topicId: string) => {
    setReadTopics((prev) => {
      const next = new Set(prev);
      next.add(topicId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const markUnread = useCallback((topicId: string) => {
    setReadTopics((prev) => {
      const next = new Set(prev);
      next.delete(topicId);
      saveToStorage(next);
      return next;
    });
  }, []);

  const isRead = useCallback((topicId: string) => readTopics.has(topicId), [readTopics]);

  return { isRead, markRead, markUnread, count: readTopics.size };
}
