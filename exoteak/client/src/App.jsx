import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NavModeController() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/") {
      document.documentElement.dataset.navMode = "light";
    }
    return () => { delete document.documentElement.dataset.navMode; };
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const isHome  = pathname === "/";

  return (
    <>
      <ScrollTop />
      <NavModeController />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/urunler" element={<Products />} />
        <Route path="/urunler/:category" element={<Products />} />
        <Route path="/urun/:slug" element={<ProductDetail />} />
        <Route path="/hakkimizda" element={<About />} />
        <Route path="/iletisim" element={<Contact />} />
        <Route path="/admin/giris" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Home page has its own contact/footer section as the last fp-scene */}
      {!isAdmin && !isHome && <Footer />}
    </>
  );
}

