"use client";

import { type ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Phone outer shell */}
      <div className="relative w-[280px] h-[572px] sm:w-[300px] sm:h-[612px] lg:w-[320px] lg:h-[652px] rounded-[48px] bg-[#0a0a0a] border-[3px] border-[#2a2a2a] phone-frame-shadow overflow-hidden">
        {/* Dynamic Island */}
        <div className="dynamic-island" />

        {/* Status bar */}
        <div className="phone-status-bar">
          <span className="text-white/80 text-[11px] font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal bars */}
            <div className="flex gap-[2px] items-end">
              <div className="w-[3px] h-[4px] bg-white/80 rounded-[1px]" />
              <div className="w-[3px] h-[6px] bg-white/80 rounded-[1px]" />
              <div className="w-[3px] h-[8px] bg-white/80 rounded-[1px]" />
              <div className="w-[3px] h-[10px] bg-white/40 rounded-[1px]" />
            </div>
            {/* WiFi */}
            <div className="w-[14px] h-[10px] flex items-end justify-center">
              <div className="w-2 h-2 border-t-2 border-l-2 border-r-2 border-white/80 rounded-t-full" />
            </div>
            {/* Battery */}
            <div className="flex items-center gap-[2px]">
              <div className="w-[22px] h-[10px] rounded-[3px] border border-white/50 p-[1.5px]">
                <div className="w-[65%] h-full bg-white/80 rounded-[1.5px]" />
              </div>
              <div className="w-[1.5px] h-[4px] bg-white/40 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Screen content area */}
        <div className="absolute inset-0 top-[54px] bottom-[34px] overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 left-0 right-0 pb-2">
          <div className="phone-home-indicator" />
        </div>
      </div>
    </div>
  );
}
