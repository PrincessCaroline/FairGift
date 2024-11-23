"use client";

export default function LanguageSwitcher() {
  const changeLanguage = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <button
        onClick={() => changeLanguage("en")}
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
      >
        Français
      </button>
    </div>
  );
}
