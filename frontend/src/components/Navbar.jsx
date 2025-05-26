import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Menu,
  X,
  Home as HomeIcon,
  BookOpen,
  Info as InfoIcon,
} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const navItems = [
    { name: "Classifier", path: "/", icon: HomeIcon },
    { name: "Species Guide", path: "/species", icon: BookOpen },
    { name: "About", path: "/about", icon: InfoIcon },
  ];

  useEffect(() => {
    const navbarHeightThreshold = 50;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledToTop = currentScrollY < 10;
      setIsAtTop(scrolledToTop);

      if (scrolledToTop) {
        setShowNavbar(true);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > navbarHeightThreshold
      ) {
        if (!isMenuOpen) {
          setShowNavbar(false);
        }
      }
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isMenuOpen]);

  useEffect(() => {
    if (!showNavbar && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [showNavbar, isMenuOpen]);

  const navClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out transform
    ${
      showNavbar
        ? "translate-y-0 opacity-100"
        : "-translate-y-full opacity-0 pointer-events-none"
    }
    ${
      isAtTop && showNavbar && !isMenuOpen
        ? "bg-transparent shadow-none border-b-transparent"
        : "bg-black/75 backdrop-blur-md border-b border-white/10 shadow-lg"
    }
  `;

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              MushroomAI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors duration-200 group"
              >
                <item.icon className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors duration-200" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 py-2 border-t border-white/10"
              : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/5"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
