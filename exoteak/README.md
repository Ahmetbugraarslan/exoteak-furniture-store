# EXOTEAK — Modern Mobilya Sitesi

El yapımı doğal ahşap mobilya markası için sıfırdan, modern, SEO uyumlu, admin panelli tam site.

- **Frontend:** React 18 + Vite + React Router + react-helmet-async (SEO)
- **Backend:** Node + Express + JWT auth + Multer (görsel yükleme) + JSON dosya veritabanı
- **Admin:** Korumalı `/admin` paneli — ürün ekle / düzenle / sil, görsel yükle, öne çıkar

```
exoteak/
├── server/      # API (port 4000)
└── client/      # React arayüz (port 5173)
```

---

## 1. Kurulum

İki ayrı terminal aç.

### Backend
```bash
cd server
cp .env.example .env          # gerekirse şifreyi değiştir
npm install
npm run dev
```
İlk açılışta `.env` dosyasındaki `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile otomatik bir admin kullanıcısı oluşturulur (bkz. `.env.example`).

### Frontend
```bash
cd client
npm install
npm run dev
```
Site: **http://localhost:5173**
Admin: **http://localhost:5173/admin/giris**

Vite, `/api` ve `/uploads` isteklerini otomatik olarak backend'e (4000) yönlendirir.

---

## 2. Ürün Ekleme

`/admin/giris` → giriş yap → form üzerinden:
- Ad, kategori, fiyat, malzeme, ölçü, koleksiyon
- Görsel sürükle-yükle (sunucuya kaydedilir)
- "Anasayfada öne çıkar" işaretle
- Kaydet → site anında güncellenir

Veriler `server/data/db.json`, görseller `server/uploads/` içinde tutulur.

---

## 3. SEO — yapılanlar

- **Sayfa bazlı meta:** her sayfanın kendi `<title>`, `description`, `canonical`, Open Graph etiketleri (`react-helmet-async`)
- **Yapısal veri (JSON-LD):** anasayfada `FurnitureStore` (yerel işletme), ürün sayfalarında `Product` + `Offer` → Google'da zengin sonuç (fiyat, stok) için
- **sitemap.xml:** backend tüm ürün/kategori URL'lerini canlı üretir → `/sitemap.xml`
- **robots.txt:** `client/public/robots.txt` (admin engelli, sitemap bildirimli)
- **Semantik HTML + Türkçe `lang`**, anlamlı başlık hiyerarşisi
- **Görsel `loading="lazy"`** ve `alt` metinleri → hız + erişilebilirlik
- **SEO dostu URL'ler:** `/urun/galata-suar-yemek-masasi` gibi slug yapısı

### Mevcut sitenin "geç açılması" için öneriler
1. **Görselleri WebP/AVIF'e çevir** ve boyutlandır (en büyük yavaşlık kaynağı genelde budur)
2. **CDN + tarayıcı cache** (Cloudflare ücretsiz katman yeterli)
3. **Lazy-load** + `width/height` vererek layout kaymasını engelle
4. **Kritik CSS'i satır içi**, gerisini ertele
5. Bu proje Vite ile **kod bölme (code-splitting)** yapar; `npm run build` çıktısı küçük ve hızlıdır

---

## 4. Yayına Alma (production)

```bash
cd client && npm run build      # client/dist üretir
```
- `client/dist` içeriğini statik sunucuya / Netlify / Vercel'e koy
- `server`'ı Render / Railway / kendi VPS'inde çalıştır
- Frontend'in `/api` çağrılarını backend adresine yönlendir (Vercel rewrites veya Nginx reverse proxy)
- `.env` içinde `JWT_SECRET` ve admin şifresini **mutlaka** değiştir
- `CLIENT_ORIGIN`'i gerçek alan adına ayarla

---

## 5. MongoDB Atlas'a geçmek istersen

`server/db.js` içindeki `readDB`/`writeDB` fonksiyonlarını Mongoose modelleriyle değiştirmen yeterli; `index.js`'teki rotalar aynı kalır. (JSON yapısı zaten koleksiyon mantığında: `users`, `products`, `categories`.)
