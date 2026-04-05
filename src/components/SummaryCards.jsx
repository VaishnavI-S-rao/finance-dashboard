import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { getSummary, fmt, fmtShort } from "../utils/finance";

function StatCard({ label, value, icon, color, sub, delay = 0 }) {
  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      animation: `fadeUp 0.5s ease ${delay}s both`,
      position: "relative",
      overflow: "hidden",
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at 100% 0%, ${color}18 0%, transparent 60%)`,
        borderRadius: "0 16px 0 100%",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
        <span style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 18,
        }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 28, fontFamily: "Syne", fontWeight: 700, color, lineHeight: 1.1 }}>
          {fmtShort(value)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{fmt(value)}</div>
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--text2)", paddingTop: 8, borderTop: "1px solid var(--border)" }}>{sub}</div>}
    </div>
  );
}

export default function SummaryCards() {
  const { state } = useApp();
  const { income, expense, balance } = useMemo(() => getSummary(state.transactions), [state.transactions]);
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <StatCard
        label="Net Balance"
        value={balance}
        icon="◈"
        color={balance >= 0 ? "var(--green)" : "var(--red)"}
        sub={`Savings rate: ${savingsRate}%`}
        delay={0}
      />
      <StatCard
        label="Total Income"
        value={income}
        icon="↑"
        color="var(--green)"
        sub={`${state.transactions.filter(t => t.type === "income").length} income transactions`}
        delay={0.1}
      />
      <StatCard
        label="Total Expenses"
        value={expense}
        icon="↓"
        color="var(--red)"
        sub={`${state.transactions.filter(t => t.type === "expense").length} expense transactions`}
        delay={0.2}
      />
    </div>
  );
}
