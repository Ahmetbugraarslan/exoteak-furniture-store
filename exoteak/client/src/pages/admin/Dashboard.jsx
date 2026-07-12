import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatPrice } from "../../api";
import Seo from "../../components/Seo.jsx";

const EMPTY = {
  name: "", category: "", collection: "", material: "",
  price: "", dimensions: "", image: "", featured: false, description: "",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null); // id | null
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function load() {
    const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
    setProducts(p);
    setCategories(c);
  }

  useEffect(() => {
    load().catch(() => {
      localStorage.removeItem("exoteak_token");
      navigate("/admin/giris");
    });
  }, []);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function startEdit(p) {
    setEditing(p.id);
    setForm({ ...EMPTY, ...p, price: String(p.price) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleUpload(file) {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      set("image", url);
      notify("Görsel yüklendi");
    } catch (e) {
      notify(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.name.trim()) return notify("Ürün adı gerekli");
    setBusy(true);
    try {
      if (editing) {
        await api.updateProduct(editing, form);
        notify("Ürün güncellendi");
      } else {
        await api.createProduct(form);
        notify("Ürün eklendi");
      }
      reset();
      await load();
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(p) {
    if (!confirm(`"${p.name}" silinsin mi?`)) return;
    await api.deleteProduct(p.id);
    notify("Ürün silindi");
    if (editing === p.id) reset();
    await load();
  }

  function logout() {
    localStorage.removeItem("exoteak_token");
    navigate("/admin/giris");
  }

  return (
    <div className="admin">
      <Seo title="Yönetim Paneli" path="/admin" />
      <aside className="admin__side">
        <h3>EXOTEAK</h3>
        <p style={{ color: "rgba(251,248,242,0.6)", fontSize: "0.82rem", marginBottom: "2rem" }}>
          Yönetim Paneli
        </p>
        <div style={{ color: "rgba(251,248,242,0.8)", fontSize: "0.9rem", lineHeight: 2 }}>
          <div>📦 {products.length} ürün</div>
          <div>🗂️ {categories.length} kategori</div>
        </div>
        <button className="btn btn--ghost" style={{ marginTop: "2rem", width: "100%", justifyContent: "center", color: "var(--paper)", borderColor: "rgba(255,255,255,0.3)" }} onClick={logout}>
          Çıkış Yap
        </button>
      </aside>

      <main className="admin__main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.8rem" }}>{editing ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h2>
            <button className="btn btn--ghost" onClick={() => navigate("/")}>Siteyi Gör →</button>
          </div>

          {/* FORM */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 2, padding: "clamp(20px,3vw,32px)", margin: "1.5rem 0 3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="about__cols">
              <div>
                <div className="field">
                  <label>Ürün Adı *</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Galata Suar Yemek Masası" />
                </div>
                <div className="field">
                  <label>Kategori</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                    <option value="">Seçiniz…</option>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="field">
                    <label>Fiyat (TL)</label>
                    <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="184600" />
                  </div>
                  <div className="field">
                    <label>Koleksiyon</label>
                    <input value={form.collection} onChange={(e) => set("collection", e.target.value)} placeholder="Galata Konsept" />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="field">
                    <label>Malzeme</label>
                    <input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="Suar" />
                  </div>
                  <div className="field">
                    <label>Ölçüler</label>
                    <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="240 x 100 x 76 cm" />
                  </div>
                </div>
              </div>

              <div>
                <div className="field">
                  <label>Görsel</label>
                  <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} />
                  {uploading && <p className="muted" style={{ fontSize: "0.82rem", marginTop: "0.5rem" }}>Yükleniyor…</p>}
                  {form.image && (
                    <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.8rem", alignItems: "center" }}>
                      <img src={form.image} alt="" className="admin__thumb" />
                      <button className="icon-btn" onClick={() => set("image", "")}>Kaldır</button>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Açıklama</label>
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Ürünün hikâyesi, dokusu, kullanımı…" />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.9rem" }}>
                  <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} style={{ width: "auto" }} />
                  Anasayfada öne çıkar
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button className="btn" onClick={save} disabled={busy}>
                {busy ? "Kaydediliyor…" : editing ? "Güncelle" : "Ürünü Ekle"}
              </button>
              {editing && <button className="btn btn--ghost" onClick={reset}>İptal</button>}
            </div>
          </div>

          {/* LISTE */}
          <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>Ürünler ({products.length})</h2>
          {products.map((p) => (
            <div key={p.id} className="admin__row">
              {p.image ? <img src={p.image} alt="" className="admin__thumb" /> : <div className="admin__thumb" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{p.name}</b>
                <div className="muted" style={{ fontSize: "0.82rem" }}>
                  {(categories.find((c) => c.slug === p.category)?.name) || "—"} · {formatPrice(p.price)}
                  {p.featured && " · ⭐ Öne çıkan"}
                </div>
              </div>
              <button className="icon-btn" onClick={() => startEdit(p)}>Düzenle</button>
              <button className="icon-btn icon-btn--danger" onClick={() => remove(p)}>Sil</button>
            </div>
          ))}
        </div>
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
