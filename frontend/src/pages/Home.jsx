import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  ImagePlus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Camera,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AmbientBackground from "../components/AmbientBackground";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastClassifiedKey, setLastClassifiedKey] = useState(null);
  const inputRef = useRef(null);

  // Convert species name to images/<species>.jpg
  const getSpeciesImagePath = (speciesName) =>
    `/images/${speciesName.toLowerCase().replace(/\s+/g, "_")}.jpg`;

  const topPrediction = useMemo(
    () => (predictions?.length ? predictions[0] : null),
    [predictions]
  );

  const currentFileKey = file
    ? `${file.name}-${file.size}-${file.lastModified || "nomtime"}`
    : null;
  const isSameImageClassified =
    !!predictions?.length &&
    currentFileKey &&
    lastClassifiedKey === currentFileKey;

  const onPickFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    hydrateFile(selected);
  };

  const hydrateFile = (blob) => {
    setFile(blob);
    setPredictions([]);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(blob);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.type.startsWith("image/")) {
      setError("Please drop an image file (JPG, PNG, or WebP).");
      return;
    }
    hydrateFile(dropped);
  };

  const onDragOver = (e) => e.preventDefault();

  const classify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        "https://ai-mushroom-classifier.duckdns.org/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      const preds = Array.isArray(data?.predictions)
        ? data.predictions
        : Array.isArray(data)
        ? data
        : null;

      if (!preds) throw new Error("Unexpected response format from server.");
      setPredictions(preds);
      if (currentFileKey) setLastClassifiedKey(currentFileKey);
    } catch (err) {
      if (err?.name === "TypeError" && String(err?.message).includes("fetch")) {
        setError("Cannot reach server. Please try again in a bit.");
      } else if (String(err?.message).toLowerCase().includes("cors")) {
        setError("CORS error. Check server configuration.");
      } else {
        setError(err?.message || "Failed to classify image.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAndPickAnother = () => {
    setPredictions([]);
    setError(null);
    setLastClassifiedKey(null);
    // Keep preview so user sees current image; immediately open picker
    inputRef.current?.click();
  };

  return (
    <main className="relative min-h-screen bg-black text-white">
      <AmbientBackground variant="about" opacity={0.2} />
      <AmbientBackground variant="home" opacity={0.4} />
      <Navbar />

      {/* Content container */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Hero */}
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="inline-flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-emerald-400" />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-lime-300 bg-clip-text text-transparent">
                AI Mushroom Classifier
              </span>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-sm/relaxed text-zinc-400 sm:text-base">
            Drop a photo. Get instant species predictions with confidence. Clean
            UI, fast feedback.
          </p>
        </header>

        {/* Main grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-2">
          {/* Left: Uploader (flex column, actions pinned bottom) */}
          <div className="flex min-h-[520px] flex-col rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_-16px_rgba(16,185,129,0.25)] sm:p-6 lg:p-7">
            {/* Drop zone grows to fill */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  inputRef.current?.click();
              }}
              className={`group relative flex flex-none
              h-[360px] sm:h-[420px] cursor-pointer flex-col items-center
              justify-center overflow-hidden rounded-2xl border-2 border-dashed
              transition-all duration-300 focus:outline-none focus:ring-2
              focus:ring-emerald-500/60 ${
                preview
                  ? "border-emerald-400/60 bg-black/30"
                  : "border-zinc-700/60 bg-zinc-900/40 hover:border-emerald-400/60"
              }`}
              onClick={() => inputRef.current?.click()}
              aria-label={preview ? "Change image" : "Upload image"}
            >
              {preview ? (
                // Keep container height fixed; image fits inside
                <div className="relative h-full w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-contain p-3"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-700/20 px-5 py-1.5 text-sm text-white ring-1 ring-inset ring-gray-200">
                      <ImagePlus className="h-4 w-4" /> Change image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 ring-1 ring-inset ring-emerald-400/30">
                      <Upload className="h-7 w-7 text-emerald-300" />
                    </div>
                    <p className="text-base font-medium text-zinc-200">
                      Drop your image here or click to upload
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      JPG, PNG, WebP — up to 10MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={inputRef}
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
              />
            </div>

            {/* Spacer so the action area stays pinned to the bottom of the card */}
            <div className="flex-1" />

            {/* Actions pinned at bottom */}
            <div className="mt-4">
              <button
                onClick={isSameImageClassified ? resetAndPickAnother : classify}
                disabled={!file || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/7 focus:outline-none focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing
                  </>
                ) : isSameImageClassified ? (
                  <>
                    <ImagePlus className="h-4 w-4" /> Pick another image
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Classify image
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Camera className="h-4 w-4" /> Better results with clear,
                close‑up photos
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-200">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 lg:p-7">
            {predictions?.length ? (
              <div className="flex h-full flex-col gap-4">
                {topPrediction && (
                  <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        to={`/species/${encodeURIComponent(
                          topPrediction.label
                        )}`}
                        className="group inline-flex items-center gap-2 text-lg font-semibold text-emerald-200 hover:text-emerald-100"
                      >
                        <Sparkles className="h-5 w-5" /> {topPrediction.label}
                        <ArrowRight className="h-4 w-4 translate-x-0 opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                      <ConfidencePill value={topPrediction.confidence * 100} />
                    </div>
                    <p className="mt-2 flex items-start gap-2 text-sm text-emerald-200/80">
                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      Likely match. For higher certainty, add more angles
                      showing cap, gills, stem, and habitat.
                    </p>
                  </div>
                )}

                <div className="flex-1" />

                <div
                  className="grid grid-cols-1 gap-3 h-full content-between pr-1 sm:gap-4"
                  style={{ maxHeight: 420 }}
                >
                  {predictions.map((p, i) => (
                    <PredictionRow
                      key={`${p.label}-${i}`}
                      data={p}
                      getImg={getSpeciesImagePath}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mx-auto mt-12 max-w-3xl text-center text-xs text-zinc-500">
          <p>
            Never consume wild mushrooms based on an app prediction. Consult a
            local mycologist.
          </p>
        </footer>
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full place-items-center">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-zinc-900 ring-1 ring-inset ring-white/10">
          <CheckCircle2 className="h-7 w-7 text-zinc-500" />
        </div>
        <p className="text-base text-zinc-300">
          Upload an image to see classification results
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          We’ll analyze your photo and return species predictions with
          confidence scores.
        </p>
      </div>
    </div>
  );
}

function PredictionRow({ data, getImg }) {
  const confidence = Math.max(0, Math.min(100, (data.confidence || 0) * 100));
  const tier = confidence >= 70 ? "high" : confidence >= 50 ? "mid" : "low";

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/7 p-4">
      <img
        src={getImg(data.label)}
        alt={data.label}
        className="h-14 w-14 flex-shrink-0 rounded-xl object-cover ring-1 ring-inset ring-white/10"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='64' height='64' fill='%230a0a0a'/%3E%3Ctext x='32' y='34' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/species/${encodeURIComponent(data.label)}`}
            className="group inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-white hover:text-emerald-200"
          >
            <span className="truncate">{data.label}</span>
            <ArrowRight className="h-4 w-4 translate-x-0 opacity-60 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
          <ConfidencePill value={confidence} compact />
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-2 rounded-full transition-[width] duration-500 ${
              tier === "high"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : tier === "mid"
                ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                : "bg-gradient-to-r from-rose-400 to-red-500"
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>

        {data.warning && (
          <div className="mt-2 inline-flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1.5 text-xs text-yellow-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{data.warning}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfidencePill({ value, compact = false }) {
  const tier = value >= 70 ? "high" : value >= 50 ? "mid" : "low";
  const label = `${value.toFixed(1)}%`;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        tier === "high"
          ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/30"
          : tier === "mid"
          ? "bg-amber-500/15 text-amber-200 ring-amber-400/30"
          : "bg-rose-500/15 text-rose-200 ring-rose-400/30"
      } ${compact ? "" : "shadow-inner shadow-black/40"}`}
    >
      {label}
    </span>
  );
}
