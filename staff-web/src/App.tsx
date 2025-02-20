import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StockManagement from "./pages/StockManagement";
import Analysis from "./pages/Analysis";
import AccountManagement from "./pages/AccountManagement";
import PendingOrders from "./pages/PendingOrders";
import Order from "./pages/Order";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

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
          <Route
            path="/account-management"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={<AccountManagement />}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
