import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import Title from "../components/Title";
import { useLanguage } from "../context/LanguageContext";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition " +
  "focus:border-red-800 focus:ring-2 focus:ring-red-800/25 placeholder:text-gray-400";

const Contact = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={t("contact.t1")} text2={t("contact.t2")} />
        <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto px-4">
          {t("contact.subtitle")}
        </p>
      </div>
      <div className="my-10 max-w-2xl mx-auto px-4 sm:px-0 mb-28">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-red-200/70 bg-gradient-to-b from-red-50/40 to-white p-6 sm:p-8 shadow-[0_8px_32px_rgba(153,27,27,0.1)]"
        >
          {sent && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 text-red-900 px-4 py-3 text-sm text-center"
            >
              {t("contact.sent")}
            </p>
          )}
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-red-900 mb-1.5"
              >
                {t("contact.name")}{" "}
                <span className="text-red-800/90" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className={inputClass}
                placeholder={t("contact.placeName")}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-red-900 mb-1.5"
              >
                {t("contact.email")}{" "}
                <span className="text-red-800/90" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                placeholder={t("contact.placeEmail")}
              />
            </div>
            <div>
              <label
                htmlFor="contact-phone"
                className="block text-sm font-medium text-red-900 mb-1.5"
              >
                {t("contact.phone")}
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={inputClass}
                placeholder={t("contact.placePhone")}
              />
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm font-medium text-red-900 mb-1.5"
              >
                {t("contact.subject")}{" "}
                <span className="text-red-800/90" aria-hidden>
                  *
                </span>
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                className={inputClass}
                placeholder={t("contact.placeSubject")}
              />
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-red-900 mb-1.5"
            >
              {t("contact.message")}{" "}
              <span className="text-red-800/90" aria-hidden>
                *
              </span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              className={`${inputClass} resize-y min-h-[7rem]`}
              placeholder={t("contact.placeMessage")}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-800 px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
            >
              <FaPaperPlane className="text-xs opacity-90" aria-hidden />
              {t("contact.send")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
