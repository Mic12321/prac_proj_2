import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/authService";
import logo from "../assets/logo.png";

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setIsAdmin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");

    const { user, error: loginError } = await login({ username, password });

    if (loginError) {
      setError(loginError);
      return;
    }

    setIsAuthenticated(true);
    setIsAdmin(user?.role === "admin");

    navigate("/home");
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow text-center" style={{ width: "350px" }}>
        <div className="mb-3">
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "80px", height: "80px" }}
          />
          <h3 className="mt-2">Company Name</h3>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
