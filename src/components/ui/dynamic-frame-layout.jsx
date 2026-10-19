import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useSpring, useReducedMotion } from 'motion/react';
import './dynamic-frame-layout.css';

/**
 * DynamicFrameLayout — port of the 21st.dev component (plain JSX + CSS, no Tailwind).
 *
 * 3x3 grid where the hovered row + column expand and only the active frame plays
 * its video. Row/column sizes are driven by physics springs (motion/react) instead
 * of a CSS grid transition, so retargeting between tiles is fluid instead of boxy.
 * The image-based "frame" borders of the original were replaced with CSS CCTV
 * corner brackets that fit the Cuauthli identity.
 *
 * Props
 *  - frames:        [{ id, video, defaultPos: { x, y }, mediaSize? }]  (x/y in 0 | 4 | 8)
 *  - hoverSize:     fr units for the expanded row/col (out of 12). Default 6.
 *  - gapSize:       px gap between frames. Default 8.
 *  - showFrames:    show CCTV corner brackets. Default true.
 *  - autoCycle:     ms between automatic focus changes while idle & in view (0 = off).
 *  - renderOverlay: (frame, { isActive, hasActive, isAuto, index }) => ReactNode — HUD per tile.
 *  - onFrameClick:  (frame) => void
 *  - onActiveChange:(frame | null) => void — fires when the focused frame changes (hover or tour)
 */

const MOBILE_QUERY = '(max-width: 767px)';
const SPRING = { stiffness: 120, damping: 20, mass: 0.9 };
const EASE = [0.22, 1, 0.36, 1];
// pleasant, non-linear tour across the wall
const CYCLE_ORDER = [4, 0, 5, 7, 2, 3, 8, 1, 6];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

function FrameComponent({ video, mediaSize = 1, showFrame, isActive, hasActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isActive) {
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive]);

  return (
    <div className="dfl-frame">
      <div className="dfl-media" style={{ '--dfl-media-scale': mediaSize }}>
        <video
          ref={videoRef}
          className="dfl-video"
          // #t= forces the browser to paint a still frame while paused
          src={`${video}#t=0.6`}
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>

      <div className={`dfl-veil ${hasActive && !isActive ? 'is-dimmed' : ''}`} />
      <div className="dfl-shade" />
      <div className="dfl-scan" aria-hidden="true" />
      <div className="dfl-sweep" aria-hidden="true" />

      {showFrame && (
        <div className="dfl-brackets" aria-hidden="true">
          <span className="dfl-bracket dfl-bracket--tl" />
          <span className="dfl-bracket dfl-bracket--tr" />
          <span className="dfl-bracket dfl-bracket--bl" />
          <span className="dfl-bracket dfl-bracket--br" />
        </div>
      )}
    </div>
  );
}

const tileVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 14 },
  show: (d) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: EASE },
  }),
};

const revealVariants = {
  hidden: { clipPath: 'inset(18% 18% 18% 18% round 14px)' },
  show: (d) => ({
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    transition: { duration: 1.1, delay: d + 0.05, ease: EASE },
  }),
};

