import Seo from "../components/Seo.jsx";

export default function Contact() {
  return (
    <>
      <Seo
        title="İletişim"
        description="Exoteak mağazası Masko Mobilya Kenti, Başakşehir İstanbul'da. Telefon, WhatsApp ve adres bilgileri."
        path="/iletisim"
      />

      <header className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">İletişim</span>
          <h1>Bize Ulaşın</h1>
          <p className="page-hero__sub">
            Showroom ziyareti, proje teklifi veya ürün bilgisi için bize ulaşın. Size en kısa sürede dönüş yapalım.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)" }} className="about__cols">
            <div className="info-card">
              <div className="spec"><span>Telefon</span><span><a href="tel:+902122264550">+90 212 226 45 50</a></span></div>
              <div className="spec"><span>WhatsApp</span><span><a href="https://wa.me/902122264550" target="_blank" rel="noreferrer">Mesaj Gönder</a></span></div>
              <div className="spec"><span>E-posta</span><span><a href="mailto:info@exoteak.com.tr">info@exoteak.com.tr</a></span></div>
              <div className="spec"><span>Adres</span><span style={{ textAlign: "right" }}>Masko Mobilyacılar Sitesi<br />10B Blok No:8, Başakşehir / İstanbul</span></div>
              <div className="spec"><span>Çalışma Saatleri</span><span>Her gün · Kapanış 19:00</span></div>

              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a className="btn btn--brass" href="https://wa.me/902122264550" target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="btn btn--ghost" href="https://maps.google.com/?q=Exoteak+Masko" target="_blank" rel="noreferrer">Yol Tarifi</a>
              </div>
            </div>

            <div className="map-frame">
              <iframe
                title="Exoteak konum"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Masko+Mobilya+Kenti+Ba%C5%9Fak%C5%9Fehir&output=embed"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
