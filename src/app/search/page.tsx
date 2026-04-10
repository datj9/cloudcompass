"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { cloudMap, labs } from "@/lib/content";
import type { CloudName } from "@/lib/content";
import { Search, BookOpen, Terminal, ArrowRight } from "lucide-react";

interface SearchResult {
  type: "topic" | "lab";
  id: string;
  title: string;
  summary: string;
  cloud: string;
  cloudColor: string;
  level: string;
  href: string;
}

const CLOUD_COLORS: Record<string, string> = {
  AWS: "#FF9900",
  GCP: "#4285F4",
  Azure: "#0078D4",
  All: "#22C55E",
};

const levelColor: Record<string, string> = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

const allItems: SearchResult[] = [
  ...(Object.keys(cloudMap) as CloudName[]).flatMap((cloudKey) =>
    cloudMap[cloudKey].modules.flatMap((mod) =>
      mod.topics.map((topic) => ({
        type: "topic" as const,
        id: topic.id,
        title: topic.title,
        summary: topic.summary,
        cloud: cloudMap[cloudKey].displayName,
        cloudColor: CLOUD_COLORS[cloudMap[cloudKey].displayName] ?? "#94A3B8",
        level: topic.level,
        href: `/learn/${cloudKey}/${topic.id}`,
      }))
    )
  ),
  ...labs.map((lab) => ({
    type: "lab" as const,
    id: lab.id,
    title: lab.title,
    summary: lab.desc,
    cloud: "All",
    cloudColor: CLOUD_COLORS.All,
    level: lab.level,
    href: `/practice/${lab.id}`,
  })),
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.cloud.toLowerCase().includes(q) ||
        item.level.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A" }}>
      <Navbar />

      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: 800,
            color: "#F8FAFC",
            letterSpacing: "-0.6px",
            marginBottom: "8px",
          }}
        >
          Search
        </h1>
        <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "32px" }}>
          {allItems.length} topics and labs across AWS, GCP, and Azure
        </p>

        {/* Search input */}
        <div
          style={{
            position: "relative",
            marginBottom: "40px",
          }}
        >
          <Search
            size={18}
            color="#64748B"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics, labs, services..."
            autoFocus
            style={{
              width: "100%",
              padding: "14px 16px 14px 48px",
              borderRadius: "12px",
              border: "1px solid #334155",
              backgroundColor: "#1B2336",
              color: "#F8FAFC",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              caretColor: "#22C55E",
            }}
          />
        </div>

        {/* Results */}
        {query.trim() === "" ? (
          <p style={{ color: "#475569", fontSize: "14px", textAlign: "center" }}>
            Start typing to search topics and labs...
          </p>
        ) : results.length === 0 ? (
          <p style={{ color: "#475569", fontSize: "14px", textAlign: "center" }}>
            No results for &ldquo;{query}&rdquo;
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  backgroundColor: "#1B2336",
                  textDecoration: "none",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: item.cloudColor + "15",
                    border: `1px solid ${item.cloudColor}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.type === "topic" ? (
                    <BookOpen size={16} color={item.cloudColor} />
                  ) : (
                    <Terminal size={16} color={item.cloudColor} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#F8FAFC" }}>
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "999px",
                        backgroundColor: item.cloudColor + "18",
                        color: item.cloudColor,
                        flexShrink: 0,
                      }}
                    >
                      {item.cloud}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: "999px",
                        backgroundColor: levelColor[item.level] + "18",
                        color: levelColor[item.level],
                        flexShrink: 0,
                      }}
                    >
                      {item.level}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748B",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.summary}
                  </p>
                </div>

                <ArrowRight size={16} color="#334155" style={{ flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
