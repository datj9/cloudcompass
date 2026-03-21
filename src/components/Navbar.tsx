"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cloud, BookOpen, GitCompare, Zap, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/practice", label: "Practice", icon: Zap },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        borderBottom: "1px solid #334155",
        backgroundColor: "rgba(15,23,42,0.92)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <nav
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#F8FAFC",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Cloud size={18} color="#0F172A" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: "17px", letterSpacing: "-0.3px" }}>
            CloudCompass
          </span>
        </Link>

        {/* Desktop nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          className="hidden md:flex"
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#22C55E" : "#94A3B8",
                  backgroundColor: active ? "rgba(34,197,94,0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#F8FAFC";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#272F42";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#94A3B8";
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/learn"
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "#22C55E",
              color: "#0F172A",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.15s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#16A34A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#22C55E";
            }}
            className="hidden md:inline-flex"
          >
            Start Learning
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "transparent",
              color: "#94A3B8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid #334155",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          className="md:hidden"
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#22C55E" : "#94A3B8",
                  backgroundColor: active ? "rgba(34,197,94,0.1)" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          <Link
            href="/learn"
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: "8px",
              padding: "12px 14px",
              borderRadius: "8px",
              backgroundColor: "#22C55E",
              color: "#0F172A",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Start Learning
          </Link>
        </div>
      )}
    </header>
  );
}
