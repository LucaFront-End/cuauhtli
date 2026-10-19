import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { ArrowRight, Bell, Check, Lock, ShieldAlert, ShieldCheck, Unlock } from "lucide-react";
import "./features-with-panel.css";
import CctvIsometricScene from "../services/heroes/CctvIsometricScene";
import AccessIsometricScene from "../services/heroes/AccessIsometricScene";
import AlarmIsometricScene from "../services/heroes/AlarmIsometricScene";
import FenceIsometricScene from "../services/heroes/FenceIsometricScene";
import IntercomIsometricScene from "../services/heroes/IntercomIsometricScene";

const IMG = {
  entrance: "/assets/features/entrance.jpg",
  face: "/assets/features/face.jpg",
  parking: "/assets/features/parking.jpg",
  warehouse: "/assets/features/warehouse.jpg",
  lobby: "/assets/features/lobby.jpg",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

function useTicker(ms, count) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => clearInterval(id);
  }, [ms, count]);
  return i;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const pad = (n) => String(n).padStart(2, "0");
const fmtStamp = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}  ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

const loop = (duration, times, ease = "easeInOut") => ({ duration, times, repeat: Infinity, ease });

/* Every scene is drawn on a 560x420 artboard and scaled to cover the panel. */
const AB_W = 560;
const AB_H = 420;

