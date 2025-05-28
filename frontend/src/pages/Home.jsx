import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  Camera,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
      setPredictions([]);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleRequest = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Sending request to backend...");

      const res = await fetch("https://ai-mushroom-classifier.onrender.com", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log("API Response:", data);

      if (data && data.predictions && Array.isArray(data.predictions)) {
        setPredictions(data.predictions);
        console.log("Predictions set:", data.predictions);
      } else if (Array.isArray(data)) {
        setPredictions(data);
        console.log("Predictions set from array:", data);
      } else {
        console.error("Unexpected response format:", data);
        setError("Unexpected response format from server");
      }
    } catch (err) {
      console.error("Prediction error:", err);

      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Cannot connect to server. Please try again later.");
      } else if (err.message.includes("CORS")) {
        setError("CORS error. Please check server configuration.");
      } else {
        setError(err.message || "Failed to classify image. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPredictions([]);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to get species image path
  const getSpeciesImagePath = (speciesName) => {
    // Convert species name to filename format (lowercase, spaces to underscores)
    const filename = speciesName.toLowerCase().replace(/\s+/g, "_");
    return `/images/${filename}.jpg`;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Navbar */}
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-8 pt-20 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8 py-6 pb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Mushroom Classifier
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Upload an image of a mushroom and let our AI identify the species
            with advanced machine learning
          </p>
        </div>

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10">
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl flex flex-col h-[450px] md:h-[550px]">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="relative group flex-1 mb-6 min-h-0"
            >
              <label
                htmlFor="fileUpload"
                className={`cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 ${
                  preview
                    ? "border-green-400"
                    : "border-gray-400 hover:border-green-400"
                }`}
              >
                {preview ? (
                  <div className="relative w-full h-full overflow-hidden rounded-lg min-h-0 bg-black/25">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full p-2 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">
                        Click to change image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <span className="text-gray-300 text-xl block mb-3">
                      Drop your image here or click to browse
                    </span>
                    <span className="text-gray-500 text-base">
                      Supports JPG, PNG, WebP up to 10MB
                    </span>
                  </div>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <button
              onClick={handleRequest}
              disabled={!file || loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                file && !loading
                  ? "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-105"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Classify Mushroom</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-medium">Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl flex flex-col min-h-[450px] md:min-h-[550px]">
            {predictions.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col space-y-3">
                  {predictions.map((prediction, idx) => {
                    const confidence = prediction.confidence * 100;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                          idx === 0
                            ? "bg-green-500/15 border-green-500/40 hover:bg-green-500/20"
                            : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start space-x-4 h-full">
                          {/* Species Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={getSpeciesImagePath(prediction.label)}
                              alt={prediction.label}
                              className="w-16 h-16 object-cover rounded-lg border border-white/20"
                              onError={(e) => {
                                // Fallback to a placeholder if image doesn't exist
                                e.target.src =
                                  "data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='64' height='64' fill='%23374151'/%3E%3Ctext x='32' y='32' text-anchor='middle' dy='0.3em' fill='%239CA3AF' font-family='Arial' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex items-center mb-2 space-x-3">
                              <Link
                                to={`/species/${encodeURIComponent(
                                  prediction.label
                                )}`}
                                className="flex-1 text-lg font-semibold text-white hover:text-green-300 transition-colors duration-200 flex items-center group overflow-hidden"
                              >
                                <span className="truncate">
                                  {prediction.label}
                                </span>
                                <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                              </Link>
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap ${
                                  confidence > 70
                                    ? "bg-green-500/30 text-green-300"
                                    : confidence > 50
                                    ? "bg-yellow-500/30 text-yellow-300"
                                    : "bg-red-500/30 text-red-300"
                                }`}
                              >
                                {confidence.toFixed(2)}%
                              </span>
                            </div>

                            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  confidence > 70
                                    ? "bg-gradient-to-r from-green-500 to-green-400"
                                    : confidence > 50
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                    : "bg-gradient-to-r from-red-500 to-red-400"
                                }`}
                                style={{ width: `${confidence}%` }}
                              ></div>
                            </div>

                            {/* Show warning for low confidence or helpful message for top prediction */}
                            {prediction.warning ? (
                              <div className="mt-auto p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-yellow-200 text-sm">
                                    {prediction.warning}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              idx === 0 && (
                                <div className="mt-auto p-3 bg-blue-600/20 border border-blue-400/50 rounded-lg">
                                  <div className="flex items-start space-x-2">
                                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-blue-200 text-sm">
                                      Likely match - For higher certainty,
                                      provide more angles showing all key
                                      mushroom parts.
                                    </p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">
                    Upload an image to see classification results
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Our AI will analyze the mushroom and provide species
                    predictions with confidence scores
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-white/10 mt-auto">
          <p className="text-gray-400 text-sm">
            Powered by advanced machine learning • Always verify with expert
            mycologists before consumption
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
