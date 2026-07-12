import { Helmet } from "react-helmet-async";

// Her sayfa kendi baslik/aciklama/canonical ve isteğe bagli JSON-LD'sini verir.
export default function Seo({ title, description, path = "", image, jsonLd }) {
  const base = "https://exoteak.com.tr";
  const url = `${base}${path}`;
  const fullTitle = title ? `${title} | EXOTEAK` : "EXOTEAK | El Yapımı Doğal Ahşap Mobilya";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
