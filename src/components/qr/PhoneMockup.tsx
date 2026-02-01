"use client";

export default function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[260px]">
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-gray-900 rounded-b-2xl z-10" />
        <div className="bg-white rounded-[2rem] overflow-hidden relative">
          <div className="h-7 bg-white flex items-center justify-between px-5 pt-1">
            <span className="text-[9px] font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-0.5">
              <div className="flex gap-[1px]">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-[3px] bg-gray-900 rounded-[0.5px]" style={{ height: `${i * 2 + 2}px` }} />
                ))}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-900 ml-0.5" />
              <svg className="w-5 h-2.5 text-gray-900 ml-0.5" viewBox="0 0 25 12" fill="currentColor">
                <rect x="0" y="1" width="20" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1" />
                <rect x="2" y="3" width="14" height="6" rx="1" fill="currentColor" />
                <rect x="21" y="4" width="3" height="4" rx="1" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
          </div>
          <div className="h-[400px] overflow-hidden">{children}</div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-[80px] h-[4px] bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
