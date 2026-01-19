import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";

const SplashScreen = () => {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      {/* Container Icon dengan Efek Pulse */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Lingkaran Berdenyut di Belakang */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-24 h-24 bg-accent rounded-full blur-xl"
        />

        {/* Icon Utama */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Gamepad2 size={64} className="text-accent relative z-10" />
        </motion.div>
      </div>

      {/* Teks Brand */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-blue-400 to-accent bg-clip-text text-transparent mb-8"
      >
        GameGallery
      </motion.h1>

      {/* Loading Bar Line */}
      <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.8, ease: "easeInOut" }} // Durasi sedikit kurang dari 3s agar pas
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
