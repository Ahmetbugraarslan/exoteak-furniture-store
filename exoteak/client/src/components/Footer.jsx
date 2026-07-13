import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories.js";

export default function Footer() {
  const categories = useCategories();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">EXO<span>TEAK</span></div>
            <p className="footer__tagline">
              Suar, teak ve recycle ahşaptan el yapımı mobilyalar. Her parça dünyada tek.
            </p>
            <div className="footer__socials">
              <a href="https://www.instagram.com/exoteak/" target="_blank" rel="noreferrer" className="footer__social" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@exoteak3739" target="_blank" rel="noreferrer" className="footer__social" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 12s0-3.8-.5-5.6a3.3 3.3 0 00-2.3-2.3C18.4 4 12 4 12 4s-6.4 0-8.2.1a3.3 3.3 0 00-2.3 2.3C1 8.2 1 12 1 12s0 3.8.5 5.6a3.3 3.3 0 002.3 2.3c1.8.2 8.2.2 8.2.2s6.4 0 8.2-.2a3.3 3.3 0 002.3-2.3c.5-1.8.5-5.6.5-5.6z"/>
                  <path d="M10 15V9l6 3-6 3z" fill="currentColor" opacity="0.85"/>
                </svg>
              </a>
              <a href="https://wa.me/902122264550" target="_blank" rel="noreferrer" className="footer__social" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" opacity=".4"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4>Koleksiyonlar</h4>
            {categories.map((c) => (
              <Link key={c.slug} to={`/urunler/${c.slug}`}>{c.name}</Link>
            ))}
          </div>

          <div>
            <h4>Kurumsal</h4>
            <Link to="/hakkimizda">Hakkımızda</Link>
            <Link to="/iletisim">İletişim</Link>
            <Link to="/urunler">Tüm Ürünler</Link>
          </div>

          <div className="footer__contact">
            <h4>İletişim</h4>
            <a href="tel:+902122264550">+90 212 226 45 50</a>
            <a href="mailto:info@exoteak.com.tr">info@exoteak.com.tr</a>
            <p>Masko Mobilyacılar Sitesi<br />10B Blok No:8<br />Başakşehir / İstanbul</p>
            <a href="https://wa.me/902122264550" target="_blank" rel="noreferrer" className="footer__wa">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              WhatsApp ile Yaz
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Exoteak. Tüm hakları saklıdır.</span>
          <span>Doğayla bir arada, zamansız tasarım.</span>
        </div>
      </div>
    </footer>
  );
}
