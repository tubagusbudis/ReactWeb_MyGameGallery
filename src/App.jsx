import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Komponen Baru
import Navbar from "./components/Navbar";
import FilterTabs from "./components/FilterTabs";
import ImageCard from "./components/ImageCard";
import UploadModal from "./components/UploadModal"; // Perbaiki nama file jika typo di folder (UploadModal vs UploadModel)
import ImageModal from "./components/ImageModal";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen.jsx";

// Data
import { initialImages } from "./data/images";

function App() {
  const [images, setImages] = useState(initialImages);
  const [filteredImages, setFilteredImages] = useState(initialImages);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "RPG", "FPS", "Sci-Fi", "Action", "Adventure", "Simulator", "Horror", "Racing"];

  // Logic Filter & Search
  useEffect(() => {
    let result = images;
    if (activeCategory !== "All") {
      result = result.filter((img) => img.genre === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.desc.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredImages(result);
  }, [activeCategory, searchTerm, images]);

  useEffect(() => {
    // Simulasi loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
  },[]);

  // Logic Tambah Gambar (Diterima dari UploadModal)
  const handleAddImage = (formData) => {
    const newEntry = {
      id: Date.now(),
      title: formData.title,
      genre: formData.genre,
      desc: formData.desc,
      url: URL.createObjectURL(formData.file),
    };
    setImages([newEntry, ...images]);
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Splash Screen */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen />
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
              />

              <FilterTabs
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
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

              {/* --- MODALS --- */}
              <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUpload={handleAddImage}
                categories={categories}
              />

              <AnimatePresence>
                {selectedImage && (
                  <ImageModal
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
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
