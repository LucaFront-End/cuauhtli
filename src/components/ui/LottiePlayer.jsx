import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

/**
 * Robust, zero-friction Lottie Player component.
 * Uses lottie-web SVG renderer directly to guarantee 100% playback fidelity,
 * eliminating wrapper prop-mismatch issues (supports both `animationData` and `src`).
 */
export default function LottiePlayer({
  animationData,
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  className = '',
  style = {},
  fallback = null,
  onComplete
}) {
  const containerRef = useRef(null);
  const animInstanceRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const data = animationData || src;
    if (!containerRef.current || !data) return;

    try {
      setHasError(false);
      if (animInstanceRef.current) {
        animInstanceRef.current.destroy();
        animInstanceRef.current = null;
      }

      // Clear any leftover DOM inside container
      containerRef.current.innerHTML = '';

      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData: data,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true,
          clearCanvas: true
        }
      });

      animInstanceRef.current = anim;

      if (speed && speed !== 1) {
        anim.setSpeed(speed);
      }

      if (onComplete) {
        anim.addEventListener('complete', onComplete);
      }
    } catch (err) {
      console.warn('[LottiePlayer] Error initializing animation:', err);
      setHasError(true);
    }

    return () => {
      if (animInstanceRef.current) {
        try {
          animInstanceRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        animInstanceRef.current = null;
      }
    };
  }, [animationData, src, loop, autoplay, speed]);

  if (hasError && fallback) {
    return fallback;
  }

  return (
    <div
      ref={containerRef}
      className={`lottie-player-wrapper ${className}`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
