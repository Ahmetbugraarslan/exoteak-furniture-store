import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useCategories } from "../hooks/useCategories.js";

export default function Navbar() {
  const { pathname } = useLocation();
  const categories = useCategories();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileUrunler, setMobileUrunler] = useState(false);

  useEffect(() => {
    const syncNavH = () => {
      const narrow = window.matchMedia("(max-width: 640px)").matches;
      const h = narrow ? (scrolled ? 56 : 64) : (scrolled ? 68 : 80);
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    syncNavH();
    window.addEventListener("resize", syncNavH);
    return () => window.removeEventListener("resize", syncNavH);
  }, [scrolled]);

  useEffect(() => {
    setScrolled(window.scrollY > 40);
    setMobileOpen(false);
    setMobileUrunler(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) {
        setMobileOpen(false);
        setMobileUrunler(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => { setMobileOpen(false); setMobileUrunler(false); };

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__logo" onClick={close}>
            EXO<span>TEAK</span>
          </Link>

          <div className="nav__center">
            <NavLink to="/" end className={({ isActive }) => `nav__link${isActive ? " active" : ""}`}>
              Anasayfa
            </NavLink>

            <div className="nav__dropdown">
              <button type="button" className="nav__link">Ürünler</button>
              <div className="nav__dropdown-menu">
                <Link to="/urunler">Tüm Ürünler</Link>
                {categories.map((c) => (
                  <Link key={c.slug} to={`/urunler/${c.slug}`}>{c.name}</Link>
                ))}
              </div>
            </div>

            <NavLink to="/hakkimizda" className={({ isActive }) => `nav__link${isActive ? " active" : ""}`}>
              Hakkımızda
            </NavLink>
            <NavLink to="/iletisim" className={({ isActive }) => `nav__link${isActive ? " active" : ""}`}>
              İletişim
            </NavLink>
          </div>

          <div className="nav__right">
            <a href="https://wa.me/902122264550" target="_blank" rel="noreferrer" className="nav__wa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              WhatsApp
            </a>
            <a href="https://www.instagram.com/exoteak/" target="_blank" rel="noreferrer" className="nav__icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            <button
              type="button"
              className={`nav__toggle${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <button
          type="button"
          className="nav__backdrop"
          onClick={close}
          aria-label="Menüyü kapat"
        />
      )}

      <div className={`nav__mobile${mobileOpen ? " open" : ""}`} aria-hidden={!mobileOpen}>
        <Link to="/" onClick={close}>Anasayfa</Link>
        <button
          type="button"
          className={`nav__mobile-expand${mobileUrunler ? " open" : ""}`}
          onClick={() => setMobileUrunler((o) => !o)}
          aria-expanded={mobileUrunler}
        >
          <span>Ürünler</span>
          <svg className="nav__mobile-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {mobileUrunler && (
          <div className="nav__mobile-sub">
            <Link to="/urunler" onClick={close}>Tüm Ürünler</Link>
            {categories.map((c) => (
              <Link key={c.slug} to={`/urunler/${c.slug}`} onClick={close}>{c.name}</Link>
            ))}
          </div>
        )}
        <Link to="/hakkimizda" onClick={close}>Hakkımızda</Link>
        <Link to="/iletisim" onClick={close}>İletişim</Link>
        <a href="https://wa.me/902122264550" target="_blank" rel="noreferrer" onClick={close}>WhatsApp</a>
        <a href="https://www.instagram.com/exoteak/" target="_blank" rel="noreferrer" onClick={close}>Instagram</a>
      </div>
    </>
  );
}
