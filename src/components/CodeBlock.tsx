"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Terminal, FileCode2, FileJson, FileText, Database, Cloud } from "lucide-react";

/* ── language icon & accent mapping ─────────────────────────────────── */

const langMeta: Record<string, { icon: typeof Terminal; accent: string; label: string }> = {
  bash:       { icon: Terminal,  accent: "#22C55E", label: "Bash" },
  sh:         { icon: Terminal,  accent: "#22C55E", label: "Shell" },
  shell:      { icon: Terminal,  accent: "#22C55E", label: "Shell" },
  zsh:        { icon: Terminal,  accent: "#22C55E", label: "Zsh" },
  typescript: { icon: FileCode2, accent: "#3B82F6", label: "TypeScript" },
  ts:         { icon: FileCode2, accent: "#3B82F6", label: "TypeScript" },
  javascript: { icon: FileCode2, accent: "#FACC15", label: "JavaScript" },
  js:         { icon: FileCode2, accent: "#FACC15", label: "JavaScript" },
  json:       { icon: FileJson,  accent: "#A78BFA", label: "JSON" },
  yaml:       { icon: FileText,  accent: "#F472B6", label: "YAML" },
  yml:        { icon: FileText,  accent: "#F472B6", label: "YAML" },
  sql:        { icon: Database,  accent: "#38BDF8", label: "SQL" },
  python:     { icon: FileCode2, accent: "#FACC15", label: "Python" },
  py:         { icon: FileCode2, accent: "#FACC15", label: "Python" },
  go:         { icon: FileCode2, accent: "#00ADD8", label: "Go" },
  hcl:        { icon: Cloud,     accent: "#7C3AED", label: "HCL" },
  terraform:  { icon: Cloud,     accent: "#7C3AED", label: "Terraform" },
  tf:         { icon: Cloud,     accent: "#7C3AED", label: "Terraform" },
  dockerfile: { icon: FileCode2, accent: "#2496ED", label: "Dockerfile" },
  docker:     { icon: FileCode2, accent: "#2496ED", label: "Dockerfile" },
};

const defaultMeta = { icon: FileCode2, accent: "#94A3B8", label: "Code" };

function getMeta(lang: string) {
  return langMeta[lang.toLowerCase()] ?? defaultMeta;
}

/* ── minimal syntax colouring (no heavy dependency) ─────────────────── */

interface Token { text: string; color: string }

