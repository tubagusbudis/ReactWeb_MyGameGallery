import { Search, UploadCloud, Gamepad2 } from "lucide-react";

const Navbar = ({ searchTerm, setSearchTerm, onOpenUpload }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 pt-4">
      {/* Logo Area */}
      <div className="flex items-center gap-2">
        <Gamepad2 className="text-accent" size={32} />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-accent bg-clip-text text-transparent">
          GameGallery
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari game, gendre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 py-2.5 pl-10 pr-4 rounded-full focus-outline-none focus-ring-2 focus:ring-accent focus-border-transparent transition-all text-white placeholder:text-gray-500"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={onOpenUpload}
        className="flex items-center gap-2 bg-accent hover:bg-indigo-600 px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-indigo-500/30 text-white group"
      >
        {/* Icon UploadCloud dengan sedikit animasi saat hover */}
        <UploadCloud
          size={20}
          className="group-hover:scale-110 transition-transform"
        />
        <span>Upload</span>
      </button>
    </header>
  );
};

export default Navbar;