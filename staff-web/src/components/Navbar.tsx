import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

interface NavbarProps {
  setIsAuthenticated: (auth: boolean) => void;
  username: string;
  setNavbarHeight: (height: number) => void; //
}

const Navbar: React.FC<NavbarProps> = ({
  setIsAuthenticated,
  username,
  setNavbarHeight,
}) => {
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, [setNavbarHeight]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
      style={{ zIndex: 1050 }}
    >
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
