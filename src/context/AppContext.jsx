import { createContext, useContext, useReducer, useEffect } from "react";
import { getInitialTransactions, SEED_TRANSACTIONS } from "../data/mockData";

const AppContext = createContext(null);

const initialState = {
  transactions: getInitialTransactions(),
  role: localStorage.getItem("finio_role") || "viewer",
  theme: localStorage.getItem("finio_theme") || "dark",
  filters: { search: "", category: "all", type: "all", dateFrom: "", dateTo: "" },
  sort: { field: "date", dir: "desc" },
  activeTab: "dashboard",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":
      return { ...state, filters: initialState.filters };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "ADD_TRANSACTION": {
      const newT = { ...action.payload, id: Date.now() };
      const updated = [newT, ...state.transactions];
      localStorage.setItem("finio_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "EDIT_TRANSACTION": {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      localStorage.setItem("finio_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "DELETE_TRANSACTION": {
      const updated = state.transactions.filter((t) => t.id !== action.payload);
      localStorage.setItem("finio_transactions", JSON.stringify(updated));
      return { ...state, transactions: updated };
    }
    case "RESET_DATA": {
      localStorage.removeItem("finio_transactions");
      return { ...state, transactions: SEED_TRANSACTIONS };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("finio_role", state.role);
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem("finio_theme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const useFilteredTransactions = () => {
  const { state } = useApp();
  const { transactions, filters, sort } = state;

  let result = transactions.filter((t) => {
    if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  });

  result = [...result].sort((a, b) => {
    let va = a[sort.field], vb = b[sort.field];
    if (sort.field === "amount") { va = Number(va); vb = Number(vb); }
    if (va < vb) return sort.dir === "asc" ? -1 : 1;
    if (va > vb) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  return result;
};
