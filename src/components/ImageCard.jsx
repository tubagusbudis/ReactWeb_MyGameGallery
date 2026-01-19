import { motion } from "framer-motion";
import { Download, Share2, Maximize2 } from "lucide-react";

const ImageCard = ({ image, onOpen }) => {
  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${image.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Gagal download gambar:", error);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: `Cek gambar ini: ${image.desc}`,
        url: image.url,
      });
    } else {
      alert("Link disalin ke clipboart");
      navigator.clipboard.writeText(image.url);
    }
  };

  return (
    <motion.div
      layout initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileHover={{ y: -5 }}
      className="relative group rounded-xl overflow-hidden cursor-pointer
      shadow-lg bg-slate-800 break-inside-avoid mb-4" onClick=
      {() => onOpen(image)}
      >
    
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Overlay Animasi */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white">{image.title}</h3>
        <p className="text-sm text-gray-300">{image.genre}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDownload}
            className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition"
          >
            <Download size={18} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition"
          >
            <Share2 size={18} />
          </button>
          <button className="p-2 bg-accent hover:bg-accent/80 rounded-full transition ml-auto">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ImageCard;