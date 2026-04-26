import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "data", "products.json");
const ordersPath = join(__dirname, "data", "orders.json");

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bookbazaar2026";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const adminSessions = new Map();

function loadProducts() {
  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

function saveProducts(list) {
  writeFileSync(dataPath, JSON.stringify(list, null, 2), "utf-8");
}

function loadOrders() {
  try {
    return JSON.parse(readFileSync(ordersPath, "utf-8"));
  } catch {
    return [];
  }
}

function saveOrders(list) {
  writeFileSync(ordersPath, JSON.stringify(list, null, 2), "utf-8");
}

function pruneSessions() {
  const now = Date.now();
  for (const [t, exp] of adminSessions) {
    if (exp < now) adminSessions.delete(t);
  }
}

function requireAdmin(req, res, next) {
  pruneSessions();
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = h.slice(7);
  if (!adminSessions.has(token) || adminSessions.get(token) < Date.now()) {
    if (adminSessions.has(token)) adminSessions.delete(token);
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "ecommerce-api" });
});

app.get("/api/products", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.json(loadProducts());
});

app.get("/api/products/:id", (req, res) => {
  res.set("Cache-Control", "no-store");
  const p = loadProducts().find((x) => x._id === req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// ——— Customer orders (public create) ———

app.post("/api/orders", (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return res.status(400).json({ error: "no items" });
  }
  const c = body.customer || {};
  const email = String(c.email || "").trim();
  if (!email) {
    return res.status(400).json({ error: "email required" });
  }
  const firstName = String(c.firstName || "").trim() || "—";
  const lastName = String(c.lastName || "").trim() || "—";
  const list = loadOrders();
  const id = `ord-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const order = {
    _id: id,
    createdAt: Date.now(),
    status: "pending",
    customer: {
      firstName,
      lastName,
      email,
      phone: String(c.phone || "").trim(),
      street: String(c.street || "").trim(),
      city: String(c.city || "").trim(),
      state: String(c.state || "").trim(),
      zip: String(c.zip || "").trim(),
      country: String(c.country || "").trim(),
    },
    paymentMethod: String(body.paymentMethod || "cod"),
    items: items.map((row) => ({
      productId: String(row.productId ?? ""),
      name: String(row.name || ""),
      image: String(row.image || ""),
      format: String(row.format || ""),
      qty: Math.max(1, Math.floor(Number(row.qty) || 0)),
      unitPrice: Math.max(0, Number(row.unitPrice) || 0),
      lineTotal: Math.max(0, Number(row.lineTotal) || 0),
    })),
    subtotal: Math.max(0, Number(body.subtotal) || 0),
    shipping: Math.max(0, Number(body.shipping) || 0),
    total: Math.max(0, Number(body.total) || 0),
  };
  list.unshift(order);
  saveOrders(list);
  res.status(201).json({ order });
});

// ——— Admin ———

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString("hex");
    adminSessions.set(token, Date.now() + SESSION_MS);
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const h = req.headers.authorization;
  const token = h?.slice(7);
  if (token) adminSessions.delete(token);
  res.json({ ok: true });
});

app.get("/api/admin/verify", requireAdmin, (req, res) => {
  res.json({ ok: true, role: "admin" });
});

app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(loadProducts());
});

app.get("/api/admin/orders", requireAdmin, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(loadOrders());
});

app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  const allowed = new Set(["pending", "processing", "shipped", "cancelled"]);
  if (typeof status !== "string" || !allowed.has(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const list = loadOrders();
  const idx = list.findIndex((o) => o._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  list[idx] = { ...list[idx], status, updatedAt: Date.now() };
  saveOrders(list);
  res.json(list[idx]);
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const list = loadProducts();
  const nextId = String(
    Math.max(0, ...list.map((p) => Number(p._id) || 0)) + 1
  );
  const body = req.body;
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return res.status(400).json({ error: "name required" });
  }
  const imageRaw = body.image;
  const image = Array.isArray(imageRaw)
    ? imageRaw.map(String).map((s) => s.trim()).filter(Boolean)
    : typeof imageRaw === "string"
      ? imageRaw
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  if (image.length === 0) {
    return res.status(400).json({ error: "at least one image URL" });
  }
  const sizes = Array.isArray(body.sizes)
    ? body.sizes
    : typeof body.sizes === "string"
      ? body.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Paperback", "Hardcover"];

  const product = {
    _id: nextId,
    name: String(body.name).trim(),
    description: String(body.description ?? "").trim() || "—",
    descriptionEn: String(body.descriptionEn ?? "").trim() || "—",
    price: Math.max(0, Number(body.price) || 0),
    image,
    category: String(body.category ?? "Fiction").trim() || "Fiction",
    subCategory: String(body.subCategory ?? "General").trim() || "General",
    sizes: sizes.length ? sizes : ["Paperback", "Hardcover"],
    date: typeof body.date === "number" ? body.date : Date.now(),
    bestSeller: Boolean(body.bestSeller),
    author: String(body.author ?? "").trim() || "—",
    publisher: String(body.publisher ?? "").trim() || "—",
    isbn: String(body.isbn ?? "").trim() || "—",
  };
  list.push(product);
  saveProducts(list);
  res.status(201).json(product);
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const list = loadProducts();
  const idx = list.findIndex((x) => x._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const prev = list[idx];
  const body = req.body || {};
  const imageFromBody = (() => {
    const imageRaw = body.image;
    if (imageRaw === undefined) return prev.image;
    if (Array.isArray(imageRaw)) {
      return imageRaw.map(String).map((s) => s.trim()).filter(Boolean);
    }
    if (typeof imageRaw === "string") {
      return imageRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return prev.image;
  })();
  const sizesFrom = (() => {
    if (body.sizes === undefined) return prev.sizes;
    if (Array.isArray(body.sizes)) return body.sizes;
    if (typeof body.sizes === "string") {
      return body.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return prev.sizes;
  })();
  const updated = {
    ...prev,
    name: body.name !== undefined ? String(body.name).trim() : prev.name,
    description:
      body.description !== undefined
        ? String(body.description)
        : prev.description,
    descriptionEn:
      body.descriptionEn !== undefined
        ? String(body.descriptionEn)
        : prev.descriptionEn,
    price: body.price !== undefined ? Math.max(0, Number(body.price) || 0) : prev.price,
    image: imageFromBody.length ? imageFromBody : prev.image,
    category:
      body.category !== undefined ? String(body.category) : prev.category,
    subCategory:
      body.subCategory !== undefined
        ? String(body.subCategory)
        : prev.subCategory,
    sizes: sizesFrom.length ? sizesFrom : prev.sizes,
    bestSeller:
      body.bestSeller !== undefined ? Boolean(body.bestSeller) : prev.bestSeller,
    author: body.author !== undefined ? String(body.author) : prev.author,
    publisher:
      body.publisher !== undefined ? String(body.publisher) : prev.publisher,
    isbn: body.isbn !== undefined ? String(body.isbn) : prev.isbn,
  };
  list[idx] = updated;
  saveProducts(list);
  res.json(updated);
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const list = loadProducts();
  const next = list.filter((x) => x._id !== req.params.id);
  if (next.length === list.length) return res.status(404).json({ error: "Not found" });
  saveProducts(next);
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`E-commerce API: http://127.0.0.1:${PORT} (and localhost:${PORT})`);
  console.log(`Admin user (override with ADMIN_USER / ADMIN_PASSWORD): ${ADMIN_USER}`);
});
