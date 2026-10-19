import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './timeline.css';

export function Timeline({ 
  data = [], 
  header = null
}) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [activeEntryIndex, setActiveEntryIndex] = useState(0);
  const entryRefs = useRef([]);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [data]);

  // Scroll beam progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  // Track active year milestone on scroll
  useEffect(() => {
    const handleScroll = () => {
      const triggerY = 220; // Distance from top of viewport where sticky year locks
      entryRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          setActiveEntryIndex(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  return (
    <div className="tl-container" ref={containerRef}>
      {/* SECTION HEADER (IF PROVIDED) */}
      {header && (
        <div className="tl-header">
          {header}
        </div>
      )}

      {/* TIMELINE TRACK & ENTRIES */}
      <div ref={ref} className="tl-track-wrapper">
        {data.map((item, index) => {
          const isActive = activeEntryIndex === index;
          const isPassed = activeEntryIndex > index;

          return (
            <div 
              key={item.title || index} 
              ref={(el) => (entryRefs.current[index] = el)}
              className={`tl-entry ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}
            >
              {/* STICKY MILESTONE COLUMN */}
              <div className="tl-sticky-col">
                <div className={`tl-node-anchor ${isActive ? 'is-active' : ''} ${isPassed ? 'is-passed' : ''}`}>
                  <div className="tl-node-ring">
                    <div className="tl-node-dot" />
                  </div>
                </div>
                <h3 className={`tl-title-desktop ${isActive ? 'is-active' : ''}`}>
                  {item.title}
                </h3>
              </div>

              {/* CONTENT COLUMN */}
              <div className="tl-content-col">
                <div className="tl-mobile-header">
                  <h3 className="tl-title-mobile">
                    {item.title}
                  </h3>
                </div>
                <div className="tl-content-body">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* GLOWING SCROLL BEAM */}
        <div 
          style={{ height: `${height}px` }} 
          className="tl-beam-track"
          aria-hidden="true"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="tl-beam-glow"
          />
        </div>
      </div>
    </div>
  );
}

export default Timeline;
