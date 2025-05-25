import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMushroomData } from "../context/MushroomDataContext";
import {
  Search,
  Sprout,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Info,
} from "lucide-react";

function SpeciesList() {
  const { mushrooms, loading, error, searchMushrooms } = useMushroomData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMushrooms, setFilteredMushrooms] = useState([]);

  useEffect(() => {
    if (!loading) {
      setFilteredMushrooms(searchMushrooms(searchTerm));
    }
  }, [searchTerm, mushrooms, loading, searchMushrooms]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-[url('/path-to-your-dot-pattern.svg')] opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-xl">Loading Mushroom Species...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div
          className="absolute inset-0 z-0 bg-[url('/path-to-your-dot-pattern.svg')] opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Error Loading Species</h1>
          <p className="text-gray-300 mb-6">{error.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background pattern layers - ensure z-indexes are appropriate */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      <div className="relative z-20 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-600 bg-clip-text text-transparent mb-4">
            Mushroom Species Library
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Explore and search our database of classifiable mushroom species.
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by scientific or common name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Species Grid / List */}
        {filteredMushrooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMushrooms.map((mushroom) => {
              const commonNames = mushroom.common_name
                ? mushroom.common_name.split(",").map((name) => name.trim())
                : [];
              return (
                <Link
                  key={mushroom.scientific_name}
                  to={`/species/${encodeURIComponent(
                    mushroom.scientific_name
                  )}`}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-cyan-500/30 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gray-700/50 flex items-center justify-center">
                      {mushroom.image_path ? (
                        <img
                          src={mushroom.image_path}
                          alt={commonNames[0] || mushroom.scientific_name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          } // Hide if image fails to load
                        />
                      ) : (
                        <Sprout className="w-12 h-12 text-gray-500" />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {commonNames[0] || mushroom.scientific_name}
                    </h2>
                    <p className="text-sm text-gray-400 italic mb-2">
                      {commonNames[0]
                        ? mushroom.scientific_name
                        : commonNames.length > 1
                        ? commonNames.slice(1).join(", ")
                        : " "}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-end text-sm text-cyan-400 group-hover:text-cyan-300">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <Info className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">
              No Species Found
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search term or explore the full list."
                : "There are no species currently available in the database."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-gray-400 text-sm">
            Explore the fascinating world of fungi. Data is for informational
            purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpeciesList;
