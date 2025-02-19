import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Stock from "./pages/Stock";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? <Navigate to="/login" replace /> : <Home />
            }
          />

          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route
            path="/home"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
