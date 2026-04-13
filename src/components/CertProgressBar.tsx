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
        <span style={{ fontSize: "12px", color: "#94A3B8" }}>{completed} of {total} domains</span>
        <span style={{ fontSize: "12px", fontWeight: 600, color }}>{pct}%</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", backgroundColor: "#272F42", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: "3px", backgroundColor: color, transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}
