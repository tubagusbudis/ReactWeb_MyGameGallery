import { motion } from "framer-motion";
import { X, Calendar, User, Download } from "lucide-react";

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  const handleDownload = async (e) => {
    e.stopPropagation();

    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${image.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal download:", error);
      alert("Gagal download gambar. Mohon coba lagi...");
      window.open(image.url, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`img-${image.id}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kolom Gambar (Kiri/Atas) */}
        <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative bg-grid-pattern">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full md:hidden text-white z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Kolom Info (Kanan/Bawah) */}
        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col overflow-y-auto bg-slate-900 text-white border-l border-slate-800">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                {image.title}
              </h2>
              <span className="inline-block mt-2 text-accent text-sm font-semibold bg-accent/10 px-3 py-1 rounded-md border border-accent/20">
                {image.genre}
              </span>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block p-2 hover:bg-slate-800 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {image.desc}
            </p>

            <div className="border-t border-slate-800 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Calendar size={16} />
                <span>Uploaded: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <User size={16} />
                <span className="text-white font-medium">
                By: {image.userName || "Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Pasang onClick di Button ini */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <button
              onClick={handleDownload}
              className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg group"
            >
              <Download
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              Download Image
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageModal;
