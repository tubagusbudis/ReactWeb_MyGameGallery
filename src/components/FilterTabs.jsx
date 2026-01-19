const FilterTabs = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-4">
      {categories.map((cat) => (
        <button
        key={cat}
        onClick={() => setActiveCategory(cat)}
        className={`
            px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border
            ${activeCategory === cat 
              ? "bg-white text-slate-900 border-white shadow-md scale-105" 
              : "bg-slate-800/50 text-gray-400 border-slate-700 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
            }
          `}>
            {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs