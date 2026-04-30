import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State สำหรับเปิด/ปิดเมนูมือถือ

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "หน้าหลัก" },
    { path: "/upload", label: "ทำนาย" },
    { path: "/profile", label: "ผู้จัดทำโครงการ" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl md:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            SENTINEL-2 AI
          </div>

          {/* Desktop & iPad Menu */}
          <ul className="hidden md:flex space-x-8 text-sm md:text-base font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`transition-all duration-300 pb-1 border-b-2 ${
                    isActive(link.path)
                      ? "text-blue-400 border-blue-400"
                      : "text-gray-300 border-transparent hover:text-white hover:border-gray-400"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2">
            <ul className="flex flex-col space-y-4 text-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)} // ปิดเมนูเมื่อคลิก
                    className={`block w-full py-2 rounded-lg transition-all ${
                      isActive(link.path)
                        ? "bg-blue-900/50 text-blue-400 font-bold"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;