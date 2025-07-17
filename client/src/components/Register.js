import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://to-do-backend.onrender.com/auth/register", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        const data = await res.json();
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{ fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: 400, borderRadius: "12px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-success">Create Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Choose a username"
              onChange={handleChange}
              value={form.username}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              onChange={handleChange}
              value={form.password}
              required
              minLength={6}
            />
            <div className="form-text">At least 6 characters</div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold py-2"
            style={{ fontSize: "1.1rem" }}
          >
            Register
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Already have an account?{" "}
            <a href="/login" className="text-success text-decoration-none">
              Log in here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register;
