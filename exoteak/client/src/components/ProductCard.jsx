import { Link } from "react-router-dom";
import { formatPrice } from "../api";

export default function ProductCard({ product }) {
  return (
    <Link to={`/urun/${product.slug}`} className="card">
      <div className="card__media">
        {product.collection && <span className="card__tag">{product.collection}</span>}
        <div className="card__img-wrap">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" className="front" />
          ) : (
            <div className="card__placeholder">{product.name}</div>
          )}
        </div>
        <div className="card__action">
          <span className="card__action-btn">İncele</span>
        </div>
      </div>
      <div className="card__body">
        <div className="card__name">{product.name}</div>
        <div className="card__meta">{product.material}</div>
        <div className="card__price">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
