import { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Camera,
  TreePine,
  Book,
  Leaf,
  Shield,
  Eye,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useMushroomData } from "../context/MushroomDataContext";
import Navbar from "../components/Navbar";

function SpeciesDetail() {
  const { scientificName } = useParams();
  const navigate = useNavigate();

  const [mushroom, setMushroom] = useState(null);
  const [imageError, setImageError] = useState(false);

  const { getMushroomByScientificName, loading, error } = useMushroomData();

  useEffect(() => {
    if (!loading && scientificName) {
      const foundMushroom = getMushroomByScientificName(scientificName);
      setMushroom(foundMushroom);
      setImageError(false);
    }
  }, [scientificName, loading, getMushroomByScientificName]);

  const [showImageModal, setShowImageModal] = useState(false);

  const ImageModal = () =>
    showImageModal && (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={() => setShowImageModal(false)}
      >
        <div className="relative max-w-2xl max-h-[70vh] flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute -top-12 -right-4 md:-top-20 md:-right-20 text-white hover:text-gray-300 transition-colors z-10"
          >
            <XCircle className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          <img
            src={mushroom.image_path}
            alt={
              commonNames.length > 0 ? commonNames[0] : mushroom.scientific_name
            }
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );

  const getEdibilityInfo = (edibility) => {
    if (!edibility) {
      return {
        icon: AlertTriangle,
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50",
        status: "Unknown",
        priority: "medium",
      };
    }

    const lower = edibility.toLowerCase();
    if (
      lower.includes("edible") &&
      (lower.includes("good") || lower.includes("excellent"))
    ) {
      return {
        icon: CheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/50",
        status: "Safe to Eat",
        priority: "high",
      };
    } else if (lower.includes("edible")) {
      return {
        icon: Info,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50",
        status: "Edible with Caution",
        priority: "medium",
      };
    } else if (lower.includes("toxic") || lower.includes("poisonous")) {
      return {
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/20",
        borderColor: "border-red-500/50",
        status: "Toxic",
        priority: "critical",
      };
    } else {
      return {
        icon: AlertTriangle,
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50",
        status: "Unknown",
        priority: "medium",
      };
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading mushroom details...</p>
        </div>
      </div>
    );
  }

  // Error state from data context
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Error Loading Data</h1>
          <p className="text-gray-300 mb-6">{error}</p>
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

  // Mushroom not found for the given scientificName
  if (!mushroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-2xl mb-2">Species Not Found</h1>
          <p className="text-gray-300 mb-6">
            The mushroom species "{scientificName}" was not found in our
            database.
          </p>
          <button
            onClick={handleBackClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const edibilityInfo = getEdibilityInfo(mushroom.edibility);
  const EdibilityIcon = edibilityInfo.icon;
  const commonNames = mushroom.common_name
    ? mushroom.common_name.split(",").map((name) => name.trim())
    : [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background pattern */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-6 pt-20">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="mb-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back</span>
        </button>

        {/* Hero Section with Image and Title */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl mb-6 md:mb-8">
          <div className="grid lg:grid-cols-5 gap-4 md:gap-8 items-start">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-lg relative group">
                {!imageError && mushroom.image_path ? (
                  <div className="relative w-full h-full">
                    {/* Blurred background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-md scale-110"
                      style={{
                        backgroundImage: `url(${mushroom.image_path})`,
                      }}
                    />
                    {/* Overlay to darken the blurred background */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Main image */}
                    <div className="relative w-full h-full flex items-center justify-center p-0">
                      <img
                        src={mushroom.image_path}
                        alt={
                          commonNames.length > 0
                            ? commonNames[0]
                            : mushroom.scientific_name
                        }
                        className="max-w-full max-h-full object-contain drop-shadow-2xl"
                        onError={handleImageError}
                      />
                    </div>

                    {/* Expand button - shows on hover */}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/70 hover:bg-black/90 text-white p-1.5 md:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20"
                      title="Click to expand"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        className="md:w-5 md:h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                      </svg>
                    </button>
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-800 h-full flex items-center justify-center text-center text-gray-400 p-4 md:p-6">
                    <div>
                      <Camera className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-50" />
                      <p className="text-base md:text-lg font-medium">
                        Image not available
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {commonNames.length > 0
                          ? commonNames[0]
                          : mushroom.scientific_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Key Info */}
            <div className="lg:col-span-3 flex flex-col justify-between min-h-full">
              {/* Scientific Name and Common Names */}
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 leading-tight">
                  {mushroom.scientific_name}
                </h1>
                {commonNames.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
                      Also known as:
                    </span>
                    <p className="text-base md:text-xl text-gray-200 italic mt-1">
                      {commonNames.join(" • ")}
                    </p>
                  </div>
                )}
                {!mushroom.common_name && (
                  <p className="text-sm md:text-lg text-gray-300 italic mb-4 md:mb-6">
                    (No common names listed)
                  </p>
                )}
              </div>

              {/* Prominent Edibility Status and Quick Stats */}
              <div className="space-y-3 md:space-y-4">
                <div
                  className={`inline-flex items-center space-x-2 md:space-x-3 px-4 py-2 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg font-bold ${edibilityInfo.bgColor} ${edibilityInfo.borderColor} border-2 shadow-lg`}
                >
                  <EdibilityIcon
                    className={`w-5 h-5 md:w-7 md:h-7 ${edibilityInfo.color}`}
                  />
                  <span className={`${edibilityInfo.color}`}>
                    {edibilityInfo.status}
                  </span>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Leaf className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          Type
                        </p>
                        <p className="text-sm md:text-base text-white font-semibold">
                          {mushroom.type || "Fungus"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-white/10">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Shield
                        className={`w-4 h-4 md:w-5 md:h-5 ${edibilityInfo.color} flex-shrink-0`}
                      />
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                          Edibility
                        </p>
                        <p className="text-sm md:text-base text-white font-semibold">
                          {mushroom.edibility || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Equal height columns with flex */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Primary Information */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            {/* Description Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center">
                <Eye className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-400" />
                Identification
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {mushroom.description || "No description available."}
                </p>
              </div>
            </div>

            {/* Habitat Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center">
                <TreePine className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-green-400" />
                Habitat & Ecology
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {mushroom.habitat || "Habitat information not available."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Information */}
          <div className="flex flex-col space-y-6 md:space-y-8">
            {/* Important Notes Card */}
            <div className="bg-yellow-500/20 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-500/50 shadow-xl h-full">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center">
                <Info className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-yellow-400" />
                Important Notes
              </h2>
              <div className="flex items-start space-x-3">
                <p className="text-sm md:text-base text-yellow-100 leading-relaxed">
                  {mushroom.notes}
                </p>
              </div>
            </div>
            {/* Additional Information Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 shadow-xl flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center">
                <Book className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-purple-400" />
                Additional Information
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="bg-white/5 rounded-lg p-3 md:p-4">
                  <h3 className="text-sm md:text-base text-white font-semibold mb-2">
                    Scientific Classification
                  </h3>
                  <p className="text-xs md:text-sm text-gray-300 italic">
                    {mushroom.scientific_name}
                  </p>
                </div>

                {mushroom.type && (
                  <div className="bg-white/5 rounded-lg p-3 md:p-4">
                    <h3 className="text-sm md:text-base text-white font-semibold mb-2">
                      Mushroom Type
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300">
                      {mushroom.type}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning - Full Width */}
        <div className="mt-6 md:mt-8">
          <div className="bg-red-500/20 border-l-4 border-red-500 rounded-r-xl md:rounded-r-2xl p-4 md:p-8 shadow-xl">
            <div className="flex items-start space-x-3 md:space-x-4">
              <AlertTriangle className="w-6 h-6 md:w-10 md:h-10 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-red-300 mb-2 md:mb-3">
                  Safety Warning
                </h3>
                <p className="text-sm md:text-lg text-red-200 leading-relaxed">
                  Never consume any wild mushroom based solely on digital
                  identification. Always consult with expert mycologists and use
                  multiple reliable field guides before considering any wild
                  mushroom for consumption. Misidentification can be fatal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 md:mt-8 py-6 md:py-8 border-t border-white/10">
          <p className="text-xs md:text-sm text-gray-400">
            Information provided for educational purposes only • Always verify
            with expert mycologists
          </p>
        </div>
      </div>
      {ImageModal()}
    </div>
  );
}

export default SpeciesDetail;
