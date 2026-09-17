'use client'

import React from 'react'

/**
 * High-fidelity Clear Art-Style Seagull Vector
 * Features:
 * - Proportional M-wingspan with high carpal elbow and swept primary wingtips
 * - Well-defined aerodynamic body with arched chest, neck, and head
 * - Terracotta accent beak tip (#E26D5C matching the brand identity)
 * - Three-tiered notched fan tail
 * - Dynamic 3D depth with dual-tone wing layering
 */
export function SeagullSvg({
  className = '',
  wingDuration = '1.35s',
  isForeground = false,
}: {
  className?: string
  wingDuration?: string
  isForeground?: boolean
}) {
  return (
    <svg
      viewBox="-105 -78 165 118"
      className={`overflow-visible select-none ${
        isForeground
          ? 'drop-shadow-[0_4px_10px_rgba(14,38,62,0.22)]'
          : 'drop-shadow-[0_3px_6px_rgba(14,38,62,0.16)]'
      } ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <g fill="#FFFFFF">
        {/* Far Wing (Upper / Background M arch) */}
        <g
          style={{
            transformOrigin: '12px -2px',
            animation: `seagullFlapFar ${wingDuration} ease-in-out infinite alternate`,
            opacity: 0.86,
          }}
        >
          <path
            d="M 12 -2 
               C 6 -24, -4 -50, -18 -56 
               C -28 -60, -48 -58, -78 -38 
               C -58 -32, -38 -26, -20 -18 
               C -8 -10, 2 -4, 12 -2 Z"
            fill="#EAF4FA"
          />
        </g>

        {/* Torso & Tail Assembly */}
        <g
          style={{
            animation: `seagullBob ${wingDuration} ease-in-out infinite`,
          }}
        >
          {/* Fan Tail with 3 distinct feather notches */}
          <path
            d="M -16 6 
               C -28 10, -42 16, -56 22 
               C -46 18, -36 15, -28 13 
               C -40 18, -52 24, -64 28 
               C -48 23, -36 18, -26 15 
               C -38 22, -48 30, -58 35 
               C -44 28, -30 22, -14 15 Z"
            fill="#FFFFFF"
          />

          {/* Full chest, arched neck, and head */}
          <path
            d="M 44 -3 
               C 36 -7, 26 -8, 14 -7 
               C 2 -5, -8 -1, -18 2 
               C -26 4, -34 6, -40 8 
               C -28 13, -16 15, -2 14 
               C 10 13, 22 12, 32 8 
               C 38 6, 46 3, 54 0 
               C 49 -2, 45 -3, 44 -3 Z"
            fill="#FFFFFF"
          />

          {/* Sharp Terracotta Beak Tip */}
          <polygon points="54,0 44,-3 42,2" fill="#E26D5C" />
        </g>

        {/* Near Wing (Foreground M arch) */}
        <g
          style={{
            transformOrigin: '18px 2px',
            animation: `seagullFlapNear ${wingDuration} ease-in-out infinite alternate`,
          }}
        >
          <path
            d="M 18 2 
               C 10 -26, -2 -58, -22 -68 
               C -34 -74, -58 -70, -96 -46 
               C -72 -38, -46 -30, -24 -18 
               C -10 -10, 4 -2, 18 2 Z"
            fill="#FFFFFF"
          />
        </g>
      </g>
    </svg>
  )
}

/**
 * Puffy Aesthetic Cumulus & Nimbus Cloud Shapes
 * Rendered with soft translucent fill and dreamy maritime ambient drop-shadow
 */
export function PuffyCloudSvg({
  type = 1,
  className = '',
}: {
  type?: 1 | 2 | 3 | 4
  className?: string
}) {
  return (
    <svg
      viewBox={
        type === 1
          ? '0 0 380 115'
          : type === 2
          ? '0 0 320 85'
          : type === 3
          ? '0 0 270 85'
          : '0 0 220 70'
      }
      className={`overflow-visible select-none drop-shadow-[0_10px_24px_rgba(142,197,220,0.28)] ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {type === 1 && (
        // Grand Cumulus Cloud
        <path
          d="M 50 100 
             Q 15 100 15 75 
             Q 15 50 45 45 
             Q 60 18 105 18 
             Q 135 18 155 32 
             Q 180 8 225 8 
             Q 275 8 295 35 
             Q 325 25 350 45 
             Q 380 65 370 90 
             Q 380 100 350 100 
             Z"
          fill="rgba(255, 255, 255, 0.76)"
        />
      )}

      {type === 2 && (
        // Elongated Drifter Nimbus Cloud
        <path
          d="M 35 75 
             Q 10 75 12 55 
             Q 15 35 40 32 
             Q 55 10 95 10 
             Q 125 10 140 24 
             Q 165 5 205 8 
             Q 245 12 255 35 
             Q 285 35 285 55 
             Q 290 75 260 75 
             Z"
          fill="rgba(255, 255, 255, 0.72)"
        />
      )}

      {type === 3 && (
        // Soft Rounded Cluster Cloud
        <path
          d="M 35 70 
             Q 10 70 12 50 
             Q 15 32 38 30 
             Q 50 10 88 10 
             Q 115 10 128 22 
             Q 150 6 185 8 
             Q 220 12 230 32 
             Q 255 35 250 55 
             Q 250 70 225 70 
             Z"
          fill="rgba(255, 255, 255, 0.74)"
        />
      )}

      {type === 4 && (
        // Small Wispy Nimbus Cloud
        <path
          d="M 25 60 
             Q 8 60 10 44 
             Q 12 28 32 26 
             Q 44 8 74 8 
             Q 96 8 106 18 
             Q 122 4 150 6 
             Q 178 8 186 26 
             Q 208 28 204 44 
             Q 204 60 180 60 
             Z"
          fill="rgba(255, 255, 255, 0.68)"
        />
      )}
    </svg>
  )
}

/**
 * LAPISAN AWAN-AWAN LAUT PASTEL MENGAPUNG (PUFFY CLOUDS):
 * - 4 gumpalan awan pastel lembut
 * - z-index: 0 (di balik burung dan di balik kartu konten)
 * - Pergeseran horizontal lambat (durasi 58s–88s secara infinit)
 * - Staggered negative delays agar awan langsung terdistribusi di viewport sejak detik pertama
 */
export function PuffyCloudsLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {/* Cloud 1: Grand Cumulus (Top 6%, drifting slow 76s) */}
      <div
        className="absolute top-[6%] left-0 w-[320px] sm:w-[380px]"
        style={{
          animation: 'cloudDrift1 76s linear infinite',
          animationDelay: '-22s',
          pointerEvents: 'none',
        }}
      >
        <PuffyCloudSvg type={1} />
      </div>

      {/* Cloud 2: Drifting Nimbus (Top 15%, drifting slow 88s) */}
      <div
        className="absolute top-[15%] left-0 w-[260px] sm:w-[320px]"
        style={{
          animation: 'cloudDrift2 88s linear infinite',
          animationDelay: '-55s',
          pointerEvents: 'none',
        }}
      >
        <PuffyCloudSvg type={2} />
      </div>

      {/* Cloud 3: Soft Cluster (Top 24%, drifting 68s) */}
      <div
        className="absolute top-[24%] left-0 w-[220px] sm:w-[270px]"
        style={{
          animation: 'cloudDrift3 68s linear infinite',
          animationDelay: '-10s',
          pointerEvents: 'none',
        }}
      >
        <PuffyCloudSvg type={3} />
      </div>

      {/* Cloud 4: Wispy Cloud (Top 10%, drifting 58s) */}
      <div
        className="absolute top-[10%] left-0 w-[170px] sm:w-[210px]"
        style={{
          animation: 'cloudDrift4 58s linear infinite',
          animationDelay: '-38s',
          pointerEvents: 'none',
        }}
      >
        <PuffyCloudSvg type={4} />
      </div>
    </div>
  )
}

