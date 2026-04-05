import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import "./index.css";

function Layout() {
  const { state, dispatch } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const pages = { dashboard: <Dashboard />, transactions: <Transactions />, insights: <Insights /> };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Sidebar — always shown on desktop via media approach below */}
      <div id="sidebar-desktop" style={{
        display: "flex", flexShrink: 0,
      }}>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setMenuOpen(false)}>
          <div style={{
            width: 260, height: "100%", background: "var(--bg2)",
            borderRight: "1px solid var(--border)",
          }} onClick={(e) => e.stopPropagation()}>
            <Sidebar mobile onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Mobile topbar */}
        <div id="mobile-topbar" style={{
          display: "none", padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg2)",
          alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, var(--accent), #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontFamily: "Syne", fontWeight: 800, color: "#fff",
            }}>F</div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>Finio</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" })}
              style={{
                width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border)",
                background: "var(--bg3)", fontSize: 16,
              }}>{state.theme === "dark" ? "☀️" : "🌙"}</button>
            <button onClick={() => setMenuOpen(true)} style={{
              width: 34, height: 34, borderRadius: 9, border: "1px solid var(--border)",
              background: "var(--bg3)", color: "var(--text)", fontSize: 18,
            }}>☰</button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "32px", maxWidth: 1200, width: "100%" }}>
          {pages[state.activeTab]}
        </div>
      </main>

      {/* Responsive style injection */}
      <style>{`
        @media (max-width: 768px) {
          #sidebar-desktop { display: none !important; }
          #mobile-topbar { display: flex !important; }
          main > div:last-child { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
