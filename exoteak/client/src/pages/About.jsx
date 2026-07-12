import Seo from "../components/Seo.jsx";

export default function About() {
  return (
    <>
      <Seo
        title="Hakkımızda"
        description="Exoteak'in hikâyesi: asırlık ahşaba saygı. Fırınlarda yakılmaktan kurtardığımız ahşaplar, ustalarımızın elinde dünyada tek parçalara dönüşüyor."
        path="/hakkimizda"
      />

      <header className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Hikâyemiz</span>
          <h1>Asırlık ağaçların anlatacakları var.</h1>
          <p className="page-hero__sub">
            Recycle, suar ve teak ahşabı el işçiliğiyle buluşturan, her parçayı dünyada tek üreten bir atölye.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,5rem)" }} className="about__cols">
            <div style={{ fontSize: "1.08rem", lineHeight: 1.9 }}>
              <p>
                Her şey o sihirli kelimeyle başladı: <strong>saygı</strong>. Sevginin, dostluğun temeli saygı.
                Yıllar önce yurt dışından ürün seçmeye gittiğimizde recycle ürünlerle tanıştık ve eşsiz
                görünümlerine ilk görüşte âşık olduk.
              </p>
              <p style={{ marginTop: "1.5rem" }}>
                Ürünleri Türkiye'ye getirdiğimizde sizler de kıymet verdiniz. Recycle'a olan aşkımız
                giderek arttı. İthalat yerine ihracat hedefledik; ürünleri ülkemizde bulmamız gerekiyordu.
              </p>
            </div>
            <div style={{ fontSize: "1.08rem", lineHeight: 1.9 }}>
              <p>
                Anadolu'ya yaptığımız iş seyahatinde, tıpkı yurt dışındaki gibi eski evlerin varlığından
                haberdar olduk. Fakat saygı duyduğumuz ahşaplar fırınlarda odun olarak yakılıyordu. Bu, asla
                istemeyeceğimiz bir şeydi.
              </p>
              <p style={{ marginTop: "1.5rem" }}>
                Çünkü her şeyde olduğu gibi yaşanmışlıklar da saygıyı hak ediyordu. Fırınlarda yakılan recycle
                ahşaplar, mimarlarımızın tasarım kararlarıyla yeniden vücut buluyor. İşte bu yüzden her bir
                ürünümüz <strong>dünyada tek</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="material-grid">
            {[
              ["Recycle", "Geri kazanılmış asırlık ahşap"],
              ["Suar", "Doğal kenarlı yağmur ağacı"],
              ["Teak", "Dayanıklı, zamansız tik"],
              ["Epoksi", "Ahşap ve reçinenin dansı"],
            ].map(([t, d]) => (
              <div key={t} className="material-card">
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
