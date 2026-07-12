import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import Seo from "../../components/Seo.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem("exoteak_token", token);
      navigate("/admin");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-card">
      <Seo title="Yönetim Girişi" path="/admin/giris" />
      <div className="auth-box">
        <div className="nav__logo" style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          EXO<span style={{ color: "var(--brass)" }}>TEAK</span>
        </div>
        <p className="muted" style={{ textAlign: "center", marginBottom: "2rem", fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Yönetim Paneli
        </p>
        <div className="field">
          <label>E-posta</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@exoteak.com.tr" />
        </div>
        <div className="field">
          <label>Şifre</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }} onClick={submit} disabled={loading}>
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </div>
    </div>
  );
}
