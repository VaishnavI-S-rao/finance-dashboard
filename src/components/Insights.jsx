import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { getInsights, getMonthlyData, getCategoryBreakdown, fmt, fmtShort } from "../utils/finance";
import { CATEGORIES } from "../data/mockData";
import { MonthlyBarChart } from "./Charts";

function InsightCard({ icon, title, value, sub, color = "var(--accent)", delay = 0 }) {
  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 16, padding: "20px 22px",
      animation: `fadeUp 0.5s ease ${delay}s both`,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}18`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20,
        }}>{icon}</span>
        <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ fontSize: 26, fontFamily: "Syne", fontWeight: 700, color }}>{value}</div>
      {sub && <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const insights = useMemo(() => getInsights(state.transactions), [state.transactions]);
  const monthly = useMemo(() => getMonthlyData(state.transactions), [state.transactions]);
  const catBreak = useMemo(() => getCategoryBreakdown(state.transactions), [state.transactions]);
  const totalExpense = catBreak.reduce((s, d) => s + d.amount, 0);

  const { topCat, savingsRate, expenseChange, avgMonthlyExpense, last, prev } = insights;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontFamily: "Syne" }}>Insights</h2>
        <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>Smart observations from your financial data</p>
      </div>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <InsightCard
          icon="🏆"
          title="Top Spending Category"
          value={CATEGORIES[topCat?.category]?.label || "—"}
          sub={topCat ? `${fmt(topCat.amount)} spent — ${Math.round((topCat.amount / totalExpense) * 100)}% of total` : "No data"}
          color={CATEGORIES[topCat?.category]?.color || "var(--accent)"}
          delay={0}
        />
        <InsightCard
          icon="💾"
          title="Savings Rate"
          value={`${savingsRate}%`}
          sub={savingsRate >= 20 ? "Great! You're saving well." : savingsRate >= 10 ? "Room for improvement." : "Try to cut discretionary spending."}
          color={savingsRate >= 20 ? "var(--green)" : savingsRate >= 10 ? "var(--yellow)" : "var(--red)"}
          delay={0.1}
        />
        <InsightCard
          icon="📊"
          title="Expense Change"
          value={`${expenseChange > 0 ? "+" : ""}${expenseChange}%`}
          sub={`vs previous month. ${expenseChange > 10 ? "Spending increased significantly." : expenseChange < -10 ? "Great, spending is down!" : "Spending is stable."}`}
          color={expenseChange <= 0 ? "var(--green)" : expenseChange <= 10 ? "var(--yellow)" : "var(--red)"}
          delay={0.2}
        />
        <InsightCard
          icon="📅"
          title="Avg Monthly Expense"
          value={fmtShort(avgMonthlyExpense)}
          sub={`Across ${monthly.length} months of data. ${fmt(avgMonthlyExpense)} per month on average.`}
          color="var(--accent)"
          delay={0.3}
        />
      </div>

      {/* Monthly Bar Chart */}
      <MonthlyBarChart />

      {/* Category deep dive */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.4s both",
      }}>
        <h3 style={{ fontSize: 15, fontFamily: "Syne", marginBottom: 4 }}>Category Deep Dive</h3>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>Where your money goes — sorted by highest spend</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {catBreak.slice(0, 8).map((d) => {
            const cat = CATEGORIES[d.category];
            const pct = Math.round((d.amount / totalExpense) * 100);
            return (
              <div key={d.category}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
                    {cat?.icon} {cat?.label || d.category}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{pct}%</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{fmt(d.amount)}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: "var(--bg4)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 4,
                    background: cat?.color || "var(--accent)",
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick observations */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.5s both",
      }}>
        <h3 style={{ fontSize: 15, fontFamily: "Syne", marginBottom: 16 }}>💡 Observations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            topCat && `Your highest spending is on ${CATEGORIES[topCat.category]?.label} at ${fmt(topCat.amount)}. Consider setting a monthly budget for this category.`,
            savingsRate < 20 && `Your savings rate is ${savingsRate}%. Financial advisors typically recommend saving at least 20% of income.`,
            expenseChange > 15 && `Your expenses increased by ${expenseChange}% this month compared to last. Review discretionary spending.`,
            expenseChange < -15 && `Great job! You reduced expenses by ${Math.abs(expenseChange)}% this month.`,
            last && `This month you ${last.income > last.expense ? `saved ${fmt(last.income - last.expense)}` : `overspent by ${fmt(last.expense - last.income)}`}.`,
          ].filter(Boolean).map((obs, i) => (
            <div key={i} style={{
              padding: "12px 14px", borderRadius: 10,
              background: "var(--bg3)", border: "1px solid var(--border)",
              fontSize: 13, color: "var(--text2)", lineHeight: 1.6,
              display: "flex", gap: 10,
            }}>
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
              {obs}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
