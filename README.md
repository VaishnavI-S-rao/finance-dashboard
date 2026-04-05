# Finio — Finance Dashboard

A clean, interactive finance dashboard built with **React + Vite**, designed for the Zorvyn Frontend Developer Intern screening assignment.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Features

### Core Requirements (All implemented)

| Requirement | Status | Notes |
|---|---|---|
| Dashboard Overview | ✅ | Summary cards + 2 charts |
| Transactions Section | ✅ | Full CRUD, search, filter, sort |
| Role-Based UI | ✅ | Viewer / Admin toggle in sidebar |
| Insights Section | ✅ | 4 metrics + category breakdown + observations |
| State Management | ✅ | React Context + useReducer |
| Responsive UI | ✅ | Mobile sidebar + adaptive layout |

### Optional Enhancements (All implemented)

| Enhancement | Status |
|---|---|
| Dark / Light Mode | ✅ |
| Data Persistence (localStorage) | ✅ |
| Export CSV / JSON | ✅ |
| Animations & Transitions | ✅ |
| Advanced Filtering (search + category + type + date range) | ✅ |

---

## 🗂 Project Structure

```
src/
├── context/
│   └── AppContext.jsx       # Global state: Context + useReducer
├── data/
│   └── mockData.js          # 65 seed transactions + category config
├── components/
│   ├── Sidebar.jsx          # Navigation, role switcher, theme toggle
│   ├── Dashboard.jsx        # Overview page
│   ├── SummaryCards.jsx     # Balance / Income / Expense cards
│   ├── Charts.jsx           # Area, Bar, Pie charts (Recharts)
│   ├── Transactions.jsx     # Transaction list with filters + CRUD
│   ├── TransactionModal.jsx # Add / Edit modal with validation
│   └── Insights.jsx        # Analytics + observations
├── utils/
│   └── finance.js           # Pure helpers: formatting, aggregation, export
├── App.jsx                  # Root layout
├── main.jsx                 # Entry point
└── index.css                # CSS variables, animations, scrollbar
```

---

## 🎨 Design Decisions

- **Syne** (display) + **DM Sans** (body) — distinctive typographic pairing
- **CSS custom properties** for full dark/light theming, no flickering
- **Two-tone color system**: green for income, red for expense, purple accent
- Minimal use of third-party UI kits — nearly all components built from scratch
- Smooth `fadeUp` stagger animations on page load for every card/row

---

## 🔐 Role-Based UI

Switch roles via the **sidebar toggle** (persists via localStorage):

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard & charts | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Filter & search | ✅ | ✅ |
| Export CSV / JSON | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

---

## 📊 State Management

All state lives in a single **React Context** backed by `useReducer`:

```
AppContext
├── transactions[]      ← persisted to localStorage
├── role                ← "viewer" | "admin", persisted
├── theme               ← "dark" | "light", persisted
├── filters             ← { search, category, type, dateFrom, dateTo }
├── sort                ← { field, dir }
└── activeTab           ← "dashboard" | "transactions" | "insights"
```

The `useFilteredTransactions` custom hook derives filtered+sorted transactions from state without duplicating data.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `recharts` | Area, Bar, Pie charts |
| `lucide-react` | Icon set |
| `vite` | Build tool |

---

## 📱 Responsive Behaviour

- **≥ 769px**: Fixed sidebar + scrollable main content
- **≤ 768px**: Collapsible hamburger menu, full-width layout, touch-friendly tap targets

---

## 💾 Data Persistence

- Transactions, role, and theme are all saved to **localStorage**
- First visit loads 65 seed transactions spanning 6 months (Nov 2025 – Apr 2026)
- Any edits/additions persist across page refreshes

---

## 📤 Export

In the Transactions tab:
- **CSV** — downloads `finio_transactions.csv` of currently filtered view
- **JSON** — downloads `finio_transactions.json` of currently filtered view

---

*Built by Vaishnavi for the Zorvyn Frontend Developer Intern screening — April 2026*
