import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import { FaPen, FaPlus, FaTrash } from "react-icons/fa";

const emptyForm = () => ({
  name: "",
  description: "",
  descriptionEn: "",
  price: "",
  category: "Fiction",
  subCategory: "Novel",
  image: "",
  sizes: "Paperback, Hardcover",
  bestSeller: false,
  author: "",
  publisher: "",
  isbn: "",
});

const AdminDashboard = () => {
  const { t, isRTL } = useLanguage();
  const { authFetch, logout } = useAdmin();
  const { refetchProducts } = useContext(ShopContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authFetch("/admin/products");
      if (!r.ok) {
        if (r.status === 401) {
          await logout();
          navigate("/login", { replace: true });
        }
        throw new Error("load failed");
      }
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  }, [authFetch, logout, navigate, t]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing("new");
    setForm(emptyForm());
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      descriptionEn: p.descriptionEn,
      price: String(p.price),
      category: p.category,
      subCategory: p.subCategory,
      image: (p.image || []).join("\n"),
      sizes: (p.sizes || []).join(", "),
      bestSeller: Boolean(p.bestSeller),
      author: p.author,
      publisher: p.publisher,
      isbn: p.isbn,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm());
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        descriptionEn: form.descriptionEn,
        price: form.price,
        image: form.image,
        category: form.category,
        subCategory: form.subCategory,
        sizes: form.sizes,
        bestSeller: form.bestSeller,
        author: form.author,
        publisher: form.publisher,
        isbn: form.isbn,
      };
      if (editing === "new") {
        const r = await authFetch("/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || "save");
        }
        toast.success(t("admin.saved"));
      } else {
        const r = await authFetch(`/admin/products/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          throw new Error(err.error || "save");
        }
        toast.success(t("admin.saved"));
      }
      closeForm();
      await load();
      await refetchProducts();
    } catch (err) {
      toast.error(t("admin.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    try {
      const r = await authFetch(`/admin/products/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("delete");
      toast.success(t("admin.deleted"));
      await load();
      await refetchProducts();
      if (editing === id) closeForm();
    } catch {
      toast.error(t("admin.deleteError"));
    }
  };

  return (
    <div className="pb-16" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Title text1={t("admin.t1")} text2={t("admin.t2")} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-red-900 px-4 py-2.5 text-sm text-white transition hover:bg-red-800"
          >
            <FaPlus className="h-3.5 w-3.5" />
            {t("admin.add")}
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={onSave}
          className="mb-10 rounded-2xl border border-stone-200 bg-stone-50/50 p-5 shadow-sm dark:border-stone-600/80 dark:bg-stone-900/60"
        >
          <p className="mb-4 text-sm font-medium text-stone-800">
            {editing === "new" ? t("admin.add") : t("admin.edit")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("admin.name")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              {t("admin.price")}
              <input
                type="number"
                min="0"
                step="0.01"
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              {t("admin.category")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              {t("admin.subCategory")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.subCategory}
                onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-stone-600 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) => setForm((f) => ({ ...f, bestSeller: e.target.checked }))}
              />
              {t("admin.bestSeller")}
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("admin.descAr")}
              <textarea
                className="min-h-[80px] rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("admin.descEn")}
              <textarea
                className="min-h-[80px] rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.descriptionEn}
                onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("admin.imagesHelp")}
              <textarea
                className="min-h-[90px] rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 font-mono text-xs"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://…"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("admin.sizes")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.sizes}
                onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              {t("product.author")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600">
              {t("product.publisher")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.publisher}
                onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-stone-600 sm:col-span-2">
              {t("product.isbn")}
              <input
                className="rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800/90 px-3 py-2 text-sm"
                value={form.isbn}
                onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))}
              />
            </label>
          </div>
          <div className={`mt-4 flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white transition hover:bg-stone-800 disabled:opacity-50"
            >
              {t("admin.save")}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700"
            >
              {t("admin.cancel")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-stone-500">{t("app.loading")}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-600/80">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-100/80 text-stone-700 dark:border-stone-600/80 dark:bg-stone-800/90 dark:text-stone-200">
                <th className="px-3 py-2 font-medium">{t("admin.name")}</th>
                <th className="px-3 py-2 font-medium">{t("admin.price")}</th>
                <th className="px-3 py-2 font-medium">{t("admin.category")}</th>
                <th className="px-3 py-2 font-medium w-32">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-stone-100 transition hover:bg-red-50/30 dark:border-stone-800 dark:hover:bg-red-950/20"
                >
                  <td className="px-3 py-2.5 font-medium text-stone-900 dark:text-stone-100">
                    {p.name}
                  </td>
                  <td className="px-3 py-2.5 text-stone-600 dark:text-stone-400">
                    ${p.price}
                  </td>
                  <td className="px-3 py-2.5 text-stone-600 dark:text-stone-400">
                    {p.category}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-600 transition hover:bg-red-100 hover:text-red-900"
                        aria-label={t("admin.edit")}
                      >
                        <FaPen className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(p._id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-600 transition hover:bg-red-100 hover:text-red-900"
                        aria-label={t("admin.delete")}
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
