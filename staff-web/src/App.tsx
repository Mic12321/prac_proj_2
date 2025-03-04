import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StockManagement from "./pages/StockManagement";
import Analysis from "./pages/Analysis";
import AccountManagement from "./pages/AccountManagement";
import PendingOrders from "./pages/PendingOrders";
import Order from "./pages/Order";
import SearchItem from "./pages/SearchItem";
import ModifyMenu from "./pages/ModifyMenu";
import AddItem from "./pages/AddItem";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  //
  const [username, setUsername] = useState("testUsername");

  return (
    <Router>
      {isAuthenticated && (
        <Navbar setIsAuthenticated={setIsAuthenticated} username={username} />
      )}

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<Home isAdmin={isAdmin} />}
              />
            }
          />

          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setIsAdmin={setIsAdmin}
              />
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<Home isAdmin={isAdmin} />}
              />
            }
          />
          <Route
            path="/stock-management"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<StockManagement />}
              />
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<Analysis />}
              />
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<Order />}
              />
            }
          />
          <Route
            path="/pending-orders"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<PendingOrders />}
              />
            }
          />
          <Route // Only admin can access, has to moodify in the future
            path="/account-management"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<AccountManagement />}
              />
            }
          />
          <Route
            path="/search-item"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<SearchItem />}
              />
            }
          />
          <Route
            path="/modify-menu"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<ModifyMenu />}
              />
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<AddItem />}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
