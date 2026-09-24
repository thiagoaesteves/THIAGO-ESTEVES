import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1222] text-[#AFC0FF] py-8 border-t border-[#262A3D]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-code text-xs uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-5 flex-shrink-0"
              viewBox="0 0 23.95 18"
              fill="none"
              aria-hidden="true"
            >
              <g transform="translate(-1.582 -4.548) scale(0.33052)">
                <path
                  d="m16.65 14.92-11.29 11.21c-1.23 1.2-0.35 3.04 1.36 3.04h21.32c1.09 0 2.12-0.46 2.88-1.23l14.08-14.18h-25.71c-1.02 0-1.94 0.46-2.64 1.16z"
                  fill="#AFC0FF"
                />
                <path
                  d="m75.51 13.76h-25.59c-1.18 0-2.31 0.49-3.14 1.33l-11.64 11.67c-0.79 0.75-1.15 1.85-1.15 2.92v36.57c0 1.84 1.92 2.6 3.2 1.37l9.83-9.66c0.7-0.7 1-1.6 1-2.58v-26.21h14.67c1.13 0 2.15-0.54 2.95-1.35l11.04-10.97c1.15-1.14 0.39-3.09-1.17-3.09z"
                  fill="#AFC0FF"
                />
              </g>
            </svg>
            <span className="text-white font-medium">
              Thiago Esteves · Creative Copywriter &amp; Transmídia Storyteller
            </span>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-[#6B7CBA] text-[11px] font-mono-code">
              © 2026 Thiago Esteves · All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
