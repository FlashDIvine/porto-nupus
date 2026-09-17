'use client'

import React from 'react'

/**
 * Pure SVG Art-Style Seagull Silhouette
 * Fill: #FFFFFF with soft maritime drop-shadow
 */
export function SeagullSvg({
  className = '',
  wingDuration = '1.4s',
}: {
  className?: string
  wingDuration?: string
}) {
  return (
    <svg
      viewBox="0 0 110 50"
      className={`overflow-visible select-none drop-shadow-[0_3px_6px_rgba(14,38,62,0.16)] ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <g fill="#FFFFFF">
        {/* Far Wing (Background) */}
        <g
          className="origin-[44px_22px]"
          style={{
            animation: `seagullFlapFar ${wingDuration} ease-in-out infinite alternate`,
            opacity: 0.85,
          }}
        >
          <path d="M 44 22 C 30 13, 14 7, -18 5 C 4 13, 26 19, 44 22 Z" />
        </g>

        {/* Streamlined Torso, Head, Beak & Trailing Tail */}
        <path
          d="M 86 24 C 83 22, 76 21, 67 22 C 54 23, 38 29, 20 35 C 6 40, -4 45, 0 43 C 12 39, 28 32, 46 29 C 60 27, 70 28, 76 27 C 80 26, 83 26, 86 24 Z"
          style={{
            animation: `seagullBob ${wingDuration} ease-in-out infinite`,
          }}
        />

        {/* Near Wing (Foreground) with iconic high-aspect-ratio gull curvature */}
        <g
          className="origin-[50px_25px]"
          style={{
            animation: `seagullFlapNear ${wingDuration} ease-in-out infinite alternate`,
          }}
        >
          <path d="M 50 25 C 32 13, 14 5, -24 3 C 2 14, 28 21, 50 25 Z" />
        </g>
      </g>
    </svg>
  )
}

/**
 * Lapisan Latar Belakang (z-index rendah / di balik kartu konten):
 * 2 burung melintas lambat dengan skala 0.35 dan opasitas 0.55.
 * pointer-events: none wajib tersemat.
 */
export function SeagullsBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {/* Background Bird 1 */}
      <div
        className="absolute top-[18%] left-[-120px] w-[110px] h-[50px]"
        style={{
          opacity: 0.55,
          animation: 'seagullFlyBg1 28s linear infinite',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.35s" />
      </div>

      {/* Background Bird 2 */}
      <div
        className="absolute top-[38%] left-[-120px] w-[110px] h-[50px]"
        style={{
          opacity: 0.55,
          animation: 'seagullFlyBg2 34s linear infinite',
          animationDelay: '-16s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.55s" />
      </div>
    </div>
  )
}

/**
 * Lapisan Latar Depan (foreground / di depan layar):
 * 1 burung aksen sesekali melintas di depan elemen antarmuka dengan delay panjang
 * (interval kemunculan sekitar 25–35 detik).
 * pointer-events: none wajib tersemat agar tidak memblokir klik kursor.
 */
export function SeagullsForeground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-40 select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="absolute top-[28%] left-[-150px] w-[110px] h-[50px]"
        style={{
          animation: 'seagullFlyFg 30s linear infinite',
          animationDelay: '6s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.2s" />
      </div>
    </div>
  )
}
