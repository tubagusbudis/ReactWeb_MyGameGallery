import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./supabase";

// Import Komponen
import FloatingLines from "./components/FloatingLines";
import Navbar from "./components/Navbar";
import FilterTabs from "./components/FilterTabs";
import ImageCard from "./components/ImageCard";
import UploadModal from "./components/UploadModal";
import EditModal from "./components/EditModal";
import ImageModal from "./components/ImageModal";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import AuthModal from "./components/AuthModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

function App() {
  // --- STATE ---
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
          borderRadius: "16px",
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "16px 24px",
          maxWidth: "350px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
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

  // --- 1. FETCH DATA ---
  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item) => ({
        ...item,
        url: item.image_url,
        userName: item.user_name,
      }));

      setImages(formattedData);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    }
  };

  // --- USE EFFECT (SPLASH SCREEN & FETCH) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    fetchImages();

    return () => clearTimeout(timer);
  }, []);

  // --- 2. UPLOAD DATA ---
  const handleAddImage = async (formData) => {
    try {
      const file = formData.file;
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

      const { error: uploadError } = await supabase.storage
        .from("game-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("game-images")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

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
        .select();

      if (dbError) throw dbError;

      const newEntry = {
        ...data[0],
        url: imageUrl,
        userName: data[0].user_name,
      };

      setImages([newEntry, ...images]);
      setIsUploadOpen(false);
      alert("Upload Berhasil!");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Gagal upload: " + error.message);
    }
  };

  // --- 3. EDIT DATA ---
  const handleEditImage = async (id, formData) => {
    try {
      let newImageUrl = formData.oldImageUrl;

      // Jika user memilih gambar baru, upload gambar tersebut
      if (formData.file) {
        const file = formData.file;
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;

        // Upload gambar baru
        const { error: uploadError } = await supabase.storage
          .from("game-images")
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        // Dapatkan URL baru
        const { data: publicUrlData } = supabase.storage
          .from("game-images")
          .getPublicUrl(fileName);
        newImageUrl = publicUrlData.publicUrl;

        // Hapus gambar lama dari storage agar tidak memakan memori
        const oldFileName = formData.oldImageUrl.split("/").pop();
        await supabase.storage.from("game-images").remove([oldFileName]);
      }

      // Update Database
      const { error: dbError } = await supabase
        .from("gallery")
        .update({
          title: formData.title,
          genre: formData.genre,
          desc: formData.desc,
          image_url: newImageUrl,
        })
        .eq("id", id);

      if (dbError) throw dbError;

      // Update State Lokal agar otomatis berubah tanpa refresh
      setImages(
        images.map((img) =>
          img.id === id
            ? {
                ...img,
                title: formData.title,
                genre: formData.genre,
                desc: formData.desc,
                url: newImageUrl,
              }
            : img,
        ),
      );

      setIsEditOpen(false);
      setImageToEdit(null);
      setSelectedImage(null); // Tutup image modal
      alert("Konten berhasil diperbarui!");
    } catch (error) {
      console.error("Error editing:", error);
      alert("Gagal memperbarui: " + error.message);
    }
  };

  // --- 4. FILTERING ---
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

  // --- 5. DELETE DATA ---
  const handleDeleteImage = async (imageToDelete) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus Gambar "${imageToDelete.title}"?`,
    );

    if (!confirmDelete) return;

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
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-50">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={5}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>

      <Toaster position="top-center" reverseOrder={false} />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div
            key="splash"
            className="relative z-50 h-screen w-full flex items-center justify-center pointer-events-auto"
          >
            <SplashScreen />
          </div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col min-h-screen pointer-events-none"
          >
            <div className="p-6 max-w-7xl mx-auto flex-grow w-full mb-20">
              <div className="pointer-events-auto">
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
              </div>

              <motion.div
                layout
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pb-48 min-h-[60vh] pointer-events-auto mt-4"
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

              {filteredImages.length === 0 && (
                <div className="text-center py-20 text-gray-500 relative z-20 pointer-events-auto">
                  <p>Belum ada gambar. Jadilah yang pertama mengupload!</p>
                </div>
              )}

              <div className="pointer-events-auto">
                <AuthModal
                  isOpen={isAuthOpen}
                  onClose={() => setIsAuthOpen(false)}
                />

                <EditModal
                  key={isEditOpen ? `edit-${imageToEdit?.id}` : "edit-closed"}
                  isOpen={isEditOpen}
                  onClose={() => setIsEditOpen(false)}
                  onEdit={handleEditImage}
                  categories={categories}
                  image={imageToEdit}
                />

                <ResetPasswordModal
                  isOpen={isResetPasswordOpen}
                  onClose={() => setIsResetPasswordOpen(false)}
                />

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
                      // --- PERBAIKAN: Fungsi onEdit ditambahkan di sini ---
                      onEdit={() => {
                        setSelectedImage(null); // Tutup ImageModal
                        setImageToEdit(selectedImage); // Set data yang mau diedit
                        setIsEditOpen(true); // Buka EditModal
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="pointer-events-auto">
              <Footer />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
