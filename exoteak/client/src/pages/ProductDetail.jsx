import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatPrice } from "../api";
import Seo from "../components/Seo.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    api.getProduct(slug).then(setProduct).catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    if (!product?.category) return;
    api.getCategories()
      .then((cats) => setCategoryName(cats.find((c) => c.slug === product.category)?.name || product.category))
      .catch(() => setCategoryName(product.category));
  }, [product]);

  if (notFound)
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h1>Ürün bulunamadı</h1>
        <Link to="/urunler" className="btn" style={{ marginTop: "1.5rem" }}>Ürünlere Dön</Link>
      </div>
    );

  if (!product)
    return <div className="container section"><p className="muted">Yükleniyor…</p></div>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    material: product.material,
    brand: { "@type": "Brand", name: "Exoteak" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
  };

  const waText = encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum.`);

  return (
    <>
      <Seo
        title={product.name}
        description={product.description?.slice(0, 155)}
        path={`/urun/${product.slug}`}
        image={product.image || undefined}
        jsonLd={jsonLd}
      />

      <div className="container page-top">
        <div style={{ paddingTop: "1.5rem", fontSize: "0.82rem" }} className="muted">
          <Link to="/urunler">Ürünler</Link> / <Link to={`/urunler/${product.category}`}>{categoryName || product.category}</Link>
        </div>

        <div className="detail">
          <div className="detail__media">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="card__placeholder" style={{ fontSize: "1.6rem" }}>{product.name}</div>
            )}
          </div>

          <div>
            {product.collection && <span className="eyebrow">{product.collection}</span>}
            <h1>{product.name}</h1>
            <div className="detail__price">{formatPrice(product.price)}</div>
            <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem" }}>
              {product.description}
            </p>

            <div style={{ marginBottom: "2rem" }}>
              {product.material && (
                <div className="spec"><span>Malzeme</span><span>{product.material}</span></div>
              )}
              {product.dimensions && (
                <div className="spec"><span>Ölçüler</span><span>{product.dimensions}</span></div>
              )}
              {product.collection && (
                <div className="spec"><span>Koleksiyon</span><span>{product.collection}</span></div>
              )}
              <div className="spec"><span>Üretim</span><span>El yapımı · Sipariş üzerine</span></div>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a className="btn btn--gold" href={`https://wa.me/902122264550?text=${waText}`} target="_blank" rel="noreferrer">
                WhatsApp ile Sor
              </a>
              <a className="btn btn--ghost" href="tel:+902122264550">Hemen Ara</a>
            </div>
            <p className="muted" style={{ fontSize: "0.82rem", marginTop: "1.5rem" }}>
              Her ürün el yapımıdır; doku ve renk doğal ahşaba göre küçük farklılıklar gösterebilir.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
