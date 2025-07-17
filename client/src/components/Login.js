import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://to-do-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } else {
        const data = await res.json();
        alert(data.message || "Login failed.");
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
        <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back</h2>

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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold py-2"
            style={{ fontSize: "1.1rem" }}
          >
            Log In
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Don’t have an account?{" "}
            <a href="/register" className="text-primary text-decoration-none">
              Register here
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;
