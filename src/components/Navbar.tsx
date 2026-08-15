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

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

function Navbar({
  activePage,
  onNavigate,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      page: "Dashboard",
      icon: FiGrid,
    },
    {
      name: "Resume",
      page: "Resume Analyzer",
      icon: FiFileText,
    },
    {
      name: "Interview",
      page: "AI Interview",
      icon: FiMessageSquare,
    },
    {
      name: "Jobs",
      page: "Job Matching",
      icon: FiBriefcase,
    },
    {
      name: "Matching",
      page: "Job Matching",
      icon: FiTarget,
    },
    {
      name: "Roadmap",
      page: "Career Roadmap",
      icon: FiMap,
    },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1450px] items-center px-6">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <FiMenu size={20} />
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("Dashboard")}
            className="text-xl font-bold tracking-tight text-blue-600"
          >
            CareerLens
            <span className="ml-1 text-purple-600">
              AI
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.page;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  handleNavigate(item.page)
                }
                className={`flex items-center gap-2 text-sm font-medium transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="ml-8 flex items-center gap-3">
          <button
            type="button"
            className="relative hidden text-slate-500 sm:block"
          >
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

              <p className="text-xs text-slate-500">
                Candidate
              </p>
            </div>

            <FiUser
              className="hidden text-slate-400 sm:block"
              size={17}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    handleNavigate(item.page)
                  }
                  className={`flex items-center gap-3 text-left text-sm font-medium ${
                    activePage === item.page
                      ? "text-blue-600"
                      : "text-slate-600"
                  }`}
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