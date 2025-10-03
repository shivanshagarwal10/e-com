// src/components/auth/Register.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../../Context/Context";
import logo from "../../assets/logo.png"; // <- your logo (png/svg/jpg)

const Register = () => {
  const { registerUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await registerUser(form.name.trim(), form.email.trim(), form.password);
      navigate("/");
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          "Registration failed. Try a different email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 72px)", paddingTop: "72px" }}
    >
      <div className="card shadow-sm rounded-4 p-4 p-md-5" style={{ width: "100%", maxWidth: 480 }}>
        {/* Header with logo */}
        <div className="mb-4 text-center">
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
              style={{ width: "70%", height: "70%", objectFit: "contain", display: "block" }}
            />
          </div>
          <h2 className="fw-semibold mb-1" style={{ letterSpacing: ".2px" }}>
            Create account
          </h2>
          <p className="text-muted mb-0">Join and start shopping</p>
        </div>

        {err && <div className="alert alert-danger py-2">{err}</div>}

        <form className="vstack gap-3" onSubmit={onSubmit} noValidate>
          {/* Name */}
          <div>
            <label className="form-label">Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Your name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-shield-lock" />
              </span>
              <input
                type={showPw ? "text" : "password"}
                className="form-control"
                placeholder="At least 6 characters"
                name="password"
                value={form.password}
                onChange={onChange}
                minLength={6}
                required
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
            <small className="text-muted">Use 6+ characters for a strong password.</small>
          </div>

          {/* Submit */}
          <button className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>

          {/* Footer */}
          <div className="text-center">
            <small className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="link-primary">
                Sign in
              </Link>
            </small>
          </div>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">We keep your data safe with encryption and JWT auth.</small>
        </div>
      </div>
    </div>
  );
};

export default Register;
