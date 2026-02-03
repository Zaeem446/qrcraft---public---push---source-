"use client";

export default function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px]">
      {/* Outer glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-b from-violet-500/20 via-purple-500/10 to-transparent rounded-[3.5rem] blur-2xl" />

      {/* Phone frame */}
      <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[2.75rem] p-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset]">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20">
          <div className="w-[100px] h-[28px] bg-black rounded-full flex items-center justify-center gap-2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-900 ring-1 ring-gray-700" />
            <div className="w-[8px] h-[8px] rounded-full bg-gradient-to-br from-gray-700 to-gray-800" />
          </div>
        </div>

        {/* Screen container */}
        <div className="bg-white rounded-[2.25rem] overflow-hidden relative shadow-[0_0_0_1px_rgba(0,0,0,0.1)]">
          {/* Status bar */}
          <div className="h-12 bg-white flex items-end justify-between px-6 pb-1 pt-7 relative z-10">
            <span className="text-[13px] font-semibold text-gray-900 tracking-tight">9:41</span>
            <div className="flex items-center gap-1">
              {/* Signal bars */}
              <div className="flex gap-[2px] items-end">
                {[4, 6, 8, 10].map((h, i) => (
                  <div key={i} className="w-[3px] bg-gray-900 rounded-[1px]" style={{ height: `${h}px` }} />
                ))}
              </div>
              {/* WiFi icon */}
              <svg className="w-4 h-4 text-gray-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-4c2.2 0 4 1.8 4 4h-2c0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.2 1.8-4 4-4zm0-4c3.3 0 6 2.7 6 6h-2c0-2.2-1.8-4-4-4s-4 1.8-4 4H6c0-3.3 2.7-6 6-6zm0-4c4.4 0 8 3.6 8 8h-2c0-3.3-2.7-6-6-6s-6 2.7-6 6H4c0-4.4 3.6-8 8-8z"/>
              </svg>
              {/* Battery */}
              <div className="flex items-center ml-1">
                <div className="w-[22px] h-[11px] rounded-[3px] border-[1.5px] border-gray-900 flex items-center p-[2px]">
                  <div className="w-[14px] h-[5px] bg-gray-900 rounded-[1px]" />
                </div>
                <div className="w-[1.5px] h-[4px] bg-gray-900 rounded-r-sm ml-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="h-[420px] overflow-hidden bg-gray-50">{children}</div>

          {/* Home indicator */}
          <div className="h-8 flex items-center justify-center bg-white">
            <div className="w-[100px] h-[5px] bg-gray-900 rounded-full" />
          </div>
        </div>

        {/* Side buttons - subtle details */}
        <div className="absolute -left-[2px] top-28 w-[3px] h-8 bg-gray-700 rounded-l-sm" />
        <div className="absolute -left-[2px] top-40 w-[3px] h-14 bg-gray-700 rounded-l-sm" />
        <div className="absolute -left-[2px] top-56 w-[3px] h-14 bg-gray-700 rounded-l-sm" />
        <div className="absolute -right-[2px] top-36 w-[3px] h-16 bg-gray-700 rounded-r-sm" />
      </div>
    </div>
  );
}
