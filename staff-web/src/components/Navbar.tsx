import React from "react";
import { Link, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
  setIsAuthenticated: (auth: boolean) => void;
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated, username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/home">
          Company Name
        </Link>
        <div className="d-flex align-items-center">
          <span className="text-white me-3">Hi, {username}</span>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
