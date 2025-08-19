import AmbientBackground from "../components/AmbientBackground";
import { ShieldAlert, Sparkles, ExternalLink, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-[hsl(0_0_2)] text-white">
      <AmbientBackground variant="about" opacity={0.3} />

      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        {/* Header – compact, cleaner */}
        <header className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              About
            </p>
            <h1 className="mt-0.5 text-[26px] font-semibold tracking-tight sm:text-[28px]">
              MushroomAI
            </h1>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">
                A calm, responsible guide to help you explore fungi through
                computer vision.
              </p>
              <span className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-400/20 bg-emerald-600/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 sm:self-auto">
                <Sparkles className="h-4 w-4" /> AI-assisted identification
              </span>
            </div>
          </div>
        </header>

        {/* Grid – 12-col layout with subtle internal glows */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Row 1 */}

          <Card className="lg:col-span-7" title="How it works" glow="purple">
            <ol className="list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-zinc-300">
              <li>Upload a clear photo (cap, gills/pores, stem, habitat).</li>
              <li>The model returns top matches with confidence.</li>
              <li>
                Open a species for identification cues, habitat, and notes.
              </li>
              <li> Compare lookalikes to avoid common misidentifications. </li>
              <li>
                Use this tool as a guide — never a substitute for expert advice.
              </li>
            </ol>
          </Card>

          <Card className="lg:col-span-5" title="Tech stack" glow="cyan">
            <SectionRow label="Frontend" value="React, Tailwind, Framer" />
            <SectionRow label="Backend" value="Flask (Python)" />
            <SectionRow
              label="Model"
              value="TensorFlow/Keras + transfer learning"
            />
            <SectionRow label="Data" value="Kaggle dataset" isLink={true} />
          </Card>

          {/* Row 2 */}
          <Card className="lg:col-span-12" title="Mission" glow="emerald">
            <p className="text-[15px] leading-relaxed text-zinc-300">
              Make mushroom identification more accessible and engaging—without
              compromising on safety. Upload a photo, get likely matches with
              confidence scores, then dive into a clear species guide.
            </p>
          </Card>

          <Card className="lg:col-span-12 flex-row" glow="amber">
            <div className="flex flex-wrap justify-between items-center">
              <p className="text-[15px] leading-relaxed text-zinc-300">
                Built by{" "}
                <span className="font-semibold text-white">Devansh Kapoor</span>
                .
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://github.com/devanshkp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/7"
                >
                  Github <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://linkedin.com/in/devansh-kapoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/7"
                >
                  LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="mailto:hello@devansh.kp@outlook.com"
                  className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition-colors hover:bg-white/7"
                >
                  Email <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Card>

          {/* Full-width safety banner */}
          <Safety className="lg:col-span-12" />

          {/* Row 3 */}
          <Card className="lg:col-span-6" title="Model details" glow="pink">
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-zinc-300">
              <li>MobileNetV2 backbone; fine‑tuned for 100 species.</li>
              <li>Custom head with GAP, BatchNorm, Dense, Dropout.</li>
              <li>~80% test accuracy (varies by photo quality and angle).</li>
            </ul>
          </Card>

          <Card className="lg:col-span-6" title="Roadmap" glow="indigo">
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-zinc-300">
              <li>Feedback on predictions to improve the model.</li>
              <li>Local history for your classification sessions.</li>
              <li>Better guidance on capturing helpful photos.</li>
            </ul>
          </Card>
        </div>
      </section>
      <footer className="mx-auto mt-4 md:mt-12 mb-4 md:mb-8 max-w-3xl text-center text-xs text-zinc-500">
        Enjoy exploring the world of mushrooms—and always prioritise safety and
        expert verification.
      </footer>
    </main>
  );
}

function Card({ title, children, className = "", glow }) {
  const glowColors = {
    emerald: "bg-gradient-to-br from-emerald-500/4 to-transparent",
    cyan: "bg-gradient-to-br from-cyan-500/4 to-transparent",
    purple: "bg-gradient-to-br from-purple-500/4 to-transparent",
    amber: "bg-gradient-to-br from-amber-500/4 to-transparent",
    pink: "bg-gradient-to-br from-pink-500/4 to-transparent",
    indigo: "bg-gradient-to-br from-indigo-500/4 to-transparent",
  };

  return (
    <section
      className={`relative rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 ${className} flex flex-col overflow-hidden`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${glowColors[glow]} opacity-60`}
      />
      <header className="relative mb-2 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </header>
      <div className="relative min-h-0 flex-1">{children}</div>
    </section>
  );
}

function SectionRow({ label, value, isLink = false }) {
  return (
    <div className="grid grid-cols-12 items-center border-t border-white/10 py-2 first:border-t-0">
      <span className="col-span-5 text-[11px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {isLink ? (
        <a
          href="https://www.kaggle.com/datasets/thehir0/mushroom-species/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-end col-span-7 truncate text-right text-sm text-zinc-300 underline gap-2"
        >
          {value} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="col-span-7 truncate text-right text-sm text-zinc-300">
          {value}
        </span>
      )}
    </div>
  );
}

function Safety({ className = "" }) {
  return (
    <section
      className={`rounded-3xl border-l-4 border-rose-500 bg-rose-500/15 p-5 md:p-6 ${className}`}
    >
      <header className="mb-1.5 flex items-center gap-2 text-rose-200">
        <ShieldAlert className="h-5 w-5" />
        <h2 className="text-base font-semibold">Critical safety notice</h2>
      </header>
      <p className="text-[15px] leading-relaxed text-rose-100/90">
        This tool is for educational use only and offers preliminary
        identification. Never rely solely on app output to decide
        edibility—misidentification can be fatal. Always consult local
        mycologists and multiple field guides.
      </p>
    </section>
  );
}
