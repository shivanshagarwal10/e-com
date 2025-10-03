// src/components/auth/Login.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../../Context/Context";
import logo from "../../assets/logo.png"; // <- add your file here (png/svg/jpg)

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate("/");
    } catch {
      setErr("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 72px)", paddingTop: "72px" }}
    >
      <div className="card shadow-sm rounded-4 p-4 p-md-5" style={{ width: "100%", maxWidth: 440 }}>
        {/* Header */}
        <div className="mb-4 text-center">
          {/* Round badge with logo */}
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: 56,
              height: 56,
              background: "var(--card-bg, var(--bs-light))",
              border: "1px solid var(--border, var(--bs-border-color))",
              overflow: "hidden",
            }}
          >
            <img
              src={logo}
              alt="Brand"
              style={{
                width: "70%",
                height: "70%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <h2 className="fw-semibold mb-1" style={{ letterSpacing: ".2px" }}>
            Welcome back
          </h2>
          <p className="text-muted mb-0">Sign in to continue shopping</p>
        </div>

        {/* Error */}
        {err && (
          <div className="alert alert-danger py-2" role="alert">
            {err}
          </div>
        )}

        {/* Form */}
        <form className="vstack gap-3" onSubmit={onSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope" />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label mb-0">Password</label>
            </div>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-lock" />
              </span>
              <input
                type={showPw ? "text" : "password"}
                className="form-control"
                placeholder="Your password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
              </button>
            </div>
          </div>

          {/* Row: remember + forgot */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
          </div>

          {/* Submit */}
          <button className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Footer */}
          <div className="text-center">
            <small className="text-muted">
              Don’t have an account?{" "}
              <Link to="/register" className="link-primary">
                Create one
              </Link>
            </small>
          </div>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">Protected by modern encryption and JWT auth.</small>
        </div>
      </div>
    </div>
  );
};

export default Login;