/**
 * LAPISAN LATAR BELAKANG BURUNG (z-index 2 / di balik kartu konten, di depan awan):
 * - 5 burung melintas santai (skala 38px–48px, opasitas ~0.65–0.78)
 * - Termasuk 1 pasangan burung camar yang terbang beriringan (tandem flight)
 * - Staggered negative delays agar langit tidak pernah kosong
 */
export function SeagullsBackgroundLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[2] select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {/* Background Bird 1: Solo High Altitude (Top 9%, width 44px) */}
      <div
        className="absolute top-[9%] left-0 w-[44px] h-[32px]"
        style={{
          opacity: 0.72,
          animation: 'seagullFlyBg1 24s linear infinite',
          animationDelay: '-4s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.3s" />
      </div>

      {/* Background Bird 2: TANDEM PAIR - Leader (Top 22%, width 48px) */}
      <div
        className="absolute top-[22%] left-0 w-[48px] h-[34px]"
        style={{
          opacity: 0.78,
          animation: 'seagullFlyBg2 27s linear infinite',
          animationDelay: '-12s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.4s" />
      </div>

      {/* Background Bird 3: TANDEM PAIR - Follower (Top 25%, width 40px, flying in tandem) */}
      <div
        className="absolute top-[25%] left-0 w-[40px] h-[29px]"
        style={{
          opacity: 0.68,
          animation: 'seagullFlyBg3 27s linear infinite',
          animationDelay: '-10.8s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.35s" />
      </div>

      {/* Background Bird 4: Solo Mid-Low Altitude (Top 36%, width 46px) */}
      <div
        className="absolute top-[36%] left-0 w-[46px] h-[33px]"
        style={{
          opacity: 0.75,
          animation: 'seagullFlyBg4 30s linear infinite',
          animationDelay: '-19s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.45s" />
      </div>

      {/* Background Bird 5: Solo Mid-High Altitude (Top 15%, width 42px) */}
      <div
        className="absolute top-[15%] left-0 w-[42px] h-[30px]"
        style={{
          opacity: 0.7,
          animation: 'seagullFlyBg5 25s linear infinite',
          animationDelay: '-8s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.35s" />
      </div>
    </div>
  )
}

/**
 * LAPISAN LATAR DEPAN BURUNG (z-index 40 / di depan elemen antarmuka):
 * - 2 burung aksen berukuran lebih besar (skala 62px–76px, opasitas ~0.95)
 * - Melintas di depan kartu antarmuka secara bergantian dengan ritme kontinu
 * - pointer-events: none wajib tersemat agar tidak memblokir interaksi klik
 */
export function SeagullsForegroundLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-40 select-none"
      aria-hidden="true"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {/* Foreground Bird 1: Large Accent Gull (Top 28%, width 76px) */}
      <div
        className="absolute top-[28%] left-0 w-[76px] h-[54px]"
        style={{
          animation: 'seagullFlyFg1 26s linear infinite',
          animationDelay: '2s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.25s" isForeground />
      </div>

      {/* Foreground Bird 2: Medium-Large Accent Gull (Top 18%, width 62px) */}
      <div
        className="absolute top-[18%] left-0 w-[62px] h-[44px]"
        style={{
          animation: 'seagullFlyFg2 32s linear infinite',
          animationDelay: '15s',
          pointerEvents: 'none',
        }}
      >
        <SeagullSvg wingDuration="1.3s" isForeground />
      </div>
    </div>
  )
}

// Backward-compatible export aliases
export { SeagullsBackgroundLayer as SeagullsBackground }
export { SeagullsForegroundLayer as SeagullsForeground }
