import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMushroomData } from "../context/MushroomDataContext";
import {
  Search,
  Sprout,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Info,
  Shield,
  ArrowUp,
} from "lucide-react";
import Navbar from "../components/Navbar";
import AmbientBackground from "../components/AmbientBackground";

export default function SpeciesList() {
  const { mushrooms, loading, error, searchMushrooms } = useMushroomData();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showTop, setShowTop] = useState(false);

  // debounce the query for snappier UX
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 180);
    return () => clearTimeout(t);
  }, [query]);

  // back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = useMemo(() => {
    if (loading) return [];
    return searchMushrooms(debounced);
  }, [loading, debounced, searchMushrooms]);

  if (loading)
    return (
      <CenteredState
        title="Loading species"
        subtitle="Fetching the catalogue"
        icon={<Loader2 className="h-10 w-10 animate-spin text-emerald-400" />}
      />
    );

  if (error)
    return (
      <CenteredState
        title="Error loading species"
        subtitle={String(error)}
        icon={<AlertTriangle className="h-10 w-10 text-rose-400" />}
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );

  return (
    <main className="relative min-h-screen bg-black text-white">
      <AmbientBackground variant="search" />
      <Navbar />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        {/* Compact header */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Library
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Mushroom Species
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
            Browse 100 species. Search by scientific or common name.
          </p>
        </header>

        {/* Search */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="group relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              placeholder="Search species…"
              className="w-full rounded-2xl border border-white/10 bg-zinc-950/60 px-12 py-4 text-base text-white shadow-inner ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:border-emerald-400/40 focus:outline-none focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length ? (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((m) => (
              <li key={m.scientific_name}>
                <SpeciesCard data={m} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No species found"
            subtitle={
              debounced
                ? "Try a different search term or clear the search."
                : "There are no species available in the database yet."
            }
            action={
              debounced
                ? { label: "Clear search", onClick: () => setQuery("") }
                : undefined
            }
          />
        )}

        <footer className="mx-auto mt-14 max-w-3xl text-center text-xs text-zinc-500">
          Explore the fascinating world of fungi. Data for educational use only.
        </footer>
      </section>

      {/* Back to top */}
      {showTop && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/20 backdrop-blur-sm transition-transform hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </main>
  );
}

function SpeciesCard({ data }) {
  const names = data.common_name
    ? data.common_name.split(",").map((n) => n.trim())
    : [];
  const primary = names[0] || data.scientific_name;
  const secondary = names[0] ? data.scientific_name : names.slice(1).join(", ");

  const edibility = tierFromEdibility(data.edibility);
  const glow = (edibility && edibility.glow) || "emerald"; // restrained palette

  return (
    <Link
      to={`/species/${encodeURIComponent(data.scientific_name)}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-colors hover:bg-white/7"
    >
      {/* Internal, enclosed glow (subtle) */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowClass(
          glow
        )} to-transparent opacity-60`}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        {data.image_path ? (
          <img
            src={data.image_path}
            alt={primary}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="grid h-full place-items-center text-zinc-600">
            <Sprout className="h-10 w-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-90" />
      </div>

      <div className="relative p-4">
        {/* Title row with edibility on the right */}
        <div className="mb-1 flex items-center gap-3">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-white">
            {primary}
          </h3>
          {edibility && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${edibility.bg} ${edibility.ring} ${edibility.text}`}
            >
              <Shield className="h-3.5 w-3.5" /> {edibility.label}
            </span>
          )}
        </div>
        {secondary && (
          <p className="line-clamp-1 text-xs italic text-zinc-400">
            {secondary}
          </p>
        )}
        <div className="mt-3 flex items-center justify-end text-emerald-300">
          <span className="mr-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
            View
          </span>
          <ChevronRight className="h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function glowClass(key) {
  switch (key) {
    case "rose":
      return "from-rose-500/6";
    case "amber":
      return "from-amber-500/6";
    default:
      return "from-emerald-500/6"; // emerald
  }
}

function tierFromEdibility(ed) {
  if (!ed) return null;
  const lower = ed.toLowerCase();
  if (lower.includes("toxic") || lower.includes("poison"))
    return {
      label: "Toxic",
      text: "text-rose-200",
      bg: "bg-rose-500/15",
      ring: "ring-rose-400/30",
      glow: "rose",
    };
  if (
    lower.includes("edible") &&
    (lower.includes("good") || lower.includes("excellent"))
  )
    return {
      label: "Edible",
      text: "text-emerald-200",
      bg: "bg-emerald-500/15",
      ring: "ring-emerald-400/30",
      glow: "emerald",
    };
  if (lower.includes("edible"))
    return {
      label: "Caution",
      text: "text-amber-200",
      bg: "bg-amber-500/15",
      ring: "ring-amber-400/30",
      glow: "amber",
    };
  return null;
}

function CenteredState({ title, subtitle, icon, action }) {
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

function EmptyState({ title, subtitle, action }) {
  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center ring-1 ring-inset ring-white/10">
      <Info className="mx-auto mb-3 h-10 w-10 text-zinc-500" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-600/30"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
