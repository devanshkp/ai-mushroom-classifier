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
  XCircle,
  CheckCircle2,
} from "lucide-react";
import AmbientBackground from "../components/AmbientBackground";
import { motion, AnimatePresence } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function SpeciesList() {
  const { loading, error, searchMushrooms } = useMushroomData();
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
    <main className="relative min-h-screen flex flex-col bg-[hsl(0_0_2)] text-white">
      <AmbientBackground variant="search" opacity={0.9} />

      <section className="relative z-10 mx-auto max-w-screen md:max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8">
        {/* Compact header */}
        <header className="mx-auto md:mt-4   max-w-3xl text-center">
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
              className="w-full rounded-4xl border-white/10 bg-white/4 px-12 py-4 text-base text-white shadow-inner ring-1 ring-inset ring-white/10 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length ? (
          <>
            {/* Mobile: compact list */}
            <ul className="mt-6 space-y-4 md:hidden max-w-screen">
              {filtered.map((m) => (
                <li key={m.scientific_name}>
                  <MobileSpeciesRow data={m} />
                </li>
              ))}
            </ul>

            {/* Desktop+: card grid */}
            <ul className="mt-8 hidden grid-cols-1 gap-5 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((m) => (
                <li key={m.scientific_name}>
                  <DesktopSpeciesCard data={m} />
                </li>
              ))}
            </ul>
          </>
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
      </section>

      <footer className="mx-auto mt-4 md:mt-12 mb-4 md:mb-8 max-w-3xl text-center text-xs text-zinc-500">
        Explore the fascinating world of fungi. Data for educational use only.
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="backToTop"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.18 },
            }}
            exit={{
              opacity: 0,
              y: 12,
              scale: 0.96,
              transition: { duration: 0.16 },
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="
              fixed z-50 pointer-events-auto
              bottom-[calc(1rem+env(safe-area-inset-bottom))]
              right-[calc(1rem+env(safe-area-inset-right))]
              inline-flex items-center justify-center
              h-12 w-12 rounded-full
              bg-white/6 backdrop-blur-md
              ring-1 ring-inset ring-white/15
              shadow-[0_6px_24px_-8px_rgba(0,0,0,0.45)]
              transition-colors
              hover:bg-white/8 active:bg-white/10
              focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50
            "
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <span
              aria-hidden
              className="block h-3 w-3 rotate-45 border-t-2 border-l-2 mt-1 border-white/80"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}

function MobileSpeciesRow({ data }) {
  const names = data.common_name
    ? data.common_name.split(",").map((n) => n.trim())
    : [];
  const primary = names[0] || data.scientific_name;
  const secondary = names[0] ? data.scientific_name : names.slice(1).join(", ");
  const ed = tierFromEdibility(data.edibility);

  return (
    <Link
      to={`/species/${encodeURIComponent(data.scientific_name)}`}
      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 active:bg-white/7 w-full min-w-0"
    >
      {/* Fixed safe thumb size prevents overflow */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-900">
        {data.image_path ? (
          <img
            src={data.image_path}
            alt={primary}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-zinc-600">
            <Sprout className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 flex flex-col items-start overflow-hidden">
        <div className="w-full overflow-hidden">
          <h3 className="truncate text-[18px] font-semibold w-full">
            {primary}
          </h3>
          {secondary && (
            <p className="line-clamp-1 text-sm italic text-zinc-400 w-full overflow-hidden text-ellipsis">
              {secondary}
            </p>
          )}
        </div>
        {ed && (
          <div className="flex justify-start mt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-semibold ring-1 ring-inset ${ed.bg} ${ed.ring} ${ed.text} whitespace-nowrap`}
            >
              <ed.icon className="h-3 w-3" /> {ed.label}
            </span>
          </div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-500 flex-shrink-0" />
    </Link>
  );
}

function DesktopSpeciesCard({ data }) {
  const names = data.common_name
    ? data.common_name.split(",").map((n) => n.trim())
    : [];
  const primary = names[0] || data.scientific_name;
  const secondary = names[0] ? data.scientific_name : names.slice(1).join(", ");
  const ed = tierFromEdibility(data.edibility);
  const glow = (ed && ed.glow) || "emerald";

  return (
    <Link
      to={`/species/${encodeURIComponent(data.scientific_name)}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-colors hover:bg-white/7"
    >
      {/* enclosed, subtle glow */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowClass(
          glow
        )} to-transparent opacity-60`}
      />

      {/* Fixed aspect prevents massive vertical cards; object-cover keeps image tidy */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        {data.image_path ? (
          <LazyLoadImage
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="relative p-4">
        <div className="mb-1 flex items-center gap-3">
          <h3 className="min-w-0 flex-1 truncate text-base font-semibold">
            {primary}
          </h3>
          {ed && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${ed.bg} ${ed.ring} ${ed.text}`}
            >
              <ed.icon className="h-3.5 w-3.5" /> {ed.label}
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
      icon: XCircle,
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
      icon: CheckCircle2,
      text: "text-emerald-200",
      bg: "bg-emerald-500/15",
      ring: "ring-emerald-400/30",
      glow: "emerald",
    };
  if (lower.includes("edible"))
    return {
      label: "Caution",
      icon: Shield,
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
