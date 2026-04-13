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
        <Link href={`/certifications/${certId}/${prevDomain.id}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 18px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#1B2336", textDecoration: "none" }}>
          <ArrowLeft size={16} color="#94A3B8" />
          <div>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Previous</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{prevDomain.title}</div>
          </div>
        </Link>
      ) : <div />}
      {nextDomain && (
        <Link href={`/certifications/${certId}/${nextDomain.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "16px 18px", borderRadius: "10px", border: "1px solid #334155", backgroundColor: "#1B2336", textDecoration: "none" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "2px" }}>Next</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#E2E8F0" }}>{nextDomain.title}</div>
          </div>
          <ArrowRight size={16} color="#94A3B8" />
        </Link>
      )}
    </div>
  );
}
