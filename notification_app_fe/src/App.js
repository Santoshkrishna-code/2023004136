import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";

const PAGE_SIZE = 5;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://4.224.186.213/evaluation-service";

function normalizeNotification(item) {
  return {
    id: item.id || item.ID || Math.random().toString(36).slice(2),
    type: item.type || item.Type || "Event",
    title: item.title || item.Type || "Notification",
    message: item.message || item.Message || "",
    isRead: Boolean(item.isRead || item.IsRead),
    createdAt: item.createdAt || item.Timestamp || new Date().toISOString()
  };
}

function App() {
  const [view, setView] = useState("all");
  const [typeFilter, setTypeFilter] = useState("All");
  const [readFilter, setReadFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = process.env.REACT_APP_ACCESS_TOKEN;

    if (!token) {
      setError("REACT_APP_ACCESS_TOKEN is not set. Add it in notification_app_fe/.env.");
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          params: {
            page: 1,
            limit: 100
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const items = (response.data.notifications || []).map(normalizeNotification);
        if (isMounted) {
          setAllNotifications(items);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch API notifications. Check token and API base URL.");
          setAllNotifications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return allNotifications.filter((item) => {
      const typeOk = typeFilter === "All" || item.type === typeFilter;
      const readOk =
        readFilter === "All" ||
        (readFilter === "Read" && item.isRead) ||
        (readFilter === "Unread" && !item.isRead);
      return typeOk && readOk;
    });
  }, [allNotifications, typeFilter, readFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <h1>Notification Center</h1>
        <p>Stage 7 UI: all notifications, filters, pagination, and priority inbox.</p>
        {loading && <p className="info">Loading notifications from API...</p>}
        {error && <p className="warn">{error}</p>}
      </header>

      <section className="toolbar">
        <div className="tabs">
          <button
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            All Notifications
          </button>
          <button
            className={view === "priority" ? "active" : ""}
            onClick={() => setView("priority")}
          >
            Priority Inbox
          </button>
        </div>

        <div className="filters">
          <label>
            Type
            <select value={typeFilter} onChange={onFilterChange(setTypeFilter)}>
              <option>All</option>
              <option>Placement</option>
              <option>Result</option>
              <option>Event</option>
            </select>
          </label>

          <label>
            Status
            <select value={readFilter} onChange={onFilterChange(setReadFilter)}>
              <option>All</option>
              <option>Read</option>
              <option>Unread</option>
            </select>
          </label>
        </div>
      </section>

      {view === "all" ? (
        <>
          <NotificationsPage notifications={paginated} />
          <footer className="pager">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
            <span>
              Page {safePage} of {pageCount}
            </span>
            <button onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>Next</button>
          </footer>
        </>
      ) : (
        <PriorityInboxPage notifications={filtered} />
      )}
    </main>
  );
}

export default App;
