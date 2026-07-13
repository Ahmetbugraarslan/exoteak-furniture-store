import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Seo from "../components/Seo.jsx";
import ProductCard from "../components/ProductCard.jsx";
import FullPageScroll from "../components/FullPageScroll.jsx";
import { useCategoriesWithCounts, getCategoryCardClass } from "../hooks/useCategories.js";

const slides = [
  {
    eyebrow: "El Yapımı Mobilya",
    title: "Doğal Ahşabın Sıcaklığını Yaşam Alanlarınıza Taşıyoruz",
    sub: "Suar, teak ve recycle ahşaptan üretilen, her biri dünyada tek parçalar.",
    cta: "Koleksiyonu İncele",
    ctaLink: "/urunler",
    img: "/images/slider/1.jpg",
    bg: "linear-gradient(125deg,#3a2215 0%,#6a3d1a 40%,#8B5A2B 100%)",
  },
  {
    eyebrow: "Premium Koleksiyon",
    title: "Zamansız Tasarım, Sürdürülebilir Malzeme",
    sub: "Her parça; doğadan ilham alan mimarlar ve usta el işçileri tarafından hayata geçirilir.",
    cta: "Ürünleri Keşfet",
    ctaLink: "/urunler",
    img: "/images/slider/2.jpg",
    bg: "linear-gradient(125deg,#2d3820 0%,#4a5a32 40%,#6B7553 100%)",
  },
  {
    eyebrow: "El İşçiliğinin Sanatı",
    title: "Her Parça Dünyada Tek, Her Doku Bir Hikaye",
    sub: "Asırlık ahşabın doğal güzelliğini modern bir tasarım anlayışıyla birleştiriyoruz.",
    cta: "Hikayemizi Oku",
    ctaLink: "/hakkimizda",
    img: "/images/slider/3.jpg",
    bg: "linear-gradient(125deg,#1a1208 0%,#4a3018 40%,#C8A86B 100%)",
  },
];

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5.5c0 4.6-3 8.2-7 9.5-4-1.3-7-4.9-7-9.5V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14z" />
      <path d="M5 19c2-4 5-7 9-9" />
    </svg>
  );
}
function IconHand() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12.5V6a1.5 1.5 0 013 0v5" />
      <path d="M11 11V4.5a1.5 1.5 0 013 0V11" />
      <path d="M14 11.2V6a1.5 1.5 0 013 0v7" />
      <path d="M8 12l-1.6-1.6a1.5 1.5 0 00-2.3 1.9L6.5 16c1.4 2.6 3 4.5 6.5 4.5 3.6 0 5.5-2.3 5.5-5.8V9.5" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5z" />
    </svg>
  );
}
function IconRecycle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 19H4.8a1 1 0 01-.87-1.5L6 13.5" />
      <path d="M9.5 4.5H12a1 1 0 01.87.5L15 8.5" />
      <path d="M17.5 19.5H20a1 1 0 00.87-1.5L18.5 14" />
      <path d="M13.5 4l2.5 4.3-2.2 1.3" />
      <path d="M4.9 15l2.5 1.4-1.3 2.3" />
      <path d="M19.6 15.4l-2.7.2.4 2.7" />
    </svg>
  );
}

const whyItems = [
  { icon: <IconShield />,  title: "Uzun Ömürlü",    desc: "Tik ağacı doğal yağlar sayesinde onlarca yıl dayanıklılığını korur." },
  { icon: <IconLeaf />,    title: "Doğal Yapı",     desc: "Kimyasal katkı maddesi kullanılmadan işlenen saf doğal ahşap." },
  { icon: <IconHand />,    title: "El İşçiliği",    desc: "Her parça ustat elleriyle özenle şekillendirilen, benzersiz bir eserdir." },
  { icon: <IconStar />,    title: "Premium Kalite", desc: "En iyi hammadde seçimi ve sıkı kalite kontrolüyle üretim." },
  { icon: <IconRecycle />, title: "Çevre Dostu",    desc: "Sürdürülebilir ormanlarda yetiştirilen sertifikalı tik ağacı." },
];

const refProjects = [
  {
    cls: "ref-card--1",
    image: "/images/references/fatih-terim-villa.webp",
    name: "Fatih Terim – Özel Villa",
    loc: "İstanbul",
    products: "Satılan ürün: Tek parça doğal kenarlı suar yemek masası. Teslim sonrası Exoteak ekibimiz tarafından periyodik bakım ve zımpara hizmeti verilmektedir.",
    sold: true,
  },
  {
    cls: "ref-card--2",
    image: "/images/references/urla-konut-projesi.webp",
    name: "Urla Konut Projesi",
    loc: "Urla, İzmir",
    products: "Yuvarlak masif yemek masası, dörtlü sandalye takımı ve doğal ahşap avize",
  },
  {
    cls: "ref-card--3",
    image: "/images/references/masko-showroom.webp",
    name: "Masko Showroom",
    loc: "Başakşehir, İstanbul",
    products: "Showroom iç mekân düzenlemesi ve sergilenen koleksiyon parçaları",
  },
  { cls: "ref-card--4", name: "Bahçe Evi", loc: "Sapanca", products: "Bahçe takımı, pergola" },
  { cls: "ref-card--5", name: "Modern Loft", loc: "Karaköy, İstanbul", products: "Çalışma masası, raflar" },
  { cls: "ref-card--6", name: "Deniz Koyu", loc: "Bodrum", products: "Tekne mobilyaları" },
];

