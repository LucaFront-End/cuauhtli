import React, { useState, useMemo, useRef, useId, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Zap,
  Building2,
  PackageCheck,
  Radio
} from 'lucide-react';
import { MEXICO_VIEW_W, MEXICO_VIEW_H, REGIONS, HUBS, STATES } from './mexico-data';
import './mexico-presence-picker.css';

const FULL_VIEW = { s: 1, tx: 0, ty: 0 };

// Response speed tiers for visual emphasis
const TIER_1_STATES = new Set(['cmx', 'mex']); // Valle de México (< 1 hr)
const TIER_2_STATES = new Set(['que', 'gua', 'slp', 'agu', 'jal', 'nle', 'coa', 'pue', 'tla', 'mor', 'hid']); // Corredores Industriales (< 2 hrs)

function fitView(bbox, padding = 1.35, maxScale = 4.2) {
  if (!bbox || bbox.length < 4) return FULL_VIEW;
  const [minX, minY, maxX, maxY] = bbox;
  const w = (maxX - minX) * padding;
  const h = (maxY - minY) * padding;
  if (w <= 0 || h <= 0) return FULL_VIEW;
  
  const s = Math.min(MEXICO_VIEW_W / w, MEXICO_VIEW_H / h, maxScale);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  
  return {
    s: Math.max(1, s),
    tx: Math.round(MEXICO_VIEW_W / 2 - cx * s),
    ty: Math.round(MEXICO_VIEW_H / 2 - cy * s),
  };
}

