import { useState } from "react";
import { motion } from "framer-motion";
import { X, UploadCloud, Loader2 } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onUpload, categories }) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    desc: "",
    file: null,
    userName: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) return;

    setLoading(true);

    // Simulasi loading 1 detik agar terlihat keren
    setTimeout(() => {
      onUpload(formData);
      setLoading(false);
      setFormData({ title: "", genre: "", desc: "", file: null, userName: "" }); // Reset form
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Upload Screenshot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input Area */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-accent rounded-xl p-8 text-center cursor-pointer transition-colors group bg-slate-800/50">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              onChange={(e) =>
                setFormData({ ...formData, file: e.target.files[0] })
              }
              required
            />
            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-accent transition-colors">
              <UploadCloud size={32} />
              <p className="text-sm font-medium">
                {formData.file
                  ? formData.file.name
                  : "Klik atau drag gambar ke sini"}
              </p>
            </div>
          </div>

          <input
            placeholder="Judul Gambar"
            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-gray-500"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          {/* Input Nama User Uploaded */}
          <input
          placeholder="Nama Pengupload (Uploded)"
          className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-accent focus-ring-accent transition-all placeholder-gray-500"
          onChange={(e) => setFormData({...formData, userName: e.target.value})}
          required
           />

          <select
            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none"
            onChange={(e) =>
              setFormData({ ...formData, genre: e.target.value })
            }
            required
          >
            <option value="">Pilih Genre</option>
            {categories
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <textarea
            placeholder="Ceritakan momen ini..."
            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all h-24 resize-none placeholder-gray-500"
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Uploading...
              </>
            ) : (
              "Posting Sekarang"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadModal;
