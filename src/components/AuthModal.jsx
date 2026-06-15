import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../supabase";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "", // Hanya dipakai saat Register
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        // --- PROSES LUPA PASSWORD ---
        const { error } = await supabase.auth.resetPasswordForEmail(
          formData.email,
          {
            redirectTo: window.location.origin,
          },
        );
        if (error) throw error;
        alert(
          "Link reset password telah dikirim! Silakan cek kontak masuk email Anda.",
        );
        setIsForgotPassword(false);
        onClose();
      } else if (isLogin) {
        // --- PROSES LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        alert("Login Berhasil!");
        onClose();
      } else {
        // --- PROSES REGISTER ---
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(formData.password)) {
          alert(
            "Gagal: Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol/karakter khusus.",
          );
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            },
          },
        });
        if (error) throw error;
        alert(
          "Akun berhasil dibuat! Link verifikasi telah dikirim! Silahkan cek email Anda.",
        );
        setIsLogin(true); // Pindah ke tab login
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (mode) => {
    if (mode === "login") {
      setIsLogin(true);
      setIsForgotPassword(false);
    } else if (mode === "register") {
      setIsLogin(false);
      setIsForgotPassword(false);
    } else if (mode === "forgot") {
      setIsForgotPassword(true);
    }
    setShowPassword(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
                ? "Welcome Back"
                : "Create Account"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isForgotPassword && (
            <p className="text-sm text-gray-400 mb-4">
              Masukkan email akun Anda. Kami akan mengirimkan link untuk membuat
              password baru.
            </p>
          )}

          {!isLogin && !isForgotPassword && (
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white p-3 pl-10 rounded-xl focus:outline-none focus:border-accent"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 pl-10 rounded-xl focus:outline-none focus:border-accent"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Sembunyikan input password jika sedang di mode Lupa Password */}
          {!isForgotPassword && (
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white p-3 pl-10 pr-10 rounded-xl focus:outline-none focus:border-accent"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!isLogin && (
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  *Min. 8 karakter, huruf besar & kecil, angka, dan simbol
                  (!@#$).
                </p>
              )}
            </div>
          )}

          {/* Tombol Lupa Password */}
          {isLogin && !isForgotPassword && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => toggleMode("forgot")}
                className="text-sm text-accent hover:underline"
              >
                Lupa password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-all flex justify-center mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : isForgotPassword ? (
              "Kirim Link Reset"
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isForgotPassword
            ? "Ingat password Anda? "
            : isLogin
              ? "Belum punya akun? "
              : "Sudah punya akun? "}
          <button
            onClick={() =>
              isForgotPassword
                ? toggleMode("login")
                : toggleMode(isLogin ? "register" : "login")
            }
            className="text-accent hover:underline font-semibold"
          >
            {isForgotPassword
              ? "Kembali Login"
              : isLogin
                ? "Daftar di sini"
                : "Login di sini"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthModal;
