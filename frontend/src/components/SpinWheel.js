import React, { useEffect, useMemo, useRef, useState } from 'react';
import './SpinWheel.css';

function getViewportSize() {
  // visualViewport is more accurate on mobile (esp. iOS address bar / safe areas)
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round(vv?.height ?? window.innerHeight),
  };
}

function useViewportSize() {
  const [vp, setVp] = useState(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return getViewportSize();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(getViewportSize()));
    };

    const vv = window.visualViewport;
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);

    // Ensure correct size on first paint (fixes “refresh-to-fix”)
    update();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
    };
  }, []);

  return vp;
}

function SpinWheel({ restaurants, spinning, result }) {
  const rotationRef = useRef(0); // current rotation in degrees (normalized 0..360)
  const lastSpinKeyRef = useRef(null);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [transitionMs, setTransitionMs] = useState(0);
  const spinAudioRef = useRef(null);
  const viewport = useViewportSize();

  const items = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return restaurants.map((r) => (typeof r === 'string' ? { name: r } : r));
  }, [restaurants]);

  // Arc wheel geometry:
  // - Mobile: 95vw
  // - Desktop: fixed 500px
  // Container clips to half height (semi-circle) using overflow hidden in CSS.
  const arcGeom = useMemo(() => {
    const screenWidth = viewport.width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    const isMobile = screenWidth > 0 && screenWidth <= 768;
    const arcWidthPx = isMobile ? Math.round(screenWidth * 0.95) : 500;

    return {
      isMobile,
      arcWidthPx,
      wheelPx: arcWidthPx, // full circle size; we clip to top half
      heightPx: Math.round(arcWidthPx / 2), // visible height (semi-circle)
    };
  }, [viewport.width]);

  const sliceDeg = items.length > 0 ? 360 / items.length : 0;

  const palette = useMemo(
    () => [
      // Slightly softened palette (works better with “glass” styling)
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#FFB347', '#87CEEB', '#DDA0DD', '#F0E68C',
    ],
    []
  );

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeSlice = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? '0' : '1';
    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  // Outer arc path (for curved labels via <textPath>)
  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? '0' : '1';
    return [`M ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`].join(' ');
  };

  const getMaxCharsForCount = (count, isMobile) => {
    if (count <= 6) return isMobile ? 18 : 22;
    if (count <= 10) return isMobile ? 14 : 18;
    if (count <= 12) return isMobile ? 12 : 16;
    return isMobile ? 10 : 14;
  };

  // Spinning sound (frontend/public/sounds/spin.mp3 -> /sounds/spin.mp3)
  useEffect(() => {
    const audio = new Audio('/sounds/spin.mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'auto';
    spinAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      spinAudioRef.current = null;
    };
  }, []);

  // Play/pause sound based on `spinning`
  useEffect(() => {
    const audio = spinAudioRef.current;
    if (!audio) return;

    if (spinning) {
      // Reset to start each spin for consistency
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay may be blocked in some browsers; user interaction usually fixes it.
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [spinning]);

  // Reset when list changes (mall/categories)
  useEffect(() => {
    rotationRef.current = 0;
    setTransitionMs(0);
    setRotationDeg(0);
    lastSpinKeyRef.current = null;
  }, [items.length]);

  // Start a spin ONLY when we have both `spinning === true` and a concrete result name.
  // This avoids the old mismatch where the wheel started moving before the backend result arrived.
  useEffect(() => {
    if (!spinning) return;
    if (!items || items.length === 0) return;
    if (!result) return;

    const resultName = typeof result === 'string' ? result : result?.restaurant_name;
    if (!resultName) return;

    const spinKey = `${resultName}__${items.length}`;
    if (lastSpinKeyRef.current === spinKey) return;
    lastSpinKeyRef.current = spinKey;

    const targetIndex = items.findIndex((r) => r.name === resultName);
    if (targetIndex === -1) {
      console.warn('Restaurant not found in wheel:', resultName);
      return;
    }

    const targetCenterDegFromTop = targetIndex * sliceDeg + sliceDeg / 2;
    // rotation=0 means slice 0 boundary starts at top; pointer is at top-center.
    // To bring target center to top-center, rotate by -(targetCenterDegFromTop)
    const desiredFinal = ((-targetCenterDegFromTop % 360) + 360) % 360;

    // We animate to a big value, then normalize on transition end.
    const fullRotations = 6 * 360; // slightly heavier feel
    const target = fullRotations + desiredFinal;

    setTransitionMs(4200);
    setRotationDeg(target);
  }, [spinning, result, items, sliceDeg]);

  const onTransitionEnd = () => {
    // Normalize rotation to 0..360 (no animation jump)
    const normalized = ((rotationDeg % 360) + 360) % 360;
    rotationRef.current = normalized;
    setTransitionMs(0);
    setRotationDeg(normalized);
  };

  return (
    <div
      className="spin-arc"
      style={{
        // CSS variables so you can tune without touching JS
        '--arc-width': `${arcGeom.arcWidthPx}px`,
      }}
    >
      <div className="spin-arc__needle" aria-hidden="true" />

      <div className="spin-arc__clip">
        <div
          className="spin-arc__rotator"
          style={{
            width: arcGeom.wheelPx,
            height: arcGeom.wheelPx,
            transform: `rotate(${rotationDeg}deg)`,
            transitionDuration: `${transitionMs}ms`,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          <svg
            className="spin-arc__svg"
            width={arcGeom.wheelPx}
            height={arcGeom.wheelPx}
            viewBox="0 0 100 100"
            role="img"
            aria-label="Spin wheel"
          >
            <defs>
              <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.22)" />
              </filter>
              <radialGradient id="glassHighlight" cx="30%" cy="20%" r="80%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.10)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
              </radialGradient>
            </defs>

            {items.length === 0 ? (
              <circle cx="50" cy="50" r="48" fill="rgba(240,240,240,0.7)" />
            ) : items.length === 1 ? (
              (() => {
                const r = items[0];
                const fill = palette[0];
                return (
                  <g>
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill={fill}
                      opacity="0.88"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="0.8"
                      filter="url(#wheelShadow)"
                    />
                    <circle cx="50" cy="50" r="48" fill="url(#glassHighlight)" opacity="0.55" />
                    <text x="50" y="50" className="spin-arc__label" textAnchor="middle" dominantBaseline="middle">
                      {r.name}
                    </text>
                  </g>
                );
              })()
            ) : (
              items.map((r, i) => {
                // Build slices starting at top (-90deg) and going clockwise.
                const start = -90 + i * sliceDeg;
                const end = -90 + (i + 1) * sliceDeg;
                const d = describeSlice(50, 50, 48, start, end);

                const maxChars = getMaxCharsForCount(items.length, arcGeom.isMobile);
                const label = r.name.length > maxChars ? `${r.name.slice(0, Math.max(1, maxChars - 1))}…` : r.name;

                // Label arc just inside outer rim
                const labelPathId = `arcLabel-${i}`;
                const arcD = describeArc(50, 50, 44, start + 1.5, end - 1.5);

                const fill = palette[i % palette.length];

                return (
                  <g key={`${r.name}-${i}`}>
                    <path
                      d={d}
                      fill={fill}
                      opacity="0.86"
                      stroke="rgba(255,255,255,0.65)"
                      strokeWidth="0.8"
                      filter="url(#wheelShadow)"
                    />
                    <path d={d} fill="url(#glassHighlight)" opacity="0.35" />

                    <path id={labelPathId} d={arcD} fill="none" />
                    <text className="spin-arc__label" textAnchor="middle">
                      <textPath href={`#${labelPathId}`} startOffset="50%">
                        {label}
                      </textPath>
                    </text>
                  </g>
                );
              })
            )}
          </svg>
        </div>

        {spinning && <div className="spin-arc__overlay" />}
      </div>
    </div>
  );
}

export default SpinWheel;
