import * as React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import './highlight-testimonial-section.css';

/**
 * HighlightTestimonialSection — Minimal, compact, continuous rotating showcase.
 * 
 * Choreography:
 * 1. Quote displays in the card.
 * 2. Highlighter sweeps across the key phrase in the quote.
 * 3. The highlighted text floats UPWARD into the top headline slot.
 * 4. Settles cleanly as the promoted headline.
 * 5. Rotates automatically to the next review.
 */

function splitQuote(quote, highlight) {
  if (!quote) return { before: '', phrase: '', after: '' };
  const at = highlight ? quote.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (at < 0) return { before: quote, phrase: '', after: '' };
  return {
    before: quote.slice(0, at),
    phrase: quote.slice(at, at + highlight.length),
    after: quote.slice(at + highlight.length),
  };
}

function initials(name) {
  if (!name) return 'CU';
  return name
    .replace(/^(Lic\.|Ing\.|Dr\.|Dra\.|Arq\.|Mtro\.|Mtra\.)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function HighlightTestimonialSection({
  testimonials,
  index,
  defaultIndex = 0,
  onIndexChange,
  interval = 5500,
  className = '',
  renderCardTop,
}) {
  const count = testimonials?.length || 0;
  const [localIndex, setLocalIndex] = React.useState(defaultIndex);
  const current = count ? Math.min(count - 1, Math.max(0, index ?? localIndex)) : 0;
  const item = testimonials?.[current];

  const [paused, setPaused] = React.useState(false);
  const [animStep, setAnimStep] = React.useState(0);
  const [replayCount, setReplayCount] = React.useState(0);

  const go = React.useCallback(
    (next) => {
      if (!count) return;
      const wrapped = ((next % count) + count) % count;
      if (index === undefined) setLocalIndex(wrapped);
      onIndexChange?.(wrapped);
    },
    [count, index, onIndexChange]
  );

  const replay = () => {
    setReplayCount((c) => c + 1);
  };

  // 3-Act Animation Cycle: Sweep -> Fly Up -> Settle
  React.useEffect(() => {
    setAnimStep(0);

    // Act 1: Se resalta
    const t1 = setTimeout(() => {
      setAnimStep(1);
    }, 200);

    // Act 2: Pasa arriba
    const t2 = setTimeout(() => {
      setAnimStep(2);
    }, 950);

    // Act 3: Aterriza en el titular
    const t3 = setTimeout(() => {
      setAnimStep(3);
    }, 1650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [current, replayCount]);

  // Autoplay (changes on its own, pauses on hover)
  React.useEffect(() => {
    if (!interval || paused || count < 2) return;
    const id = setInterval(() => {
      go(current + 1);
    }, interval);
    return () => clearInterval(id);
  }, [interval, paused, count, current, go]);

  if (!item) return null;
  const parts = splitQuote(item.quote, item.highlight);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(current + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(current - 1);
    }
  };

  return (
    <div
      data-slot="highlight-testimonial-section"
      data-index={current}
      data-step={animStep}
      aria-roledescription="carousel"
      aria-label="Testimonios de clientes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`hts ${className}`}
      style={{ '--hts-interval': `${interval}ms` }}
    >
      {/* 1. TITULAR DESTACADO (ARRIBA) */}
      <div className="hts-head">
        <div className="hts-headline-wrap">
          {/* Headline after landing */}
          <h3
            key={`hl-${current}-${replayCount}`}
            className={`hts-headline ${animStep === 3 ? 'is-settled' : 'is-preparing'}`}
            aria-live="polite"
          >
            <span className="hts-quote-mark hts-quote-mark--open">“</span>
            <span className="hts-headline-text">{parts.phrase || item.quote}</span>
            <span className="hts-quote-mark hts-quote-mark--close">”</span>
          </h3>

          {/* Upward flight runner */}
          {animStep === 2 && (
            <div key={`flight-${current}-${replayCount}`} className="hts-flight-runner">
              <div className="hts-flight-chip">
                <Sparkles size={13} className="hts-flight-chip-icon" />
                <span>{parts.phrase || item.quote}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. TARJETA DE RESEÑA (ABAJO) */}
      <figure className="hts-card" data-card>
        {renderCardTop && <div className="hts-card-top">{renderCardTop(item)}</div>}

        {/* Quote text with sweep mark */}
        <blockquote key={`q-${current}`} className="hts-quote" data-quote>
          <span>{parts.before}</span>
          {parts.phrase && (
            <mark
              key={`mark-${current}-${replayCount}`}
              className={`hts-mark ${animStep >= 1 ? 'is-highlighted' : ''} ${animStep === 2 ? 'is-lifting' : ''}`}
              data-highlight
            >
              {parts.phrase}
            </mark>
          )}
          <span>{parts.after}</span>
        </blockquote>

        {/* Footer info & controls */}
        <figcaption className="hts-foot">
          <div className="hts-author">
            <span aria-hidden="true" className="hts-avatar hts-avatar--initials">
              {initials(item.author)}
            </span>
            <div className="hts-author-text">
              <p className="hts-author-name" data-author>
                {item.author}
              </p>
              {(item.role || item.company) && (
                <p className="hts-author-role">
                  {item.role} · <strong>{item.company}</strong>
                </p>
              )}
            </div>
          </div>

          <div className="hts-controls">
            {/* Pagination Dots with Autoplay Progress Fill */}
            <div role="group" aria-label="Elegir testimonio" onKeyDown={onKeyDown} className="hts-dots">
              {testimonials.map((entry, i) => (
                <button
                  key={entry.author + i}
                  type="button"
                  data-dot={i}
                  aria-label={`Ver testimonio ${i + 1} de ${count}`}
                  aria-pressed={i === current}
                  onClick={() => go(i)}
                  className={`hts-dot ${i === current ? 'is-active' : ''}`}
                >
                  {i === current && !paused && (
                    <span key={`p-${current}-${replayCount}`} className="hts-dot-progress" />
                  )}
                </button>
              ))}
            </div>

            {/* Subtle Replay Icon */}
            <button
              type="button"
              className="hts-arrow"
              onClick={replay}
              title="Repetir animación"
              aria-label="Repetir animación"
            >
              <RotateCcw size={12} />
            </button>

            {/* Arrows */}
            <button
              type="button"
              className="hts-arrow"
              aria-label="Testimonio anterior"
              onClick={() => go(current - 1)}
            >
              <ArrowLeft size={13} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hts-arrow"
              aria-label="Siguiente testimonio"
              onClick={() => go(current + 1)}
            >
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export default HighlightTestimonialSection;
