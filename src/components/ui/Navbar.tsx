import { Search, Share2, Sun, Moon, Loader2, Save } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface Props {
  onSave: () => void;
  saving: boolean;
  canSave: boolean;
}

export default function Navbar({ onSave, saving, canSave }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-600 flex items-center px-4 gap-10 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <span className="font-bold text-lg text-blue-500">My</span>
        <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
          Notes
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1.5">
          <Search
            size={14}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="Search notes..."
            className="bg-transparent text-sm text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none w-full"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        {/* Save */}
        <button
          onClick={onSave}
          disabled={!canSave || saving}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-40"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={14} />
              Save
            </>
          )}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Share */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
          <Share2 size={14} />
          Share
        </button>
      </div>
    </header>
  );
}
