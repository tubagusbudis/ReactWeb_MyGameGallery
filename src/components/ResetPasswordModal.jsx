import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabase";

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Sama seperti register, kita wajibkan password kuat
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        alert(
          "Gagal: Password harus minimal 8 karakter, mengandung huruf besar, kecil, angka, dan simbol.",
        );
        setLoading(false);
        return;
      }

      // Supabase update password untuk user yang sedang login (via link email)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      await supabase.auth.signOut();

      alert(
        "Password berhasil diperbarui! Silakan login ulang dengan password baru Anda.",
      );
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Buat Password Baru
          </h2>
          <p className="text-sm text-gray-400">
            Silakan masukkan password baru Anda yang kuat dan mudah diingat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password Baru"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 pl-10 pr-10 rounded-xl focus:outline-none focus:border-accent"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all flex justify-center mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Simpan Password Baru"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordModal;
