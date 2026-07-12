import { useState, useEffect, useRef, useCallback } from "react";

// sections 2=products(cream) and 5=references(beige) are light backgrounds
const LIGHT_SECTIONS = [2, 5];

export default function FullPageScroll({ children }) {
  const sections = Array.isArray(children) ? children : [children];
  const total = sections.length;

  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Refs so event handlers never go stale - registered only once
  const currentRef  = useRef(0);
  const blockRef    = useRef(false);
  const lastWheelTs = useRef(0);
  const touchStartY = useRef(0);
  const mobileRef   = useRef(false);

  // Mobile detection
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth <= 900;
      setIsMobile(m);
      mobileRef.current = m;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll on desktop
  useEffect(() => {
    document.body.style.overflow = isMobile ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile]);

  // Navigation function - stable ref
  const go = useCallback((idx) => {
    if (blockRef.current || mobileRef.current) return;
    if (idx < 0 || idx >= total) return;
    blockRef.current = true;
    currentRef.current = idx;
    setCurrent(idx);
    setTimeout(() => { blockRef.current = false; }, 1100);
  }, [total]);

  // Wheel - registered ONCE (no stale current)
  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTs.current < 1100) return;
      if (Math.abs(e.deltaY) < 15) return;
      lastWheelTs.current = now;
      go(currentRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [go]);

  // Touch - registered ONCE
  useEffect(() => {
    const onStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onEnd   = (e) => {
      if (mobileRef.current) return;
      const d = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(d) > 55) go(currentRef.current + (d > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend",   onEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [go]);

  // Keyboard - registered ONCE
  useEffect(() => {
    const handler = (e) => {
      if (mobileRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(currentRef.current + 1); }
      if (e.key === "ArrowUp"   || e.key === "PageUp")   { e.preventDefault(); go(currentRef.current - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  // Update nav mode immediately when section changes; CSS transitions handle the visual smoothness
  useEffect(() => {
    document.documentElement.dataset.navMode = LIGHT_SECTIONS.includes(current) ? "light" : "dark";
    return () => { delete document.documentElement.dataset.navMode; };
  }, [current]);

  const jumpTo = (idx) => {
    blockRef.current = false;
    go(idx);
  };

  // Mobile: normal scroll
  if (isMobile) {
    return (
      <div className="fp-mobile">
        {sections.map((s, i) => (
          <div key={i} className="fp-section fp-active">{s}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="fp-wrapper">
      <div className="fp-track" style={{ transform: `translateY(-${current * 100}vh)` }}>
        {sections.map((section, i) => (
          <div key={i} className={`fp-section${i === current ? " fp-active" : ""}`}>
            {section}
          </div>
        ))}
      </div>

      <nav className="fp-nav" aria-label="Bolum navigasyonu">
        {sections.map((_, i) => (
          <button
            key={i}
            className={`fp-dot${i === current ? " active" : ""}`}
            onClick={() => jumpTo(i)}
            aria-label={`Bolum ${i + 1}`}
          />
        ))}
      </nav>

      <div className="fp-counter">
        <span className="fp-counter__cur">{String(current + 1).padStart(2, "0")}</span>
        <span className="fp-counter__sep"> / </span>
        <span className="fp-counter__tot">{String(total).padStart(2, "0")}</span>
      </div>

      {current === 0 && (
        <button className="fp-hint" onClick={() => jumpTo(1)} aria-label="Asagi git">
          <span>Kaydır</span>
          <div className="fp-hint__line" />
        </button>
      )}
    </div>
  );
}
