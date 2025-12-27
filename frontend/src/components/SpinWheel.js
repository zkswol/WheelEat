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

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    let raf = 0;
    const update = (w) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(Math.round(w)));
    };

    // Initial
    update(el.getBoundingClientRect().width || 0);

    // ResizeObserver where available
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver((entries) => {
          const next = entries?.[0]?.contentRect?.width ?? el.getBoundingClientRect().width;
          update(next || 0);
        })
      : null;

    ro?.observe(el);

    // Fallback
    const onResize = () => update(el.getBoundingClientRect().width || 0);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);

  return width;
}

function SpinWheel({ restaurants, spinning, result }) {
  const rotationRef = useRef(0); // current rotation in degrees (normalized 0..360)
  const lastSpinKeyRef = useRef(null);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [transitionMs, setTransitionMs] = useState(0);
  const spinAudioRef = useRef(null);
  const viewport = useViewportSize();
  const frameRef = useRef(null);
  const frameWidth = useElementWidth(frameRef);

  const items = useMemo(() => {
    if (!restaurants || restaurants.length === 0) return [];
    return restaurants.map((r) => (typeof r === 'string' ? { name: r } : r));
  }, [restaurants]);

  // Semi-circle arc sizing:
  // - Mobile: ~95vw (but capped by container width)
  // - Desktop: fixed 500px (but capped by container width)
  const archGeom = useMemo(() => {
    const screenW = viewport.width || (typeof window !== 'undefined' ? window.innerWidth : 0);
    const isMobile = screenW > 0 && screenW <= 768;
    const available = Math.max(0, frameWidth || screenW || 0);

    const desired = isMobile ? Math.round(available * 0.95) : 500;
    const widthPx = Math.max(220, Math.min(desired, available || desired)); // clamp for tiny layouts

    return {
      isMobile,
      widthPx,
      heightPx: Math.round(widthPx / 2),
    };
  }, [viewport.width, frameWidth]);

  const sliceDeg = items.length > 0 ? 180 / items.length : 0;

  const palette = useMemo(
    () => [
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

  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = Math.abs(endDeg - startDeg) <= 180 ? '0' : '1';
    return [`M ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`].join(' ');
  };

  const getMaxCharsForCount = (count) => {
    if (count <= 6) return archGeom.isMobile ? 18 : 22;
    if (count <= 10) return archGeom.isMobile ? 14 : 18;
    if (count <= 12) return archGeom.isMobile ? 12 : 16;
    return archGeom.isMobile ? 10 : 14;
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

    // Semi-circle spans -180deg (left) to 0deg (right); pointer is at -90deg (top-center).
    const targetCenterDeg = -180 + targetIndex * sliceDeg + sliceDeg / 2;
    const desiredFinal = ((-90 - targetCenterDeg) % 360 + 360) % 360;

    // We animate to a big value, then normalize on transition end.
    const fullRotations = 6 * 360; // heavier feel
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
    <div className="spin-wheel-container v2">
      <div className="spin-arch-shell" ref={frameRef} style={{ '--arch-width': `${archGeom.widthPx}px` }}>
        <div className="spin-arch-pointer" aria-hidden="true" />

        <div className="spin-arch-clip">
          <div
            className="spin-arch-rotator"
            style={{
              width: archGeom.widthPx,
              height: archGeom.widthPx,
              transform: `rotate(${rotationDeg}deg)`,
              transitionDuration: `${transitionMs}ms`,
              '--spin-ease': 'cubic-bezier(0.15, 0, 0.15, 1)',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            <svg
              className="spin-arch-svg"
              width={archGeom.widthPx}
              height={archGeom.widthPx}
              viewBox="0 0 100 100"
              role="img"
              aria-label="Spin wheel"
            >
              <defs>
                <filter id="archShadow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.22)" />
                </filter>
                <radialGradient id="archGlass" cx="30%" cy="18%" r="85%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                  <stop offset="48%" stopColor="rgba(255,255,255,0.14)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                </radialGradient>
              </defs>

              {/* Base line (diameter) */}
              <line x1="2" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />

              {items.length === 0 ? (
                <path d={describeSlice(50, 50, 48, -180, 0)} fill="rgba(240,240,240,0.75)" />
              ) : (
                items.map((r, i) => {
                  const start = -180 + i * sliceDeg;
                  const end = -180 + (i + 1) * sliceDeg;
                  const d = describeSlice(50, 50, 48, start, end);
                  const fill = palette[i % palette.length];

                  const maxChars = getMaxCharsForCount(items.length);
                  const label = r.name.length > maxChars ? `${r.name.slice(0, Math.max(1, maxChars - 1))}…` : r.name;

                  const labelPathId = `archLabel-${i}`;
                  const arcD = describeArc(50, 50, 43.5, start + 1.5, end - 1.5);

                  return (
                    <g key={`${r.name}-${i}`}>
                      <path
                        d={d}
                        fill={fill}
                        opacity="0.88"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth="0.9"
                        filter="url(#archShadow)"
                      />
                      <path d={d} fill="url(#archGlass)" opacity="0.38" />

                      <path id={labelPathId} d={arcD} fill="none" />
                      <text className="spin-arch-label" textAnchor="middle">
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

          {spinning && <div className="spin-arch-overlay" />}
        </div>
      </div>
    </div>
  );
}

export default SpinWheel;