export default function MexicoPresencePicker({
  defaultRegionId = null, // Default to FULL MEXICO view as requested!
  onSelectZone,
  onOpenQuote,
  className = '',
}) {
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedHubId, setSelectedHubId] = useState(null);
  const [hoveredStateId, setHoveredStateId] = useState(null);
  const [hoveredHubId, setHoveredHubId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);
  const searchInputId = useId();

  const selectedRegion = useMemo(
    () => REGIONS.find((r) => r.id === selectedRegionId) || null,
    [selectedRegionId]
  );

  const selectedState = useMemo(
    () => STATES.find((s) => s.id === selectedStateId) || null,
    [selectedStateId]
  );

  const selectedHub = useMemo(
    () => HUBS.find((h) => h.id === selectedHubId) || null,
    [selectedHubId]
  );

  // Search filter across states, hubs, and postal prefixes
  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    
    return STATES.filter((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const reg = REGIONS.find((r) => r.id === s.regionId);
      const matchHubs = reg?.hubs.some((h) => h.toLowerCase().includes(q));
      const matchPostal = reg?.postalPrefixes.some((p) => q.startsWith(p) || p.startsWith(q));
      return matchName || matchHubs || matchPostal;
    });
  }, [searchQuery]);

  const searchMatchSet = useMemo(
    () => new Set(searchMatches.map((s) => s.id)),
    [searchMatches]
  );

  // Compute zoom & pan view based on selection or search
  const view = useMemo(() => {
    if (searchQuery.trim() && searchMatches.length > 0) {
      const minX = Math.min(...searchMatches.map((m) => m.bbox[0]));
      const minY = Math.min(...searchMatches.map((m) => m.bbox[1]));
      const maxX = Math.max(...searchMatches.map((m) => m.bbox[2]));
      const maxY = Math.max(...searchMatches.map((m) => m.bbox[3]));
      return fitView([minX, minY, maxX, maxY], 1.4);
    }
    
    if (selectedState) {
      return fitView(selectedState.bbox, 1.55);
    }
    
    if (selectedRegion && selectedRegion.bbox) {
      return fitView(selectedRegion.bbox, 1.32);
    }
    
    // Always start at full view of Mexico
    return FULL_VIEW;
  }, [searchQuery, searchMatches, selectedState, selectedRegion]);

  // Selection handlers
  const handleSelectRegion = useCallback((regionId) => {
    setSelectedRegionId(regionId);
    setSelectedStateId(null);
    const reg = REGIONS.find((r) => r.id === regionId);
    if (reg) {
      const primaryHub = HUBS.find((h) => h.regionId === regionId);
      if (primaryHub) setSelectedHubId(primaryHub.id);
      onSelectZone?.(reg);
    }
  }, [onSelectZone]);

  const handleSelectState = useCallback((state) => {
    setSelectedRegionId(state.regionId);
    setSelectedStateId(state.id);
    const reg = REGIONS.find((r) => r.id === state.regionId);
    if (reg) onSelectZone?.({ ...reg, selectedState: state.name });
  }, [onSelectZone]);

  const handleSelectHub = useCallback((hub) => {
    setSelectedHubId(hub.id);
    setSelectedRegionId(hub.regionId);
    setSelectedStateId(null);
    const reg = REGIONS.find((r) => r.id === hub.regionId);
    if (reg) onSelectZone?.({ ...reg, selectedHub: hub.name });
  }, [onSelectZone]);

  const handleResetToNational = useCallback(() => {
    setSelectedRegionId(null);
    setSelectedStateId(null);
    setSelectedHubId(null);
    setSearchQuery('');
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
  };

  const handleMapStateClick = (state) => {
    if (selectedRegionId === state.regionId && selectedStateId === state.id) {
      setSelectedStateId(null);
    } else {
      handleSelectState(state);
    }
  };

  const handleMouseMove = (e) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // State fill colors (Minimalist cohesive palette with response tiers)
  const getStateFill = (state) => {
    const isSelected = selectedRegionId === state.regionId;
    const isStateActive = selectedStateId === state.id;
    const isHovered = hoveredStateId === state.id;

    if (searchQuery.trim()) {
      if (searchMatchSet.has(state.id)) {
        return {
          fill: '#2563eb',
          opacity: isHovered ? 1 : 0.85,
          stroke: '#ffffff',
          strokeWidth: 1.5,
        };
      }
      return {
        fill: '#f8fafc',
        opacity: 0.4,
        stroke: '#e2e8f0',
        strokeWidth: 0.75,
      };
    }

    // FULL NATIONAL VIEW: Highlight response tiers cleanly
    if (!selectedRegionId) {
      if (isHovered) {
        return {
          fill: '#dbeafe',
          opacity: 1,
          stroke: '#3b82f6',
          strokeWidth: 1.5,
        };
      }

      if (TIER_1_STATES.has(state.id)) {
        // Valle de México (< 1 hr priority zone)
        return {
          fill: '#e0e7ff',
          opacity: 0.95,
          stroke: '#c7d2fe',
          strokeWidth: 1,
        };
      }

      if (TIER_2_STATES.has(state.id)) {
        // Corredores Industriales (< 2 hrs)
        return {
          fill: '#f1f5f9',
          opacity: 0.9,
          stroke: '#cbd5e1',
          strokeWidth: 0.8,
        };
      }

      // Rest of Mexico
      return {
        fill: '#f8fafc',
        opacity: 0.75,
        stroke: '#e2e8f0',
        strokeWidth: 0.7,
      };
    }

    // REGION SELECTED VIEW
    if (isSelected) {
      return {
        fill: isStateActive ? '#1d4ed8' : '#2563eb',
        opacity: isStateActive ? 1 : (isHovered ? 0.95 : 0.85),
        stroke: '#ffffff',
        strokeWidth: isStateActive ? 2 : 1.1,
      };
    }

    // Unselected regions fade back gracefully in clean neutral slate
    return {
      fill: isHovered ? '#e2e8f0' : '#f8fafc',
      opacity: 0.4,
      stroke: '#e2e8f0',
      strokeWidth: 0.6,
    };
  };

  const hoveredState = STATES.find((s) => s.id === hoveredStateId);
  const hoveredHub = HUBS.find((h) => h.id === hoveredHubId);
  const isZoomed = view.s > 1.05;

  return (
    <div className={`mxp ${className}`}>
      {/* 1. TOP MINIMALIST REGION TABS & SEARCH */}
      <div className="mxp-bar">
        <div className="mxp-tabs-scroll">
          <button
            type="button"
            className={`mxp-tab ${!selectedRegionId ? 'is-active' : ''}`}
            onClick={handleResetToNational}
          >
            <span>Toda la República</span>
          </button>

          {REGIONS.map((reg) => {
            const isActive = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                className={`mxp-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelectRegion(reg.id)}
              >
                <span>{reg.shortName}</span>
                {reg.id === 1 && <span className="mxp-tab-dot" title="Matriz 24/7 (< 1 hr)" />}
              </button>
            );
          })}
        </div>

        {/* COMPACT SEARCH */}
        <div className="mxp-search-box">
          <Search size={13} className="mxp-search-icon" />
          <input
            id={searchInputId}
            type="text"
            className="mxp-search-input"
            placeholder="Buscar por CP o estado..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              type="button"
              className="mxp-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN BODY (MAP + SLIM DETAIL PANEL) */}
      <div className="mxp-body">
        
        {/* MAP CANVAS */}
        <div 
          ref={mapContainerRef} 
          className="mxp-map-stage"
          onMouseMove={handleMouseMove}
        >
          <svg
            viewBox={`0 0 ${MEXICO_VIEW_W} ${MEXICO_VIEW_H}`}
            className="mxp-svg"
            role="img"
            aria-label="Mapa interactivo de cobertura nacional de Sistemas Cuauhtli"
            onMouseLeave={() => { setHoveredStateId(null); setHoveredHubId(null); }}
          >
            <g
              className="mxp-zoom-layer"
              style={{
                transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.s})`,
                transformOrigin: '0 0',
              }}
            >
              {/* 32 STATE PATHS */}
              {STATES.map((s) => {
                const style = getStateFill(s);
                return (
                  <path
                    key={s.id}
                    id={`mx-state-${s.id}`}
                    d={s.d}
                    className="mxp-state-path"
                    fill={style.fill}
                    fillOpacity={style.opacity}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeLinejoin="round"
                    onMouseEnter={() => setHoveredStateId(s.id)}
                    onClick={() => handleMapStateClick(s)}
                  />
                );
              })}

              {/* OPERATIONAL HUBS — HIGHLY REFINED, PRECISE & CRISP */}
              {HUBS.map((hub) => {
                const isSelected = selectedHubId === hub.id;
                const isHovered = hoveredHubId === hub.id;
                const [hx, hy] = hub.coords;
                const isTier1 = hub.regionId === 1;

                // Scale counter-balance: stays crisp at all zoom levels
                const scaleFactor = Math.max(0.65, 1 / Math.sqrt(view.s));

                return (
                  <g
                    key={hub.id}
                    className={`mxp-pin ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''}`}
                    transform={`translate(${hx}, ${hy}) scale(${scaleFactor})`}
                    onMouseEnter={() => { setHoveredHubId(hub.id); setHoveredStateId(null); }}
                    onClick={() => handleSelectHub(hub)}
                  >
                    {/* Subtle radar aura */}
                    <circle
                      r={isHovered ? 13 : isSelected ? 11 : isTier1 ? 9 : 7}
                      className={`mxp-pin-aura ${isTier1 ? 'is-tier1' : ''}`}
                    />

                    {/* Outer ring */}
                    <circle
                      r={isHovered ? 4.8 : isSelected ? 4.4 : 3.4}
                      className="mxp-pin-ring"
                      fill={isSelected ? '#1d4ed8' : isHovered ? '#0284c7' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />

                    {/* Glowing white core */}
                    <circle 
                      r={isHovered ? 2 : 1.4} 
                      fill="#ffffff" 
                    />

                    {/* Clean Apple-style City & SLA Micro-Tag */}
                    <text
                      x="0"
                      y={isHovered ? -9 : -8}
                      textAnchor="middle"
                      className={`mxp-pin-text ${isSelected || isHovered ? 'is-active' : ''}`}
                    >
                      {hub.shortName}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* RESPONSE TIERS MINIMALIST LEGEND */}
          <div className="mxp-legend">
            <div className="mxp-legend-item">
              <span className="mxp-legend-dot is-tier1" />
              <span>&lt; 1 hr (Valle de México)</span>
            </div>
            <div className="mxp-legend-item">
              <span className="mxp-legend-dot is-tier2" />
              <span>&lt; 2 hrs (Corredores Industriales)</span>
            </div>
            <div className="mxp-legend-item">
              <span className="mxp-legend-dot is-tier3" />
              <span>Red Nacional 24/7</span>
            </div>
          </div>

          {/* FLOATING MICRO-TOOLTIP */}
          {(hoveredHub || hoveredState) && (
            <div 
              className="mxp-micro-tooltip"
              style={{
                left: `${Math.min(Math.max(12, mousePos.x + 14), 480)}px`,
                top: `${Math.max(12, mousePos.y - 36)}px`,
              }}
            >
              {hoveredHub ? (
                <div className="mxp-tt-content">
                  <span className="mxp-tt-dot" />
                  <strong>{hoveredHub.name}</strong>
                  <span className="mxp-tt-time">⚡ {hoveredHub.response}</span>
                </div>
              ) : (
                <div className="mxp-tt-content">
                  <span>{hoveredState.name}</span>
                  <span className="mxp-tt-sub">
                    {REGIONS.find((r) => r.id === hoveredState.regionId)?.shortName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* MINIMAL RESET VIEW BUTTON (WHEN ZOOMED) */}
          {isZoomed && (
            <button
              type="button"
              className="mxp-reset-btn"
              onClick={handleResetToNational}
              title="Restablecer vista a toda la República"
            >
              <RotateCcw size={12} />
              <span>Ver Todo México</span>
            </button>
          )}
        </div>

        {/* RIGHT DETAIL PANEL — ULTRA-MINIMALIST & CLEAN */}
        <div className="mxp-panel">
          {selectedRegion ? (
            <div className="mxp-card">
              <div className="mxp-card-status">
                <span className="mxp-status-live" />
                <span>Cuadrilla activa 24/7</span>
              </div>

              <h3 className="mxp-card-title">
                {selectedHub ? selectedHub.name : selectedRegion.name}
              </h3>

              {/* HERO TIME METRIC */}
              <div className="mxp-metric-card">
                <span className="mxp-metric-caption">Tiempo de arribo</span>
                <div className="mxp-metric-number">
                  <Zap size={18} className="mxp-metric-bolt" />
                  <span>{selectedHub ? selectedHub.response : selectedRegion.badge.replace('Respuesta ', '')}</span>
                </div>
              </div>

              {/* COMPACT CHIPS */}
              <div className="mxp-chip-row">
                <span className="mxp-chip">Stock local</span>
                <span className="mxp-chip">Refacciones en sitio</span>
                <span className="mxp-chip">{selectedRegion.projects}</span>
              </div>

              {/* QUICK HUBS (CLICKABLE) */}
              <div className="mxp-hubs-compact">
                <span className="mxp-hubs-caption">Puntos de despacho:</span>
                <div className="mxp-hubs-pills">
                  {HUBS.filter((h) => h.regionId === selectedRegion.id).map((h) => {
                    const isCur = selectedHubId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        className={`mxp-hub-btn ${isCur ? 'is-active' : ''}`}
                        onClick={() => handleSelectHub(h)}
                        onMouseEnter={() => setHoveredHubId(h.id)}
                        onMouseLeave={() => setHoveredHubId(null)}
                      >
                        {h.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUBTLE PROTOCOL TIMELINE */}
              <div className="mxp-protocol-box">
                <span className="mxp-protocol-title">Protocolo de Respuesta Rápida:</span>
                <div className="mxp-protocol-steps">
                  <div className="mxp-pstep">
                    <span className="mxp-pstep-num">1</span>
                    <span className="mxp-pstep-txt">Reporte C4</span>
                  </div>
                  <div className="mxp-pstep-arrow">→</div>
                  <div className="mxp-pstep">
                    <span className="mxp-pstep-num">2</span>
                    <span className="mxp-pstep-txt">Despacho</span>
                  </div>
                  <div className="mxp-pstep-arrow">→</div>
                  <div className="mxp-pstep is-accent">
                    <span className="mxp-pstep-num">3</span>
                    <span className="mxp-pstep-txt">En sitio {selectedHub ? selectedHub.response : selectedRegion.badge.replace('Respuesta ', '')}</span>
                  </div>
                </div>
              </div>

              {/* SUBTLE SLA GUARANTEE FOOTNOTE */}
              <div className="mxp-guarantee-strip">
                <ShieldCheck size={13} className="mxp-guarantee-icon" />
                <span>Tiempo de arribo garantizado por contrato SLA</span>
              </div>

              {/* DIRECT ACTION CTA */}
              <button
                type="button"
                className="mxp-cta-btn"
                onClick={() => onOpenQuote?.(selectedRegion.name)}
              >
                <span>Cotizar en {selectedRegion.shortName}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            /* DEFAULT NATIONAL VIEW CARD — PUNCHY & MINIMALIST */
            <div className="mxp-card">
              <div className="mxp-card-status">
                <span className="mxp-status-live" />
                <span>7 Hubs Estratégicos</span>
              </div>

              <h3 className="mxp-card-title">Cobertura Nacional</h3>

              {/* HERO TIME METRIC */}
              <div className="mxp-metric-card">
                <span className="mxp-metric-caption">Respuesta en corredores</span>
                <div className="mxp-metric-number">
                  <Zap size={18} className="mxp-metric-bolt" />
                  <span>&lt; 1 a 2 hrs</span>
                </div>
              </div>

              {/* COMPACT CHIPS */}
              <div className="mxp-chip-row">
                <span className="mxp-chip">Valle de México</span>
                <span className="mxp-chip">Bajío</span>
                <span className="mxp-chip">Norte</span>
                <span className="mxp-chip">Occidente</span>
              </div>

              {/* QUICK HUB SELECTOR */}
              <div className="mxp-hubs-compact">
                <span className="mxp-hubs-caption">Explorar base operativa:</span>
                <div className="mxp-hubs-pills">
                  {HUBS.slice(0, 6).map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      className="mxp-hub-btn"
                      onClick={() => handleSelectHub(h)}
                      onMouseEnter={() => setHoveredHubId(h.id)}
                      onMouseLeave={() => setHoveredHubId(null)}
                    >
                      {h.shortName}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBTLE TIERS BREAKDOWN */}
              <div className="mxp-protocol-box">
                <span className="mxp-protocol-title">Despliegue Operativo:</span>
                <div className="mxp-tiers-list">
                  <div className="mxp-tier-row">
                    <span className="mxp-tier-dot is-tier1" />
                    <span className="mxp-tier-name">Valle de México</span>
                    <span className="mxp-tier-val">&lt; 1 hr</span>
                  </div>
                  <div className="mxp-tier-row">
                    <span className="mxp-tier-dot is-tier2" />
                    <span className="mxp-tier-name">Bajío & Corredores</span>
                    <span className="mxp-tier-val">&lt; 2 hrs</span>
                  </div>
                  <div className="mxp-tier-row">
                    <span className="mxp-tier-dot is-tier3" />
                    <span className="mxp-tier-name">Red Nacional</span>
                    <span className="mxp-tier-val">Soporte 24/7</span>
                  </div>
                </div>
              </div>

              {/* SUBTLE CERTIFICATION BADGE */}
              <div className="mxp-guarantee-strip">
                <CheckCircle2 size={13} className="mxp-guarantee-icon" />
                <span>Personal certificado con refacciones en almacén</span>
              </div>

              <button
                type="button"
                className="mxp-cta-btn"
                onClick={() => onOpenQuote?.('Cobertura Nacional')}
              >
                <span>Consultar disponibilidad</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
