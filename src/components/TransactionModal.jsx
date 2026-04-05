import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: transaction?.description || "",
    category: transaction?.category || "food",
    type: transaction?.type || "expense",
    amount: transaction?.amount || "",
    date: transaction?.date || new Date().toISOString().split("T")[0],
    note: transaction?.note || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { ...form, amount: Number(form.amount) };
    if (isEdit) {
      dispatch({ type: "EDIT_TRANSACTION", payload: { ...payload, id: transaction.id } });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
    }
    onClose();
  };

  const Field = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11, color: "var(--red)" }}>{error}</span>}
    </div>
  );

  const inputStyle = {
    background: "var(--bg3)", border: "1px solid",
    borderColor: "var(--border2)", borderRadius: 10,
    padding: "10px 14px", color: "var(--text)", fontSize: 14,
    outline: "none", transition: "border-color 0.2s", width: "100%",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, animation: "fadeIn 0.2s ease",
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: 20, padding: "28px", width: "100%", maxWidth: 480,
        animation: "fadeUp 0.3s ease",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontFamily: "Syne" }}>{isEdit ? "Edit Transaction" : "New Transaction"}</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--bg3)", color: "var(--text2)", fontSize: 16,
          }}>✕</button>
        </div>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "var(--bg3)", borderRadius: 12, padding: 4 }}>
          {["expense", "income"].map((t) => (
            <button key={t} onClick={() => setForm({ ...form, type: t })} style={{
              flex: 1, padding: "9px", borderRadius: 9, border: "none",
              background: form.type === t ? (t === "income" ? "var(--green)" : "var(--red)") : "transparent",
              color: form.type === t ? "#fff" : "var(--text2)",
              fontWeight: 600, fontSize: 13, textTransform: "capitalize", transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Description" error={errors.description}>
            <input style={inputStyle} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Swiggy Order" />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Amount (₹)" error={errors.amount}>
              <input style={inputStyle} type="number" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0" min="0" />
            </Field>
            <Field label="Date" error={errors.date}>
              <input style={inputStyle} type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>

          <Field label="Category">
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.icon} {cat.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Note (optional)">
            <input style={inputStyle} value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note..." />
          </Field>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text2)", fontSize: 14, fontWeight: 500,
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "12px", borderRadius: 12,
            border: "none", background: "var(--accent)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            boxShadow: "0 4px 12px var(--accent-glow)", transition: "opacity 0.2s",
          }}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
