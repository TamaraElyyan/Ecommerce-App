import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
    <LanguageProvider>
      <AdminContextProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </AdminContextProvider>
    </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
);
