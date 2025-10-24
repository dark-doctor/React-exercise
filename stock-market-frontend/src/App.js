import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

//
// 🧩 Stocks Page
//
function StocksPage({ onAddToWatchlist }) {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all stocks when this page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/stocks")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setStockList(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getRandomColor = () => {
    const colors = ["#FF0000", "#00FF00"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) return <p>Loading stocks...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="App">
      <h1>Stock Market MERN App</h1>
      <h2>Stocks List</h2>
      <ul>
        {stockList.map((item) => (
          <li key={item._id || item.symbol}>
            {item.company} ({item.symbol}) -
            <span style={{ color: getRandomColor() }}> ${item.initial_price}</span>
            <button onClick={() => onAddToWatchlist(item)}>
              Add to My Watchlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

//
// 🧩 Watchlist Page
//
function WatchlistPage({ watchlist, setWatchlist }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch the persisted watchlist from backend on load
  useEffect(() => {
    fetch("http://localhost:5000/api/watchlist")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setWatchlist(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setWatchlist]);

  const getRandomColor = () => {
    const colors = ["#FF0000", "#00FF00"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) return <p>Loading watchlist...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="App">
      <h1>Stock Market MERN App</h1>
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul>
          {watchlist.map((item) => (
            <li key={item._id || item.symbol}>
              {item.company} ({item.symbol}) -
              <span style={{ color: getRandomColor() }}> ${item.initial_price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

//
// 🧩 Root Component
//
function App() {
  const [watchlist, setWatchlist] = useState([]);

  // ✅ Add stock to backend and update local state
  const handleAddToWatchlist = (stockItem) => {
    fetch("http://localhost:5000/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockItem),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((response) => {
        alert(response.message);

        // Optional: prevent duplicates in UI
        setWatchlist((prev) => {
          if (prev.some((s) => s.symbol === stockItem.symbol)) return prev;
          return [...prev, stockItem];
        });
      })
      .catch((err) => console.error("Error adding to watchlist:", err));
  };

  return (
    <Router>
      <nav>
        <NavLink to="/stocks">Stocks</NavLink>{" | "}
        <NavLink to="/watchlist">Watchlist</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/stocks" />} />
        <Route
          path="/stocks"
          element={<StocksPage onAddToWatchlist={handleAddToWatchlist} />}
        />
        <Route
          path="/watchlist"
          element={
            <WatchlistPage
              watchlist={watchlist}
              setWatchlist={setWatchlist}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
