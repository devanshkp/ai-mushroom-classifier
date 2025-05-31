import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, Menu, X, Home, BookOpen, Info } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const navItems = [
    { name: "Classifier", path: "/", icon: Home },
    { name: "Species Guide", path: "/species", icon: BookOpen },
    { name: "About", path: "/about", icon: Info },
  ];

  // Function to handle navigation with scroll to top
  const handleNavigation = () => {
    setIsMenuOpen(false);
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
        ? "bg-transparent shadow-none"
        : "bg-black/70 backdrop-blur-lg shadow-lg"
    }
  `;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={handleNavigation}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-xl tracking-tight hidden sm:block">
              MushroomAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200 group font-medium tracking-wide"
                onClick={handleNavigation}
              >
                <item.icon className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors duration-200" />
                <span className="text-gray-300">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-out ${
            isMenuOpen
              ? "max-h-64 opacity-100 pb-6"
              : "max-h-0 opacity-0 pb-0 pointer-events-none"
          }`}
        >
          <div className="border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleNavigation}
                  className={`flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-white/8 active:bg-white/12 transition-all duration-200 px-4 py-3 rounded-lg font-medium group cursor-pointer transform ${
                    isMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 75}ms` : "0ms",
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-200">
                    <item.icon className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors duration-200" />
                  </div>
                  <span className="tracking-wide font-medium text-gray-300">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
