"use client";

/**
 * NectarOrbs — subtle animated background gradient orbs
 * placed behind page content for visual depth.
 */
export function NectarOrbs() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Primary orb — top-right electric glow */}
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
      />
      {/* Secondary orb — bottom-left dimmer glow */}
      <div
        className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-[0.04] blur-[100px]"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
      />
      {/* Tertiary — centre subtle wash */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-[0.025] blur-[140px]"
        style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
      />
    </div>
  );
}