/* ---- Hero Slider ---- */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const back = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  const restartTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 6000);
  }, [next]);

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, [restartTimer]);

  const handleDot = (i) => {
    setCurrent(i);
    restartTimer();
  };
  const handleNext = () => {
    next();
    restartTimer();
  };
  const handleBack = () => {
    back();
    restartTimer();
  };

  return (
    <div className="hero-slider" style={{ height: "100vh" }}>
      {slides.map((s, i) => (
        <div key={i} className={`hero-slide${i === current ? " active" : ""}`}>
          <div
            className="hero-slide__bg"
            style={{ backgroundImage: `url(${s.img}), ${s.bg}` }}
          />
          <div className="hero-slide__overlay" />
          <div className="container hero-slide__content">
            <p className="hero-slide__eyebrow">{s.eyebrow}</p>
            <h1 className="hero-slide__title">{s.title}</h1>
            <p className="hero-slide__sub">{s.sub}</p>
            <div className="hero-slide__cta">
              <Link to={s.ctaLink} className="btn btn--gold">{s.cta}</Link>
              <Link to="/iletisim" className="btn btn--light">Teklif Al</Link>
            </div>
          </div>
        </div>
      ))}
      <div className="hero-controls">
        <button className="hero-arrow" onClick={handleBack} aria-label="Önceki">&#8592;</button>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={`hero-dot${i === current ? " active" : ""}`} onClick={() => handleDot(i)} aria-label={`Slayt ${i+1}`} />
          ))}
        </div>
        <button className="hero-arrow" onClick={handleNext} aria-label="Sonraki">&#8594;</button>
      </div>
    </div>
  );
}

