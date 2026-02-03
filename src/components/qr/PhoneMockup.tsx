"use client";

export default function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px]">
      {/* Outer glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-b from-violet-500/20 via-purple-500/10 to-transparent rounded-[3rem] blur-2xl" />

      {/* Phone frame - clean minimal design */}
      <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[2.5rem] p-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
        {/* Screen container */}
        <div className="bg-white rounded-[2rem] overflow-hidden relative">
          {/* Minimal notch/island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
            <div className="w-20 h-6 bg-black rounded-full" />
          </div>

          {/* Content area - full height, no status bar */}
          <div className="h-[500px] overflow-hidden bg-gray-50 pt-10">
            {children}
          </div>

          {/* Home indicator */}
          <div className="h-6 flex items-center justify-center bg-white">
            <div className="w-24 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
