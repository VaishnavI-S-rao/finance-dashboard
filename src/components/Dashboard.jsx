import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import SummaryCards from "./SummaryCards";
import { BalanceTrendChart, SpendingBreakdownChart } from "./Charts";
import { CATEGORIES } from "../data/mockData";
import { fmt } from "../utils/finance";

export default function Dashboard() {
  const { state } = useApp();

  const recent = useMemo(() =>
    [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6),
    [state.transactions]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ animation: "fadeUp 0.4s ease both" }}>
        <p style={{ fontSize: 13, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 500 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontSize: 28, fontFamily: "Syne", marginTop: 4 }}>
          Financial Overview
        </h1>
        {state.role === "admin" && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8,
            padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: "rgba(255,200,0,0.1)", color: "#FFE66D",
            border: "1px solid rgba(255,200,0,0.2)", textTransform: "uppercase", letterSpacing: 0.5,
          }}>🔑 Admin Access</span>
        )}
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <BalanceTrendChart />
        </div>
        <SpendingBreakdownChart />

        {/* Recent Transactions mini */}
        <div style={{
          background: "var(--card-bg)", border: "1px solid var(--card-border)",
          borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.3s both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontFamily: "Syne" }}>Recent Activity</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recent.length === 0 ? (
              <p style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No transactions yet</p>
            ) : recent.map((tx, i) => {
              const cat = CATEGORIES[tx.category];
              return (
                <div key={tx.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
                  animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                }}>
                  <span style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: `${cat?.color || "#999"}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>{cat?.icon || "💸"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {tx.description}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
                      {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: tx.type === "income" ? "var(--green)" : "var(--red)",
                    flexShrink: 0,
                  }}>
                    {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
