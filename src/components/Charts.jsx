import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";
import { useApp } from "../context/AppContext";
import { getMonthlyData, getCategoryBreakdown, fmtShort, fmt } from "../utils/finance";
import { CATEGORIES } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg3)", border: "1px solid var(--border2)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13,
    }}>
      <p style={{ color: "var(--text2)", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
};

export function BalanceTrendChart() {
  const { state } = useApp();
  const data = useMemo(() => getMonthlyData(state.transactions), [state.transactions]);

  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.1s both",
    }}>
      <h3 style={{ fontSize: 15, fontFamily: "Syne", marginBottom: 4 }}>Balance Trend</h3>
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>Monthly income vs expenses over time</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtShort} tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#34D399" fill="url(#incomeGrad)" strokeWidth={2.5} dot={false} />
          <Area type="monotone" dataKey="expense" name="Expense" stroke="#FF6B6B" fill="url(#expenseGrad)" strokeWidth={2.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpendingBreakdownChart() {
  const { state } = useApp();
  const data = useMemo(() => getCategoryBreakdown(state.transactions), [state.transactions]);
  const total = data.reduce((s, d) => s + d.amount, 0);

  const COLORS = data.map((d) => CATEGORIES[d.category]?.color || "#999");

  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.2s both",
    }}>
      <h3 style={{ fontSize: 15, fontFamily: "Syne", marginBottom: 4 }}>Spending Breakdown</h3>
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>Expenses by category</p>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <ResponsiveContainer width={180} height={180} style={{ minWidth: 180 }}>
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%"
              innerRadius={55} outerRadius={80} paddingAngle={2} strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip
              formatter={(v, name) => [fmt(v), CATEGORIES[name]?.label || name]}
              contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
          {data.slice(0, 6).map((d, i) => (
            <div key={d.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: "var(--text2)", flex: 1 }}>
                {CATEGORIES[d.category]?.label || d.category}
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                {Math.round((d.amount / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MonthlyBarChart() {
  const { state } = useApp();
  const data = useMemo(() => getMonthlyData(state.transactions), [state.transactions]);

  return (
    <div style={{
      background: "var(--card-bg)", border: "1px solid var(--card-border)",
      borderRadius: 16, padding: "20px 24px", animation: "fadeUp 0.5s ease 0.3s both",
    }}>
      <h3 style={{ fontSize: 15, fontFamily: "Syne", marginBottom: 4 }}>Monthly Comparison</h3>
      <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>Net savings per month</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtShort} tick={{ fill: "var(--text3)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" name="Income" fill="#34D399" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Bar dataKey="expense" name="Expense" fill="#FF6B6B" radius={[4, 4, 0, 0]} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
