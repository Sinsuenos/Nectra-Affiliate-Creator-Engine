"use client";

/**
 * NectarOrbs — restrained multi-color ambient light for Nectar's visual identity.
 * The colors stay soft so content remains primary while the interface feels alive.
 */
export function NectarOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-[0.08] blur-[120px]"
        style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[18%] -left-48 h-[520px] w-[520px] rounded-full opacity-[0.055] blur-[110px]"
        style={{ background: "radial-gradient(circle, #d946ef 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 right-[18%] h-[500px] w-[500px] rounded-full opacity-[0.045] blur-[110px]"
        style={{ background: "radial-gradient(circle, #a3e635 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.025] blur-[140px]"
        style={{ background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)" }}
      />
    </div>
  );
}
