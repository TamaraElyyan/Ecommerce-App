import { useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import { ShopContext } from "./context/ShopContext";
import { useLanguage } from "./context/LanguageContext";
import { useTheme } from "./context/ThemeContext";

const App = () => {
  const { productsLoading } = useContext(ShopContext);
  const { t, isRTL, language } = useLanguage();
  const { isDark } = useTheme();
  const location = useLocation();
  return (
    <div className="relative min-h-[40vh] bg-stone-50 px-4 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {productsLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/85 backdrop-blur-[1px] dark:bg-stone-950/90">
          <p className="animate-pulse text-sm text-stone-600 dark:text-stone-400">
            {t("app.loading")}
          </p>
        </div>
      )}
      <ToastContainer
        rtl={isRTL}
        position={language === "ar" ? "top-left" : "top-right"}
        theme={isDark ? "dark" : "light"}
      />
      <Navbar />

      <main
        key={location.pathname}
        className="motion-reduce:animate-none animate-fadeIn motion-reduce:opacity-100 pb-2"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
