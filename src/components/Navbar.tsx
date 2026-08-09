import { useState } from "react";
import {
  FiMenu,
  FiGrid,
  FiFileText,
  FiMessageSquare,
  FiBriefcase,
  FiTarget,
  FiMap,
  FiBell,
  FiUser,
} from "react-icons/fi";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: FiGrid },
    { name: "Resume", icon: FiFileText },
    { name: "Interview", icon: FiMessageSquare },
    { name: "Jobs", icon: FiBriefcase },
    { name: "Matching", icon: FiTarget },
    { name: "Roadmap", icon: FiMap },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1450px] items-center px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <FiMenu size={20} />
          </button>

          <div className="text-xl font-bold tracking-tight text-blue-600">
            CareerLens
            <span className="ml-1 text-purple-600">AI</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                <Icon size={16} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="ml-8 flex items-center gap-3">
          <button className="relative hidden text-slate-500 sm:block">
            <FiBell size={20} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              S
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Sandhesha
              </p>
              <p className="text-xs text-slate-500">Candidate</p>
            </div>

            <FiUser className="hidden text-slate-400 sm:block" size={17} />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className="flex items-center gap-3 text-left text-sm font-medium text-slate-600"
                >
                  <Icon size={18} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;