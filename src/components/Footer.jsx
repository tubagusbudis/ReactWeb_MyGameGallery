import { motion } from "framer-motion";
import {
  Gamepad2,
  Github,
  Twitter,
  Instagram,
  Heart,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Bagian 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-extrabold text-white">
              <Gamepad2 className="text-accent" size={32} />
              <span>
                Game<span className="text-accent">Gallery</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Koleksi screenshot game terbaik dari seluruh dunia. Simpan,
              bagikan, dan temukan inspirasi visual gaming-mu di sini.
            </p>
          </div>

          {/* Bagian 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Explore</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                "Trending",
                "New Uploads",
                "Popular Genres",
                "Top Contributors",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-accent transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bagian 3: Connect */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com/tubagusbudis" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Mail, href: "tubagusbudi2018@gmail.com" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -5, color: "#6366f1" }} // Warna accent saat hover
                  className="bg-slate-800 p-3 rounded-full text-gray-400 hover:bg-slate-700 transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
            <p className="mt-6 text-gray-500 text-xs">
              Tertarik kolaborasi? <br />
              <span className="text-accent cursor-pointer hover:underline">
                contact@gamegallery.com
              </span>
            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} GameGallery. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            By Tubagus & Gemini AI{" "}
            <Heart
              size={14}
              className="text-red-500 fill-red-500 animate-pulse"
            />{" "}
            menggunakan React & Vite
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
