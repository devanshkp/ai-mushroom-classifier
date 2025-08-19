import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, Home, Search, Info } from "lucide-react";
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
    location.pathname === path
      ? "text-emerald-300 bg-white/10 px-4 py-2 border border-white/20 rounded-full"
      : "text-zinc-100";

  const isActiveMobile = (path) =>
    location.pathname === path ? "text-emerald-300" : "text-zinc-100";

  // animations
  const bar =
    "absolute left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-white";
  const barTx = { duration: 0.36, ease: [0.22, 0.61, 0.36, 1] };
  const listTx = { duration: 0.18, ease: [0.25, 0.8, 0.25, 1] };

  return (
    <>
      <nav className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
        <div
          className={[
            "relative mx-auto flex w-full max-w-7xl items-center justify-between",
            "rounded-full ",
            "transition-[padding,transform,width] duration-300",
            "px-3 py-2 ",
            !isMenuOpen &&
              "bg-white/5 ring-1 ring-inset ring-white/15  backdrop-blur-2xl",
          ].join(" ")}
          style={{ width: scrolled ? "min(100%, 980px)" : "min(100%, 1120px)" }}
          aria-label="Primary Navigation"
        >
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2"
          >
            <span className="grid h-7 w-7 place-items-center rounded-4xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-sm ring-1 ring-inset ring-white/20">
              <Camera className="h-4 w-4" />
            </span>
            {!scrolled && (
              <span className="hidden text-[15px] font-semibold tracking-tight text-white sm:block">
                MushroomAI
              </span>
            )}
          </Link>

          {/* Desktop */}
          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={`group inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium transition-colors hover:text-emerald-300 ${isActive(
                    item.path
                  )}`}
                >
                  <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="relative h-9 w-9 md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <motion.span
              className={bar}
              initial={false}
              animate={isMenuOpen ? { y: 0, rotate: 45 } : { y: -5, rotate: 0 }}
              transition={barTx}
            />
            <motion.span
              className={bar}
              initial={false}
              animate={isMenuOpen ? { y: 0, rotate: -45 } : { y: 5, rotate: 0 }}
              transition={barTx}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobileSheet"
            className="fixed inset-0 z-40 md:hidden bg-[hsl(0_0_5)]/50 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="mx-auto w-full max-w-7xl"
              style={{ paddingTop: 96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ul>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: 200 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { ...listTx, delay: 0.04 * i },
                    }}
                    exit={{ opacity: 0, x: 28, transition: listTx }}
                    className="hover:bg-white/10 py-3 px-6"
                  >
                    <Link
                      to={item.path}
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`flex items-center gap-3 text-[16px] font-medium ${isActiveMobile(
                        item.path
                      )}`}
                    >
                      <item.icon className="h-[16px] w-[16px]" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