function tokenize(code: string, lang: string): Token[][] {
  const lines = code.split("\n");
  const l = lang.toLowerCase();

  return lines.map((line) => {
    const tokens: Token[] = [];
    let remaining = line;

    while (remaining.length > 0) {
      let matched = false;

      // comments
      if (l === "bash" || l === "sh" || l === "shell" || l === "zsh" || l === "python" || l === "py" || l === "hcl" || l === "terraform" || l === "tf" || l === "yaml" || l === "yml" || l === "dockerfile" || l === "docker") {
        const commentMatch = remaining.match(/^(#.*)$/);
        if (commentMatch) {
          tokens.push({ text: commentMatch[1], color: "#6B7B8D" });
          remaining = "";
          matched = true;
        }
      }
      if (!matched && (l === "javascript" || l === "js" || l === "typescript" || l === "ts" || l === "go" || l === "json")) {
        const commentMatch = remaining.match(/^(\/\/.*)$/);
        if (commentMatch) {
          tokens.push({ text: commentMatch[1], color: "#6B7B8D" });
          remaining = "";
          matched = true;
        }
      }
      if (!matched && (l === "sql")) {
        const commentMatch = remaining.match(/^(--.*)$/);
        if (commentMatch) {
          tokens.push({ text: commentMatch[1], color: "#6B7B8D" });
          remaining = "";
          matched = true;
        }
      }

      // strings (double/single quoted)
      if (!matched) {
        const strMatch = remaining.match(/^("[^"]*"|'[^']*')/);
        if (strMatch) {
          tokens.push({ text: strMatch[1], color: "#A5D6A7" });
          remaining = remaining.slice(strMatch[1].length);
          matched = true;
        }
      }

      // backtick strings / template literals
      if (!matched) {
        const tmplMatch = remaining.match(/^(`[^`]*`)/);
        if (tmplMatch) {
          tokens.push({ text: tmplMatch[1], color: "#A5D6A7" });
          remaining = remaining.slice(tmplMatch[1].length);
          matched = true;
        }
      }

      // numbers
      if (!matched) {
        const numMatch = remaining.match(/^(\b\d+(\.\d+)?\b)/);
        if (numMatch) {
          tokens.push({ text: numMatch[1], color: "#F9A825" });
          remaining = remaining.slice(numMatch[1].length);
          matched = true;
        }
      }

      // shell variables $VAR or ${VAR}
      if (!matched && (l === "bash" || l === "sh" || l === "shell" || l === "zsh")) {
        const varMatch = remaining.match(/^(\$\{[^}]+\}|\$[A-Za-z_][A-Za-z0-9_]*)/);
        if (varMatch) {
          tokens.push({ text: varMatch[1], color: "#80CBC4" });
          remaining = remaining.slice(varMatch[1].length);
          matched = true;
        }
      }

      // CLI flags
      if (!matched && (l === "bash" || l === "sh" || l === "shell" || l === "zsh")) {
        const flagMatch = remaining.match(/^(--?[a-zA-Z][\w-]*)/);
        if (flagMatch) {
          tokens.push({ text: flagMatch[1], color: "#90CAF9" });
          remaining = remaining.slice(flagMatch[1].length);
          matched = true;
        }
      }

      // keywords for common languages
      if (!matched) {
        const kwSets: Record<string, string[]> = {
          bash: ["if", "then", "else", "fi", "for", "do", "done", "while", "case", "esac", "function", "return", "export", "local", "source", "echo", "aws", "gcloud", "az", "kubectl", "docker", "terraform"],
          python: ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "try", "except", "with", "as", "yield", "async", "await", "lambda", "True", "False", "None"],
          typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "from", "class", "interface", "type", "async", "await", "new", "true", "false", "null", "undefined"],
          javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "from", "class", "async", "await", "new", "true", "false", "null", "undefined"],
          go: ["func", "package", "import", "var", "const", "type", "struct", "interface", "return", "if", "else", "for", "range", "switch", "case", "defer", "go", "chan", "map", "nil", "true", "false"],
          sql: ["SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "TABLE", "INDEX", "JOIN", "LEFT", "RIGHT", "INNER", "ON", "AND", "OR", "NOT", "NULL", "AS", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "INTO", "VALUES", "SET", "IN", "EXISTS", "UNION", "ALL", "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX", "LIKE", "BETWEEN", "IS", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CASCADE", "DEFAULT", "CONSTRAINT", "INT", "VARCHAR", "TEXT", "BOOLEAN", "TIMESTAMP", "SERIAL"],
          hcl: ["resource", "data", "variable", "output", "module", "provider", "locals", "terraform", "required_providers", "backend", "source", "version", "for_each", "count", "depends_on", "lifecycle", "true", "false", "null"],
        };

        const aliases: Record<string, string> = {
          sh: "bash", shell: "bash", zsh: "bash",
          ts: "typescript", js: "javascript", py: "python",
          terraform: "hcl", tf: "hcl",
        };
        const resolvedLang = aliases[l] ?? l;
        const keywords = kwSets[resolvedLang] ?? [];

        if (keywords.length > 0) {
          const kwPattern = new RegExp(`^\\b(${keywords.join("|")})\\b`, l === "sql" ? "i" : undefined);
          const kwMatch = remaining.match(kwPattern);
          if (kwMatch) {
            tokens.push({ text: kwMatch[1], color: "#CE93D8" });
            remaining = remaining.slice(kwMatch[1].length);
            matched = true;
          }
        }
      }

      // fallback: consume one character
      if (!matched) {
        // operators & punctuation
        const opMatch = remaining.match(/^([{}()[\];,=<>!&|+\-*/%:?.])/);
        if (opMatch) {
          tokens.push({ text: opMatch[1], color: "#B0BEC5" });
          remaining = remaining.slice(1);
        } else {
          // regular text - consume until next special char
          const textMatch = remaining.match(/^([^\s"'`$#\-/{}()[\];,=<>!&|+*%:?.\\0-9]+)/);
          if (textMatch) {
            tokens.push({ text: textMatch[1], color: "#E2E8F0" });
            remaining = remaining.slice(textMatch[1].length);
          } else {
            tokens.push({ text: remaining[0], color: "#E2E8F0" });
            remaining = remaining.slice(1);
          }
        }
      }
    }

    return tokens;
  });
}

/* ── CodeBlock component ────────────────────────────────────────────── */

interface CodeBlockProps {
  snippet: string;
  lang: string;
  label: string;
}

export function CodeBlock({ snippet, lang, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const meta = getMeta(lang);
  const Icon = meta.icon;
  const tokenizedLines = tokenize(snippet, lang);
  const showLineNumbers = tokenizedLines.length > 3;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API may fail in some contexts */
    }
  }, [snippet]);

  return (
    <div
      style={{
        marginTop: "20px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #1E293B",
        backgroundColor: "#0B1120",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03) inset",
      }}
    >
      {/* ── header ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          backgroundColor: "#111827",
          borderBottom: "1px solid #1E293B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* coloured dot accent */}
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: meta.accent,
              boxShadow: `0 0 6px ${meta.accent}60`,
              flexShrink: 0,
            }}
          />
          <Icon size={14} color={meta.accent} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#CBD5E1" }}>
            {label}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: meta.accent,
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: `${meta.accent}15`,
              fontFamily: "monospace",
            }}
          >
            {meta.label}
          </span>
          <button
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: copied ? "rgba(34,197,94,0.1)" : "transparent",
              color: copied ? "#22C55E" : "#64748B",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── code body ────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto" }}>
        <pre
          style={{
            margin: 0,
            padding: showLineNumbers ? "16px 20px 16px 0" : "16px 20px",
            fontSize: "13px",
            lineHeight: 1.75,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            counterReset: "line",
          }}
        >
          <code>
            {tokenizedLines.map((tokens, lineIdx) => (
              <div
                key={lineIdx}
                style={{
                  display: "flex",
                  minHeight: "22px",
                }}
              >
                {/* line number gutter */}
                {showLineNumbers && (
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: "44px",
                      paddingRight: "16px",
                      textAlign: "right",
                      color: "#334155",
                      fontSize: "12px",
                      userSelect: "none",
                      flexShrink: 0,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {lineIdx + 1}
                  </span>
                )}
                {/* tokens */}
                <span>
                  {tokens.map((token, tIdx) => (
                    <span key={tIdx} style={{ color: token.color }}>
                      {token.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
