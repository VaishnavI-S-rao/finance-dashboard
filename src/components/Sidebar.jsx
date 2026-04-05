import { useApp } from "../context/AppContext";

const NAV = [
  { id: "dashboard", label: "Overview", icon: "◈" },
  { id: "transactions", label: "Transactions", icon: "⇄" },
  { id: "insights", label: "Insights", icon: "◎" },
];

export default function Sidebar({ mobile, onClose }) {
  const { state, dispatch } = useApp();

  return (
    <aside style={{
      width: mobile ? "100%" : 220,
      background: "var(--bg2)",
      borderRight: mobile ? "none" : "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
      height: mobile ? "auto" : "100vh",
      position: mobile ? "static" : "sticky",
      top: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontFamily: "Syne", fontWeight: 800, color: "#fff",
            boxShadow: "0 4px 12px var(--accent-glow)",
          }}>F</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>Finio</span>
        </div>
        {mobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: 20 }}>✕</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((item) => {
          const active = state.activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { dispatch({ type: "SET_ACTIVE_TAB", payload: item.id }); if (onClose) onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, border: "none",
                background: active ? "var(--accent-glow)" : "transparent",
                color: active ? "var(--accent2)" : "var(--text2)",
                fontFamily: "DM Sans", fontWeight: active ? 600 : 400,
                fontSize: 14, transition: "all 0.2s", textAlign: "left",
                cursor: "pointer", width: "100%",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 18, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div style={{ padding: "16px 16px 0", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, paddingLeft: 4 }}>Role</p>
        <div style={{ display: "flex", gap: 6 }}>
          {["viewer", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
              style={{
                flex: 1, padding: "7px 0", borderRadius: 8, border: "1px solid",
                borderColor: state.role === r ? "var(--accent)" : "var(--border)",
                background: state.role === r ? "var(--accent-glow)" : "transparent",
                color: state.role === r ? "var(--accent2)" : "var(--text3)",
                fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                transition: "all 0.2s",
              }}
            >{r}</button>
          ))}
        </div>
        {state.role === "admin" && (
          <div style={{
            marginTop: 8, padding: "6px 10px", borderRadius: 6,
            background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)",
            fontSize: 11, color: "#FFE66D", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>🔑</span> Admin mode active
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <div style={{ padding: "16px 16px 0" }}>
        <button
          onClick={() => dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" })}
          style={{
            width: "100%", padding: "9px 14px", borderRadius: 10,
            border: "1px solid var(--border)", background: "var(--bg3)",
            color: "var(--text2)", fontSize: 13, display: "flex",
            alignItems: "center", gap: 10, transition: "all 0.2s",
          }}
        >
          <span>{state.theme === "dark" ? "☀️" : "🌙"}</span>
          {state.theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
