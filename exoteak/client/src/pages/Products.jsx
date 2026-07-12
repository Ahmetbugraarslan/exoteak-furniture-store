import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import Seo from "../components/Seo.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts(category ? { category } : {})
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  const activeName = categories.find((c) => c.slug === category)?.name;

  return (
    <>
      <Seo
        title={activeName ? `${activeName} Modelleri` : "Tüm Ürünler"}
        description={
          activeName
            ? `${activeName} kategorisindeki el yapımı doğal ahşap ürünler. Her biri dünyada tek.`
            : "Suar, teak ve recycle ahşaptan el yapımı tüm mobilyalarımız."
        }
        path={category ? `/urunler/${category}` : "/urunler"}
      />

      <header className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Ürünlerimiz</span>
          <h1>{activeName || "Tüm Koleksiyon"}</h1>
          <p className="page-hero__sub">
            {activeName
              ? `${activeName} kategorisinde el yapımı, doğal ahşap parçalarımızı keşfedin.`
              : "Suar, teak, epoksi ve recycle koleksiyonlarımızın tamamı burada."}
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div className="filters">
            <button type="button" className={`chip ${!category ? "active" : ""}`} onClick={() => navigate("/urunler")}>
              Tümü
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={`chip ${category === c.slug ? "active" : ""}`}
                onClick={() => navigate(`/urunler/${c.slug}`)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4].map((n) => <div key={n} className="skeleton" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="muted">Bu kategoride henüz ürün yok.</p>
          ) : (
            <div className="grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
