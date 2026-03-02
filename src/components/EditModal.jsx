import { useState } from "react";
import { motion } from "framer-motion";
import { X, UploadCloud, Save } from "lucide-react";

const EditModal = ({ isOpen, onClose, onEdit, categories, image }) => {
  const [title, setTitle] = useState(image?.title || "");
  const [genre, setGenre] = useState(image?.genre || "");
  const [desc, setDesc] = useState(image?.desc || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(image?.url || "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Kirim data baru beserta URL gambar lama untuk referensi
    await onEdit(image.id, {
      title,
      genre,
      desc,
      file,
      oldImageUrl: image.url,
    });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Edit Konten</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Judul Game
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Genre
            </label>
            <select
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="" disabled>
                Pilih Genre
              </option>
              {categories
                .filter((c) => c !== "All")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Deskripsi
            </label>
            <textarea
              required
              rows="3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Gambar (Kosongkan jika tidak ingin diganti)
            </label>
            <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:bg-slate-800/50 transition-colors cursor-pointer group overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 mx-auto rounded-lg object-cover"
                />
              ) : (
                <div className="text-gray-400 group-hover:text-accent transition-colors">
                  <UploadCloud size={32} className="mx-auto mb-2" />
                  <span className="text-sm">Klik untuk mengganti gambar</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Menyimpan...</span>
            ) : (
              <>
                <Save size={20} /> Simpan Perubahan
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditModal;
