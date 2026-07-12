import { useEffect, useState } from "react";
import { api } from "../api";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return categories;
}

export function useCategoriesWithCounts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([categories, products]) => {
        const counts = {};
        products.forEach((p) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setItems(
          categories
            .map((c) => ({ ...c, count: counts[c.slug] || 0 }))
            .sort((a, b) => b.count - a.count)
        );
      })
      .catch(() => {});
  }, []);

  return items;
}

const CAT_CLS = {
  masalar: "cat-card--masa",
  sandalyeler: "cat-card--sandalye",
  konsollar: "cat-card--konsol",
  "tv-uniteleri": "cat-card--tv",
  "orta-sehpalar": "cat-card--sehpa",
  "bar-uniteleri": "cat-card--bar",
  recycle: "cat-card--recycle",
  epoksi: "cat-card--epoksi",
  "dis-mekan": "cat-card--bahce",
  aksesuarlar: "cat-card--aksesuar",
};

const FALLBACK = [
  "cat-card--masa",
  "cat-card--sandalye",
  "cat-card--konsol",
  "cat-card--tv",
  "cat-card--bahce",
  "cat-card--aksesuar",
];

export function getCategoryCardClass(slug, index = 0) {
  return CAT_CLS[slug] || FALLBACK[index % FALLBACK.length];
}
