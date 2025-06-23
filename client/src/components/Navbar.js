import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/tasks" style={{ gap: '0.5rem' }}>
          <span role="img" aria-label="memo">📝</span> To-Do App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navMenu">
          <ul className="navbar-nav align-items-center gap-3">
            {token ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-light fw-semibold px-3"
                    to="/tasks"
                  >
                    My Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm rounded-pill px-4"
                    type="button"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light btn-sm rounded-pill px-4"
                    to="/login"
                    role="button"
                    aria-label="Login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm rounded-pill px-4 text-primary fw-semibold"
                    to="/register"
                    role="button"
                    aria-label="Register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
