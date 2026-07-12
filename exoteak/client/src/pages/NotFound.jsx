import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";

export default function NotFound() {
  return (
    <>
      <Seo title="Sayfa Bulunamadı" description="Aradığınız sayfa mevcut değil." path="/404" />
      <section className="not-found page-top">
        <div className="container not-found__inner">
          <span className="eyebrow">404</span>
          <h1>Sayfa bulunamadı</h1>
          <p className="muted">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn--gold">Anasayfa</Link>
            <Link to="/urunler" className="btn btn--ghost">Ürünleri Gör</Link>
          </div>
        </div>
      </section>
    </>
  );
}
