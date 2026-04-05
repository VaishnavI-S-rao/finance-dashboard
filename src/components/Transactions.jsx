import { useState } from "react";
import { useApp, useFilteredTransactions } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import { fmt } from "../utils/finance";
import TransactionModal from "./TransactionModal";
import { exportCSV, exportJSON } from "../utils/finance";

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { filters, sort, role } = state;
  const filtered = useFilteredTransactions();

  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const setFilter = (key, val) => dispatch({ type: "SET_FILTER", payload: { [key]: val } });
  const setSort = (field) => {
    dispatch({
      type: "SET_SORT",
      payload: { field, dir: sort.field === field && sort.dir === "desc" ? "asc" : "desc" },
    });
  };

  const SortBtn = ({ field, label }) => (
    <button onClick={() => setSort(field)} style={{
      background: "none", border: "none", color: sort.field === field ? "var(--accent2)" : "var(--text3)",
      fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
      padding: "4px 0", textTransform: "uppercase", letterSpacing: 0.5,
    }}>
      {label}
      {sort.field === field && <span style={{ fontSize: 10 }}>{sort.dir === "asc" ? "▲" : "▼"}</span>}
    </button>
  );

  const inputStyle = {
    background: "var(--bg3)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "9px 13px", color: "var(--text)",
    fontSize: 13, outline: "none", width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontFamily: "Syne" }}>Transactions</h2>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>
            {filtered.length} transactions {filters.search || filters.category !== "all" || filters.type !== "all" ? "(filtered)" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => exportCSV(filtered)} style={{
            padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--bg3)", color: "var(--text2)", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
          }}>⬇ CSV</button>
          <button onClick={() => exportJSON(filtered)} style={{
            padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--bg3)", color: "var(--text2)", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
          }}>⬇ JSON</button>
          {role === "admin" && (
            <button onClick={() => { setEditTx(null); setShowModal(true); }} style={{
              padding: "9px 18px", borderRadius: 10, border: "none",
              background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 12px var(--accent-glow)",
            }}>+ Add Transaction</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: 16, padding: "16px 20px",
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ flex: "2 1 200px" }}>
          <input style={inputStyle} placeholder="🔍  Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)} />
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 120px" }}>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={filters.type}
            onChange={(e) => setFilter("type", e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div style={{ flex: "1 1 130px" }}>
          <input style={inputStyle} type="date" value={filters.dateFrom}
            onChange={(e) => setFilter("dateFrom", e.target.value)} />
        </div>
        <div style={{ flex: "1 1 130px" }}>
          <input style={inputStyle} type="date" value={filters.dateTo}
            onChange={(e) => setFilter("dateTo", e.target.value)} />
        </div>
        {(filters.search || filters.category !== "all" || filters.type !== "all" || filters.dateFrom || filters.dateTo) && (
          <button onClick={() => dispatch({ type: "RESET_FILTERS" })} style={{
            padding: "9px 14px", borderRadius: 10, border: "1px solid var(--border)",
            background: "transparent", color: "var(--red)", fontSize: 13, whiteSpace: "nowrap",
          }}>✕ Clear</button>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: "var(--card-bg)", border: "1px solid var(--card-border)",
        borderRadius: 16, overflow: "hidden", animation: "fadeUp 0.4s ease both",
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px auto",
          padding: "12px 20px", borderBottom: "1px solid var(--border)",
          gap: 12,
        }}>
          <SortBtn field="description" label="Description" />
          <SortBtn field="category" label="Category" />
          <SortBtn field="date" label="Date" />
          <SortBtn field="amount" label="Amount" />
          <span style={{ fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {role === "admin" ? "Actions" : "Type"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "var(--text2)", fontFamily: "Syne", fontSize: 16 }}>No transactions found</p>
            <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {filtered.map((tx, i) => {
              const cat = CATEGORIES[tx.category];
              return (
                <div key={tx.id} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 120px 100px auto",
                  padding: "13px 20px", borderBottom: "1px solid var(--border)",
                  gap: 12, alignItems: "center",
                  transition: "background 0.15s",
                  animation: `fadeUp 0.3s ease ${i * 0.02}s both`,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{tx.description}</p>
                    {tx.note && <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{tx.note}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      fontSize: 12, padding: "3px 9px", borderRadius: 20,
                      background: `${cat?.color || "#999"}18`,
                      color: cat?.color || "var(--text2)", fontWeight: 500,
                    }}>
                      {cat?.icon} {cat?.label || tx.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text2)" }}>
                    {new Date(tx.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                  </p>
                  <p style={{
                    fontSize: 14, fontWeight: 600,
                    color: tx.type === "income" ? "var(--green)" : "var(--red)",
                  }}>
                    {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                  </p>
                  {role === "admin" ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditTx(tx); setShowModal(true); }} style={{
                        padding: "5px 10px", borderRadius: 7, border: "1px solid var(--border)",
                        background: "var(--bg3)", color: "var(--text2)", fontSize: 12,
                      }}>Edit</button>
                      <button onClick={() => {
                        if (window.confirm("Delete this transaction?"))
                          dispatch({ type: "DELETE_TRANSACTION", payload: tx.id });
                      }} style={{
                        padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(255,107,107,0.3)",
                        background: "rgba(255,107,107,0.08)", color: "var(--red)", fontSize: 12,
                      }}>Del</button>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 600,
                      background: tx.type === "income" ? "rgba(52,211,153,0.12)" : "rgba(255,107,107,0.12)",
                      color: tx.type === "income" ? "var(--green)" : "var(--red)",
                      textTransform: "uppercase", letterSpacing: 0.5,
                    }}>{tx.type}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal transaction={editTx} onClose={() => { setShowModal(false); setEditTx(null); }} />
      )}
    </div>
  );
}
