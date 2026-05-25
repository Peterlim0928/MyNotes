import { Search, Share2, Sun, Moon } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("edit");

  return (
    <header className="h-12 border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <span className="font-bold text-lg text-blue-500">My</span>
        <span className="font-bold text-lg text-gray-800">Notes</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {["edit", "view"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveNav(item)}
            className={`px-3 py-1 text-sm rounded capitalize transition-colors ${
              activeNav === item
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Search bar */}
      <div className="flex-1 max-w-sm mx-auto">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search notes..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
          />
          <span className="text-xs text-gray-300 flex-shrink-0">⌘K</span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Share */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
          <Share2 size={14} />
          Share
        </button>

        {/* User avatar placeholder */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          U
        </div>
      </div>
    </header>
  );
}
