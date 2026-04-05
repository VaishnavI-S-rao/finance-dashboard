export const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const fmtShort = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

export const getMonthLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
};

export const getMonthKey = (dateStr) => dateStr.slice(0, 7);

export const getSummary = (transactions) => {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};

export const getMonthlyData = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    if (!map[key]) map[key] = { month: key, label: getMonthLabel(t.date), income: 0, expense: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expense += t.amount;
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({ ...m, balance: m.income - m.expense }));
};

export const getCategoryBreakdown = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += t.amount;
    });
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const getInsights = (transactions) => {
  const monthly = getMonthlyData(transactions);
  const catBreak = getCategoryBreakdown(transactions);
  const topCat = catBreak[0];

  const sorted = [...monthly].sort((a, b) => a.month.localeCompare(b.month));
  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];

  const savingsRate = last
    ? Math.round(((last.income - last.expense) / (last.income || 1)) * 100)
    : 0;

  const expenseChange = last && prev && prev.expense > 0
    ? Math.round(((last.expense - prev.expense) / prev.expense) * 100)
    : 0;

  const avgMonthlyExpense = monthly.length
    ? Math.round(monthly.reduce((s, m) => s + m.expense, 0) / monthly.length)
    : 0;

  return { topCat, savingsRate, expenseChange, avgMonthlyExpense, last, prev };
};

export const exportCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount", "Note"];
  const rows = transactions.map((t) => [
    t.date, t.description, t.category, t.type, t.amount, t.note
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finio_transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "finio_transactions.json";
  a.click();
  URL.revokeObjectURL(url);
};
