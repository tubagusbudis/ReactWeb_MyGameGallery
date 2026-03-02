import { motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Download,
  Share2,
  Trash2,
  Edit,
} from "lucide-react";

const ImageModal = ({ image, onClose, session, onDelete, onEdit }) => {
  if (!image) return null;

  // Cek apakah user yang login adalah pemilik gambar ini
  const isOwner = session?.user?.user_metadata?.username === image.userName;

  // Format tanggal berdasarkan data dari database
  const formattedDate = image.created_at
    ? new Date(image.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Tidak diketahui";

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

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: `Cek gambar game keren ini: ${image.desc}`,
        url: image.url,
      });
    } else {
      navigator.clipboard.writeText(image.url);
      alert("Link disalin ke clipboard!");
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
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full md:hidden text-white z-10 hover:bg-black/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Kolom Info (Kanan/Bawah) */}
        <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col overflow-y-auto bg-slate-900 text-white border-l border-slate-800">
          {/* Header Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-white mb-2">
                {image.title}
              </h2>
              <span className="inline-block text-accent text-sm font-semibold bg-accent/10 px-3 py-1.5 rounded-md border border-accent/20">
                {image.genre}
              </span>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block p-2 bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Deskripsi & Meta Data */}
          <div className="space-y-6 flex-1">
            <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {image.desc || "Tidak ada deskripsi."}
            </p>

            <div className="border-t border-slate-800 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Calendar size={16} className="text-accent" />
                <span>Diunggah: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <User size={16} className="text-accent" />
                <span>
                  Oleh:{" "}
                  <span className="text-white font-medium">
                    {image.userName || "Anonymous"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Area Tombol Aksi */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            {/* Tombol Download & Share */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleDownload}
                className="flex-1 bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg group"
              >
                <Download
                  size={20}
                  className="group-hover:-translate-y-1 transition-transform"
                />
                Download Image
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl transition-colors flex items-center justify-center group"
                title="Share"
              >
                <Share2
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </button>
            </div>

            {/* Tombol Edit & Hapus (Hanya Muncul Jika isOwner) */}
            {isOwner && (
              <div className="flex gap-3 w-full">
                {/* Tombol Edit (Kini menggunakan flex-1 agar sama besar) */}
                <button
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white hover:border-blue-500 py-3 rounded-xl transition-all font-semibold"
                >
                  <Edit size={18} />
                  Edit
                </button>

                {/* Tombol Delete (Kini menggunakan flex-1 agar sama besar) */}
                <button
                  onClick={() => onDelete(image)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white hover:border-red-500 py-3 rounded-xl transition-all font-semibold"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageModal;
