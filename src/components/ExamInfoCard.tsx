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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} style={{ backgroundColor: "#1B2336", border: "1px solid #334155", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
          <Icon size={18} color="#4ade80" style={{ margin: "0 auto 8px" }} />
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#F8FAFC" }}>{value}</div>
          <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}
