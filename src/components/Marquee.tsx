import React from 'react';
import { ALL_BRANDS } from '../data/cases';

export const Marquee: React.FC = () => {
  return (
    <div
      aria-label="Marcas atendidas"
      className="bg-[#0F1222] text-[#F6F7F2] overflow-hidden py-4 border-y border-[#262A3D] select-none"
    >
      <div className="animate-marquee items-center text-lg sm:text-xl font-bold tracking-tight font-disp">
        {/* First repetition */}
        <div className="flex items-center gap-6 pr-6">
          {ALL_BRANDS.map((brand, i) => (
            <React.Fragment key={`b1-${i}`}>
              <span className="hover:text-[#D4FF3A] transition-colors whitespace-nowrap">
                {brand}
              </span>
              <span className="text-[#D4FF3A] text-xs font-serif-it" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
        {/* Second repetition for seamless continuous loop */}
        <div className="flex items-center gap-6 pr-6">
          {ALL_BRANDS.map((brand, i) => (
            <React.Fragment key={`b2-${i}`}>
              <span className="hover:text-[#D4FF3A] transition-colors whitespace-nowrap">
                {brand}
              </span>
              <span className="text-[#D4FF3A] text-xs font-serif-it" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
