import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UploadCloud,
  Gamepad2,
  LogOut,
  User,
  LogIn,
} from "lucide-react";

import TrueFocus from "./TrueFocus";

const Navbar = ({ searchTerm, setSearchTerm, onOpenUpload, session, onOpenAuth, onLogout }) => {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pt-4">
      <div className="flex items-center gap-2">
        <Gamepad2 className="text-accent" size={55} />
        <div className="text-2xl font-extrabold text-white tracking-wider">
          <TrueFocus
            sentence="Game Gallery"
            manualMode={false}
            blurAmount={5}
            borderColor="#5227FF"
            animationDuration={0.5}
            pauseBetweenAnimations={1}
          />
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari game, genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 py-2.5 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-white placeholder-gray-500"
        />
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            {/* Tombol Upload Tetap Ada */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 bg-accent hover:bg-indigo-600 px-5 py-2.5 rounded-full font-medium transition-all text-white group"
            >
              <UploadCloud
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* WADAH DROPDOWN PROFIL */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white text-gray-400 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                title="Profile Menu"
              >
                <User size={20} />
              </button>

              {/* Animasi Kotak Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* Bagian Header Info Akun */}
                    <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                      <p className="text-xs text-gray-400 mb-1">
                        Login sebagai
                      </p>
                      <p className="font-bold text-white text-lg truncate">
                        {session.user.user_metadata.username}
                      </p>
                      <p className="text-sm text-gray-400 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    {/* Bagian Menu (Logout) */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false); // Tutup menu saat diklik
                          onLogout(); // Jalankan fungsi logout
                        }}
                        className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors font-medium text-left"
                      >
                        <LogOut size={18} />
                        Logout dari Akun
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* Tombol Login */
          <button
            onClick={onOpenAuth}
            className="p-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white text-gray-400 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            title="Login / Daftar"
          >
            <LogIn size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;