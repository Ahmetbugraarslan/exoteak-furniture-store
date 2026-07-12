import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("exoteak_token");
  return token ? children : <Navigate to="/admin/giris" replace />;
}

// Scroll ile gorunume girince .reveal -> .in animasyonu
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
