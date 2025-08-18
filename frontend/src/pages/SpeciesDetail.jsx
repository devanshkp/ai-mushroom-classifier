import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Camera,
  Shield,
  Maximize2,
  XCircle as CloseIcon,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useMushroomData } from "../context/MushroomDataContext";
import Navbar from "../components/Navbar";
import AmbientBackground from "../components/AmbientBackground";

export default function SpeciesDetail() {
  const { scientificName } = useParams();
  const navigate = useNavigate();

  const [mushroom, setMushroom] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { getMushroomByScientificName, loading, error } = useMushroomData();

  useEffect(() => {
    if (!loading && scientificName) {
      const found = getMushroomByScientificName(scientificName);
      setMushroom(found);
      setImageError(false);
    }
  }, [scientificName, loading, getMushroomByScientificName]);

  const commonNames = useMemo(
    () =>
      mushroom?.common_name
        ? mushroom.common_name.split(",").map((n) => n.trim())
        : [],
    [mushroom]
  );

  const edibilityInfo = useMemo(
    () => getEdibilityInfo(mushroom?.edibility),
    [mushroom]
  );
  const EdibilityIcon = edibilityInfo.icon;

  // Shared shells
  if (loading)
    return (
      <CenteredState
        icon={
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500/70 border-t-transparent" />
        }
        title="Loading"
        subtitle="Fetching species details..."
      />
    );

  if (error)
    return (
      <CenteredState
        icon={<AlertTriangle className="h-14 w-14 text-rose-400" />}
        title="Error loading data"
        subtitle={String(error)}
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );

  if (!mushroom)
    return (
      <CenteredState
        icon={<AlertTriangle className="h-14 w-14 text-amber-400" />}
        title="Species not found"
        subtitle={`We couldn't find "${scientificName}" in the database.`}
        action={{ label: "Go back", onClick: () => navigate(-1) }}
      />
    );

  return (
    <main className="relative min-h-screen flex flex-col bg-[hsl(0_0_2)] text-white">
      <Navbar />
      <AmbientBackground variant="mushroom" />
      <AmbientBackground variant="about" opacity={0.2} />
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-white/15 bg-[rgb(20_20_20/0.8)] p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
            {/* Image */}
            <div className="lg:col-span-2">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
                {!imageError && mushroom.image_path ? (
                  <>
                    {/* soft blur backdrop */}
                    <div
                      className="absolute inset-0 scale-110 bg-cover bg-center blur-md"
                      style={{ backgroundImage: `url(${mushroom.image_path})` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <img
                      src={mushroom.image_path}
                      alt={commonNames[0] || mushroom.scientific_name}
                      className="relative z-10 h-full w-full object-contain p-2"
                      onError={() => setImageError(true)}
                    />
                    <button
                      title="Expand"
                      onClick={() => setShowImageModal(true)}
                      className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-xl bg-black/70 px-3 py-1.5 text-sm text-white opacity-0 ring-1 ring-inset ring-white/20 transition-all hover:bg-black/90 group-hover:opacity-100"
                    >
                      <Maximize2 className="h-4 w-4" /> View
                    </button>
                    <div
                      className="absolute inset-0"
                      onClick={() => setShowImageModal(true)}
                    />
                  </>
                ) : (
                  <div className="grid h-full place-items-center p-6 text-center text-zinc-500">
                    <div>
                      <Camera className="mx-auto mb-3 h-14 w-14 opacity-60" />
                      <p className="text-base font-medium">
                        Image not available
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {commonNames[0] || mushroom.scientific_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title & quick facts */}
            <div className="flex min-h-full flex-col justify-between lg:col-span-3 b">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  {mushroom.scientific_name}
                </h1>
                {commonNames.length ? (
                  <div className="mt-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                      Also known as
                    </span>
                    <p className="mt-1 text-base italic text-zinc-300 sm:text-lg">
                      {commonNames.join(" • ")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm italic text-zinc-400">
                    (No common names listed)
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div
                  className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 ring-inset ${edibilityInfo.badge}`}
                >
                  <EdibilityIcon className="h-5 w-5" /> {edibilityInfo.status}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Type" value={mushroom.type || "Fungus"} />
                  <StatCard
                    label="Edibility"
                    value={mushroom.edibility || "Unknown"}
                    rightIcon={
                      <Shield className={`h-4 w-4 ${edibilityInfo.text}`} />
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Card title="Identification" glow="emerald">
            <p className="text-sm text-zinc-300 sm:text-base">
              {mushroom.description || "No description available."}
            </p>
          </Card>

          <Card title="Habitat & Ecology" glow="emerald">
            <p className="text-sm text-zinc-300 sm:text-base">
              {mushroom.habitat || "Habitat information not available."}
            </p>
          </Card>

          <Card title="Important Notes" variant="warning" glow="amber">
            <p className="text-sm text-amber-100 sm:text-base">
              {mushroom.notes || "—"}
            </p>
          </Card>

          <Card title="Additional Information" glow="emerald">
            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 p-4">
                <h3 className="text-sm font-semibold">
                  Scientific Classification
                </h3>
                <p className="mt-1 text-sm italic text-zinc-300">
                  {mushroom.scientific_name}
                </p>
              </div>
              {mushroom.type && (
                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="text-sm font-semibold">Mushroom Type</h3>
                  <p className="mt-1 text-sm text-zinc-300">{mushroom.type}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Safety banner */}
        <div className="mt-8 rounded-2xl border-l-4 border-rose-500 bg-rose-500/15 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 text-rose-300" />
            <div>
              <h3 className="text-lg font-semibold text-rose-200">
                Safety Warning
              </h3>
              <p className="mt-1 text-sm text-rose-100/90">
                Never consume wild mushrooms based solely on digital
                identification. Always consult expert mycologists and multiple
                field guides. Misidentification can be fatal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-4 md:mt-12 mb-4 md:mb-8 max-w-3xl text-center text-xs text-zinc-500">
        Information is for educational purposes only. Always verify with local
        experts.
      </footer>

      {showImageModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-h-[80vh] max-w-3xl">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -right-4 -top-10 rounded-full p-1 text-zinc-200 transition-colors hover:text-white"
              aria-label="Close"
            >
              <CloseIcon className="h-7 w-7" />
            </button>
            <img
              src={mushroom.image_path}
              alt={commonNames[0] || mushroom.scientific_name}
              className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </main>
  );
}

// === UI helpers ===
function Card({ title, children, variant, glow = "emerald" }) {
  // limited palette for subtle variation
  const glowColors = {
    emerald: "from-emerald-500/0",
    amber: "from-amber-500/4",
  };

  const base =
    "relative rounded-3xl border bg-[rgb(20_20_20/0.8)] p-5 sm:p-6 lg:p-7 overflow-hidden";
  const chrome =
    variant === "warning"
      ? "border-amber-400/30 ring-1 ring-inset ring-amber-400/20 bg-amber-500/10"
      : "border-white/10 ring-1 ring-inset ring-white/10";

  return (
    <section className={`${base} ${chrome}`}>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowColors[glow]} to-transparent`}
      />
      <header className="relative mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
      </header>
      <div className="relative">{children}</div>
    </section>
  );
}

function StatCard({ label, value, rightIcon }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
      <div>
        <p className="text-[11px] font-regular uppercase tracking-widest text-zinc-500 md:pb-2">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-white sm:text-base">
            {value}
          </p>
          {rightIcon}
        </div>
      </div>
    </div>
  );
}

function CenteredState({ icon, title, subtitle, action }) {
  return (
    <main className="grid min-h-screen place-items-center bg-black text-white">
      <div className="mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-zinc-900 ring-1 ring-inset ring-white/10">
          {icon}
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-600/30"
          >
            {action.label}
          </button>
        )}
      </div>
    </main>
  );
}

function getEdibilityInfo(edibility) {
  if (!edibility) {
    return {
      icon: AlertTriangle,
      status: "Unknown",
      text: "text-amber-300",
      badge: "text-amber-200 bg-amber-500/15 ring-amber-400/30",
    };
  }
  const lower = edibility.toLowerCase();
  if (lower.includes("toxic") || lower.includes("poison")) {
    return {
      icon: XCircle,
      status: "Toxic",
      text: "text-rose-300",
      badge: "text-rose-200 bg-rose-500/15 ring-rose-400/30",
    };
  }
  if (
    lower.includes("edible") &&
    (lower.includes("good") || lower.includes("excellent"))
  ) {
    return {
      icon: CheckCircle2,
      status: "Safe to Eat",
      text: "text-emerald-300",
      badge: "text-emerald-200 bg-emerald-500/15 ring-emerald-400/30",
    };
  }
  if (lower.includes("edible")) {
    return {
      icon: Info,
      status: "Edible with Caution",
      text: "text-amber-300",
      badge: "text-amber-200 bg-amber-500/15 ring-amber-400/30",
    };
  }
  return {
    icon: AlertTriangle,
    status: "Unknown",
    text: "text-amber-300",
    badge: "text-amber-200 bg-amber-500/15 border-amber-400/30",
  };
}
