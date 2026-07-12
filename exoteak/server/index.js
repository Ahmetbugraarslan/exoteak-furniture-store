import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";
import { readDB, writeDB } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN === "*" ? true : CLIENT_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

// --- Gorsel yukleme klasoru ---
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${nanoid(6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(jpe?g|png|webp|avif|gif)/.test(file.mimetype);
    cb(ok ? null : new Error("Sadece gorsel dosyalari yuklenebilir"), ok);
  },
});

// --- Ilk admin kullanicisini olustur ---
async function seedAdmin() {
  const db = await readDB();
  if (db.users.length === 0) {
    const email = process.env.ADMIN_EMAIL || "admin@exoteak.com.tr";
    const password = process.env.ADMIN_PASSWORD || "Exoteak2025!";
    const hash = await bcrypt.hash(password, 10);
    db.users.push({ id: nanoid(), email, password: hash, role: "admin" });
    await writeDB(db);
    console.log(`\n  Admin olusturuldu -> ${email} / ${password}`);
    console.log("  (Giris sonrasi sifreyi degistirmeyi unutma)\n");
  }
}

// --- Auth middleware ---
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Yetkisiz" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Gecersiz oturum" });
  }
}

function slugify(text) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return text
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => map[c] || c)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ============ AUTH ============
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const db = await readDB();
  const user = db.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password || "", user.password))) {
    return res.status(401).json({ error: "E-posta veya sifre hatali" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, user: { email: user.email, role: user.role } });
});

// ============ CATEGORIES ============
app.get("/api/categories", async (_req, res) => {
  const db = await readDB();
  res.json(db.categories);
});

app.post("/api/categories", auth, async (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: "Kategori adi gerekli" });
  const db = await readDB();
  const slug = slugify(name);
  if (db.categories.some((c) => c.slug === slug))
    return res.status(409).json({ error: "Bu kategori zaten var" });
  const cat = { slug, name };
  db.categories.push(cat);
  await writeDB(db);
  res.status(201).json(cat);
});

app.delete("/api/categories/:slug", auth, async (req, res) => {
  const db = await readDB();
  db.categories = db.categories.filter((c) => c.slug !== req.params.slug);
  await writeDB(db);
  res.json({ ok: true });
});

// ============ PRODUCTS ============
app.get("/api/products", async (req, res) => {
  const db = await readDB();
  let items = [...db.products];
  const { category, featured, q } = req.query;
  if (category) items = items.filter((p) => p.category === category);
  if (featured === "true") items = items.filter((p) => p.featured);
  if (q) {
    const s = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.collection || "").toLowerCase().includes(s) ||
        (p.material || "").toLowerCase().includes(s)
    );
  }
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(items);
});

app.get("/api/products/:slug", async (req, res) => {
  const db = await readDB();
  const product = db.products.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!product) return res.status(404).json({ error: "Urun bulunamadi" });
  res.json(product);
});

app.post("/api/products", auth, async (req, res) => {
  const db = await readDB();
  const b = req.body || {};
  if (!b.name) return res.status(400).json({ error: "Urun adi gerekli" });
  let slug = b.slug ? slugify(b.slug) : slugify(b.name);
  // benzersiz slug
  let unique = slug, n = 1;
  while (db.products.some((p) => p.slug === unique)) unique = `${slug}-${++n}`;
  const product = {
    id: `p_${nanoid(8)}`,
    slug: unique,
    name: b.name,
    category: b.category || "",
    collection: b.collection || "",
    material: b.material || "",
    price: Number(b.price) || 0,
    dimensions: b.dimensions || "",
    image: b.image || "",
    featured: Boolean(b.featured),
    description: b.description || "",
    createdAt: new Date().toISOString(),
  };
  db.products.push(product);
  await writeDB(db);
  res.status(201).json(product);
});

app.put("/api/products/:id", auth, async (req, res) => {
  const db = await readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Urun bulunamadi" });
  const b = req.body || {};
  const current = db.products[idx];
  db.products[idx] = {
    ...current,
    ...b,
    id: current.id,
    price: b.price !== undefined ? Number(b.price) : current.price,
    featured: b.featured !== undefined ? Boolean(b.featured) : current.featured,
    slug: b.slug ? slugify(b.slug) : current.slug,
  };
  await writeDB(db);
  res.json(db.products[idx]);
});

app.delete("/api/products/:id", auth, async (req, res) => {
  const db = await readDB();
  db.products = db.products.filter((p) => p.id !== req.params.id);
  await writeDB(db);
  res.json({ ok: true });
});

// ============ UPLOAD ============
app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Dosya yok" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ============ SEO: sitemap.xml ============
app.get("/sitemap.xml", async (_req, res) => {
  const db = await readDB();
  const base = "https://exoteak.com.tr";
  const urls = [
    { loc: `${base}/`, p: "1.0" },
    { loc: `${base}/urunler`, p: "0.9" },
    { loc: `${base}/hakkimizda`, p: "0.6" },
    { loc: `${base}/iletisim`, p: "0.6" },
    ...db.categories.map((c) => ({ loc: `${base}/urunler/${c.slug}`, p: "0.7" })),
    ...db.products.map((p) => ({ loc: `${base}/urun/${p.slug}`, p: "0.8" })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc><priority>${u.p}</priority></url>`)
    .join("\n")}\n</urlset>`;
  res.header("Content-Type", "application/xml").send(xml);
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// hata yakalama (multer vs.)
app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || "Sunucu hatasi" });
});

seedAdmin().then(() => {
  app.listen(PORT, () => console.log(`\n  Exoteak API -> http://localhost:${PORT}`));
});
