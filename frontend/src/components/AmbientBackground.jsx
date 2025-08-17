import React from "react";

const AmbientBackground = ({
  variant = "home",
  className = "",
  opacity = 1,
}) => {
  // ultra-light film grain (base64 SVG)
  const noiseDataUrl =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")";

  const keyframes = `
    @keyframes ab-float-slow {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50%      { transform: translate3d(12px, -10px, 0) scale(1.04); }
    }
    @keyframes ab-float-alt {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50%      { transform: translate3d(-16px, 12px, 0) scale(0.98); }
    }
    @keyframes ab-orbit {
      0%   { transform: rotate(0deg) translateX(18px) rotate(0deg); }
      50%  { transform: rotate(180deg) translateX(18px) rotate(-180deg) scale(1.02); }
      100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
    }
    @keyframes ab-breathe {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.28; }
      50%      { transform: translate(-50%, -50%) scale(1.08); opacity: 0.18; }
    }
    @keyframes ab-beam {
      0%, 100% { transform: translate3d(0,0,0) rotate(-8deg) scale(1); opacity: 0.12; }
      50%      { transform: translate3d(10px,-8px,0) rotate(-6deg) scale(1.05); opacity: 0.18; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ab-anim { animation: none !important; }
    }
  `;

  const BaseWrapper = ({ children }) => (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    >
      <style>{keyframes}</style>
      {children}
    </div>
  );

  // Shared layers: noise + faint vignette to “frame” the page nicely
  const BaseLayers = () => (
    <>
      {/* film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: noiseDataUrl,
          backgroundRepeat: "repeat",
          backgroundSize: "140px 140px",
          mixBlendMode: "soft-light",
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 rounded-none"
          style={{
            boxShadow: "inset 0 0 240px 40px rgba(0,0,0,0.22)",
          }}
        />
      </div>
    </>
  );

  const home = (
    <BaseWrapper>
      <BaseLayers />

      {/* Core emerald aura */}
      <div
        className="absolute -top-48 -left-40 w-[38rem] h-[38rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(16,185,129,0.38) 0%, rgba(16,185,129,0.16) 40%, rgba(16,185,129,0) 70%)",
          animation: "ab-float-slow 10s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Lime accent orb */}
      <div
        className="absolute -top-24 -right-28 w-[30rem] h-[30rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(163,230,53,0.30) 0%, rgba(163,230,53,0.12) 45%, rgba(163,230,53,0) 72%)",
          animation: "ab-float-alt 12s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Deep emerald base glow */}
      <div
        className="absolute -bottom-40 -right-16 w-[32rem] h-[32rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(5,150,105,0.28) 0%, rgba(5,150,105,0.14) 40%, rgba(5,150,105,0) 70%)",
          animation: "ab-float-slow 11s ease-in-out infinite reverse",
          willChange: "transform",
        }}
      />

      {/* Subtle center breathe */}
      <div
        className="absolute top-1/2 left-1/2 w-[26rem] h-[26rem] rounded-full blur-3xl ab-anim"
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(55% 55% at 50% 50%, rgba(52,211,153,0.22) 0%, rgba(52,211,153,0.10) 45%, rgba(52,211,153,0) 70%)",
          animation: "ab-breathe 14s ease-in-out infinite",
        }}
      />

      {/* Beams for extra “premium” depth */}
      <div
        className="absolute top-1/6 left-1/3 w-[70rem] h-[18rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.22) 20%, rgba(16,185,129,0.15) 50%, rgba(16,185,129,0) 80%)",
          transform: "rotate(-8deg)",
          animation: "ab-beam 16s ease-in-out infinite",
          mixBlendMode: "screen",
        }}
      />

      {/* Tiny orbiting highlight near center */}
      <div
        className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full blur-lg opacity-70 ab-anim"
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(110,231,183,0.55) 0%, rgba(110,231,183,0.15) 55%, rgba(110,231,183,0) 70%)",
          animation: "ab-orbit 18s linear infinite",
        }}
      />
    </BaseWrapper>
  );

  const search = (
    <BaseWrapper>
      <BaseLayers />

      {/* Cool cyan sweep */}
      <div
        className="absolute -top-40 left-1/4 w-[42rem] h-[26rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,184,166,0.22) 0%, rgba(6,182,212,0.14) 50%, rgba(99,102,241,0.10) 100%)",
          transform: "rotate(-12deg)",
          animation: "ab-float-slow 13s ease-in-out infinite",
        }}
      />

      {/* Emerald pillar on left */}
      <div
        className="absolute top-1/3 -left-24 w-80 h-[28rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(45% 75% at 50% 50%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.08) 50%, rgba(16,185,129,0) 80%)",
          animation: "ab-float-alt 12s ease-in-out infinite",
        }}
      />

      {/* Violet grounding glow */}
      <div
        className="absolute -bottom-24 right-1/4 w-[34rem] h-[28rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.08) 45%, rgba(139,92,246,0) 75%)",
          animation: "ab-float-slow 10s ease-in-out infinite reverse",
        }}
      />

      {/* Soft grid overlay for “exploration” feel */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />
    </BaseWrapper>
  );

  const about = (
    <BaseWrapper>
      <BaseLayers />

      {/* Warm amber crown */}
      <div
        className="absolute -top-48 left-1/3 w-[34rem] h-[34rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(245,158,11,0.22) 0%, rgba(245,158,11,0.10) 45%, rgba(245,158,11,0) 75%)",
          animation: "ab-float-slow 16s ease-in-out infinite",
        }}
      />

      {/* Soft terracotta base */}
      <div
        className="absolute top-1/2 -left-40 w-[30rem] h-[42rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(50% 70% at 50% 50%, rgba(234,88,12,0.16) 0%, rgba(234,88,12,0.08) 50%, rgba(234,88,12,0) 80%)",
          transform: "rotate(35deg)",
          animation: "ab-float-alt 18s ease-in-out infinite",
        }}
      />

      {/* Herb green lift */}
      <div
        className="absolute -bottom-48 right-1/3 w-[40rem] h-[28rem] rounded-full blur-3xl ab-anim"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(34,197,94,0.14) 0%, rgba(34,197,94,0.08) 45%, rgba(34,197,94,0) 75%)",
          animation: "ab-float-slow 14s ease-in-out infinite reverse",
        }}
      />

      {/* Gentle center pulse */}
      <div
        className="absolute top-2/3 left-1/2 w-[26rem] h-[26rem] rounded-full blur-3xl ab-anim"
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(55% 55% at 50% 50%, rgba(250,204,21,0.18) 0%, rgba(250,204,21,0.08) 45%, rgba(250,204,21,0) 70%)",
          animation: "ab-breathe 20s ease-in-out infinite",
        }}
      />
    </BaseWrapper>
  );

  const minimal = (
    <BaseWrapper>
      <BaseLayers />
      <div
        className="absolute top-1/4 left-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl ab-anim"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.08) 40%, rgba(16,185,129,0) 70%)",
          animation: "ab-breathe 16s ease-in-out infinite",
        }}
      />
    </BaseWrapper>
  );

  const variants = { home, search, about, minimal };
  return variants[variant] || variants.home;
};

export default AmbientBackground;
