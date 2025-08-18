import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Home, Search, Info, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isMenuOpen]);

  const navItems = [
    { name: "Classifier", path: "/", icon: Home },
    { name: "Species", path: "/species", icon: Search },
    { name: "About", path: "/about", icon: Info },
  ];

  const isActive = (path) =>
    location.pathname === path ? "text-emerald-300" : "text-zinc-100";

  return (
    <nav className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      {/* Pill container */}
      <div
        className={[
          "relative mx-auto flex w-full max-w-7xl items-center justify-between",
          "rounded-full border border-white/10 backdrop-blur-2xl ring-1 ring-inset ring-white/10",
          "transition-[padding,transform,width] duration-300",
          "px-3 py-3",
          "bg-white/5",
        ].join(" ")}
        style={{
          width: scrolled ? "min(100%, 980px)" : "min(100%, 1120px)",
        }}
        aria-label="Primary Navigation"
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group inline-flex items-center gap-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-4xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-sm ring-1 ring-inset ring-white/20">
            <Camera className="h-5 w-5" />
          </span>
          <AnimatePresence>
            {!scrolled && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="hidden text-[15px] font-semibold tracking-tight text-white sm:block"
              >
                MushroomAI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-emerald-300 ${isActive(
                  item.path
                )}`}
              >
                <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile button */}
        <button
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-xl p-2 text-white md:hidden hover:bg-white/10"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Fullscreen mobile overlay */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 grid grid-rows-[auto,1fr,auto] bg-black/80 backdrop-blur-xl"
        >
          <div className="flex items-start justify-between px-6 pt-6">
            <Link
              to="/"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group inline-flex items-center gap-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-4xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-sm ring-1 ring-inset ring-white/20">
                <Camera className="h-5 w-5" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                MushroomAI
              </span>
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl p-2 text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 px-6">
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[17px] font-medium text-zinc-100 ring-1 ring-inset ring-white/10 hover:bg-white/7"
                  >
                    <span className="inline-flex items-center gap-3">
                      <item.icon className="h-5 w-5 opacity-90" /> {item.name}
                    </span>
                    <span className="text-emerald-300">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