function Artboard({ children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = (w, h) => setScale(Math.max(w / AB_W, h / AB_H));
    measure(el.clientWidth, el.clientHeight);
    const ro = new ResizeObserver(([entry]) => {
      measure(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="fwp-ab-host">
      <div className="fwp-ab" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function DetBox({ x, y, w, h, label, tone = "blue", ...motionProps }) {
  return (
    <motion.div
      className={`fwp-det fwp-det--${tone}`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
      {...motionProps}
    >
      <i className="tl" />
      <i className="tr" />
      <i className="bl" />
      <i className="br" />
      <span className="fwp-det-label">{label}</span>
    </motion.div>
  );
}

function FeedFx() {
  return (
    <>
      <div className="fwp-noise" />
      <div className="fwp-vignette" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* 1 — Videovigilancia con IA                                                 */
/* -------------------------------------------------------------------------- */

const PERSON = { x: 48.5, y: 48.5, w: 9.5, h: 22.5 };
const jitter = { duration: 1.3, repeat: Infinity, ease: "easeInOut" };

function CameraScene() {
  const now = useClock();
  const D = 9;

  return (
    <Artboard>
      <div className="fwp-feed">
        <motion.div
          className="fwp-feed-zoom"
          style={{ transformOrigin: "53% 60%" }}
          animate={{ scale: [1, 1, 1.6, 1.6, 1] }}
          transition={loop(D, [0, 0.3, 0.46, 0.76, 0.92])}
        >
          <img className="fwp-feed-img" src={IMG.entrance} alt="" />

          <svg className="fwp-zone" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.polygon
              points="31,67 46,51 64,59 50,79"
              fill="#EF4444"
              stroke="rgba(239,68,68,0.9)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke"
              animate={{ fillOpacity: [0.06, 0.06, 0.28, 0.1, 0.28, 0.06, 0.06] }}
              transition={loop(D, [0, 0.38, 0.46, 0.56, 0.66, 0.86, 1])}
            />
          </svg>
          <span className="fwp-zone-label" style={{ left: "40%", top: "46%" }}>Zona restringida</span>

          <DetBox
            {...PERSON}
            label="Persona · 98%"
            animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [1.25, 1.25, 1, 1, 1, 1], x: [0, 1.5, -1, 0.5, 0] }}
            transition={{ default: loop(D, [0, 0.11, 0.16, 0.38, 0.41, 1]), x: jitter }}
          />
          <DetBox
            {...PERSON}
            tone="red"
            label="Intrusión · Persona"
            animate={{ opacity: [0, 0, 1, 1, 0], x: [0, 1.5, -1, 0.5, 0] }}
            transition={{ default: loop(D, [0, 0.38, 0.41, 0.9, 0.95]), x: jitter }}
          />
          <DetBox
            x={86}
            y={47.5}
            w={13.5}
            h={15.5}
            tone="green"
            label="Vehículo · 96%"
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [1.2, 1.2, 1, 1, 1] }}
            transition={loop(D, [0, 0.13, 0.18, 0.9, 0.95])}
          />
        </motion.div>

        <motion.div
          className="fwp-sweep"
          animate={{ top: ["-18%", "100%", "100%", "100%"], opacity: [1, 1, 0, 0] }}
          transition={loop(D, [0, 0.12, 0.13, 1], "linear")}
        />

        <FeedFx />

        <div className="fwp-hud" style={{ left: 14, top: 14 }}>
          <i className="fwp-rec" />
          <span>REC</span>
          <span className="sep" />
          <span>CAM 04 · Acceso principal</span>
        </div>
        <div className="fwp-hud fwp-tab" style={{ right: 14, top: 14 }}>{fmtStamp(now)}</div>
        <motion.div
          className="fwp-hud"
          style={{ right: 14, top: 44 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={loop(D, [0, 0.3, 0.35, 0.76, 0.82])}
        >
          Auto‑seguimiento · 1.6×
        </motion.div>
        <div className="fwp-hud" style={{ right: 14, bottom: 14 }}>IA · 4K · 30 fps</div>

        <motion.div
          className="fwp-card fwp-alert"
          animate={{ opacity: [0, 0, 1, 1, 0], y: [12, 12, 0, 0, 6] }}
          transition={loop(D, [0, 0.42, 0.48, 0.88, 0.94])}
        >
          <span className="fwp-alert-icon"><ShieldAlert size={16} /></span>
          <div>
            <div className="fwp-card-title">Intrusión en zona restringida</div>
            <div className="fwp-card-sub">Central notificada · 0.4 s</div>
          </div>
        </motion.div>
      </div>
    </Artboard>
  );
}

/* -------------------------------------------------------------------------- */
/* 2 — Acceso biométrico                                                      */
/* -------------------------------------------------------------------------- */

const LM = {
  fh: [51, 28], tL: [37.8, 37], tR: [64.3, 37], cL: [39.5, 50], cR: [63, 50],
  jL: [41, 62.5], jR: [61.5, 62.5], ch: [51, 73],
  bLo: [41.5, 38.5], bLi: [47.8, 38.6], bRi: [54.3, 38.6], bRo: [60.6, 38.5],
  eL: [44.6, 42.2], eR: [57.3, 42.2], nb: [51, 44.8], nt: [51, 52.5], nL: [47.9, 53.6], nR: [54.2, 53.6],
  mL: [46.3, 60.3], mR: [55.7, 60.3], mc: [51, 60.8],
};
const LM_KEYS = Object.keys(LM);
const MESH = [
  ["fh", "tL"], ["tL", "cL"], ["cL", "jL"], ["jL", "ch"], ["ch", "jR"], ["jR", "cR"], ["cR", "tR"], ["tR", "fh"],
  ["bLo", "bLi"], ["bRi", "bRo"], ["fh", "bLi"], ["fh", "bRi"], ["eL", "bLi"], ["eR", "bRi"],
  ["eL", "nb"], ["eR", "nb"], ["nb", "nt"], ["nt", "nL"], ["nt", "nR"], ["nL", "mL"], ["nR", "mR"],
  ["mL", "mc"], ["mc", "mR"], ["mc", "ch"], ["eL", "cL"], ["eR", "cR"], ["mL", "jL"], ["mR", "jR"],
];
const FACE_FRAME = { left: "33%", top: "20%", width: "36%", height: "60%" };

function FaceScene() {
  const D = 6;
  const corner = {
    animate: { borderColor: ["#FFFFFF", "#FFFFFF", "#34D399", "#34D399", "#FFFFFF"] },
    transition: loop(D, [0, 0.5, 0.54, 0.9, 1]),
  };

  return (
    <Artboard>
      <div className="fwp-feed">
        <motion.img
          className="fwp-feed-img"
          src={IMG.face}
          alt=""
          animate={{ scale: [1.05, 1] }}
          transition={{ duration: D, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />

        <motion.div
          className="fwp-spot"
          style={{ left: "36%", top: "22%", width: "30%", height: "55%" }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={loop(D, [0, 0.06, 0.9, 1])}
        />

        <motion.div
          className="fwp-faceframe"
          style={FACE_FRAME}
          animate={{ opacity: [0, 1, 1, 0], scale: [1.12, 1, 1, 1] }}
          transition={loop(D, [0, 0.06, 0.9, 1])}
        >
          {["tl", "tr", "bl", "br"].map((c) => (
            <motion.i key={c} className={c} {...corner} />
          ))}
        </motion.div>

        <svg className="fwp-mesh" viewBox="0 0 100 100" preserveAspectRatio="none">
          {MESH.map(([a, b], i) => (
            <motion.line
              key={`${a}-${b}`}
              x1={LM[a][0]} y1={LM[a][1]} x2={LM[b][0]} y2={LM[b][1]}
              stroke="#BFDBFE"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
              animate={{ opacity: [0, 0, 0.6, 0.6, 0] }}
              transition={loop(D, [0, 0.22 + i * 0.008, 0.3 + i * 0.008, 0.9, 1])}
            />
          ))}
        </svg>

        {LM_KEYS.map((k, i) => (
          <motion.span
            key={k}
            className="fwp-lm"
            style={{ left: `${LM[k][0]}%`, top: `${LM[k][1]}%` }}
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0, 0, 1, 1, 0] }}
            transition={loop(D, [0, 0.1 + i * 0.015, 0.14 + i * 0.015, 0.9, 1])}
          />
        ))}

        <motion.div
          className="fwp-face-scan"
          style={{ left: "34%", width: "34%" }}
          animate={{ top: ["21%", "21%", "79%", "79%", "79%"], opacity: [0, 1, 1, 0, 0] }}
          transition={loop(D, [0, 0.08, 0.46, 0.5, 1])}
        />

        <FeedFx />

        <div className="fwp-hud" style={{ left: 14, top: 14 }}>
          <i className="fwp-live" />
          <span>Terminal CU‑300</span>
          <span className="sep" />
          <span>Acceso norte</span>
        </div>
        <motion.div
          className="fwp-hud"
          style={{ right: 14, top: 14 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={loop(D, [0, 0.42, 0.46, 0.9, 0.96])}
        >
          <Check size={11} color="#34D399" strokeWidth={3} />
          Prueba de vida 3D
        </motion.div>

        {/* analyzing */}
        <motion.div
          className="fwp-card fwp-result"
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={loop(D, [0, 0.08, 0.12, 0.48, 0.52, 1])}
        >
          <div style={{ flex: 1 }}>
            <div className="fwp-card-title">Analizando rostro…</div>
            <div className="fwp-card-sub">Comparando 128 puntos biométricos</div>
            <div className="fwp-bar">
              <motion.span
                animate={{ scaleX: [0, 0, 1, 1] }}
                transition={loop(D, [0, 0.1, 0.48, 1], "linear")}
              />
            </div>
          </div>
        </motion.div>

        {/* result */}
        <motion.div
          className="fwp-card fwp-result"
          animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 0] }}
          transition={loop(D, [0, 0.52, 0.58, 0.9, 0.96])}
        >
          <span className="fwp-avatar" style={{ backgroundImage: `url(${IMG.face})` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="fwp-card-title">Carlos Mendoza</div>
            <div className="fwp-card-sub">Ingeniería · Nivel 2</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span className="fwp-badge-ok"><Check size={10} strokeWidth={3} />Autorizado</span>
            <span className="fwp-card-sub fwp-tab">0.21 s</span>
          </div>
        </motion.div>
      </div>
    </Artboard>
  );
}

/* -------------------------------------------------------------------------- */
/* 3 — Alarmas y sensores (isometric plan)                                    */
/* -------------------------------------------------------------------------- */

const WALLS =
  "M84 216 H316 Q326 216 326 206 V14 Q326 4 316 4 H14 Q4 4 4 14 V206 Q4 216 14 216 H40 " +
  "M130 4 V86 M130 124 V216 M130 124 H196 M236 124 H326";
const WALL_LAYERS = 8;

const PATH = [[62, 238], [62, 182], [100, 108], [150, 106], [216, 106], [216, 150], [258, 170]];
const PATH_T = (() => {
  const seg = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let acc = 0;
  return [0, ...seg.map((s) => (acc += s) / total)].map((t) => 0.04 + t * 0.44);
})();
const PATH_D = `M${PATH.map((p) => p.join(" ")).join(" L")}`;

function AlarmScene() {
  const D = 8;
  const alertT = [0, 0.47, 0.5, 0.88, 0.94];
  const pathTransition = { duration: D, repeat: Infinity, ease: "linear", times: [0, ...PATH_T, 1] };

  return (
    <Artboard>
      <div className="fwp-light" />
      <div className="fwp-glow" style={{ top: "58%" }} />

      <div className="fwp-iso-wrap">
        <div className="fwp-iso">
          <div className="fwp-iso-shadow" />
          <div className="fwp-iso-slab" />

          {/* floor */}
          <svg className="fwp-iso-layer" viewBox="0 0 330 220">
            <rect x="0" y="0" width="330" height="220" rx="12" fill="#F8FAFC" />
            <motion.rect
              x="130" y="124" width="196" height="92" fill="#EF4444"
              animate={{ fillOpacity: [0, 0, 0.12, 0.12, 0] }}
              transition={loop(D, alertT)}
            />

            <g fontSize="9" fontWeight="700" fill="#94A3B8" letterSpacing="1.2">
              <text x="22" y="200">OFICINA</text>
              <text x="150" y="30">RECEPCIÓN</text>
              <text x="146" y="204">BODEGA</text>
            </g>

            <path d="M14 14 L90.5 37.4 A80 80 0 0 1 37.4 90.5 Z" fill="rgba(37,99,235,0.08)" />
            <path d="M316 14 L292.6 90.5 A80 80 0 0 1 239.5 37.4 Z" fill="rgba(37,99,235,0.08)" />
            <motion.path
              d="M316 206 L234.7 181.1 A85 85 0 0 1 291.1 124.7 Z"
              animate={{ fill: ["rgba(37,99,235,0.1)", "rgba(37,99,235,0.1)", "rgba(239,68,68,0.28)", "rgba(239,68,68,0.28)", "rgba(37,99,235,0.1)"] }}
              transition={loop(D, alertT)}
            />

            <motion.path
              d={PATH_D}
              fill="none"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.55"
              animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 1, 1, 0, 0] }}
              transition={loop(D, [0, 0.04, 0.48, 0.88, 0.94], "linear")}
            />

            <motion.g animate={{ opacity: [0, 0, 1, 1, 0] }} transition={loop(D, alertT)}>
              {[0, 0.65].map((delay) => (
                <motion.circle
                  key={delay}
                  cx="316" cy="206" fill="#EF4444"
                  animate={{ r: [4, 34], opacity: [0.45, 0] }}
                  transition={{ duration: 1.3, delay, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
            </motion.g>

            {[[14, 14], [316, 14]].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#2563EB" stroke="#fff" strokeWidth="2" />
            ))}
            <motion.circle
              cx="316" cy="206" r="4.5" stroke="#fff" strokeWidth="2"
              animate={{ fill: ["#2563EB", "#2563EB", "#EF4444", "#EF4444", "#2563EB"] }}
              transition={loop(D, alertT)}
            />
            <rect x="56" y="212" width="12" height="6" rx="2" fill="#2563EB" />

            <motion.circle
              r="5" fill="#EF4444" stroke="#fff" strokeWidth="2"
              animate={{
                cx: [PATH[0][0], ...PATH.map((p) => p[0]), PATH[PATH.length - 1][0]],
                cy: [PATH[0][1], ...PATH.map((p) => p[1]), PATH[PATH.length - 1][1]],
                opacity: [0, 1, 1, 0, 0],
              }}
              transition={{
                cx: pathTransition,
                cy: pathTransition,
                opacity: loop(D, [0, 0.04, 0.88, 0.93, 1], "linear"),
              }}
            />
          </svg>

          {/* extruded walls */}
          {Array.from({ length: WALL_LAYERS }).map((_, i) => (
            <svg
              key={i}
              className="fwp-iso-layer"
              viewBox="0 0 330 220"
              style={{ transform: `translateZ(${(i + 1) * 2.4}px)` }}
            >
              <path
                d={WALLS}
                fill="none"
                stroke={i === WALL_LAYERS - 1 ? "#FFFFFF" : "#B9C4D2"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* status */}
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <motion.div
          className="fwp-status-chip"
          animate={{ opacity: [1, 1, 0, 0, 1] }}
          transition={loop(D, alertT)}
        >
          <i className="fwp-live" />
          Sistema armado
        </motion.div>
        <motion.div
          className="fwp-status-chip"
          style={{ background: "#EF4444", color: "#fff", borderColor: "#EF4444" }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={loop(D, alertT)}
        >
          <ShieldAlert size={13} />
          Alarma · Bodega
        </motion.div>
      </div>

      <motion.div
        className="fwp-card fwp-steps"
        animate={{ opacity: [0, 0, 1, 1, 0], y: [-8, -8, 0, 0, -8] }}
        transition={loop(D, [0, 0.5, 0.56, 0.88, 0.94])}
      >
        <div className="fwp-steps-head">
          <span className="fwp-card-title">Intrusión detectada</span>
          <span className="fwp-card-sub fwp-tab">0.3 s</span>
        </div>
        {["Sensor de movimiento", "Sirena 110 dB activada", "Central notificada"].map((s, i) => (
          <motion.div
            key={s}
            className="fwp-step"
            animate={{ opacity: [0, 0, 1, 1], x: [-4, -4, 0, 0] }}
            transition={loop(D, [0, 0.58 + i * 0.07, 0.62 + i * 0.07, 1])}
          >
            <span className="fwp-step-check"><Check size={9} strokeWidth={3.5} /></span>
            {s}
          </motion.div>
        ))}
      </motion.div>
    </Artboard>
  );
}

/* -------------------------------------------------------------------------- */
/* 4 — Monitoreo 24/7 (video wall)                                            */
/* -------------------------------------------------------------------------- */

const FEEDS = [
  { id: "entrance", src: IMG.entrance, name: "Acceso principal", box: { ...PERSON, label: "Persona · 98%" } },
  { id: "parking", src: IMG.parking, name: "Estacionamiento", box: { x: 51, y: 56.5, w: 17, h: 14.5, label: "Vehículo · 96%", tone: "green" } },
  { id: "warehouse", src: IMG.warehouse, name: "Almacén", box: { x: 45, y: 61.5, w: 8.5, h: 25, label: "Persona · 97%" } },
  { id: "lobby", src: IMG.lobby, name: "Recepción", box: { x: 62, y: 41.5, w: 12, h: 29, label: "Acceso válido", tone: "green" } },
];
const AREAS = ["1 / 1 / 4 / 2", "1 / 2 / 2 / 3", "2 / 2 / 3 / 3", "3 / 2 / 4 / 3"];
const tileSpring = { type: "spring", stiffness: 210, damping: 30 };

function MonitorScene() {
  const now = useClock();
  const focus = useTicker(2800, FEEDS.length);
  const order = [focus, ...FEEDS.map((_, i) => i).filter((i) => i !== focus)];

  return (
    <Artboard>
      <div className="fwp-wall">
        <div className="fwp-wall-head">
          <div>
            <i className="fwp-live" />
            Central de monitoreo
          </div>
          <div className="fwp-wall-meta">
            <span>4/4 en línea</span>
            <span>·</span>
            <span>Operador 07</span>
            <span>·</span>
            <span className="fwp-tab">{fmtStamp(now).split("  ")[1]}</span>
          </div>
        </div>

        <div className="fwp-wall-grid">
          {FEEDS.map((f, i) => {
            const slot = order.indexOf(i);
            const isBig = slot === 0;
            return (
              <motion.div
                key={f.id}
                layout
                transition={{ layout: tileSpring }}
                className={`fwp-wtile${isBig ? " is-big" : ""}`}
                style={{ gridArea: AREAS[slot] }}
              >
                <motion.div layout transition={{ layout: tileSpring }} className="fwp-wframe" style={{ translate: "-50% 0" }}>
                  <motion.img
                    className="fwp-feed-img"
                    src={f.src}
                    alt=""
                    animate={{ scale: [1, 1.08] }}
                    transition={{ duration: 8 + i * 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                  />
                  <AnimatePresence>
                    {isBig && (
                      <DetBox
                        key={`det-${focus}`}
                        {...f.box}
                        initial={{ opacity: 0, scale: 1.25 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.75, duration: 0.35 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span layout="position" transition={{ layout: tileSpring }} className="fwp-wlabel">
                  <i className="fwp-rec" />
                  CAM 0{i + 1} · {f.name}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
      <FeedFx />
    </Artboard>
  );
}

/* -------------------------------------------------------------------------- */
/* 5 — Control desde tu celular                                               */
/* -------------------------------------------------------------------------- */

function PhoneScene() {
  const now = useClock();
  const step = useTicker(1400, 5); // 0 idle · 1 alert · 2 tap · 3-4 open
  const open = step >= 3;

  const activity = [
    ...(step >= 3 ? [{ id: "open", dot: "#10B981", text: "Abriste el portón", time: fmtTime(now) }] : []),
    ...(step >= 1 ? [{ id: "person", dot: "#EF4444", text: "Persona en acceso", time: fmtTime(now) }] : []),
    { id: "armed", dot: "#2563EB", text: "Sistema armado", time: "08:00" },
  ].slice(0, 3);

  return (
    <Artboard>
      <div className="fwp-light" />
      <div className="fwp-glow" />

      <motion.div
        className="fwp-float"
        style={{ left: 34, top: 96 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="fwp-float-icon" style={{ background: "#EFF6FF", color: "#2563EB" }}><Bell size={13} /></span>
        <div>
          <div className="fwp-card-title" style={{ fontSize: 11 }}>Alerta en 0.8 s</div>
          <div className="fwp-card-sub" style={{ fontSize: 9.5 }}>Notificación push</div>
        </div>
      </motion.div>

      <motion.div
        className="fwp-float"
        style={{ right: 30, bottom: 92 }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="fwp-float-icon" style={{ background: "#ECFDF5", color: "#059669" }}><ShieldCheck size={13} /></span>
        <div>
          <div className="fwp-card-title" style={{ fontSize: 11 }}>Cifrado AES‑256</div>
          <div className="fwp-card-sub" style={{ fontSize: 9.5 }}>De extremo a extremo</div>
        </div>
      </motion.div>

      <div className="fwp-phone">
        <div className="fwp-screen">
          <span className="fwp-island" />
          <div className="fwp-statusbar">
            <span className="fwp-tab">{fmtTime(now)}</span>
            <span>5G</span>
          </div>

          <AnimatePresence mode="wait">
            {step >= 1 && (
              <motion.div
                key={open ? "n-open" : "n-person"}
                className="fwp-notif"
                initial={{ opacity: 0, y: -18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              >
                <span className="fwp-notif-icon">{open ? <Unlock size={11} /> : <Bell size={11} />}</span>
                <div className="fwp-notif-txt">
                  <div className="fwp-notif-app"><span>CUAUHTLI</span><span>ahora</span></div>
                  <strong>{open ? "Portón abierto" : "Persona en acceso principal"}</strong>
                </div>
                {!open && <span className="fwp-notif-thumb" style={{ backgroundImage: `url(${IMG.entrance})` }} />}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fwp-app-head">
            <span className="fwp-app-title">Oficina Reforma</span>
            <span className="fwp-app-chip"><i className="fwp-live" style={{ width: 5, height: 5 }} />Armado</span>
          </div>

          <div className="fwp-app-cam">
            <div className="fwp-wframe-w">
              <img className="fwp-feed-img" src={IMG.entrance} alt="" />
              <AnimatePresence>
                {step >= 1 && (
                  <DetBox
                    {...PERSON}
                    label="Persona"
                    tone={open ? "green" : "red"}
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="fwp-hud" style={{ left: 6, top: 6 }}><i className="fwp-rec" style={{ width: 4, height: 4 }} />EN VIVO</div>
          </div>

          <motion.div
            className="fwp-app-btn"
            animate={{ backgroundColor: open ? "#10B981" : "#0B1120" }}
            transition={{ duration: 0.3 }}
          >
            {open ? <Unlock size={13} /> : <Lock size={13} />}
            {open ? "Portón abierto" : "Abrir portón"}
            <AnimatePresence>
              {step === 2 && (
                <motion.span
                  className="fwp-tap"
                  initial={{ scale: 0.2, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          <span className="fwp-act-title">Actividad</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <AnimatePresence initial={false}>
              {activity.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  className="fwp-act"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="fwp-act-dot" style={{ background: a.dot }} />
                  {a.text}
                  <time>{a.time}</time>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Artboard>
  );
}

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const ITEMS = [
  {
    title: "Videovigilancia con IA",
    desc: "Cámaras PTZ 4K con auto-seguimiento, lectura de placas LPR y analítica perimetral en tiempo real.",
    Scene: CctvIsometricScene,
    slug: "cctv",
  },
  {
    title: "Control de Acceso Biométrico",
    desc: "Torniquetes speed-gate con reconocimiento facial 3D liveness, código QR y tarjetas RFID.",
    Scene: AccessIsometricScene,
    slug: "control-acceso",
  },
  {
    title: "Alarmas Inteligentes & C4",
    desc: "Sensores dual-tech PIR de microondas, panel DSC Neo y enlace celular 4G encriptado a central.",
    Scene: AlarmIsometricScene,
    slug: "alarmas",
  },
  {
    title: "Cercas de Alto Voltaje",
    desc: "Pulsos disuasivos de 10 kV, sensores de flexión, corte y supervisión continua homologada NOM.",
    Scene: FenceIsometricScene,
    slug: "cercas-electrificadas",
  },
  {
    title: "Videoporteros IP & Intercom",
    desc: "Apertura remota de chapas magnéticas, video HD 2K y comunicación de audio bidireccional desde app.",
    Scene: IntercomIsometricScene,
    slug: "videoporteros",
  },
];

/* -------------------------------------------------------------------------- */
/* Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function FeaturesWithPanel({ onOpenQuote }) {
  const isDesktop = useIsDesktop();
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const itemProgress = useMotionValue(0);

  // Pinned scroll: the section is tall, its content stays sticky,
  // and scroll progress through the section decides the active feature.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isDesktop) return;
    const scaled = Math.min(Math.max(v, 0), 0.9999) * ITEMS.length;
    const idx = Math.floor(scaled);
    itemProgress.set(scaled - idx);
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const goTo = (index) => {
    setActive(index);
    if (!isDesktop) return;
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.02) / ITEMS.length),
      behavior: "smooth",
    });
  };

  const ActiveScene = ITEMS[active].Scene;

  return (
    <section
      id="caracteristicas"
      ref={sectionRef}
      className={`fwp${isDesktop ? " fwp--pinned" : ""}`}
      style={isDesktop ? { height: `calc(100vh + ${ITEMS.length} * 60vh)` } : undefined}
    >
      <div className="fwp-sticky">
        <div className="fwp-grid">
          <div>
            <div className="fwp-top">
              <span className="fwp-eyebrow">
                <span className="fwp-eyebrow-dot" />
                Soluciones
              </span>
              <span className="fwp-counter">
                <span className="fwp-counter-win">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-100%" }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {pad(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                / {pad(ITEMS.length)}
              </span>
            </div>

            <h2 className="fwp-heading">
              Seguridad que <em>nunca duerme.</em>
            </h2>
            <p className="fwp-sub">Cinco capas de protección, integradas en una sola plataforma.</p>

            <ul className="fwp-list">
              {ITEMS.map((item, index) => {
                const isActive = active === index;
                const isDone = index < active;
                const { Scene } = item;
                return (
                  <motion.li
                    key={item.title}
                    className={`fwp-item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
                    onClick={() => goTo(index)}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
                  >
                    <span className="fwp-rail">
                      <motion.span
                        className="fwp-rail-fill"
                        style={{ scaleY: isActive ? (isDesktop ? itemProgress : 1) : isDone ? 1 : 0 }}
                      />
                    </span>
                    <span className="fwp-node" />

                    <div className="fwp-head">
                      <span className="fwp-num">{pad(index + 1)}</span>
                      <span className="fwp-title">{item.title}</span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          className="fwp-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="fwp-desc">{item.desc}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {onOpenQuote && (
                              <button
                                type="button"
                                className="fwp-cta"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenQuote(item.title);
                                }}
                              >
                                Cotizar <ArrowRight size={13} />
                              </button>
                            )}
                            {item.slug && (
                              <a
                                href={`#servicio-${item.slug}`}
                                className="fwp-cta"
                                style={{ color: '#2B5672' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Ver solución →
                              </a>
                            )}
                          </div>
                          {!isDesktop && (
                            <div className="fwp-panel fwp-panel--inline">
                              <Scene />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {isDesktop && (
            <div className="fwp-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="fwp-panel-inner"
                  initial={{ opacity: 0, y: 12, scale: 0.98, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, scale: 0.98, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ActiveScene />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