export function DynamicFrameLayout({
  frames,
  className = '',
  showFrames = true,
  hoverSize = 6,
  gapSize = 8,
  autoCycle = 0,
  renderOverlay,
  onFrameClick,
  onActiveChange,
}) {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);

  const [hovered, setHovered] = useState(null); // index chosen by the user
  const [autoIdx, setAutoIdx] = useState(null); // index chosen by the idle tour
  const [inView, setInView] = useState(false);
  const [mobileActive, setMobileActive] = useState(frames[0]?.id ?? null);
  const resumeTimer = useRef(null);
  const [paused, setPaused] = useState(false);

  /* ---------------- springs for row / column fr sizes ---------------- */
  const r0 = useSpring(4, SPRING);
  const r1 = useSpring(4, SPRING);
  const r2 = useSpring(4, SPRING);
  const c0 = useSpring(4, SPRING);
  const c1 = useSpring(4, SPRING);
  const c2 = useSpring(4, SPRING);
  const rows = useMotionTemplate`${r0}fr ${r1}fr ${r2}fr`;
  const cols = useMotionTemplate`${c0}fr ${c1}fr ${c2}fr`;

  const posOf = useCallback(
    (i) => ({
      row: Math.floor(frames[i].defaultPos.y / 4),
      col: Math.floor(frames[i].defaultPos.x / 4),
    }),
    [frames]
  );

  const activeIdx = hovered ?? autoIdx;
  const isAuto = hovered === null && autoIdx !== null;

  const activeChangeRef = useRef(onActiveChange);
  activeChangeRef.current = onActiveChange;
  useEffect(() => {
    if (isMobile) return;
    activeChangeRef.current?.(activeIdx === null ? null : frames[activeIdx]);
  }, [activeIdx, frames, isMobile]);

  useEffect(() => {
    const rs = [r0, r1, r2];
    const cs = [c0, c1, c2];
    if (activeIdx === null) {
      rs.forEach((s) => s.set(4));
      cs.forEach((s) => s.set(4));
      return;
    }
    // idle tour expands a touch less than a real hover
    const big = isAuto ? hoverSize - 1 : hoverSize;
    const small = (12 - big) / 2;
    const { row, col } = posOf(activeIdx);
    rs.forEach((s, i) => s.set(i === row ? big : small));
    cs.forEach((s, i) => s.set(i === col ? big : small));
  }, [activeIdx, isAuto, hoverSize, posOf, r0, r1, r2, c0, c1, c2]);

  /* ---------------- idle tour (only while visible) ---------------- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoCycle || isMobile || reduceMotion || !inView || paused || hovered !== null) {
      if (hovered === null && (!inView || paused)) setAutoIdx(null);
      return;
    }
    let step = 0;
    const first = setTimeout(() => setAutoIdx(CYCLE_ORDER[0] % frames.length), 900);
    const t = setInterval(() => {
      step = (step + 1) % CYCLE_ORDER.length;
      setAutoIdx(CYCLE_ORDER[step] % frames.length);
    }, autoCycle);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [autoCycle, isMobile, reduceMotion, inView, paused, hovered, frames.length]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const handleEnter = (i) => {
    clearTimeout(resumeTimer.current);
    setPaused(true);
    setAutoIdx(null);
    setHovered(i);
  };

  const handleLeaveAll = () => {
    setHovered(null);
    clearTimeout(resumeTimer.current);
    // give the user a beat before the tour resumes
    resumeTimer.current = setTimeout(() => setPaused(false), 2600);
  };

  /* ---------------- cursor parallax inside the active tile ---------------- */
  const handleTileMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const resetTileMove = (e) => {
    e.currentTarget.style.setProperty('--mx', 0);
    e.currentTarget.style.setProperty('--my', 0);
  };

  const hasActive = isMobile ? mobileActive !== null : activeIdx !== null;

  return (
    <motion.div
      ref={rootRef}
      className={[
        'dfl',
        isMobile && 'dfl--mobile',
        hasActive && 'dfl--has-active',
        isAuto && 'dfl--auto',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        isMobile
          ? { gap: `${gapSize}px` }
          : { gap: `${gapSize}px`, gridTemplateRows: rows, gridTemplateColumns: cols }
      }
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      onMouseLeave={isMobile ? undefined : handleLeaveAll}
    >
      {frames.map((frame, index) => {
        const { row, col } = posOf(index);
        const isActive = isMobile ? mobileActive === frame.id : activeIdx === index;
        // stagger outwards from the center tile
        const delay = (Math.abs(row - 1) + Math.abs(col - 1)) * 0.09;

        return (
          <motion.div
            key={frame.id}
            className={`dfl-tile ${isActive ? 'is-active' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={frame.label || `Frame ${index + 1}`}
            aria-pressed={isActive}
            variants={tileVariants}
            custom={delay}
            onMouseEnter={() => !isMobile && handleEnter(index)}
            onMouseMove={isMobile ? undefined : handleTileMove}
            onMouseLeave={isMobile ? undefined : resetTileMove}
            onFocus={() => (isMobile ? setMobileActive(frame.id) : handleEnter(index))}
            onBlur={() => !isMobile && handleLeaveAll()}
            onClick={() => {
              if (isMobile && !isActive) {
                setMobileActive(frame.id);
                return;
              }
              onFrameClick?.(frame);
            }}
          >
            <motion.div className="dfl-reveal" variants={revealVariants} custom={delay}>
              <FrameComponent
                video={frame.video}
                mediaSize={frame.mediaSize}
                showFrame={showFrames}
                isActive={isActive}
                hasActive={hasActive}
              />
              {renderOverlay && (
                <div className="dfl-overlay">
                  {renderOverlay(frame, { isActive, hasActive, isAuto: isAuto && isActive, index })}
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default DynamicFrameLayout;
