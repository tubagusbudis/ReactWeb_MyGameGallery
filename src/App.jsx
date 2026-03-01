import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./supabase"; // Pastikan file supabase.js ada di folder src

// Import Komponen
import Navbar from "./components/Navbar";
import FilterTabs from "./components/FilterTabs";
import ImageCard from "./components/ImageCard";
import UploadModal from "./components/UploadModal";
import ImageModal from "./components/ImageModal";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import AuthModal from "./components/AuthModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

function App() {
  // --- STATE ---
  const [images, setImages] = useState([]); // Mulai dengan array kosong (bukan dummy)
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Untuk Splash Screen
  const [session, setSession] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const categories = [
    "All",
    "RPG",
    "FPS",
    "Sci-Fi",
    "Action",
    "Adventure",
    "Simulator",
    "Horror",
    "Racing",
  ];

  // --- USE EFFECT ---
  useEffect(() => {
    window.alert = (message) => {
      toast(message, {
        style: {
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.4)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          padding: '16px 24px',
          maxWidth: '350px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        },
      });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === "PASSWORD_RECOVERY") {
        setIsResetPasswordOpen(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Berhasil logout!");
  };

  // --- 1. FETCH DATA (MENGAMBIL GAMBAR DARI SUPABASE) ---
  const fetchImages = async () => {
    try {
      // Ambil data dari tabel 'gallery', urutkan dari yang terbaru
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Mapping data: sesuaikan nama kolom DB dengan nama props di Frontend
      // DB: image_url, user_name -> Frontend: url, userName
      const formattedData = data.map((item) => ({
        ...item,
        url: item.image_url, // Ubah key image_url jadi url
        userName: item.user_name, // Ubah key user_name jadi userName
      }));

      setImages(formattedData);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  // --- USE EFFECT (JALAN SAAT WEBSITE DIBUKA) ---
  useEffect(() => {
    // Timer Splash Screen 3 detik
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Panggil fungsi fetch data
    fetchImages();

    return () => clearTimeout(timer);
  }, []);

  // --- 2. UPLOAD DATA (KIRIM GAMBAR KE SUPABASE) ---
  const handleAddImage = async (formData) => {
    try {
      const file = formData.file;
      // Buat nama file unik: timestamp-namafile
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

      // A. Upload File ke Storage Bucket 'game-images'
      const { error: uploadError } = await supabase.storage
        .from("game-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // B. Ambil URL Publik gambar yang baru diupload
      const { data: publicUrlData } = supabase.storage
        .from("game-images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // C. Simpan Data ke Tabel Database 'gallery'
      const { data, error: dbError } = await supabase
        .from("gallery")
        .insert([
          {
            title: formData.title,
            genre: formData.genre,
            desc: formData.desc,
            user_name: session?.user?.user_metadata?.username || "Anonymous",
            image_url: imageUrl,
          },
        ])
        .select(); // Minta data balikan setelah insert

      if (dbError) throw dbError;

      // D. Update State Lokal (Agar gambar langsung muncul tanpa refresh)
      const newEntry = {
        ...data[0],
        url: imageUrl,
        userName: data[0].user_name,
      };

      setImages([newEntry, ...images]); // Masukkan gambar baru ke paling atas
      setIsUploadOpen(false); // Tutup modal
      alert("Upload Berhasil!");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Gagal upload: " + error.message);
    }
  };

  // --- 3. FILTERING (MENGGUNAKAN USEMEMO AGAR TIDAK ERROR) ---
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchCategory =
        activeCategory === "All" || img.genre === activeCategory;
      const matchSearch =
        img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [images, activeCategory, searchTerm]);

  // --- 4. DELETE DATA (MENGHAPUS GAMBAR DARI SUPABASE) ---
  const handleDeleteImage = async (imageToDelete) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus Gambar "${imageToDelete}"?`,
    );

    try {
      const fileName = imageToDelete.url.split("/").pop();

      const { error: storageError } = await supabase.storage
        .from("game-images")
        .remove([fileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("gallery")
        .delete()
        .eq("id", imageToDelete.id);

      if (dbError) throw dbError;

      setImages(images.filter((img) => img.id !== imageToDelete.id));
      setSelectedImage(null);
      alert("Gambar berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Gagal menghapus gambar: " + error.message);
    }
  };

  // --- RENDER TAMPILAN ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
    <Toaster position="top-center" reverseOrder={false} />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Wrapper Konten Utama */}
            <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
              <Navbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onOpenUpload={() => setIsUploadOpen(true)}
                session={session}
                onOpenAuth={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
              />

              <FilterTabs
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />

              <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
              />

              <ResetPasswordModal
                isOpen={isResetPasswordOpen}
                onClose={() => setIsResetPasswordOpen(false)}
              />

              {/* Gallery Grid */}
              <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
              >
                <AnimatePresence>
                  {filteredImages.map((img) => (
                    <ImageCard
                      key={img.id}
                      image={img}
                      onOpen={setSelectedImage}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pesan jika tidak ada gambar */}
              {filteredImages.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <p>Belum ada gambar. Jadilah yang pertama mengupload!</p>
                </div>
              )}

              {/* --- MODALS --- */}
              <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleAddImage}
                categories={categories}
                session={session}
              />

              <AnimatePresence>
                {selectedImage && (
                  <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                    session={session}
                    onDelete={handleDeleteImage}
                  />
                )}
              </AnimatePresence>
            </div>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