/* ---- Section 2: Categories ---- */
function SecCategories({ categories }) {
  const display = categories.filter((c) => c.count > 0).slice(0, 6);

  return (
    <div className="fp-scene fp-scene--dark">
      <div className="fp-scene__inner">
        <div className="fp-header">
          <div className="fp-anim fp-anim-d1">
            <span className="eyebrow">Koleksiyonlar</span>
            <h2 className="fp-title">Ne Arıyorsunuz?</h2>
          </div>
          <Link to="/urunler" className="btn btn--light fp-anim fp-anim-d2">Tüm Ürünler</Link>
        </div>
        <div className="fp-cat-grid fp-anim fp-anim-d2">
          {display.length === 0 ? (
            <p className="muted" style={{ color: "rgba(255,255,255,0.5)" }}>Yükleniyor...</p>
          ) : (
            display.map((c, i) => (
              <Link key={c.slug} to={`/urunler/${c.slug}`} className={`cat-card ${getCategoryCardClass(c.slug, i)}`}>
                <div className="cat-card__bg fp-zoom" />
                <div className="cat-card__overlay" />
                <div className="cat-card__body">
                  <div className="cat-card__name">{c.name}</div>
                  <div className="cat-card__count">{c.count} ürün</div>
                </div>
                <div className="cat-card__arrow">&#8594;</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Section 3: Featured Products ---- */
function SecProducts({ products = [] }) {
  return (
    <div className="fp-scene fp-scene--light">
      <div className="fp-scene__inner fp-scene__inner--centered fp-scene__inner--products">
        <div className="fp-header fp-header--center">
          <div className="fp-anim fp-anim-d1">
            <span className="eyebrow">Seçkiler</span>
            <h2 className="fp-title">Öne Çıkan Parçalar</h2>
          </div>
          <Link to="/urunler" className="btn btn--ghost fp-anim fp-anim-d2">Tümünü Gör</Link>
        </div>
        <div className="fp-products-grid">
          {products.length === 0 ? (
            <p className="muted">Yükleniyor...</p>
          ) : (
            products.slice(0, 8).map((p, i) => (
              <div key={p.id} className={`fp-anim fp-anim-d${(i % 4) + 2}`}>
                <ProductCard product={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Section 4: Why Us ---- */
function SecWhy() {
  return (
    <div className="fp-scene fp-scene--dark">
      <div className="fp-scene__inner fp-scene__inner--centered">
        <div className="fp-anim fp-anim-d1" style={{ textAlign: "center", marginBottom: "clamp(2rem,4vh,3.5rem)" }}>
          <span className="eyebrow">Fark Yaratan Detaylar</span>
          <h2 className="fp-title" style={{ marginTop: "0.8rem" }}>Neden Exoteak?</h2>
        </div>
        <div className="fp-why-grid">
          {whyItems.map((w, i) => (
            <div key={i} className={`why-item fp-anim fp-anim-d${i + 2}`} style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
              <span className="why-item__icon">{w.icon}</span>
              <div className="why-item__title" style={{ color: "#fff" }}>{w.title}</div>
              <p className="why-item__desc" style={{ color: "rgba(250,248,245,0.65)" }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Section 5: Story ---- */
function SecStory() {
  return (
    <div className="fp-scene fp-scene--split">
      <div className="fp-story-visual fp-zoom">
        <div className="fp-story-label">EXOTEAK</div>
      </div>
      <div className="fp-story-content fp-anim fp-anim-d1">
        <span className="eyebrow">Markamız</span>
        <h2 className="fp-title" style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
          Doğadan İlham Alan<br />Bir Miras
        </h2>
        <div className="fp-story-body">
          <p>Tik ağacının binlerce yıllık hikayesi, bizim hikayemizin de temelini oluşturuyor. Her parça, doğayla kurulan derin bir bağdan besleniyor.</p>
          <p>Atölyelerimizde her tahta özenerek işlenir, her detay titizlikle tamamlanır. Ortaya çıkan mobilyalar yalnızca birer eşya değil, birer sanat eseridir.</p>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.8rem", color: "var(--gold)", margin: "1.8rem 0" }}>Exoteak</div>
        <Link to="/hakkimizda" className="btn btn--gold fp-anim fp-anim-d3">Hikayemizi Oku</Link>
      </div>
    </div>
  );
}

/* ---- Section 6: References ---- */
function SecReferences() {
  return (
    <div className="fp-scene fp-scene--beige">
      <div className="fp-scene__inner">
        <div className="fp-header">
          <div className="fp-anim fp-anim-d1">
            <span className="eyebrow">Tamamlanan Projeler</span>
            <h2 className="fp-title">Referanslarımız</h2>
          </div>
          <Link to="/iletisim" className="btn btn--ghost fp-anim fp-anim-d2">Proje Teklifi Al</Link>
        </div>
        <div className="fp-ref-grid">
          {refProjects.map((r, i) => (
            <div
              key={i}
              className={`ref-card ${r.cls}${r.image ? " ref-card--photo" : ""}${r.sold ? " ref-card--sold" : ""} fp-anim fp-anim-d${(i % 3) + 2}`}
            >
              <div
                className="ref-card__bg"
                style={r.image ? {
                  backgroundImage: `url(${r.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                } : undefined}
              />
              <div className="ref-card__overlay" />
              {r.sold && <span className="ref-card__badge">Satıldı</span>}
              <div className="ref-card__info">
                <div className="ref-card__project">{r.name}</div>
                <div className="ref-card__loc">{r.loc}</div>
                <div className="ref-card__products">{r.products}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Section 7: Contact ---- */
function SecContact() {
  return (
    <div className="fp-scene fp-scene--dark">
      <div className="fp-contact-inner">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "100px auto" }}>
          <span className="eyebrow fp-anim fp-anim-d1">Bize Ulaşın</span>
          <h2 className="fp-title fp-anim fp-anim-d2" style={{ color: "#fff", fontSize: "clamp(2.2rem,4.5vw,4rem)", margin: "1rem 0 1.5rem" }}>
            Hayalinizdeki Mobilyayı<br />Birlikte Tasarlayalım
          </h2>
          <p className="fp-anim fp-anim-d3" style={{ color: "rgba(250,248,245,0.6)", marginBottom: "2.5rem", fontSize: "1.05rem" }}>
            Uzman ekibimiz sizin için en iyi çözümü tasarlamaya hazır.
          </p>
          <div className="fp-anim fp-anim-d4" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/iletisim" className="btn btn--gold">İletişime Geç</Link>
            <a href="https://wa.me/902122264550" target="_blank" rel="noreferrer" className="btn btn--light">WhatsApp</a>
          </div>
        </div>
        <div className="fp-contact-footer fp-anim fp-anim-d5">
          <div className="fp-contact-info">
            <span>Masko Mobilyacılar Sitesi, 10B Blok No:8, Başakşehir / İstanbul</span>
            <a href="tel:+902122264550">+90 212 226 45 50</a>
            <a href="mailto:info@exoteak.com.tr">info@exoteak.com.tr</a>
          </div>
          <div className="fp-contact-copy">
            &copy; {new Date().getFullYear()} Exoteak. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Home Page ---- */
export default function Home() {
  const [featured, setFeatured] = useState([]);
  const categories = useCategoriesWithCounts();

  useEffect(() => {
    api.getProducts()
      .then((items) => {
        const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured));
        setFeatured(sorted);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Seo
        title="El Yapımı Doğal Ahşap Mobilya"
        description="Suar, teak ve recycle ahşaptan el yapımı mobilyalar. Her biri dünyada tek."
        path="/"
      />
      <FullPageScroll>
        <HeroSlider />
        <SecCategories categories={categories} />
        <SecProducts products={featured} />
        <SecWhy />
        <SecStory />
        <SecReferences />
        <SecContact />
      </FullPageScroll>
    </>
  );
}
