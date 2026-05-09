import { useState, useEffect, useRef, useMemo } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  dark:  "#0D0D0D",
  dark2: "#111111",
  dark3: "#161616",
  gold:  "#FF6FB7",
  rose:  "#FBBDD4",
  cream: "#FFFFFF",
  muted: "#999999",
  border:"rgba(255,111,183,0.12)",
};

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.dark}; color: ${C.cream}; font-family: 'Playfair Display', Georgia, serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.dark}; }
  ::-webkit-scrollbar-thumb { background: #FF6FB7; opacity: .4; border-radius: 2px; }

  @keyframes twinkle   { 0%,100%{opacity:0} 50%{opacity:var(--op,.6)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes spin      { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes popIn     { 0%{transform:scale(1.5);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes scrollCue { 0%,100%{transform:scaleY(.4);transform-origin:top;opacity:.3} 50%{transform:scaleY(1);transform-origin:top;opacity:.6} }
  @keyframes petalFall { 0%{transform:translateY(-10px) rotate(0deg) translateX(0);opacity:.5} 100%{transform:translateY(110vh) rotate(720deg) translateX(40px);opacity:0} }
  @keyframes ringPop   { 0%{transform:scale(.8);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes barFill   { from{width:0} to{width:var(--w)} }
  @keyframes soundBar  { from{transform:scaleY(.3)} to{transform:scaleY(1)} }
  @keyframes flameFlicker { 0%,100%{transform:scaleX(1) scaleY(1)} 33%{transform:scaleX(1.15) scaleY(0.9)} 66%{transform:scaleX(0.88) scaleY(1.12)} }
  @keyframes particlePulse { 0%{opacity:0;transform:rotate(var(--a,0deg)) translateX(18px) scale(.4)} 50%{opacity:.9;transform:rotate(var(--a,0deg)) translateX(32px) scale(1)} 100%{opacity:0;transform:rotate(var(--a,0deg)) translateX(44px) scale(.3)} }
  @keyframes butterflyWing { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.3)} }
  @keyframes butterflyDrift{ 0%{transform:translate(0,0) rotate(-5deg)} 25%{transform:translate(18px,-22px) rotate(8deg)} 50%{transform:translate(35px,-8px) rotate(-3deg)} 75%{transform:translate(18px,14px) rotate(6deg)} 100%{transform:translate(0,0) rotate(-5deg)} }
  @keyframes starSpin      { from{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.2)} to{transform:rotate(360deg) scale(1)} }
  @keyframes heartBeat     { 0%,100%{transform:scale(1)} 14%{transform:scale(1.25)} 28%{transform:scale(1)} 42%{transform:scale(1.18)} 70%{transform:scale(1)} }
  @keyframes floatUp       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes ribbonWave    { 0%,100%{transform:rotate(-6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-8px)} }

  @keyframes fwBurst  { 0%{transform:scale(0) translateY(0);opacity:1} 60%{opacity:1} 100%{transform:scale(1) translateY(-60px);opacity:0} }
  @keyframes fwTrail  { 0%{opacity:1;height:60px} 100%{opacity:0;height:0px} }
  @keyframes fwFlash  { 0%,100%{opacity:0} 10%,30%{opacity:1} 50%{opacity:.4} }
  @keyframes fwRocket { 0%{transform:translateY(100vh) rotate(-5deg);opacity:1} 80%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-20px);opacity:0} }
  @keyframes celebrate{ 0%{opacity:0;transform:scale(.2)} 20%{opacity:1;transform:scale(1.1)} 80%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(.8)} }
  @keyframes confettiFall { 0%{transform:translateY(-30px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(540deg);opacity:0} }
  .fade-up-enter { animation: fadeUp .7s ease both; }
`;



// ─── BUTTERFLY SVG ──────────────────────────────────────────────────────────
function Butterfly({ size = 40, color = "#FF6FB7", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
      {/* left wings */}
      <ellipse cx={18} cy={22} rx={16} ry={11} fill={color} opacity={0.85} transform="rotate(-20,18,22)"/>
      <ellipse cx={15} cy={38} rx={11} ry={8}  fill={color} opacity={0.7}  transform="rotate(15,15,38)"/>
      {/* right wings */}
      <ellipse cx={42} cy={22} rx={16} ry={11} fill={color} opacity={0.85} transform="rotate(20,42,22)"/>
      <ellipse cx={45} cy={38} rx={11} ry={8}  fill={color} opacity={0.7}  transform="rotate(-15,45,38)"/>
      {/* body */}
      <ellipse cx={30} cy={30} rx={3} ry={12} fill="#111"/>
      {/* antennae */}
      <line x1={30} y1={18} x2={22} y2={8}  stroke="#111" strokeWidth={1.2} strokeLinecap="round"/>
      <line x1={30} y1={18} x2={38} y2={8}  stroke="#111" strokeWidth={1.2} strokeLinecap="round"/>
      <circle cx={22} cy={8}  r={2} fill={color}/>
      <circle cx={38} cy={8}  r={2} fill={color}/>
      {/* wing detail */}
      <ellipse cx={20} cy={22} rx={6} ry={4}  fill="#fff" opacity={0.25} transform="rotate(-20,20,22)"/>
      <ellipse cx={40} cy={22} rx={6} ry={4}  fill="#fff" opacity={0.25} transform="rotate(20,40,22)"/>
    </svg>
  );
}

// ─── STAR / SPARKLE SVG ─────────────────────────────────────────────────────
function Sparkle({ size = 24, color = "#FF6FB7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z"
        fill={color} opacity={0.9}/>
      <path d="M12 6 L12.8 10 L16 12 L12.8 14 L12 18 L11.2 14 L8 12 L11.2 10 Z"
        fill="#fff" opacity={0.4}/>
    </svg>
  );
}

// ─── HEART SVG ──────────────────────────────────────────────────────────────
function Heart({ size = 20, color = "#FF6FB7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color} opacity={0.88}/>
    </svg>
  );
}

// ─── RIBBON / BOW SVG ───────────────────────────────────────────────────────
function Bow({ size = 36, color = "#FF6FB7" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 36">
      <ellipse cx={15} cy={18} rx={14} ry={10} fill={color} opacity={0.9} stroke="#111" strokeWidth={1.5}/>
      <ellipse cx={45} cy={18} rx={14} ry={10} fill={color} opacity={0.9} stroke="#111" strokeWidth={1.5}/>
      <circle  cx={30} cy={18} r={5}           fill="#fff" stroke="#111" strokeWidth={1.2}/>
      <ellipse cx={15} cy={18} rx={6}  ry={4}  fill="#fff" opacity={0.25}/>
      <ellipse cx={45} cy={18} rx={6}  ry={4}  fill="#fff" opacity={0.25}/>
    </svg>
  );
}

// ─── RICH BACKGROUND LAYER ──────────────────────────────────────────────────
const BG_ELEMENTS = [
  // butterflies — 2 pink shades
  { type:"butterfly", x:8,  y:12, size:38, color:"#FF6FB7", anim:"butterflyDrift 9s 0s ease-in-out infinite",   op:0.10 },
  { type:"butterfly", x:80, y:8,  size:28, color:"#FBBDD4", anim:"butterflyDrift 7s 1.5s ease-in-out infinite", op:0.09 },
  { type:"butterfly", x:55, y:70, size:44, color:"#FF6FB7", anim:"butterflyDrift 11s 3s ease-in-out infinite",  op:0.08 },
  { type:"butterfly", x:25, y:78, size:32, color:"#FBBDD4", anim:"butterflyDrift 8s 2s ease-in-out infinite",   op:0.09 },
  { type:"butterfly", x:90, y:55, size:36, color:"#FF6FB7", anim:"butterflyDrift 10s 4s ease-in-out infinite",  op:0.08 },
  // sparkles
  { type:"sparkle",   x:15, y:35, size:22, color:"#FF6FB7", anim:"starSpin 5s 0s linear infinite",     op:0.18 },
  { type:"sparkle",   x:70, y:20, size:16, color:"#FBBDD4", anim:"starSpin 4s 1s linear infinite",     op:0.15 },
  { type:"sparkle",   x:40, y:88, size:20, color:"#FF6FB7", anim:"starSpin 6s 2s linear infinite",     op:0.14 },
  { type:"sparkle",   x:92, y:40, size:14, color:"#FBBDD4", anim:"starSpin 3.5s 0.5s linear infinite", op:0.16 },
  { type:"sparkle",   x:5,  y:60, size:18, color:"#FF6FB7", anim:"starSpin 5.5s 3s linear infinite",   op:0.13 },
  { type:"sparkle",   x:60, y:45, size:12, color:"#FBBDD4", anim:"starSpin 4.5s 1.5s linear infinite", op:0.12 },
  // hearts
  { type:"heart",     x:35, y:15, size:24, color:"#FF6FB7", anim:"heartBeat 1.4s 0s ease infinite",    op:0.14 },
  { type:"heart",     x:75, y:75, size:18, color:"#FBBDD4", anim:"heartBeat 1.6s 0.3s ease infinite",  op:0.12 },
  { type:"heart",     x:12, y:85, size:20, color:"#FF6FB7", anim:"heartBeat 1.3s 0.7s ease infinite",  op:0.13 },
  { type:"heart",     x:88, y:25, size:16, color:"#FBBDD4", anim:"heartBeat 1.5s 1s ease infinite",    op:0.11 },
  { type:"heart",     x:50, y:5,  size:22, color:"#FF6FB7", anim:"heartBeat 1.4s 0.5s ease infinite",  op:0.12 },
  // bows / ribbons
  { type:"bow",       x:3,  y:25, size:40, color:"#FF6FB7", anim:"ribbonWave 4s 0s ease-in-out infinite",   op:0.10 },
  { type:"bow",       x:72, y:88, size:32, color:"#FBBDD4", anim:"ribbonWave 5s 1s ease-in-out infinite",   op:0.09 },
  { type:"bow",       x:45, y:60, size:28, color:"#FF6FB7", anim:"ribbonWave 4.5s 2s ease-in-out infinite", op:0.08 },
  // roses
  { type:"rose",      x:2,  y:5,  size:52, color:"#FF6FB7", anim:"floatUp 6s 0s ease-in-out infinite",      op:0.18 },
  { type:"rose",      x:82, y:10, size:44, color:"#FBBDD4", anim:"floatUp 7s 1s ease-in-out infinite",      op:0.15 },
  { type:"rose",      x:18, y:55, size:48, color:"#FF6FB7", anim:"floatUp 5s 2s ease-in-out infinite",      op:0.14 },
  { type:"rose",      x:65, y:62, size:56, color:"#FBBDD4", anim:"floatUp 8s 0.5s ease-in-out infinite",    op:0.16 },
  { type:"rose",      x:92, y:78, size:40, color:"#FF6FB7", anim:"floatUp 6.5s 3s ease-in-out infinite",    op:0.13 },
  { type:"rose",      x:38, y:92, size:46, color:"#FBBDD4", anim:"floatUp 7.5s 1.5s ease-in-out infinite",  op:0.15 },
  // small flowers
  { type:"flower",    x:30, y:30, size:28, color:"#FF6FB7", anim:"starSpin 8s 0s linear infinite",          op:0.20 },
  { type:"flower",    x:58, y:15, size:24, color:"#FBBDD4", anim:"starSpin 10s 1s linear infinite",         op:0.18 },
  { type:"flower",    x:10, y:70, size:26, color:"#FF6FB7", anim:"starSpin 7s 2s linear infinite",          op:0.17 },
  { type:"flower",    x:85, y:50, size:22, color:"#FBBDD4", anim:"starSpin 9s 0.5s linear infinite",        op:0.16 },
  { type:"flower",    x:52, y:82, size:30, color:"#FF6FB7", anim:"starSpin 6s 3s linear infinite",          op:0.18 },
];


// ─── ROSE SVG ───────────────────────────────────────────────────────────────
function Rose({ size = 40, color = "#FF6FB7", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 90" style={style}>
      {/* stem */}
      <path d="M40 68 Q38 78 36 88" fill="none" stroke="#2d7a2d" strokeWidth={2.5} strokeLinecap="round"/>
      {/* leaf left */}
      <path d="M38 76 Q28 70 26 62 Q34 64 38 76 Z" fill="#3a9a3a" opacity={0.8}/>
      {/* leaf right */}
      <path d="M40 72 Q50 66 52 58 Q44 60 40 72 Z" fill="#3a9a3a" opacity={0.8}/>
      {/* outer petals */}
      <ellipse cx={40} cy={44} rx={20} ry={18} fill={color} opacity={0.6}/>
      <path d="M22 44 Q20 28 40 26 Q60 28 58 44 Q56 60 40 62 Q24 60 22 44 Z" fill={color} opacity={0.75}/>
      {/* mid petals */}
      <path d="M28 42 Q28 30 40 29 Q52 30 52 42 Q52 54 40 55 Q28 54 28 42 Z" fill={color} opacity={0.85}/>
      {/* inner petals */}
      <path d="M33 40 Q34 33 40 32 Q46 33 47 40 Q46 48 40 49 Q34 48 33 40 Z" fill={color}/>
      {/* center curl */}
      <path d="M37 39 Q40 35 43 39 Q40 44 37 39 Z" fill={color} filter="none"/>
      <ellipse cx={40} cy={39} rx={4} ry={3.5} fill="#fff" opacity={0.2}/>
      {/* petal highlights */}
      <path d="M30 36 Q34 30 40 30" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.35} strokeLinecap="round"/>
      <path d="M26 42 Q24 34 32 30" fill="none" stroke="#fff" strokeWidth={1} opacity={0.25} strokeLinecap="round"/>
    </svg>
  );
}

// ─── SMALL FLOWER SVG ───────────────────────────────────────────────────────
function SmallFlower({ size = 30, color = "#FF6FB7" }) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      {petals.map((angle, i) => (
        <ellipse key={i}
          cx={30 + 12 * Math.cos(angle * Math.PI / 180)}
          cy={30 + 12 * Math.sin(angle * Math.PI / 180)}
          rx={8} ry={5}
          fill={i % 2 === 0 ? color : "#FBBDD4"}
          opacity={0.85}
          transform={`rotate(${angle}, ${30 + 12 * Math.cos(angle * Math.PI / 180)}, ${30 + 12 * Math.sin(angle * Math.PI / 180)})`}
        />
      ))}
      <circle cx={30} cy={30} r={7} fill="#FFD700" stroke="#111" strokeWidth={1}/>
      <circle cx={30} cy={30} r={3.5} fill="#FFA500"/>
    </svg>
  );
}

function RichBackground() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {BG_ELEMENTS.map((el, i) => {
        const base = {
          position:"absolute",
          left:`${el.x}%`,
          top:`${el.y}%`,
          opacity: el.op,
          animation: el.anim,
        };
        if (el.type === "butterfly") return <div key={i} style={base}><Butterfly size={el.size} color={el.color}/></div>;
        if (el.type === "sparkle")   return <div key={i} style={base}><Sparkle   size={el.size} color={el.color}/></div>;
        if (el.type === "heart")     return <div key={i} style={base}><Heart     size={el.size} color={el.color}/></div>;
        if (el.type === "bow")       return <div key={i} style={base}><Bow       size={el.size} color={el.color}/></div>;
        if (el.type === "rose")      return <div key={i} style={base}><Rose      size={el.size} color={el.color}/></div>;
        if (el.type === "flower")    return <div key={i} style={base}><SmallFlower size={el.size} color={el.color}/></div>;
        return null;
      })}
    </div>
  );
}


// ─── COUNTDOWN PHRASES ──────────────────────────────────────────────────────
const PHRASES = [
  "A magical moment is being prepared…",
  "Something beautiful is beginning…",
  "For someone extraordinary…",
  "A princess deserves a royal entrance…",
  "The countdown begins…",
  "Just a few moments left…",
  "The magic is almost here…",
  "For you, Alaa…",
  "This day belongs entirely to you…",
  "And now…",
];

// ─── STAR CANVAS — pink sparkles, dots, mini hearts ────────────────────────
function StarCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const PINKS = ["255,111,183","251,189,212","255,80,160","255,160,200","255,200,220"];
    const particles = Array.from({ length: 180 }, (_, i) => ({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 2,
      speed: 0.2 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      type: i < 110 ? "dot" : i < 150 ? "cross" : "heart",
      color: PINKS[Math.floor(Math.random() * PINKS.length)],
      size: 1 + Math.random() * 3,
    }));
    let t = 0;
    function drawHeart(x, y, sz, op) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sz * 0.012, sz * 0.012);
      ctx.beginPath();
      ctx.moveTo(0, -3);
      ctx.bezierCurveTo(-8, -12, -18, -4, -10, 6);
      ctx.lineTo(0, 14); ctx.lineTo(10, 6);
      ctx.bezierCurveTo(18, -4, 8, -12, 0, -3);
      ctx.fillStyle = `rgba(255,111,183,${op})`;
      ctx.fill();
      ctx.restore();
    }
    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;
      particles.forEach(s => {
        const op = 0.1 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        const px = s.x * canvas.width;
        const py = s.y * canvas.height;
        if (s.type === "dot") {
          ctx.beginPath();
          ctx.arc(px, py, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${op})`;
          ctx.fill();
        } else if (s.type === "cross") {
          const sz = s.size * 2.5;
          ctx.strokeStyle = `rgba(${s.color},${op * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(px - sz, py); ctx.lineTo(px + sz, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py - sz); ctx.lineTo(px, py + sz); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px - sz*0.7, py - sz*0.7); ctx.lineTo(px + sz*0.7, py + sz*0.7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px + sz*0.7, py - sz*0.7); ctx.lineTo(px - sz*0.7, py + sz*0.7); ctx.stroke();
        } else {
          drawHeart(px, py, s.size * 5, op * 0.6);
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0 }} />;
}
function PartyHat({ size = 60, color = "#FF6FB7", style = {} }) {
  const light = color === "#FF6FB7" ? "#FBBDD4" : "#fff";
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 60 66" style={style}>
      <polygon points="30,2 8,60 52,60" fill={color} opacity={0.92}/>
      {/* stripe */}
      <polygon points="30,2 21,30 39,30" fill={light} opacity={0.45}/>
      {/* band */}
      <rect x={8} y={55} width={44} height={7} rx={3.5} fill={light} opacity={0.7}/>
      {/* dots */}
      {[[30,18],[20,38],[40,38],[26,50],[34,50]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={2} fill={i%2===0?light:color==="#FF6FB7"?"#fff":"#FF6FB7"} opacity={0.8}/>
      ))}
      {/* pompom */}
      <circle cx={30} cy={3} r={4.5} fill={light}/>
    </svg>
  );
}

// ─── FIREWORKS CANVAS ────────────────────────────────────────────────────────
function FireworksCanvas({ active, onDone }) {
  const ref = useRef(null);
 
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
 
    const W = canvas.width;
    const H = canvas.height;
 
    /* ── palette ── */
    const ROSE  = ["#e86190","#f5a0c0","#ffcfe0","#c0406a","#f0b0c8","#ff8ab0"];
    const MAGIC = ["#e86190","#f5a0c0","#ffcfe0","#d46090","#ff80b0","#fff","#e0a0ff","#b060d0"];
 
    let raf;
    let frame      = 0;
    const DURATION = 520;
 
    const particles  = [];
    const rockets    = [];
 
    /* ── heart math ── */
    function heartPt(t, scale, cx, cy) {
      const x =  16 * Math.pow(Math.sin(t), 3);
      const y = -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
      return { x: cx + x*scale, y: cy + y*scale };
    }
    const isMobile    = W < 600;
    const S           = isMobile ? 0.8 : 1.0;   // global scale multiplier
    const HEART_SCALE = Math.min(W, H) * (isMobile ? 0.034 : 0.030);
    const HEART_CX    = W / 2;
    const HEART_CY    = H * (isMobile ? 0.35 : 0.38);
    const HEART_PTS   = Array.from({ length: 52 }, (_, i) =>
      heartPt((i / 52) * Math.PI * 2, HEART_SCALE, HEART_CX, HEART_CY)
    );
    const heartHit   = new Array(HEART_PTS.length).fill(false);
    const heartGlows = [];
 
    /* ── floating scene elements (balloons, gifts, stars, sparkles) ── */
    const BAL_R = Math.min(W,H) * 0.04;   // responsive radius
    const balloons = Array.from({ length: 8 }, () => ({
      x:     Math.random() * W,
      y:     H * 0.1 + Math.random() * H * 0.9,
      r:     BAL_R * (0.7 + Math.random() * 0.7),
      color: ROSE[Math.floor(Math.random() * ROSE.length)],
      color2:ROSE[Math.floor(Math.random() * ROSE.length)],
      vx:    (Math.random() - 0.5) * 0.12,
      vy:    -(0.12 + Math.random() * 0.10),   // very slow
      sway:  Math.random() * Math.PI * 2,
      swayS: 0.005 + Math.random() * 0.006,
      swayA: 8 + Math.random() * 10,
      alpha: 0,
    }));
 
    const BASE_W      = Math.min(W, H) * 0.06;   // responsive gift size
    const gifts = Array.from({ length: 7 }, (_, gi) => ({
      x:     W * 0.05 + Math.random() * W * 0.90,
      // stagger: first 3 already on screen, rest above
      y:     gi < 3 ? Math.random() * H * 0.6 : -50 - Math.random() * H * 0.7,
      w:     BASE_W * (0.7 + Math.random() * 0.7),
      vy:    0.14 + Math.random() * 0.12,
      vx:    (Math.random() - 0.5) * 0.09,
      color: ROSE[Math.floor(Math.random() * ROSE.length)],
      bow:   ROSE[Math.floor(Math.random() * ROSE.length)],
      rot:   (Math.random() - 0.5) * 0.009,
      angle: Math.random() * 0.3 - 0.15,
      alpha: gi < 3 ? 0.38 : 0,   // pre-seeded ones visible immediately
    }));
 
    const floatingStars = Array.from({ length: 28 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     1.2 + Math.random() * 2.2,
      tw:    Math.random() * Math.PI * 2,
      tws:   0.018 + Math.random() * 0.03,
      color: MAGIC[Math.floor(Math.random() * MAGIC.length)],
      vy:    -(0.08 + Math.random() * 0.14),
      vx:    (Math.random() - 0.5) * 0.12,
    }));
 
    const sparkles = Array.from({ length: 22 }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      life:Math.random(),
      decay: 0.006 + Math.random() * 0.012,
      r:   1 + Math.random() * 1.8,
      color: ["#fff","#f5a0c0","#e0a0ff"][Math.floor(Math.random()*3)],
    }));
 
    /* ── rockets ── */
    function launchToHeart(ptIdx) {
      const pt = HEART_PTS[ptIdx];
      const color = ROSE[Math.floor(Math.random() * ROSE.length)];
      rockets.push({ x:W*0.15+Math.random()*W*0.7, y:H,
        tx:pt.x, ty:pt.y, color, trail:[], done:false,
        ptIdx, _speed:0.048+Math.random()*0.032 });
    }
    function launchRandom() {
      const tx = W*0.08+Math.random()*W*0.84;
      const ty = H*0.06+Math.random()*H*0.52;
      const color = MAGIC[Math.floor(Math.random()*MAGIC.length)];
      rockets.push({ x:W*0.15+Math.random()*W*0.7, y:H,
        tx, ty, color, trail:[], done:false,
        ptIdx:-1, _speed:0.038+Math.random()*0.04 });
    }
 
    /* ── explosion ── */
    const PScale = isMobile ? 0.75 : 1.0;   // particle size scale
    function explode(x, y, color, count, starBurst) {
      count = count || 60; starBurst = starBurst || false;
      for (let i = 0; i < count; i++) {
        const angle = starBurst ? (Math.PI*2*i)/count : Math.random()*Math.PI*2;
        const speed = (starBurst ? (2.2+Math.random()*3.2) : (1.5+Math.random()*4.5)) * PScale;
        particles.push({ x, y,
          vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
          life:1, decay:0.007+Math.random()*0.013,
          color:Math.random()>0.20 ? color : "#fff",
          r:(1.5+Math.random()*2.8)*PScale,
          gravity:0.040+Math.random()*0.035,
          sparkle:Math.random()>0.45,
          twinkleOff:Math.random()*Math.PI*2 });
      }
    }
 
    /* ── draw helpers ── */
    function drawBalloon(x, y, r, col, col2, alpha) {
      ctx.save();
 
      // ── outer glow halo ──
      ctx.globalAlpha = alpha * 0.18;
      const halo = ctx.createRadialGradient(x, y, r*0.6, x, y, r*1.9);
      halo.addColorStop(0, col);
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.ellipse(x, y, r*1.9, r*2.1, 0, 0, Math.PI*2);
      ctx.fill();
 
      // ── main body — deep velvet gradient ──
      ctx.globalAlpha = alpha;
      const grd = ctx.createRadialGradient(x - r*0.32, y - r*0.36, r*0.05, x + r*0.1, y + r*0.1, r*1.05);
      grd.addColorStop(0,   "#fff9");
      grd.addColorStop(0.18, col);
      grd.addColorStop(0.65, col2);
      grd.addColorStop(1,   col2 + "88");
      ctx.fillStyle = grd;
      ctx.shadowColor = col;
      ctx.shadowBlur  = r * 1.2;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 1.18, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
 
      // ── metallic edge ring ──
      ctx.globalAlpha = alpha * 0.22;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth   = r * 0.06;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.94, r * 1.11, 0, 0, Math.PI*2);
      ctx.stroke();
 
      // ── primary shine (large soft) ──
      ctx.globalAlpha = alpha * 0.28;
      const sh1 = ctx.createRadialGradient(x - r*0.30, y - r*0.36, 0, x - r*0.30, y - r*0.36, r*0.55);
      sh1.addColorStop(0, "#fff");
      sh1.addColorStop(1, "transparent");
      ctx.fillStyle = sh1;
      ctx.beginPath();
      ctx.ellipse(x - r*0.30, y - r*0.36, r*0.55, r*0.32, -0.45, 0, Math.PI*2);
      ctx.fill();
 
      // ── secondary tiny glint ──
      ctx.globalAlpha = alpha * 0.55;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(x - r*0.18, y - r*0.50, r*0.10, r*0.06, -0.6, 0, Math.PI*2);
      ctx.fill();
 
      // ── bottom crease shadow ──
      ctx.globalAlpha = alpha * 0.20;
      const sh2 = ctx.createRadialGradient(x, y + r*0.7, 0, x, y + r*0.7, r*0.65);
      sh2.addColorStop(0, "rgba(0,0,0,0.5)");
      sh2.addColorStop(1, "transparent");
      ctx.fillStyle = sh2;
      ctx.beginPath();
      ctx.ellipse(x, y + r*0.7, r*0.65, r*0.35, 0, 0, Math.PI*2);
      ctx.fill();
 
      // ── knot ──
      ctx.globalAlpha = alpha * 0.90;
      const kgrd = ctx.createRadialGradient(x - r*0.04, y + r*1.19, 0, x, y + r*1.19, r*0.15);
      kgrd.addColorStop(0, "#fff6");
      kgrd.addColorStop(1, col2);
      ctx.fillStyle = kgrd;
      ctx.beginPath();
      // teardrop knot shape
      ctx.moveTo(x - r*0.08, y + r*1.14);
      ctx.bezierCurveTo(x - r*0.13, y + r*1.22, x - r*0.05, y + r*1.28, x, y + r*1.26);
      ctx.bezierCurveTo(x + r*0.05, y + r*1.28, x + r*0.13, y + r*1.22, x + r*0.08, y + r*1.14);
      ctx.closePath();
      ctx.fill();
 
      // ── string — elegant spiral ──
      ctx.globalAlpha = alpha * 0.30;
      ctx.strokeStyle = "#ffcfe0";
      ctx.lineWidth   = 0.7;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(x, y + r*1.30);
      ctx.bezierCurveTo(x + r*0.5, y + r*1.8, x - r*0.4, y + r*2.3, x + r*0.2, y + r*2.9);
      ctx.bezierCurveTo(x + r*0.6, y + r*3.4, x - r*0.3, y + r*3.9, x, y + r*4.5);
      ctx.stroke();
      ctx.setLineDash([]);
 
      ctx.restore();
    }
 
    function drawGift(x, y, w, angle, col, bow, alpha) {
      const h = w * 0.82;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate(angle);
 
      // ── outer glow ──
      ctx.shadowColor = col;
      ctx.shadowBlur  = w * 0.8;
      ctx.globalAlpha = alpha * 0.22;
      ctx.fillStyle   = col;
      ctx.beginPath();
      ctx.roundRect(-w/2 - 4, -h/2 - 4, w + 8, h + 8, 8);
      ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = alpha;
 
      // ── box body — rich gradient ──
      const bodyGrd = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
      bodyGrd.addColorStop(0,   col + "ff");
      bodyGrd.addColorStop(0.5, col + "cc");
      bodyGrd.addColorStop(1,   col + "88");
      ctx.fillStyle = bodyGrd;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h, 5);
      ctx.fill();
 
      // ── lid (top panel) ──
      const lidGrd = ctx.createLinearGradient(-w/2, -h/2, w/2, -h/2 + h*0.28);
      lidGrd.addColorStop(0, "rgba(255,255,255,0.18)");
      lidGrd.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = lidGrd;
      ctx.beginPath();
      ctx.roundRect(-w/2, -h/2, w, h*0.28, [5,5,0,0]);
      ctx.fill();
 
      // ── box shine ──
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.roundRect(-w/2 + 2, -h/2 + 2, w*0.4, h*0.18, 3);
      ctx.fill();
 
      // ── ribbon vertical ──
      const ribGrd = ctx.createLinearGradient(-w*0.08, 0, w*0.08, 0);
      ribGrd.addColorStop(0,   bow + "aa");
      ribGrd.addColorStop(0.5, bow + "ff");
      ribGrd.addColorStop(1,   bow + "aa");
      ctx.fillStyle = ribGrd;
      ctx.shadowColor = bow;
      ctx.shadowBlur  = w * 0.15;
      ctx.fillRect(-w*0.08, -h/2, w*0.16, h);
 
      // ── ribbon horizontal ──
      ctx.fillRect(-w/2, -h*0.14, w, h*0.28);
      ctx.shadowBlur = 0;
 
      // ── bow left loop ──
      ctx.fillStyle = bow;
      ctx.shadowColor = bow;
      ctx.shadowBlur  = w * 0.2;
      ctx.beginPath();
      ctx.ellipse(-w*0.26, -h/2 - h*0.04, w*0.20, h*0.16, -0.55, 0, Math.PI*2);
      ctx.fill();
 
      // ── bow right loop ──
      ctx.beginPath();
      ctx.ellipse(w*0.26, -h/2 - h*0.04, w*0.20, h*0.16, 0.55, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
 
      // ── bow center knot ──
      const bkGrd = ctx.createRadialGradient(0, -h/2, 0, 0, -h/2, w*0.11);
      bkGrd.addColorStop(0, "#fff6");
      bkGrd.addColorStop(1, bow);
      ctx.fillStyle = bkGrd;
      ctx.beginPath();
      ctx.arc(0, -h/2, w*0.10, 0, Math.PI*2);
      ctx.fill();
 
      // ── bottom edge shadow ──
      ctx.fillStyle = "rgba(0,0,0,0.20)";
      ctx.beginPath();
      ctx.roundRect(-w/2, h/2 - h*0.12, w, h*0.12, [0,0,5,5]);
      ctx.fill();
 
      ctx.restore();
    }
 
    function drawStar4(x, y, r, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.shadowColor = color;
      ctx.shadowBlur  = r * 3;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? r : r * 0.38;
        i === 0 ? ctx.moveTo(x + Math.cos(ang)*rad, y + Math.sin(ang)*rad)
                : ctx.lineTo(x + Math.cos(ang)*rad, y + Math.sin(ang)*rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
 
    /* ── text — all 3 stacked inside the heart ── */
    // Heart center: HEART_CY = H*0.38
    // line heights approx: HB=0.075*H, Alaa=0.125*H, 21=0.052*H
    // total stack ~0.27*H → center at H*0.38 → top at H*(0.38-0.135)=H*0.245
    const lineGap   = isMobile ? 0.13 : 0.11;
    const stackBase = (isMobile ? 0.35 : 0.38) - lineGap;
    const texts = [
      { msg: "Happy Birthday",
        size: 0.068, weight: "300", style: "italic",
        color: "#ffcfe0", glow: "#e86190",
        showAt: 155, alpha: 0, yFrac: stackBase,
        letterSpacing: 0.08 },
      { msg: "Alaa",
        size: 0.115, weight: "300", style: "italic",
        color: "#fff", glow: "#f5a0c0",
        showAt: 240, alpha: 0, yFrac: stackBase + lineGap,
        letterSpacing: 0.22 },
      { msg: "21",
        size: 0.048, weight: "300", style: "italic",
        color: "#f5a0c0", glow: "#e86190",
        showAt: 325, alpha: 0, yFrac: stackBase + lineGap * 2,
        letterSpacing: 0.15 },
    ];
 
    /* helper: draw text with manual letter-spacing */
    function drawSpacedText(txt, x, y, spacing) {
      const chars = txt.split("");
      const totalW = chars.reduce((s, ch) => s + ctx.measureText(ch).width + spacing, 0) - spacing;
      let cx = x - totalW / 2;
      chars.forEach(ch => {
        ctx.fillText(ch, cx, y);
        cx += ctx.measureText(ch).width + spacing;
      });
    }
 
    /* ── gradient bg ── */
    let bgCanvas = null;
    function buildBg() {
      bgCanvas = document.createElement("canvas");
      bgCanvas.width = W; bgCanvas.height = H;
      const b = bgCanvas.getContext("2d");
      b.fillStyle = "#06000a"; b.fillRect(0,0,W,H);
      const g1 = b.createRadialGradient(W/2,H*0.36,0, W/2,H*0.36,W*0.55);
      g1.addColorStop(0,   "rgba(130,10,60,0.60)");
      g1.addColorStop(0.35,"rgba(80,4,35,0.32)");
      g1.addColorStop(1,   "rgba(6,0,10,0)");
      b.fillStyle = g1; b.fillRect(0,0,W,H);
      const g2 = b.createRadialGradient(W/2,H,0, W/2,H,W*0.65);
      g2.addColorStop(0,  "rgba(80,10,50,0.22)");
      g2.addColorStop(1,  "rgba(6,0,10,0)");
      b.fillStyle = g2; b.fillRect(0,0,W,H);
      const g3 = b.createRadialGradient(0,H*0.6,0, 0,H*0.6,W*0.42);
      g3.addColorStop(0,  "rgba(160,20,90,0.11)");
      g3.addColorStop(1,  "rgba(6,0,10,0)");
      b.fillStyle = g3; b.fillRect(0,0,W,H);
      const g4 = b.createRadialGradient(W,H*0.35,0, W,H*0.35,W*0.38);
      g4.addColorStop(0,  "rgba(110,10,120,0.10)");
      g4.addColorStop(1,  "rgba(6,0,10,0)");
      b.fillStyle = g4; b.fillRect(0,0,W,H);
    }
    buildBg();
 
    /* ── tick ── */
    function tick() {
      frame++;
 
      if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);
      ctx.fillStyle = "rgba(6,0,10,0.16)";
      ctx.fillRect(0, 0, W, H);
 
      /* phase 0 */
      if (frame < 125) {
        const interval = Math.max(2, 7 - Math.floor(frame/18));
        if (frame % interval === 0) {
          const unhit = [];
          for (let i=0;i<HEART_PTS.length;i++) if(!heartHit[i]) unhit.push(i);
          if (unhit.length > 0) {
            const idx = unhit[Math.floor(Math.random()*unhit.length)];
            heartHit[idx] = true; launchToHeart(idx);
          }
        }
      }
      if (frame>=125 && frame<165 && frame%15===0) launchRandom();
      if (frame>=370 && frame%18===0 && frame<DURATION-30) launchRandom();
 
      /* ── balloons ── */
      balloons.forEach(function(b) {
        b.sway += b.swayS;
        b.y    += b.vy;
        b.x    += b.vx + Math.sin(b.sway) * b.swayA * 0.012;
        if (frame > 5)  b.alpha = Math.min(b.alpha + 0.004, 0.38);
        if (b.y < -100) { b.y = H + 60; b.x = Math.random()*W; }
        drawBalloon(b.x, b.y, b.r, b.color, b.color2, b.alpha);
      });
 
      /* ── gifts ── */
      gifts.forEach(function(g) {
        g.y     += g.vy;
        g.x     += g.vx;
        g.angle += g.rot;
        if (g.alpha < 0.38) g.alpha = Math.min(g.alpha + 0.005, 0.38);
        if (g.y > H + 60) { g.y = -50 - Math.random()*80; g.x = Math.random()*W; g.angle=0; }
        drawGift(g.x, g.y, g.w, g.angle, g.color, g.bow, g.alpha);
      });
 
      /* ── floating stars ── */
      floatingStars.forEach(function(s) {
        s.tw += s.tws;
        s.y  += s.vy;
        s.x  += s.vx;
        if (s.y < -10) { s.y = H+10; s.x = Math.random()*W; }
        const a = 0.4 + 0.6*((Math.sin(s.tw)+1)/2);
        drawStar4(s.x, s.y, s.r, s.color, a * 0.85);
      });
 
      /* ── sparkles (regenerating) ── */
      sparkles.forEach(function(s) {
        s.life -= s.decay;
        if (s.life <= 0) {
          s.x = Math.random()*W; s.y = Math.random()*H;
          s.life = 0.6+Math.random()*0.4;
          s.color = ["#fff","#f5a0c0","#e0a0ff","#ffcfe0"][Math.floor(Math.random()*4)];
        }
        const a = s.life * 0.55;
        ctx.globalAlpha = a;
        ctx.fillStyle   = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r*(0.5+s.life*0.5), 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
 
      /* rockets */
      rockets.forEach(function(r) {
        if (r.done) return;
        r.trail.push({x:r.x,y:r.y});
        if (r.trail.length>14) r.trail.shift();
        r.x += (r.tx-r.x)*r._speed;
        r.y += (r.ty-r.y)*r._speed;
        r.trail.forEach(function(pt,i) {
          ctx.globalAlpha = (i/r.trail.length)*0.6;
          ctx.fillStyle   = "#ffcfe0";
          ctx.beginPath(); ctx.arc(pt.x,pt.y,1.3,0,Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(r.x,r.y,2.5,0,Math.PI*2);
        ctx.fillStyle = r.color; ctx.fill();
        if (Math.hypot(r.tx-r.x,r.ty-r.y)<4) {
          explode(r.tx,r.ty,r.color,r.ptIdx!==-1?70:90,r.ptIdx!==-1);
          if (r.ptIdx!==-1) heartGlows.push({x:r.tx,y:r.ty,color:r.color});
          r.done = true;
        }
      });
 
      /* heart glow dots — large, pulsing, glowing */
      heartGlows.forEach(function(g) {
        const pulse  = 0.5 + 0.5*Math.sin(frame*0.10 + g.x*0.012);
        const radius = (isMobile ? 3.2 : 4.2) * (0.85 + 0.15*pulse);
        // outer halo
        ctx.globalAlpha = pulse * 0.30;
        ctx.fillStyle   = g.color;
        ctx.shadowColor = g.color;
        ctx.shadowBlur  = 28;
        ctx.beginPath(); ctx.arc(g.x,g.y,radius*2.8,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur  = 0;
        // core dot
        ctx.globalAlpha = pulse * 0.95;
        ctx.shadowColor = g.color;
        ctx.shadowBlur  = 16;
        ctx.beginPath(); ctx.arc(g.x,g.y,radius,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur  = 0;
      });
      ctx.globalAlpha = 1;
 
      /* firework particles */
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.vx*=0.97; p.life-=p.decay;
        if (p.life<=0){particles.splice(i,1);continue;}
        const a = p.sparkle
          ? (Math.sin(frame*0.45+p.twinkleOff)>0 ? p.life : p.life*0.22)
          : p.life;
        ctx.globalAlpha = a;
        ctx.fillStyle   = p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
 
      /* ── cinematic text ── */
      texts.forEach(function(t) {
        if (frame >= t.showAt) t.alpha = Math.min(t.alpha + 0.007, 1);
        if (t.alpha <= 0) return;
        const fs      = Math.min(W,H) * t.size;
        const spacing = fs * t.letterSpacing;
        const glow    = 28 + 12*Math.sin(frame*0.035 + t.showAt*0.01);
 
        ctx.save();
        ctx.globalAlpha  = t.alpha;
        ctx.font         = t.weight+" "+t.style+" "+fs+"px 'Cormorant Garamond',Georgia,serif";
        ctx.textAlign    = "left";
        ctx.textBaseline = "middle";
 
        // outer glow pass
        ctx.fillStyle  = t.glow;
        ctx.shadowColor= t.glow;
        ctx.shadowBlur = glow * 2;
        drawSpacedText(t.msg, W/2, H*t.yFrac, spacing);
 
        // crisp fill pass
        ctx.shadowBlur = glow * 0.6;
        ctx.fillStyle  = t.color;
        drawSpacedText(t.msg, W/2, H*t.yFrac, spacing);
 
        ctx.restore();
      });
 
      if (frame >= DURATION) {
        ctx.clearRect(0,0,W,H);
        onDone && onDone();
      } else {
        raf = requestAnimationFrame(tick);
      }
    }
 
    for (let i=0;i<4;i++) {
      const idx=Math.floor(Math.random()*HEART_PTS.length);
      heartHit[idx]=true; launchToHeart(idx);
    }
    raf = requestAnimationFrame(tick);
    return function(){ cancelAnimationFrame(raf); };
  }, [active]);
 
  return (
    <canvas ref={ref} style={{
      position:"fixed", inset:0, zIndex:999,
      pointerEvents:"none",
      display: active ? "block" : "none",
      background:"transparent",
    }}/>
  );
}

// ─── PROGRESS RING ──────────────────────────────────────────────────────────
function ProgressRing({ value, max = 10 }) {
  const r = 42, circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / max);
  return (
    <svg width={100} height={100} viewBox="0 0 100 100" style={{ transform:"rotate(-90deg)", animation:"ringPop .6s ease" }}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,111,183,.15)" strokeWidth={3}/>
      <circle cx={50} cy={50} r={r} fill="none" stroke={C.gold} strokeWidth={3}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition:"stroke-dashoffset 1s ease" }}/>
    </svg>
  );
}

// ─── AUDIO HELPERS (Web Audio API — no external files needed) ───────────────
function createAudioCtx() {
  return new (window.AudioContext || window.webkitAudioContext)();
}

// Crisp tick: short sine burst, pitch rises each count
function playTick(ctx, pitch = 880, when = 0) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(pitch, when);
  gain.gain.setValueAtTime(0.45, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
  osc.start(when);
  osc.stop(when + 0.2);
}

// Warm "last-second" accent tick (deeper, longer)
function playAccentTick(ctx, when = 0) {
  // low thud
  const osc1  = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(220, when);
  gain1.gain.setValueAtTime(0.6, when);
  gain1.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
  osc1.start(when); osc1.stop(when + 0.4);
  // high shimmer
  const osc2  = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2); gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1760, when);
  gain2.gain.setValueAtTime(0.2, when);
  gain2.gain.exponentialRampToValueAtTime(0.001, when + 0.25);
  osc2.start(when); osc2.stop(when + 0.3);
}

// Celebratory fanfare: ascending chime arpeggio
function playFanfare(ctx) {
  const notes = [523, 659, 784, 1047, 1319]; // C5 E5 G5 C6 E6
  notes.forEach((freq, i) => {
    const t    = ctx.currentTime + i * 0.13;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.start(t); osc.stop(t + 0.6);
  });
  // extra sparkle: high rapid burst
  [2093, 2637, 2093].forEach((freq, i) => {
    const t    = ctx.currentTime + 0.65 + i * 0.1;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t); osc.stop(t + 0.2);
  });
}

// ─── COUNTDOWN PAGE ─────────────────────────────────────────────────────────
function CountdownPage({ onDone }) {
  const [count, setCount]   = useState(10);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [key, setKey]       = useState(0);
  const [started, setStarted]     = useState(false);
  const [showFW,  setShowFW]       = useState(false);
  const audioCtxRef = useRef(null);

  function start() {
    audioCtxRef.current = createAudioCtx();
    setStarted(true);
  }

  useEffect(() => {
    if (!started) return;
    if (count < 0) {
      playFanfare(audioCtxRef.current);
      setShowFW(true);
      return;
    }
    // Pitch rises as count goes down (excitement builds)
    const basePitch = 440 + (10 - count) * 55;   // 440 Hz → 990 Hz
    if (count <= 3) {
      playAccentTick(audioCtxRef.current, audioCtxRef.current.currentTime);
    } else {
      playTick(audioCtxRef.current, basePitch, audioCtxRef.current.currentTime);
    }
    const id = setTimeout(() => {
      setCount(c => c - 1);
      setPhrase(PHRASES[10 - count] ?? "");
      setKey(k => k + 1);
    }, 1400);
    return () => clearTimeout(id);
  }, [count, started]);

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.dark,position:"relative",overflow:"hidden"}}>
      <FireworksCanvas active={showFW} onDone={() => { setShowFW(false); onDone(); }}/>
      <StarCanvas />
      <RichBackground/>

      {!started && (
        <div style={{textAlign:"center",zIndex:1,padding:"2rem",animation:"fadeIn .8s ease"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:7,textTransform:"uppercase",color:C.gold,opacity:.6,marginBottom:"2rem"}}>A special moment awaits you</p>
          <h1 style={{fontSize:"clamp(2.5rem,8vw,5rem)",fontWeight:400,color:C.cream,fontStyle:"italic",marginBottom:6}}>Alaa</h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(.85rem,2vw,1rem)",color:C.rose,opacity:.8,letterSpacing:3,marginBottom:"3rem"}}>My Princess</p>
          <div style={{position:"relative",width:160,height:160,margin:"0 auto 3rem"}}>
            {[160,120,80].map((sz,i)=>(
              <svg key={sz} width={sz} height={sz} viewBox="0 0 100 92"
                style={{position:"absolute",top:"50%",left:"50%",marginTop:-sz/2,marginLeft:-sz/2,animation:`spin ${10+i*5}s linear infinite${i%2?" reverse":""}`,overflow:"visible"}}>
                <path d="M50 80 C22 58 6 46 6 30 C6 16 17 7 28 7 C36 7 44 12 50 19 C56 12 64 7 72 7 C83 7 94 16 94 30 C94 46 78 58 50 80 Z"
                  fill="none" stroke={`rgba(255,111,183,${.18-i*.05})`} strokeWidth={1.5}/>
              </svg>
            ))}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
              {/* Particle burst — 8 small dots radiating outward */}
              {[0,45,90,135,180,225,270,315].map((angle,i)=>(
                <div key={i} style={{
                  position:"absolute",
                  width:5, height:5,
                  borderRadius:"50%",
                  background: i%2===0 ? C.gold : C.rose,
                  top: "50%", left: "50%",
                  marginTop:-2.5, marginLeft:-2.5,
                  transform:`rotate(${angle}deg) translateX(28px)`,
                  animation:`particlePulse 2s ${i*0.25}s ease-in-out infinite`,
                  opacity:0,
                }}/>
              ))}
            </div>
          </div>
          <button onClick={start} style={{fontFamily:"'DM Sans',sans-serif",fontSize:".78rem",letterSpacing:5,textTransform:"uppercase",color:C.dark,background:C.gold,border:"none",padding:".9rem 2.5rem",cursor:"pointer",transition:"opacity .2s,transform .15s"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="scale(1.04)"}}
            onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="scale(1)"}}>
            START
          </button>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:".75rem",color:C.muted,marginTop:"1.25rem",opacity:.6}}>Turn on the sound for a full experience</p>
        </div>
      )}

      {started && (
        <div style={{textAlign:"center",zIndex:1,padding:"2rem"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:6,textTransform:"uppercase",color:C.gold,opacity:.7,marginBottom:"1.5rem"}}>A beautiful moment begins…</p>
          <h1 style={{fontSize:"clamp(2.5rem,8vw,5rem)",fontWeight:400,color:C.cream,fontStyle:"italic",marginBottom:4}}>Alaa</h1>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:"clamp(.85rem,2vw,1.1rem)",color:C.rose,opacity:.8,letterSpacing:3,marginBottom:"3.5rem"}}>My Princess</p>
          <div key={key} style={{fontSize:"clamp(7rem,22vw,14rem)",fontWeight:700,color:count<=3?C.rose:C.gold,lineHeight:1,animation:"popIn .6s ease",transition:"color .3s"}}>
            {count>=0?count:""}
          </div>
          <p key={`p${key}`} style={{fontStyle:"italic",fontSize:"clamp(.88rem,2vw,1.1rem)",color:C.cream,opacity:.65,marginTop:"1.5rem",minHeight:"1.8rem",animation:"fadeIn .5s ease"}}>
            {phrase}
          </p>
          <div style={{margin:"2.5rem auto 0",width:100,height:100}}>
            <ProgressRing value={Math.max(count,0)}/>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",justifyContent:"center",marginTop:"2rem",height:28}}>
            {[10,16,22,16,12,20,14,18,10,16].map((h,i)=>(
              <div key={i} style={{width:3,borderRadius:2,background:count<=3?C.rose:C.gold,opacity:.55,height:h,animation:`soundBar ${.4+i*.07}s ease-in-out infinite alternate`}}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────────────────
function Nav({ musicOn, onToggleMusic }) {
  const links = [
    { href:"#hero",      label:"Home" },
    { href:"#portrait",  label:"Portrait" },
    { href:"#timeline",  label:"Timeline" },
    { href:"#voeux",     label:"Wishes" },
    { href:"#lettre",    label:"Letter" },
  ];

  return (
    <>
      <style>{`
        /* ════ RESPONSIVE VARIABLES ════ */
        :root {
          --nav-padding-x: 2rem;
          --nav-padding-y: 0.85rem;
          --logo-size: 70px;
          --links-gap: 2rem;
          --links-font-size: 0.75rem;
          --music-btn-size: 40px;
        }

        @media (max-width: 768px) {
          :root {
            --nav-padding-x: 1.2rem;
            --nav-padding-y: 0.7rem;
            --logo-size: 60px;
            --links-gap: 1.2rem;
            --links-font-size: 0.65rem;
            --music-btn-size: 38px;
          }
        }

        @media (max-width: 480px) {
          :root {
            --nav-padding-x: 0.75rem;
            --nav-padding-y: 0.6rem;
            --logo-size: 48px;
            --links-gap: 0.6rem;
            --links-font-size: 0.55rem;
            --music-btn-size: 36px;
          }
        }

        @keyframes spinRing    { to { transform: rotate(360deg); } }
        @keyframes spinRingRev { to { transform: rotate(-360deg); } }
        @keyframes eqBar       { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
        @keyframes navPulse {
          0%,100% { box-shadow: 0 0 10px 2px rgba(244,114,182,0.12), inset 0 0 0 0 rgba(244,114,182,0); }
          50%     { box-shadow: 0 0 22px 6px rgba(244,114,182,0.22), inset 0 0 8px 0 rgba(244,114,182,0.06); }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-32px) translateX(8px) scale(0); opacity: 0; }
        }
        @keyframes particleDrift2 {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-28px) translateX(-10px) scale(0); opacity: 0; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes borderGlow {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
        @keyframes floatDot {
          0%,100% { transform: translateY(0); opacity: 0.7; }
          50%     { transform: translateY(-3px); opacity: 1; }
        }
        @keyframes scanline {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { top: 102%; opacity: 0; }
        }
        @keyframes musicGlow {
          0%,100% { box-shadow: 0 0 6px 1px rgba(244,114,182,0.2); }
          50%     { box-shadow: 0 0 16px 4px rgba(244,114,182,0.45); }
        }
        @keyframes linkGlow {
          0%,100% { text-shadow: 0 0 8px rgba(244,114,182,0); }
          50%     { text-shadow: 0 0 12px rgba(244,114,182,0.6); }
        }

        /* ════ NAV BAR ════ */
        .nav-bar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--nav-padding-y) var(--nav-padding-x);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: linear-gradient(
            135deg,
            rgba(30,4,22,0.96) 0%,
            rgba(12,2,16,0.97) 40%,
            rgba(22,2,18,0.96) 70%,
            rgba(30,4,22,0.96) 100%
          );
          border-bottom: 1px solid transparent;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .nav-bar {
            gap: 0.5rem;
          }
        }

        .nav-border-top {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(244,114,182,0.08) 10%,
            rgba(251,189,212,0.35) 30%, rgba(255,255,255,0.6) 50%,
            rgba(251,189,212,0.35) 70%, rgba(244,114,182,0.08) 90%, transparent 100%
          );
          animation: borderGlow 4s ease-in-out infinite;
          pointer-events: none;
        }
        .nav-border-bottom {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(244,114,182,0.12) 15%,
            rgba(244,114,182,0.6) 40%, rgba(251,189,212,0.9) 50%,
            rgba(244,114,182,0.6) 60%, rgba(244,114,182,0.12) 85%, transparent 100%
          );
          pointer-events: none;
        }
        .nav-scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(244,114,182,0.18), transparent);
          pointer-events: none;
          animation: scanline 8s ease-in-out infinite;
        }
        .nav-shimmer {
          position: absolute; top: 0; bottom: 0; width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          pointer-events: none;
          animation: shimmerSweep 7s ease-in-out infinite;
        }
        .nav-sheen {
          position: absolute; top: 0; left: 0; right: 0; height: 45%;
          background: linear-gradient(180deg, rgba(255,255,255,0.025), transparent);
          pointer-events: none;
        }
        .nav-corner {
          position: absolute; width: 14px; height: 14px; pointer-events: none;
          display: none;
        }

        @media (min-width: 769px) {
          .nav-corner {
            display: block;
          }
        }

        .nav-corner.tl { top: 4px; left: 8px;
          border-top: 1.5px solid rgba(244,114,182,0.5);
          border-left: 1.5px solid rgba(244,114,182,0.5); }
        .nav-corner.tr { top: 4px; right: 8px;
          border-top: 1.5px solid rgba(244,114,182,0.5);
          border-right: 1.5px solid rgba(244,114,182,0.5); }
        .nav-corner.bl { bottom: 4px; left: 8px;
          border-bottom: 1.5px solid rgba(244,114,182,0.5);
          border-left: 1.5px solid rgba(244,114,182,0.5); }
        .nav-corner.br { bottom: 4px; right: 8px;
          border-bottom: 1.5px solid rgba(244,114,182,0.5);
          border-right: 1.5px solid rgba(244,114,182,0.5); }

        /* ════ LOGO ════ */
        .logo-outer { 
          position: relative; 
          width: var(--logo-size); 
          height: var(--logo-size); 
          flex-shrink: 0; 
        }
        .logo-ring-1 {
          position: absolute; inset: -6px; border-radius: 24px;
          background: conic-gradient(from 0deg,
            #f472b6 0%, #fbbde4 20%, rgba(255,255,255,0.9) 40%,
            transparent 55%, transparent 70%, #fbbde4 85%, #f472b6 100%
          );
          -webkit-mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 2px), #fff calc(100% - 2px));
          mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 2px), #fff calc(100% - 2px));
          animation: spinRing 4s linear infinite;
        }
        .logo-ring-2 {
          position: absolute; inset: -3px; border-radius: 21px;
          background: conic-gradient(from 90deg,
            rgba(251,189,212,0.7) 0%, transparent 35%,
            rgba(244,114,182,0.6) 65%, transparent 100%
          );
          -webkit-mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 1.5px), #fff calc(100% - 1.5px));
          mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 1.5px), #fff calc(100% - 1.5px));
          animation: spinRingRev 2.5s linear infinite;
        }
        .logo-ring-3 {
          position: absolute; inset: -1px; border-radius: 19px;
          background: conic-gradient(from 180deg,
            rgba(244,114,182,0.3) 0%, transparent 50%,
            rgba(251,189,212,0.3) 75%, transparent 100%
          );
          -webkit-mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 1px), #fff calc(100% - 1px));
          mask: radial-gradient(farthest-corner at 50% 50%,
            transparent calc(100% - 1px), #fff calc(100% - 1px));
          animation: spinRing 3.5s linear infinite;
        }
        .logo-particle { position: absolute; border-radius: 50%; pointer-events: none; }
        .logo-particle.p1 { width:4px; height:4px; background:#f472b6; top:2px; left:-3px; animation: particleDrift 2s ease-out infinite; }
        .logo-particle.p2 { width:3px; height:3px; background:#fbbde4; top:0; right:4px; animation: particleDrift2 1.8s .6s ease-out infinite; }
        .logo-particle.p3 { width:2.5px; height:2.5px; background:#fff; bottom:4px; left:8px; animation: particleDrift 2.4s 1.2s ease-out infinite; }
        .logo-particle.p4 { width:3px; height:3px; background:#f472b6; bottom:2px; right:-2px; animation: particleDrift2 2.1s .3s ease-out infinite; }
        .logo-particle.p5 { width:2px; height:2px; background:#fbbde4; top:50%; left:-4px; animation: particleDrift 1.9s .9s ease-out infinite; }
        
        .logo-img-wrap {
          position: relative; z-index: 1;
          height: var(--logo-size); 
          width: var(--logo-size); 
          overflow: hidden;
          border-radius: 18px;
          border: 2px solid rgba(244,114,182,0.55);
          box-shadow:
            0 0 14px rgba(255,111,183,0.4),
            0 0 32px rgba(244,114,182,0.18),
            0 0 60px rgba(244,114,182,0.08),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(244,114,182,0.2);
          animation: navPulse 4s ease-in-out infinite;
        }
        .logo-img-wrap::after {
          content: '';
          position: absolute; inset: 0; border-radius: 16px;
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 3px,
            rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px
          );
          pointer-events: none; z-index: 2;
        }
        .logo-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.6); transform-origin: center;
          transition: transform .4s ease;
        }
        .logo-img-wrap:hover img { transform: scale(1.78); }

        /* ════ LINKS CSS ONLY ════ */
        .nav-links-ul { 
          display: flex; 
          gap: var(--links-gap); 
          list-style: none;
          flex-wrap: wrap;
          justify-content: center;
          flex: 1;
          min-width: 150px;
        }

        @media (max-width: 768px) {
          .nav-links-ul {
            order: 3;
            width: 100%;
            justify-content: center;
          }
        }

        .nav-links-ul a {
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: var(--links-font-size);
          letter-spacing: 2px;
          text-transform: uppercase;
          color: inherit;
          text-decoration: none;
          transition: color .3s;
          padding-bottom: 4px;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .nav-links-ul a {
            letter-spacing: 1px;
            padding-bottom: 2px;
          }
        }

        .nav-links-ul a::before {
          content: '';
          position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%;
          background: #f472b6;
          opacity: 0; transition: opacity .3s, transform .3s;
          transform: translateX(-50%) scale(0);
        }
        .nav-links-ul a::after {
          content: '';
          position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
          width: 0; height: 1.5px;
          background: linear-gradient(90deg, #f472b6, #fbbde4, #f472b6);
          border-radius: 2px;
          transition: width .35s ease;
        }
        .nav-links-ul a:hover {
          color: #fbbde4;
          animation: linkGlow .8s ease-in-out infinite;
        }
        .nav-links-ul a:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(-6px) scale(1);
        }
        .nav-links-ul a:hover::after { width: 100%; }

        /* ════ MUSIC BUTTON ════ */
        .music-btn {
          position: relative;
          width: var(--music-btn-size); 
          height: var(--music-btn-size); 
          border-radius: 50%;
          border: 1px solid rgba(244,114,182,0.4);
          background: radial-gradient(circle at 50% 50%, rgba(244,114,182,0.06), transparent 70%);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color .3s;
          animation: musicGlow 4s ease-in-out infinite;
          overflow: visible;
          flex-shrink: 0;
        }
        .music-btn:hover {
          border-color: rgba(244,114,182,0.75);
          background: radial-gradient(circle at 50% 50%, rgba(244,114,182,0.14), transparent 70%);
        }
        .music-ring {
          position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(from 0deg, #f472b6 0%, #fbbde4 25%, transparent 50%, transparent 100%);
          opacity: 0; transition: opacity .35s;
          animation: spinRing 2s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #fff calc(100% - 2px));
        }
        .music-btn:hover .music-ring { opacity: 1; }
        .music-dots { position: absolute; inset: -8px; border-radius: 50%; pointer-events: none; }
        .music-dot {
          position: absolute; width: 3px; height: 3px;
          border-radius: 50%; background: #f472b6;
          opacity: 0; transition: opacity .3s;
          animation: floatDot 1.5s ease-in-out infinite;
        }
        .music-dot:nth-child(1) { top:0; left:50%; margin-left:-1.5px; animation-delay:0s; }
        .music-dot:nth-child(2) { top:50%; right:0; margin-top:-1.5px; animation-delay:.3s; }
        .music-dot:nth-child(3) { bottom:0; left:50%; margin-left:-1.5px; animation-delay:.6s; }
        .music-dot:nth-child(4) { top:50%; left:0; margin-top:-1.5px; animation-delay:.9s; }
        .music-btn:hover .music-dot { opacity: 0.8; }
        .eq-bars {
          display: flex; align-items: flex-end; gap: 2px;
          height: 15px; position: relative; z-index: 1;
        }

        @media (max-width: 480px) {
          .eq-bars {
            gap: 1.5px;
            height: 12px;
          }
        }

        .eq-bars span { 
          width: 2.5px; 
          border-radius: 2px; 
          display: block; 
          transform-origin: bottom; 
        }

        @media (max-width: 480px) {
          .eq-bars span {
            width: 2px;
          }
        }

        /* ════ SVG ICON RESPONSIVE ════ */
        @media (max-width: 480px) {
          .music-btn svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>

      <nav className="nav-bar">
        <div className="nav-border-top" />
        <div className="nav-border-bottom" />
        <div className="nav-scanline" />
        <div className="nav-shimmer" />
        <div className="nav-sheen" />
        <div className="nav-corner tl" />
        <div className="nav-corner tr" />
        <div className="nav-corner bl" />
        <div className="nav-corner br" />

        {/* ── Logo ── */}
        <div className="logo-outer">
          <div className="logo-ring-1" />
          <div className="logo-ring-2" />
          <div className="logo-ring-3" />
          <div className="logo-particle p1" />
          <div className="logo-particle p2" />
          <div className="logo-particle p3" />
          <div className="logo-particle p4" />
          <div className="logo-particle p5" />
          <div className="logo-img-wrap">
            <img src="/hello kitty.jpg" alt="Alaa" />
          </div>
        </div>

        {/* ── Links — logic untouched, CSS only added ── */}
        <ul className="nav-links-ul">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} style={{ color: C.muted }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = C.muted}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Music Button ── */}
        <button className="music-btn" onClick={onToggleMusic}>
          <span className="music-ring" />
          <div className="music-dots">
            <div className="music-dot" />
            <div className="music-dot" />
            <div className="music-dot" />
            <div className="music-dot" />
          </div>
          {musicOn ? (
            <div className="eq-bars">
              {[
                {h:5,  d:"0s"   },
                {h:12, d:".12s" },
                {h:7,  d:".25s" },
                {h:14, d:".08s" },
                {h:6,  d:".2s"  },
                {h:10, d:".16s" },
              ].map((bar, i) => (
                <span key={i} style={{
                  height: bar.h,
                  background: `linear-gradient(to top, ${C.gold}, #fbbde4)`,
                  animation: `eqBar .7s ${bar.d} ease-in-out infinite alternate`,
                }} />
              ))}
            </div>
          ) : (
            <svg width={15} height={15} viewBox="0 0 24 24"
              fill="none" style={{ position:"relative", zIndex:1 }}>
              <defs>
                <linearGradient id="playG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={C.gold}/>
                  <stop offset="100%" stopColor="#fbbde4"/>
                </linearGradient>
              </defs>
              <path d="M8 5v14l11-7z" fill="url(#playG)"/>
            </svg>
          )}
        </button>
      </nav>
    </>
  );
}


// ─── REVEAL WRAPPER ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(28px)",
      transition: `opacity .7s ${delay}ms ease, transform .7s ${delay}ms ease`,
    }}>
      {children}
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
// ─── BIRTHDAY CAKE SVG BACKGROUND ───────────────────────────────────────



// ── Paste these keyframe styles into your global CSS / styled-component ──
// @keyframes shimmer, fadeUp, floatUp, floatUpR, twinkle, rotateSlow,
// confettiFall, orbDrift, starPulse, flicker, flickerSm
// (full definitions included as a <style> block inside the component for portability)


/* ─── Inline style injection (run once) ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400&display=swap');

  @keyframes shimmer {
    0%,100% { text-shadow: 0 0 30px rgba(255,130,180,0.5),0 0 60px rgba(255,100,160,0.3); }
    50%      { text-shadow: 0 0 50px rgba(255,180,210,0.7),0 0 100px rgba(255,130,180,0.4); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(30px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes floatUp {
    0%,100% { transform:translateY(0) rotate(-1deg); }
    50%     { transform:translateY(-16px) rotate(1.5deg); }
  }
  @keyframes floatUpR {
    0%,100% { transform:translateY(0) rotate(1deg); }
    50%     { transform:translateY(-20px) rotate(-1.5deg); }
  }
  @keyframes twinkle {
    0%,100% { opacity:var(--op); transform:scale(1); }
    50%     { opacity:1; transform:scale(1.6); }
  }
  @keyframes rotateSlow {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes confettiFall {
    0%   { transform:translateY(-10px) rotate(0deg); opacity:0; }
    8%   { opacity:0.8; }
    92%  { opacity:0.5; }
    100% { transform:translateY(110vh) rotate(540deg); opacity:0; }
  }
  @keyframes orbDrift {
    0%,100% { transform:translate(0,0) scale(1); }
    33%     { transform:translate(18px,-12px) scale(1.04); }
    66%     { transform:translate(-12px,8px) scale(0.96); }
  }
  @keyframes starPulse {
    0%,100% { transform:scale(1) rotate(0deg); opacity:0.75; }
    50%     { transform:scale(1.35) rotate(180deg); opacity:1; }
  }
  @keyframes flicker {
    0%,100% { transform:scaleY(1) scaleX(1) translateX(0); }
    20%     { transform:scaleY(1.08) scaleX(0.92) translateX(-0.5px); }
    40%     { transform:scaleY(0.94) scaleX(1.06) translateX(0.5px); }
    60%     { transform:scaleY(1.06) scaleX(0.94) translateX(-0.3px); }
    80%     { transform:scaleY(0.97) scaleX(1.03) translateX(0.3px); }
  }
  @keyframes flickerSm {
    0%,100% { transform:scaleY(1) scaleX(1); }
    25%     { transform:scaleY(1.1) scaleX(0.9); }
    50%     { transform:scaleY(0.92) scaleX(1.08); }
    75%     { transform:scaleY(1.05) scaleX(0.95); }
  }
`;

function injectStyles() {
  if (document.getElementById("hero-birthday-styles")) return;
  const tag = document.createElement("style");
  tag.id = "hero-birthday-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

/* ─── Star / nebula / confetti generators ─── */
function buildStars(container) {
  const starColors = ["#ffffff","#ffffff","#ffffff","#ffe8f4","#e8e8ff","#ffd0e8","#c8d8ff"];
  for (let i = 0; i < 200; i++) {
    const s = document.createElement("div");
    const big  = Math.random() < 0.06;
    const size = big ? Math.random() * 2.5 + 2 : Math.random() * 1.4 + 0.3;
    const op   = (Math.random() * 0.55 + 0.12).toFixed(2);
    const dur  = (2 + Math.random() * 5).toFixed(1);
    const del  = (Math.random() * 9).toFixed(1);
    const col  = starColors[Math.floor(Math.random() * starColors.length)];
    s.style.cssText = `
      position:absolute;border-radius:50%;background:${col};
      width:${size}px;height:${size}px;
      left:${(Math.random()*100).toFixed(2)}%;
      top:${(Math.random()*100).toFixed(2)}%;
      --op:${op};opacity:${op};
      animation:twinkle ${dur}s ${del}s ease-in-out infinite;
    `;
    container.appendChild(s);
  }
  // Cross-shaped bright stars
  const bright = [
    {l:"11%",t:"7%"},{l:"87%",t:"11%"},{l:"54%",t:"3%"},{l:"27%",t:"17%"},
    {l:"74%",t:"21%"},{l:"40%",t:"29%"},{l:"5%",t:"44%"},{l:"93%",t:"39%"},
    {l:"67%",t:"54%"},{l:"19%",t:"61%"},{l:"81%",t:"67%"},{l:"34%",t:"50%"},
  ];
  bright.forEach((b, i) => {
    const el  = document.createElement("div");
    const sz  = 5 + Math.random() * 6;
    const dur = (3 + Math.random() * 4).toFixed(1);
    el.style.cssText = `
      position:absolute;left:${b.l};top:${b.t};
      width:${sz}px;height:${sz}px;pointer-events:none;
      animation:twinkle ${dur}s ${(i*0.38).toFixed(1)}s ease-in-out infinite;
      --op:0.7;
    `;
    el.innerHTML = `<svg width="${sz}" height="${sz}" viewBox="0 0 10 10">
      <line x1="5" y1="0" x2="5" y2="10" stroke="#fff" stroke-width="0.8" opacity="0.85"/>
      <line x1="0" y1="5" x2="10" y2="5" stroke="#fff" stroke-width="0.8" opacity="0.85"/>
      <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="#fff" stroke-width="0.4" opacity="0.4"/>
      <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="#fff" stroke-width="0.4" opacity="0.4"/>
      <circle cx="5" cy="5" r="1.2" fill="#fff" opacity="0.95"/>
    </svg>`;
    container.appendChild(el);
  });
}

function buildNebulas(container) {
  const nebs = [
    {l:"5%",  t:"10%",sz:300,c:"rgba(180,40,100,0.07)", d:"16s",dl:"0s"},
    {l:"65%", t:"5%", sz:360,c:"rgba(80,20,140,0.06)",  d:"22s",dl:"3s"},
    {l:"38%", t:"45%",sz:280,c:"rgba(200,50,120,0.05)", d:"28s",dl:"5s"},
    {l:"75%", t:"55%",sz:320,c:"rgba(100,30,180,0.05)", d:"20s",dl:"2s"},
    {l:"0%",  t:"60%",sz:260,c:"rgba(180,60,100,0.06)", d:"24s",dl:"7s"},
  ];
  nebs.forEach(n => {
    const d = document.createElement("div");
    d.style.cssText = `
      position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;
      left:${n.l};top:${n.t};width:${n.sz}px;height:${n.sz}px;
      background:radial-gradient(circle,${n.c},transparent 70%);
      animation:orbDrift ${n.d} ${n.dl} ease-in-out infinite;
    `;
    container.appendChild(d);
  });
}

function buildConfetti(container) {
  const cols = ["#f472b6","#fbbde4","#fce4ee","#e879a0","#fff0f8","#d040a0"];
  for (let i = 0; i < 20; i++) {
    const c    = document.createElement("div");
    const isC  = i % 3 === 0;
    const w    = Math.random() * 7 + 3;
    const h    = isC ? w : Math.random() * 9 + 3;
    const col  = cols[i % cols.length];
    const dur  = (8 + Math.random() * 8).toFixed(1);
    const del  = (Math.random() * 12).toFixed(1);
    c.style.cssText = `
      position:absolute;
      left:${(Math.random()*100).toFixed(1)}%;
      width:${w}px;height:${h}px;
      border-radius:${isC ? "50%" : "2px"};
      background:${col};opacity:0;
      transform:rotate(${Math.floor(Math.random()*360)}deg);
      animation:confettiFall ${dur}s ${del}s linear infinite;
    `;
    container.appendChild(c);
  }
}
function cubicPoint(p0, p1, p2, p3, t) {
  const m = 1 - t;
  return {
    x: m*m*m*p0.x + 3*m*m*t*p1.x + 3*m*t*t*p2.x + t*t*t*p3.x,
    y: m*m*m*p0.y + 3*m*m*t*p1.y + 3*m*t*t*p2.y + t*t*t*p3.y,
  };
}

function drawGarland(svgEl, segs, pathD, startWhiteAbove) {
  const ns = "http://www.w3.org/2000/svg";
  const BULBS = 10;
  const perSeg = Math.ceil(BULBS / segs.length);

  // رسم الخيط
  const wire = document.createElementNS(ns, "path");
  wire.setAttribute("d", pathD);
  wire.setAttribute("fill", "none");
  wire.setAttribute("stroke", "rgba(255,200,220,0.4)");
  wire.setAttribute("stroke-width", "1.1");
  svgEl.appendChild(wire);

  // جمع النقاط على المسار
  const pts = [];
  segs.forEach(seg => {
    for (let i = 1; i <= perSeg; i++) {
      pts.push(cubicPoint(...seg, i / (perSeg + 1)));
    }
  });
  pts.splice(BULBS);

  // رسم كل مصباح
  pts.forEach((pt, i) => {
    const isWhite = i % 2 === 0 ? startWhiteAbove : !startWhiteAbove;
    const above   = i % 2 === 0;
    const dir     = above ? -1 : 1;
    const stemLen = 9;
    const bulbRy  = 5;
    const capH    = 3;
    const stemY2  = pt.y + dir * stemLen;
    const bulbCy  = stemY2 + dir * bulbRy;
    const capY    = above ? bulbCy + bulbRy : bulbCy - bulbRy - capH;
    const fill    = isWhite ? "url(#bulbW)" : "url(#bulbP)";
    const halo    = isWhite ? "url(#haW)"   : "url(#haP)";
    const dur     = `${1.8 + (i % 4) * 0.35}s`;
    const delay   = `${i * 0.22}s`;
    const anim    = `twinkle ${dur} ${delay} ease-in-out infinite`;

    // هالة
    const ha = document.createElementNS(ns, "ellipse");
    ha.setAttribute("cx", pt.x); ha.setAttribute("cy", bulbCy);
    ha.setAttribute("rx", 11);   ha.setAttribute("ry", 11);
    ha.setAttribute("fill", halo);
    ha.style.animation = anim;
    svgEl.appendChild(ha);

    // ساق الربط
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", pt.x); line.setAttribute("y1", pt.y);
    line.setAttribute("x2", pt.x); line.setAttribute("y2", above ? capY + capH : capY);
    line.setAttribute("stroke", "rgba(255,200,220,0.55)");
    line.setAttribute("stroke-width", "0.9");
    svgEl.appendChild(line);

    // كاب
    const cap = document.createElementNS(ns, "rect");
    cap.setAttribute("x", pt.x - 2.2); cap.setAttribute("y", capY);
    cap.setAttribute("width", 4.4);    cap.setAttribute("height", capH);
    cap.setAttribute("rx", 1);
    cap.setAttribute("fill", "rgba(255,255,255,0.38)");
    svgEl.appendChild(cap);

    // جسم المصباح
    const bulb = document.createElementNS(ns, "ellipse");
    bulb.setAttribute("cx", pt.x); bulb.setAttribute("cy", bulbCy);
    bulb.setAttribute("rx", 3.5);  bulb.setAttribute("ry", bulbRy);
    bulb.setAttribute("fill", fill); bulb.setAttribute("opacity", "0.95");
    bulb.style.animation = anim;
    svgEl.appendChild(bulb);
  });
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  HERO COMPONENT                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
 function Hero() {
  const starsRef = useRef(null);
  const nebRef   = useRef(null);
  const confRef  = useRef(null);

  useEffect(() => {
    injectStyles();
    if (starsRef.current) buildStars(starsRef.current);
    if (nebRef.current)   buildNebulas(nebRef.current);
    if (confRef.current)  buildConfetti(confRef.current);
  }, []);

  /* ── inline style objects ── */
  const S = {
    hero: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "3rem 1.5rem 2rem",
      position: "relative",
      overflow: "hidden",
      background:
        "radial-gradient(ellipse at 50% 80%, #3d0d22 0%, #1e0812 35%, #110410 65%, #0a0210 100%)",
      fontFamily: "'DM Sans', sans-serif",
    },
    starsLayer: {
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
    },
    nebLayer: {
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
    },
    confLayer: {
      position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1,
    },
    balloonLeft: {
      position: "absolute", left: "2%", top: "4%", width: 85,
      pointerEvents: "none", zIndex: 2,
      animation: "floatUp 4.8s ease-in-out infinite",
    },
    balloonRight: {
      position: "absolute", right: "2%", top: "5%", width: 75,
      pointerEvents: "none", zIndex: 2,
      animation: "floatUpR 5.2s 0.6s ease-in-out infinite",
    },
    ringWrap: {
      position: "absolute", top: "50%", left: "50%",
      marginLeft: -260, marginTop: -260,
      width: 520, height: 520,
      pointerEvents: "none", zIndex: 1,
      animation: "rotateSlow 35s linear infinite",
      opacity: 0.05,
    },
    textContent: {
      position: "relative", zIndex: 10, textAlign: "center",
      animation: "fadeUp 1s 0.3s both", flexShrink: 0,
    },
    eyebrow: {
      fontSize: 9, letterSpacing: 6, textTransform: "uppercase",
      color: "#e87aaa", opacity: 0.65, marginBottom: "1rem",
    },
   // ── بعد ──
     mainTitle: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "clamp(2.8rem,9vw,6rem)",
      fontWeight: 400, lineHeight: 1.05,
      animation: "shimmer 3s ease-in-out infinite",
      display: "flex",
      flexDirection: "row",
      gap: "0.4em",
      justifyContent: "center",
      alignItems: "baseline",
      },
    line1: { color: "#fce4ee" },
    line2: { color: "#f472b6", fontStyle: "italic" },
    nameLine: {
      fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic",
      fontSize: "clamp(0.9rem,2.2vw,1.2rem)",
      color: "#f9a8d4", opacity: 0.88, margin: "0.5rem 0 0.25rem",
    },
    subLine: {
      fontSize: 10, letterSpacing: 4, color: "#cc4477", opacity: 0.55, marginBottom: "1.4rem",
    },
    divider: {
      width: 44, height: 1, background: "#f472b6", opacity: 0.32, margin: "0 auto 1.4rem",
    },
    quote: {
      fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic",
      fontSize: "clamp(0.85rem,1.7vw,1rem)",
      color: "#fce4ee", opacity: 0.45, maxWidth: 400, lineHeight: 1.9, margin: "0 auto",
    },
    cakeWrap: {
      position: "relative", zIndex: 10, width: "100%", maxWidth: 620,
      margin: "auto auto 0",
      paddingBottom: "1rem",
      animation: "fadeUp 1s 0.1s both", flexShrink: 0,
    },
  };

  return (
    <section id="hero" style={S.hero}>

      {/* ── Stars layer ── */}
      <div ref={starsRef} style={S.starsLayer} />

      {/* ── Nebula blobs ── */}
      <div ref={nebRef} style={S.nebLayer} />

      {/* ── Confetti ── */}
      <div ref={confRef} style={S.confLayer} />

         {/* ── Garland Left ── */}
<svg
  style={{
    position: "absolute", left: 0, top: 0,
    width: "16%", height: "100%",
    pointerEvents: "none", zIndex: 2, overflow: "visible",
  }}
  preserveAspectRatio="none"
  viewBox="0 0 100 800"
  ref={el => {
    if (!el || el.dataset.drawn) return;
    el.dataset.drawn = "1";
    drawGarland(el, [
      [{x:75,y:0},{x:15,y:133},{x:85,y:267},{x:20,y:400}],
      [{x:20,y:400},{x:-25,y:533},{x:80,y:667},{x:45,y:800}],
    ], "M 75 0 C 15 133, 85 267, 20 400 C -25 533, 80 667, 45 800", true);
  }}
>
  <defs>
    <radialGradient id="bulbW" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#ffd0e8"/>
    </radialGradient>
    <radialGradient id="bulbP" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#fbbde4"/><stop offset="100%" stopColor="#e879a0"/>
    </radialGradient>
    <radialGradient id="haW" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55"/>
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
    </radialGradient>
    <radialGradient id="haP" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#f472b6" stopOpacity="0.5"/>
      <stop offset="100%" stopColor="#f472b6" stopOpacity="0"/>
    </radialGradient>
  </defs>
</svg>

{/* ── Garland Right ── */}
<svg
  style={{
    position: "absolute", right: 0, top: 0,
    width: "16%", height: "100%",
    pointerEvents: "none", zIndex: 2, overflow: "visible",
  }}
  preserveAspectRatio="none"
  viewBox="0 0 100 800"
  ref={el => {
    if (!el || el.dataset.drawn) return;
    el.dataset.drawn = "1";
    drawGarland(el, [
      [{x:25,y:0},{x:85,y:133},{x:15,y:267},{x:80,y:400}],
      [{x:80,y:400},{x:125,y:533},{x:20,y:667},{x:55,y:800}],
    ], "M 25 0 C 85 133, 15 267, 80 400 C 125 533, 20 667, 55 800", false);
  }}
/>

      {/* ── Spinning heart ring ── */}
      <div style={S.ringWrap}>
        <svg width={520} height={520} viewBox="0 0 100 100">
          <path
            d="M50 85 C20 62 5 50 5 33 C5 18 16 8 28 8 C36 8 44 13 50 20 C56 13 64 8 72 8 C84 8 95 18 95 33 C95 50 80 62 50 85 Z"
            fill="none" stroke="#f472b6" strokeWidth={1} strokeDasharray="4,3"
          />
        </svg>
      </div>

      {/* ── Text content ── */}
      <div style={S.textContent}>
        <p style={S.eyebrow}>10 May 2005 &mdash; 10 May 2026</p>
        <h1 style={S.mainTitle}>
          <span style={S.line1}>Happy</span>
          <span style={S.line2}>Birthday</span>
        </h1>
        <p style={S.nameLine}>Alaa &mdash; My Princess</p>
        <p style={S.subLine}>21 years of grace, light, and beauty</p>
        <div style={S.divider} />
        <p style={S.quote}>
          &ldquo;Some souls make the world brighter just by being in it &mdash; you spread light, warmth, and beauty wherever you go.&rdquo;
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CAKE SVG                                               */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={S.cakeWrap}>
        <svg viewBox="0 0 580 490" width="100%" style={{ display: "block" }}>
          <defs>
            <linearGradient id="t1g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f080b0" /><stop offset="100%" stopColor="#c83888" />
            </linearGradient>
            <linearGradient id="t2g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d45890" /><stop offset="100%" stopColor="#a82870" />
            </linearGradient>
            <linearGradient id="t3g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b03878" /><stop offset="100%" stopColor="#821860" />
            </linearGradient>
            <linearGradient id="fr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff6fb" /><stop offset="100%" stopColor="#fcdaea" />
            </linearGradient>
            <linearGradient id="plG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6a1040" /><stop offset="100%" stopColor="#4a0830" />
            </linearGradient>
            <radialGradient id="cglow" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#ff80a0" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#ff80a0" stopOpacity={0} />
            </radialGradient>
            <radialGradient id="flameO" cx="50%" cy="65%" r="60%">
              <stop offset="0%" stopColor="#FFD060" /><stop offset="100%" stopColor="#FF7820" />
            </radialGradient>
            <radialGradient id="flameI" cx="50%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#FFF8B0" /><stop offset="100%" stopColor="#FFD060" />
            </radialGradient>
            <linearGradient id="sc1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffc0da" /><stop offset="100%" stopColor="#e060a0" />
            </linearGradient>
            <linearGradient id="sc2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8d0e8" /><stop offset="100%" stopColor="#d04888" />
            </linearGradient>
          </defs>

          {/* Ambient glow */}
          <ellipse cx={290} cy={200} rx={250} ry={90} fill="url(#cglow)" />

          {/* ── Garland ── */}
          <path d="M52 56 Q148 43 248 57 Q288 63 328 48 Q414 33 510 55"
            fill="none" stroke="rgba(255,130,180,0.25)" strokeWidth={1.5} strokeDasharray="5,3" />
          {[
            [90,49,82,66,98,66,"#f472b6",0.38],[148,44,140,61,156,61,"#fbbde4",0.38],
            [210,47,202,64,218,64,"#f472b6",0.33],[270,49,262,66,278,66,"#fbbde4",0.36],
            [336,43,328,60,344,60,"#f472b6",0.36],[403,38,395,55,411,55,"#fbbde4",0.33],
            [462,47,454,64,470,64,"#f472b6",0.36],
          ].map(([x1,y1,x2,y2,x3,y3,fill,op], i) => (
            <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`} fill={fill} opacity={op} />
          ))}

          {/* ═══════════════════════════════════════════════════════════════
              CANDLES
              small-L cx=196 | big-2 cx=241 | big-1 cx=325 | small-R cx=372
              ═══════════════════════════════════════════════════════════════ */}

          {/* [A] Small candle LEFT of "2" */}
          <rect x={189} y={144} width={14} height={42} rx={3.5} fill="url(#sc2)" opacity={0.92} />
          <rect x={189} y={150} width={14} height={4} rx={2} fill="#fff" opacity={0.22} />
          <line x1={196} y1={144} x2={196} y2={135} stroke="#cca" strokeWidth={2} strokeLinecap="round" />
          <g style={{ animation: "flickerSm 0.65s 0.1s ease-in-out infinite", transformOrigin: "196px 123px" }}>
            <ellipse cx={196} cy={123} rx={8} ry={14} fill="url(#flameO)" opacity={0.93} />
            <ellipse cx={196} cy={124} rx={4.2} ry={7.5} fill="url(#flameI)" opacity={0.97} />
            <ellipse cx={196} cy={125} rx={1.8} ry={3.5} fill="#fff" opacity={0.75} />
          </g>
          <ellipse cx={196} cy={123} rx={16} ry={26} fill="#FFB040" opacity={0.09} />

          {/* [B] Big digit "2" */}
          <rect x={228} y={120} width={27} height={66} rx={5} fill="url(#sc1)" opacity={0.93} />
          <rect x={228} y={127} width={27} height={6} rx={2.5} fill="#fff" opacity={0.22} />
          <line x1={241} y1={120} x2={241} y2={109} stroke="#cbb" strokeWidth={2.5} strokeLinecap="round" />
          <text x={241} y={172} textAnchor="middle"
            fontFamily="Georgia,serif" fontWeight="bold" fontSize={118}
            fill="#e870a8" opacity={0.87} stroke="#b82878" strokeWidth={1.5}>2</text>
          <text x={241} y={172} textAnchor="middle"
            fontFamily="Georgia,serif" fontWeight="bold" fontSize={118}
            fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.1}>2</text>
          <g style={{ animation: "flicker 0.72s ease-in-out infinite", transformOrigin: "241px 95px" }}>
            <ellipse cx={241} cy={95} rx={11} ry={20} fill="url(#flameO)" opacity={0.95} />
            <ellipse cx={241} cy={96} rx={6} ry={11} fill="url(#flameI)" opacity={0.97} />
            <ellipse cx={241} cy={97} rx={2.6} ry={5.5} fill="#fff" opacity={0.78} />
          </g>
          <ellipse cx={241} cy={95} rx={26} ry={42} fill="#FFB040" opacity={0.1} />

          {/* [C] Big digit "1" */}
          <rect x={312} y={120} width={27} height={66} rx={5} fill="url(#sc2)" opacity={0.93} />
          <rect x={312} y={127} width={27} height={6} rx={2.5} fill="#fff" opacity={0.22} />
          <line x1={325} y1={120} x2={325} y2={109} stroke="#cbb" strokeWidth={2.5} strokeLinecap="round" />
          <text x={328} y={172} textAnchor="middle"
            fontFamily="Georgia,serif" fontWeight="bold" fontSize={118}
            fill="#c84088" opacity={0.87} stroke="#9a2868" strokeWidth={1.5}>1</text>
          <text x={328} y={172} textAnchor="middle"
            fontFamily="Georgia,serif" fontWeight="bold" fontSize={118}
            fill="none" stroke="#fff" strokeWidth={0.8} opacity={0.1}>1</text>
          <g style={{ animation: "flicker 0.68s 0.15s ease-in-out infinite", transformOrigin: "325px 95px" }}>
            <ellipse cx={325} cy={95} rx={11} ry={20} fill="url(#flameO)" opacity={0.95} />
            <ellipse cx={325} cy={96} rx={6} ry={11} fill="url(#flameI)" opacity={0.97} />
            <ellipse cx={325} cy={97} rx={2.6} ry={5.5} fill="#fff" opacity={0.78} />
          </g>
          <ellipse cx={325} cy={95} rx={26} ry={42} fill="#FFB040" opacity={0.1} />

          {/* [D] Small candle RIGHT of "1" */}
          <rect x={365} y={144} width={14} height={42} rx={3.5} fill="url(#sc1)" opacity={0.92} />
          <rect x={365} y={150} width={14} height={4} rx={2} fill="#fff" opacity={0.22} />
          <line x1={372} y1={144} x2={372} y2={135} stroke="#cca" strokeWidth={2} strokeLinecap="round" />
          <g style={{ animation: "flickerSm 0.7s 0.25s ease-in-out infinite", transformOrigin: "372px 123px" }}>
            <ellipse cx={372} cy={123} rx={8} ry={14} fill="url(#flameO)" opacity={0.93} />
            <ellipse cx={372} cy={124} rx={4.2} ry={7.5} fill="url(#flameI)" opacity={0.97} />
            <ellipse cx={372} cy={125} rx={1.8} ry={3.5} fill="#fff" opacity={0.75} />
          </g>
          <ellipse cx={372} cy={123} rx={16} ry={26} fill="#FFB040" opacity={0.09} />

          {/* Sparkles near big flames */}
          <g style={{ animation: "starPulse 2.2s ease-in-out infinite", transformOrigin: "219px 90px" }}>
            <line x1={214} y1={90} x2={224} y2={90} stroke="#fbbde4" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
            <line x1={219} y1={85} x2={219} y2={95} stroke="#fbbde4" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
            <circle cx={219} cy={90} r={1.6} fill="#fff" opacity={0.9} />
          </g>
          <g style={{ animation: "starPulse 2.5s 0.7s ease-in-out infinite", transformOrigin: "348px 88px" }}>
            <line x1={343} y1={88} x2={353} y2={88} stroke="#fbbde4" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
            <line x1={348} y1={83} x2={348} y2={93} stroke="#fbbde4" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
            <circle cx={348} cy={88} r={1.6} fill="#fff" opacity={0.9} />
          </g>

          {/* ══════════════════ TIER 1 — Alaa (top) ══════════════════ */}
          <rect x={148} y={184} width={284} height={60} rx={9} fill="url(#t1g)" />
          <rect x={148} y={184} width={284} height={11} rx={5.5} fill="url(#fr)" opacity={0.92} />
          {[174,220,266,312,358,400].map((x,i) => (
            <g key={i}>
              <ellipse cx={x} cy={184} rx={9} ry={7.5} fill="#fff6fb" opacity={0.86} />
              <ellipse cx={x} cy={189} rx={4.5} ry={6.5} fill="#fff6fb" opacity={0.61} />
            </g>
          ))}
          <text x={290} y={222} textAnchor="middle"
            fontFamily="'Playfair Display',Georgia,serif" fontSize={22} fontWeight="700"
            fill="#fff8fc" opacity={0.96} letterSpacing={5}>Alaa</text>
          {[164,188,212,236,260,284,308,332,356,380,404].map((x,i) => (
            <circle key={i} cx={x} cy={236} r={2.2}
              fill={i % 2 === 0 ? "#fce4ee" : "#fbbde4"} opacity={i%2===0?0.65:0.58} />
          ))}
          <text x={158} y={232} fontSize={8} fill="#fbbde4" opacity={0.5}>♥</text>
          <text x={406} y={232} fontSize={8} fill="#fbbde4" opacity={0.5}>♥</text>

          {/* ══════════════════ TIER 2 — ma princesse (middle) ══════════════════ */}
          <rect x={96} y={244} width={388} height={68} rx={8} fill="url(#t2g)" />
          <rect x={96} y={244} width={388} height={11} rx={5.5} fill="url(#fr)" opacity={0.84} />
          {[120,168,218,268,318,368,416,460].map((x,i) => (
            <g key={i}>
              <ellipse cx={x} cy={244} rx={10.5} ry={8.5} fill="#ffd8ea" opacity={0.79} />
              <ellipse cx={x} cy={249} rx={5} ry={7} fill="#ffd8ea" opacity={0.53} />
            </g>
          ))}
          <text x={290} y={285} textAnchor="middle"
            fontFamily="'Playfair Display',Georgia,serif" fontSize={18} fontStyle="italic"
            fill="#fff0f8" opacity={0.95} letterSpacing={2}>My Princess</text>
          <circle cx={136} cy={276} r={7} fill="none" stroke="rgba(255,214,234,0.28)" strokeWidth={1} />
          <circle cx={136} cy={276} r={3.5} fill="rgba(255,214,234,0.18)" />
          <circle cx={444} cy={276} r={7} fill="none" stroke="rgba(255,214,234,0.28)" strokeWidth={1} />
          <circle cx={444} cy={276} r={3.5} fill="rgba(255,214,234,0.18)" />
          <path d="M290 308 C278,296 264,296 266,308 C268,317 278,315 290,308 Z" fill="#f472b6" opacity={0.62} />
          <path d="M290 308 C302,296 316,296 314,308 C312,317 302,315 290,308 Z" fill="#f472b6" opacity={0.62} />
          <circle cx={290} cy={308} r={3.8} fill="#fce4ee" opacity={0.62} />
          <text x={116} y={307} fontSize={9} fill="#fbbde4" opacity={0.38}>♥</text>
          <text x={456} y={307} fontSize={9} fill="#fbbde4" opacity={0.38}>♥</text>

          {/* ══════════════════ TIER 3 — happy birthday (bottom) ══════════════════ */}
          <rect x={44} y={312} width={492} height={84} rx={7} fill="url(#t3g)" />
          <rect x={44} y={312} width={492} height={11} rx={5.5} fill="url(#fr)" opacity={0.76} />
          {[72,124,180,238,290,342,396,450,506].map((x,i) => (
            <g key={i}>
              <ellipse cx={x} cy={312} rx={12} ry={9.5} fill="#ffcce0" opacity={0.70} />
              <ellipse cx={x} cy={318} rx={6} ry={8} fill="#ffcce0" opacity={0.46} />
            </g>
          ))}
          <text x={290} y={362} textAnchor="middle"
            fontFamily="'Playfair Display',Georgia,serif" fontSize={20} fontStyle="italic"
            fill="#ffe4f0" opacity={0.93} letterSpacing={3}>Happy Birthday</text>
          {[[82,328,94,342,82,356,70,342],[170,328,182,342,170,356,158,342],
            [410,328,422,342,410,356,398,342],[498,328,510,342,498,356,486,342]].map(([x1,y1,x2,y2,x3,y3,x4,y4],i) => (
            <path key={i} d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} Z`}
              fill="none" stroke="rgba(255,192,218,0.2)" strokeWidth={0.8} />
          ))}
          {[110,180,250,330,400,462].map((x,i) => (
            <text key={i} x={x} y={i%2===0?382:383} fontSize={11} fill="#fbbde4" opacity={i%2===0?0.38:0.32}>♥</text>
          ))}

          {/* ── Plate ── */}
          <ellipse cx={290} cy={396} rx={258} ry={14} fill="#5a0830" opacity={0.88} />
          <ellipse cx={290} cy={392} rx={255} ry={10} fill="url(#plG)" opacity={0.95} />
          <path d="M92 389 Q190 385 288 389" fill="none" stroke="rgba(255,130,180,0.1)" strokeWidth={1.5} />

          {/* Side sparkles */}
          <g style={{ animation: "starPulse 2.8s 1s ease-in-out infinite", transformOrigin: "28px 265px" }}>
            <line x1={23} y1={265} x2={33} y2={265} stroke="#f472b6" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <line x1={28} y1={260} x2={28} y2={270} stroke="#f472b6" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <circle cx={28} cy={265} r={1.4} fill="#fff" opacity={0.8} />
          </g>
          <g style={{ animation: "starPulse 2.4s 0.4s ease-in-out infinite", transformOrigin: "552px 260px" }}>
            <line x1={547} y1={260} x2={557} y2={260} stroke="#f472b6" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <line x1={552} y1={255} x2={552} y2={265} stroke="#f472b6" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
            <circle cx={552} cy={260} r={1.4} fill="#fff" opacity={0.8} />
          </g>
        </svg>
      </div>
    </section>
  );
}




// ─── PORTRAIT ───────────────────────────────────────────────────────────────
const TRAITS = [
  { icon: <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26Z"/>, color:C.gold,  name:"Quiet radiance",     desc:"She doesn't try to shine — she simply does. A warmth you feel before you even notice it." },
  { icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>, color:C.rose, name:"Tender soul",         desc:"She feels everything deeply — a heart so alive that even the smallest things move it to tears." },
  { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>, color:C.gold, name:"Gentle constancy",   desc:"Steadfast in faith, devoted in duty — she never wavers in the things that truly matter." },
  { icon: <><circle cx={12} cy={12} r={10}/><path d="M12 8v4l3 3"/></>, color:C.rose, name:"Warm sanctuary",    desc:"To be near her is to exhale. She is rest, safety, and the quiet feeling of being home." },
];

const PORTRAIT_ARCHETYPES = {
  sovereign: {
    name: "The Still Water",
    tagline: "Calm on the surface — and unfathomably deep beneath.",
    desc: "She carries a silence that is not emptiness but fullness. While others chase noise, she has learned that the most profound things happen in stillness. She thinks before she speaks, and when she does speak, it lands. Her faith is not a performance — it is the ground she stands on, unshakeable and privately radiant. She asks for no throne. She simply is.",
    traits: ["Deeply calm","Reflective","Faithful","Unhurried","Grounded","Quietly luminous"],
    attrs: [{ v:"Still", l:"Waters" },{ v:"Deep", l:"Roots" },{ v:"Soft", l:"Light" }],
    icon: <path d="M3 8l2 8h14l2-8"/>,
  },
  muse: {
    name: "The Gentle Heart",
    tagline: "She cries easily — and that is one of her greatest gifts.",
    desc: "Her sensitivity is not a wound; it is a window. She feels the world at a frequency most people have long since tuned out — the weight of a kind word, the ache of a sad song, the quiet beauty of an ordinary afternoon. She weeps because she is not numb. And in a world that so often rewards numbness, she is quietly, beautifully brave.",
    traits: ["Deeply feeling","Empathic","Soft-hearted","Expressive","Sincere","Emotionally alive"],
    attrs: [{ v:"Open", l:"Heart" },{ v:"Pure", l:"Tears" },{ v:"True", l:"Warmth" }],
    icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>,
  },
  sage: {
    name: "The Deep Thinker",
    tagline: "Her mind never truly rests — and the world is richer for it.",
    desc: "She overthinks, yes. But within that labyrinth of thought lives an astonishing depth — connections others miss, meanings buried beneath the surface, questions no one else thought to ask. She is not anxious; she is awake. She carries her faith alongside her intellect without contradiction, because she understands that wisdom begins where certainty ends.",
    traits: ["Thoughtful","Introspective","Curious","Principled","Perceptive","Intellectually alive"],
    attrs: [{ v:"Rich", l:"Inner World" },{ v:"Clear", l:"Values" },{ v:"Deep", l:"Thought" }],
    icon: <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></>,
  },
  guardian: {
    name: "The Warm Shelter",
    tagline: "She gives without keeping score — and it costs her nothing, because she means it.",
    desc: "People come to her and leave lighter. Not because she has all the answers, but because she listens the way few people do — fully, without hurry, without judgment. Her generosity is not performance; it is nature. She holds others with the same tenderness she rarely asks for herself. She is what the word 'kind' was invented to mean.",
    traits: ["Nurturing","Generous","Loyal","Patient","Devoted","Unconditionally warm"],
    attrs: [{ v:"Open", l:"Door" },{ v:"Soft", l:"Strength" },{ v:"Warm", l:"Presence" }],
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  },
  phantom: {
    name: "The Smiling Depth",
    tagline: "She always has a smile — and almost no one sees what lives behind it.",
    desc: "She is the kind of person who makes every room brighter simply by entering it — a laugh that arrives easily, a warmth that feels immediate and real. But she is also someone whose inner world very few have ever truly reached. She shares her light freely. Her depths, she guards — not out of fear, but out of discernment. Both are authentically her.",
    traits: ["Joyful","Private","Layered","Warm in company","Rich within","Selectively known"],
    attrs: [{ v:"Open", l:"Smile" },{ v:"Hidden", l:"Depths" },{ v:"Real", l:"Joy" }],
    icon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
  },
  rebel: {
    name: "The Free Spirit",
    tagline: "She needs no permission to be exactly who she is.",
    desc: "She is not rebellious in the way that breaks things — she is free in the way that builds them. She loves herself, genuinely and without apology, not out of pride but out of knowing. She has chosen her values and lives inside them without strain. She does not need to prove herself to anyone. Her freedom is quiet and radiant — the most attractive kind.",
    traits: ["Self-assured","Authentic","Liberated","Values-led","Dignified","Peacefully herself"],
    attrs: [{ v:"Free", l:"Spirit" },{ v:"Sure", l:"Self" },{ v:"Pure", l:"Contentment" }],
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  },
};

const PORTRAIT_CARDS = [
  { key:"sovereign", label:"The Still Water",    hint:"Calm & Depth"    },
  { key:"muse",      label:"The Gentle Heart",   hint:"Heart & Tears"   },
  { key:"sage",      label:"The Deep Thinker",   hint:"Thought & Faith" },
  { key:"guardian",  label:"The Warm Shelter",   hint:"Warmth & Giving" },
  { key:"phantom",   label:"The Smiling Depth",  hint:"Smile & Mystery" },
  { key:"rebel",     label:"The Free Spirit",    hint:"Faith & Freedom" },
];

const PINK     = "#E8829A";
const PINK_DIM = "#C8608A";
const DARK_BG  = "#0F080D";

function Portrait() {
  const [active, setActive] = useState(null);
  const [fading, setFading] = useState(false);
  const [copied, setCopied] = useState(false);

  const reveal = (key) => {
    if (active === key || fading) return;
    setFading(true);
    setTimeout(() => { setActive(key); setFading(false); }, 300);
  };

  const copy = () => {
    if (!active) return;
    const d = PORTRAIT_ARCHETYPES[active];
    navigator.clipboard.writeText(
      `${d.name}\n"${d.tagline}"\n\n${d.desc}\n\nTraits: ${d.traits.join(", ")}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const d = active ? PORTRAIT_ARCHETYPES[active] : null;

  return (
    <section id= "portrait" style={{ background:"#0A0608", position:"relative", overflow:"hidden", minHeight:"100vh" }}>
      
      <RichBackground />
      <div style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "clamp(3rem,8vw,6rem) clamp(1rem,5vw,3rem)",
        boxSizing: "border-box",
      }}>

        {/* ── Header ── */}
        <Reveal>
          <div style={{ textAlign:"center", marginBottom:"clamp(2rem,5vw,3.5rem)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:"1rem" }}>
              <div style={{ height:1, width:"clamp(30px,8vw,70px)", background:`linear-gradient(90deg,transparent,${PINK_DIM})` }}/>
              <div style={{ width:6, height:6, background:PINK_DIM, transform:"rotate(45deg)", opacity:.7 }}/>
              <div style={{ height:1, width:"clamp(30px,8vw,70px)", background:`linear-gradient(90deg,${PINK_DIM},transparent)` }}/>
            </div>
            <p style={{
              fontFamily:"'DM Sans',sans-serif",
              fontSize:"clamp(9px,1.2vw,11px)",
              letterSpacing:"clamp(4px,1vw,7px)",
              textTransform:"uppercase",
              color:PINK_DIM, opacity:.8, marginBottom:"1rem"
            }}>
              The Portrait
            </p>
            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(2rem,6vw,4rem)",
              fontWeight:400, lineHeight:1.15,
              color:"#F0DDE8", marginBottom:".5rem"
            }}>
              What kind of woman <em style={{ color:PINK, fontStyle:"italic" }}>are you?</em>
            </h2>
            <p style={{
              fontFamily:"'IM Fell English',serif",
              fontStyle:"italic",
              fontSize:"clamp(12px,1.5vw,15px)",
              color:PINK_DIM, opacity:.65, letterSpacing:".4px"
            }}>
              Choose your emblem — and the mirror shall speak
            </p>
          </div>
        </Reveal>

        <p style={{
          textAlign:"center",
          fontFamily:"'DM Sans',sans-serif",
          fontSize:"clamp(9px,1vw,11px)",
          letterSpacing:"clamp(3px,1vw,5px)",
          textTransform:"uppercase",
          color:PINK_DIM, opacity:.5,
          marginBottom:"clamp(.8rem,2vw,1.4rem)"
        }}>
          Choose your emblem
        </p>

        {/* ── 6-card grid ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(min(100%/3 - 2px, 180px), 1fr))",
          gap:1,
          background:"#2A1520",
          border:"1px solid #2A1520",
          marginBottom:"clamp(1.5rem,3vw,2.5rem)",
          width:"100%",
        }}>
          {PORTRAIT_CARDS.map(({ key, label, hint }) => (
            <div
              key={key}
              onClick={() => reveal(key)}
              style={{
                background: active === key ? "#1C0D14" : DARK_BG,
                padding:"clamp(1rem,3vw,2rem) clamp(.8rem,2vw,1.5rem)",
                cursor:"pointer", textAlign:"center",
                borderTop: active === key ? `2px solid ${PINK}` : "2px solid transparent",
                transition:"all .2s",
              }}
              onMouseEnter={e => { if(active!==key) e.currentTarget.style.background="#160A10"; }}
              onMouseLeave={e => { if(active!==key) e.currentTarget.style.background=DARK_BG; }}
            >
              <div style={{
                fontSize:"clamp(12px,1.8vw,15px)",
                fontFamily:"'Playfair Display',serif",
                fontStyle:"italic",
                color: active === key ? PINK : "#F0DDE8",
                marginBottom:5,
                transition:"color .2s",
              }}>{label}</div>
              <div style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"clamp(9px,1vw,11px)",
                letterSpacing:"clamp(1px,.5vw,2px)",
                textTransform:"uppercase",
                color:PINK_DIM, opacity:.45
              }}>{hint}</div>
            </div>
          ))}
        </div>

        {/* ── Reveal panel ── */}
        <div style={{
          border:"1px solid #2A1520",
          background:DARK_BG,
          position:"relative",
          minHeight:"clamp(220px,40vw,380px)",
          marginBottom:"clamp(1rem,2vw,1.5rem)",
          width:"100%",
          boxSizing:"border-box",
        }}>
          {/* Corner ornaments */}
          {[["0","0","1px 0 0 1px"],["0","auto","1px 1px 0 0"],["auto","0","0 0 1px 1px"],["auto","auto","0 1px 1px 0"]].map(([t,r,bw],i) => (
            <span key={i} style={{
              position:"absolute",
              width:"clamp(10px,2vw,18px)", height:"clamp(10px,2vw,18px)",
              top:t!=="auto"?10:"auto", bottom:t==="auto"?10:"auto",
              left:r!=="auto"?10:"auto", right:r==="auto"?10:"auto",
              borderWidth:bw, borderStyle:"solid", borderColor:PINK_DIM, opacity:.4,
            }}/>
          ))}

          <div style={{
            opacity:fading?0:1,
            transform:fading?"translateY(8px)":"none",
            transition:"opacity .3s,transform .3s"
          }}>
            {!d ? (
              <div style={{
                textAlign:"center",
                padding:"clamp(2rem,8vw,5rem) 2rem",
                color:PINK_DIM, opacity:.3,
                fontFamily:"'IM Fell English',serif",
                fontStyle:"italic",
                fontSize:"clamp(13px,2vw,17px)",
                letterSpacing:1
              }}>
                The mirror awaits your choice...
              </div>
            ) : (
              <div style={{ padding:"clamp(1.2rem,4vw,2.8rem)" }}>

                {/* Archetype header */}
                <div style={{
                  display:"flex",
                  gap:"clamp(1rem,3vw,2rem)",
                  alignItems:"flex-start",
                  marginBottom:"clamp(1.2rem,3vw,2rem)",
                  paddingBottom:"clamp(1.2rem,3vw,2rem)",
                  borderBottom:"1px solid #1E0F18",
                  flexWrap:"wrap",
                }}>
                  <div style={{
                    width:"clamp(52px,8vw,72px)", height:"clamp(52px,8vw,72px)",
                    flexShrink:0,
                    border:"1px solid #3A1E2A", background:"#160B10",
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth={1.1}
                      width="clamp(22px,4vw,30px)" height="clamp(22px,4vw,30px)">
                      {d.icon}
                    </svg>
                  </div>
                  <div style={{ flex:1, minWidth:180 }}>
                    <p style={{
                      fontFamily:"'DM Sans',sans-serif",
                      fontSize:"clamp(9px,1vw,11px)",
                      letterSpacing:"clamp(3px,1vw,5px)",
                      textTransform:"uppercase",
                      color:PINK_DIM, opacity:.55, marginBottom:".3rem"
                    }}>Your archetype</p>
                    <p style={{
                      fontFamily:"'Playfair Display',serif",
                      fontSize:"clamp(1.3rem,3.5vw,2rem)",
                      fontStyle:"italic", color:PINK,
                      lineHeight:1.1, marginBottom:".35rem"
                    }}>{d.name}</p>
                    <p style={{
                      fontFamily:"'IM Fell English',serif",
                      fontStyle:"italic",
                      fontSize:"clamp(12px,1.5vw,14px)",
                      color:"#F0DDE8", opacity:.65, lineHeight:1.6
                    }}>{d.tagline}</p>
                  </div>
                </div>

                {/* Traits */}
                <p style={{
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:"clamp(9px,1vw,11px)",
                  letterSpacing:"clamp(3px,1vw,5px)",
                  textTransform:"uppercase",
                  color:PINK_DIM, opacity:.5,
                  marginBottom:"clamp(.6rem,1.5vw,1rem)"
                }}>Character traits</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"clamp(4px,1vw,6px)", marginBottom:"clamp(1.2rem,3vw,1.8rem)" }}>
                  {d.traits.map(t => (
                    <span key={t} style={{
                      fontFamily:"'DM Sans',sans-serif",
                      fontSize:"clamp(9px,1vw,11px)",
                      letterSpacing:"clamp(1px,.5vw,2px)",
                      textTransform:"uppercase",
                      padding:"clamp(3px,.5vw,5px) clamp(8px,1.5vw,13px)",
                      border:"1px solid #2A1520",
                      color:PINK, opacity:.7
                    }}>{t}</span>
                  ))}
                </div>

                {/* Description */}
                <p style={{
                  fontFamily:"'IM Fell English',serif",
                  fontStyle:"italic",
                  fontSize:"clamp(13px,1.6vw,15px)",
                  color:"#F0DDE8", opacity:.8,
                  lineHeight:1.9,
                  marginBottom:"clamp(1.2rem,3vw,1.8rem)",
                  paddingLeft:"clamp(.8rem,2vw,1.2rem)",
                  borderLeft:`2px solid ${PINK_DIM}`,
                  borderRadius:0
                }}>
                  {d.desc}
                </p>

                {/* Attribute grid */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#1E0F18" }}>
                  {d.attrs.map(a => (
                    <div key={a.l} style={{ background:DARK_BG, padding:"clamp(.7rem,2vw,1.1rem) clamp(.5rem,1.5vw,.9rem)", textAlign:"center" }}>
                      <span style={{
                        display:"block",
                        fontFamily:"'Playfair Display',serif",
                        fontSize:"clamp(1rem,2.5vw,1.3rem)",
                        color:PINK, marginBottom:2
                      }}>{a.v}</span>
                      <span style={{
                        fontFamily:"'DM Sans',sans-serif",
                        fontSize:"clamp(8px,.9vw,10px)",
                        letterSpacing:"clamp(2px,.8vw,3px)",
                        textTransform:"uppercase",
                        color:PINK_DIM, opacity:.5
                      }}>{a.l}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ── Footer buttons ── */}
        {d && (
          <div style={{ display:"flex", gap:"clamp(6px,2vw,12px)", justifyContent:"center", flexWrap:"wrap" }}>
            <button
              onClick={() => {
                const keys = Object.keys(PORTRAIT_ARCHETYPES).filter(k => k !== active);
                reveal(keys[Math.floor(Math.random() * keys.length)]);
              }}
              style={{
                padding:"clamp(9px,1.5vw,12px) clamp(18px,4vw,30px)",
                background:PINK_DIM, color:"#0A0608", border:"none",
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"clamp(9px,1vw,11px)",
                letterSpacing:"clamp(2px,1vw,3px)",
                textTransform:"uppercase", cursor:"pointer"
              }}
            >
              Discover another self
            </button>
            <button
              onClick={copy}
              style={{
                padding:"clamp(9px,1.5vw,12px) clamp(16px,3vw,26px)",
                background:"transparent", border:"1px solid #2A1520",
                color:"#F0DDE8",
                fontFamily:"'DM Sans',sans-serif",
                fontSize:"clamp(9px,1vw,11px)",
                letterSpacing:"clamp(2px,1vw,3px)",
                textTransform:"uppercase", cursor:"pointer", opacity:.55
              }}
            >
              {copied ? "Copied" : "Copy reading"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

// ─── TIMELINE ───────────────────────────────────────────────────────────────
const EVENTS = [
  {
    year: "Winter 2025 — The Library",
    title: "The First Glance",
    text: "I was sitting with my friends, third-year student with no plans for anything unexpected. Then, across the room at the opposite table — you. A feeling I had never felt before. Something between wonder and confusion. I didn't understand it. I just knew I couldn't look away.",
    accent: false,
   
  },
  {
    year: "That same day",
    title: "I Followed the Feeling",
    text: "When you got up to leave, I followed you out of the library without thinking twice. I just needed to know where you studied. I needed to keep that feeling close. I got your Instagram. That was the beginning — though I didn't know yet how deep this would go.",
    accent: false,
  },
  {
    year: "The months that followed",
    title: "Watching From a Distance",
    text: "I was hesitant. I had been hurt before and I knew what fire looked like. But I found myself searching for you everywhere — your schedule, your routes, the people around you. I knew your timetables by heart. I knew where you'd be before you got there. I hadn't spoken a single word to you, yet I already knew you.",
    accent: false,
  },
  {
    year: "Before the exams — a first attempt",
    title: "The Follow That Got No Reply",
    text: "I sent a follow request on Instagram. You didn't respond. But after six months of everything I had been doing quietly, I kept going exactly as before. The year ended. Summer came.",
    accent: false,
  },
  {
    year: "Summer 2025",
    title: "Missing Someone I'd Never Spoken To",
    text: "You were gone from campus. But not from my mind — not for a single night. I tracked your Telegram activity. I noticed every absence. That was when I understood: I had fallen for you. Completely. Without ever having said hello.",
    accent: false,
  },
  {
    year: "12 July 2025",
    title: "The Message",
    text: "I sent you a direct message. You ignored it — just as I expected. But I didn't let it land. I had already decided: I would speak to you when the new year started. There was no way back. No escape. Only forward.",
    accent: false,
  },
  {
    year: "6 October 2025",
    title: "The Day I Actually Spoke",
    text: "Near the bus stop. I walked up to you and said — plainly, directly — that I wanted to talk to you, to know you. You refused. I stayed. You agreed to listen, intending to say no eventually. But after a long conversation — a very long one — you kept talking. And that was it.",
    accent: true,
  },
  {
    year: "10 May 2026 — Today",
    title: "Everything That Matters",
    text: "From a glance across a library to this moment — every hesitation, every silent morning, every unanswered message was part of the path. Happy birthday, Alaa. You were worth every single step.",
    accent: true,
  },
];

function Timeline() {
  return (
    <section id="timeline" style={{ background:C.dark3, position:"relative", overflow:"hidden" }}>
      <RichBackground/>
      <div style={{ maxWidth:880, margin:"0 auto", padding:"6rem 2rem" }}>
        <Reveal>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:6, textTransform:"uppercase", color:C.gold, opacity:.7, marginBottom:"1rem" }}>Our story</p>
          <h2 style={{ fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:400, lineHeight:1.15, marginBottom:"1.5rem" }}>
            From a <em style={{ color:C.gold }}>glance</em> to everything
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"1rem", lineHeight:1.9, color:C.muted, maxWidth:560, marginBottom:"3rem" }}>
            A story that began in silence, and became the most honest thing I've ever lived.
          </p>
        </Reveal>

        <div style={{ position:"relative", paddingLeft:"2.5rem" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, width:1, background:`linear-gradient(to bottom,transparent,${C.gold},transparent)`, opacity:.3 }}/>
          {EVENTS.map((ev, i) => (
            <Reveal key={ev.year} delay={i * 100}>
              <div style={{ position:"relative", paddingBottom: i < EVENTS.length - 1 ? "3.5rem" : 0 }}>
                <div style={{
                  position:"absolute", left:"-2.72rem", top:".35rem",
                  width:10, height:10, borderRadius:"50%",
                  border:`1px solid ${ev.accent ? C.rose : C.gold}`,
                  background: ev.accent ? C.rose : C.dark,
                }}/>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:4, textTransform:"uppercase", color:C.gold, opacity:.65, marginBottom:".4rem" }}>{ev.year}</p>
                <p style={{ fontSize:"1.15rem", color: ev.accent ? C.gold : C.cream, marginBottom:".4rem" }}>{ev.title}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", color:C.muted, lineHeight:1.75, maxWidth:500 }}>{ev.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VOEUX ──────────────────────────────────────────────────────────────────
const DATA = [
  {
    roman: "I", title: "Everlasting Joy",
    wish: "May sorrow never find its way to your heart — may you always wake with a smile, carry hope in your eyes, and walk through life wrapped in warmth and light.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
  },
  {
    roman: "II", title: "Health & God's Protection",
    wish: "May your health be a constant companion, and may Allah guard you, protect you, and answer every prayer you whisper — wherever life may take you, near or far.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    roman: "III", title: "Dreams & Horizons",
    wish: "May Allah bless you with success in all your future ambitions — fulfilling your mother's greatest wish for you, and seeing with your own eyes every country your heart has ever dreamed of.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    roman: "IV", title: "Academic Triumph",
    wish: "May you finish your studies in Computer Science with distinction — earning your licence with grace, and if Allah wills, your master's degree too, with brilliance that reflects who you truly are.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    roman: "V", title: "A Life Written in Happiness",
    wish: "May Allah write happiness into every chapter of your future — in your career, in your studies, and in love. May you marry the one you choose, and may you live beside him in joy and tenderness, always.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    roman: "VI", title: "Believe in Yourself",
    wish: "Never doubt your worth, Alaa — you are far more precious than you allow yourself to believe. May you always be surrounded by those who truly see you, cherish you, and are worthy of your presence in their lives.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#ff508c" strokeWidth="1.6" strokeLinecap="round" width={22} height={22}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

function WishCard({ data, index }) {
  const [opened, setOpened] = useState(false);

  return (
    <div
      onClick={() => !opened && setOpened(true)}
      style={{
        position: "relative", borderRadius: "16px", overflow: "hidden",
        minHeight: "230px", cursor: opened ? "default" : "pointer",
        border: `1px solid ${opened ? "rgba(255,80,140,0.4)" : "rgba(255,80,140,0.22)"}`,
        background: "linear-gradient(135deg, rgba(18,8,14,0.95), rgba(26,10,18,0.95))",
        boxShadow: opened ? "0 20px 50px rgba(255,80,140,0.18)" : "0 4px 20px rgba(0,0,0,0.3)",
        transform: "translateY(0) scale(1)",
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s, border-color 0.4s",
      }}
      onMouseEnter={e => {
        if (!opened) {
          e.currentTarget.style.transform = "translateY(-10px) scale(1.025)";
          e.currentTarget.style.boxShadow = "0 24px 55px rgba(255,80,140,0.22)";
          e.currentTarget.style.borderColor = "rgba(255,80,140,0.55)";
        }
      }}
      onMouseLeave={e => {
        if (!opened) {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
          e.currentTarget.style.borderColor = "rgba(255,80,140,0.22)";
        }
      }}
    >
      {/* Top accent line */}
      <div style={{
        position:"absolute",top:0,left:0,right:0,height:"2px",
        background:"linear-gradient(90deg,transparent,#ff508c,transparent)",opacity:0.55,zIndex:1,
      }}/>

      {/* COVER */}
      <div style={{ position:"absolute",inset:0,zIndex:5,borderRadius:"16px",overflow:"hidden" }}>
        {/* Envelope body */}
        <div style={{
          position:"absolute",inset:0,
          background:"linear-gradient(150deg,#4a0820 0%,#7a1540 45%,#b02860 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
          transition:`transform 0.52s cubic-bezier(0.4,0,0.2,1) ${opened?"0.32s":"0s"}, opacity 0.38s ease ${opened?"0.5s":"0s"}`,
          transform: opened ? "translateY(112%)" : "translateY(0)",
          opacity: opened ? 0 : 1,
        }}>
          <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:"2.5px",background:"rgba(255,200,220,0.3)",transform:"translateX(-50%)"}}/>
          <div style={{position:"absolute",top:"50%",left:0,right:0,height:"2.5px",background:"rgba(255,200,220,0.3)",transform:"translateY(-50%)"}}/>
          {/* Bow */}
          <div style={{position:"relative",width:54,height:40,zIndex:2}}>
            <div style={{position:"absolute",width:24,height:16,borderRadius:"50% 50% 50% 50%/60% 60% 40% 40%",background:"rgba(255,210,230,0.72)",top:8,left:0,transform:"rotate(28deg)",transformOrigin:"right center"}}/>
            <div style={{position:"absolute",width:24,height:16,borderRadius:"50% 50% 50% 50%/60% 60% 40% 40%",background:"rgba(255,210,230,0.72)",top:8,right:0,transform:"rotate(-28deg)",transformOrigin:"left center"}}/>
            <div style={{position:"absolute",width:13,height:13,borderRadius:"50%",background:"rgba(255,225,240,0.92)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
          </div>
          <div style={{fontSize:"2.2rem",fontWeight:700,color:"rgba(255,210,230,0.55)",letterSpacing:"0.05em",lineHeight:1}}>{data.roman}</div>
          <div style={{fontSize:"9.5px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,200,220,0.68)",fontWeight:500}}>{data.title}</div>
          <div style={{fontSize:"9px",color:"rgba(255,175,205,0.42)",letterSpacing:"0.12em"}}>Press to open</div>
        </div>
        {/* Flap */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"52%",
          transformOrigin:"top center",
          background:"linear-gradient(165deg,#621030 0%,#9a1f50 100%)",
          clipPath:"polygon(0 0,100% 0,50% 100%)",zIndex:6,
          transition:"transform 0.58s cubic-bezier(0.4,0,0.2,1)",
          transform: opened ? "rotateX(-170deg)" : "rotateX(0deg)",
        }}/>
      </div>

      {/* CONTENT */}
      <div style={{
        padding:"2rem 1.8rem 1.6rem",
        transition:`opacity 0.42s ease ${opened?"0.62s":"0s"}`,
        opacity: opened ? 1 : 0,
        position:"relative",
      }}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:"1.2rem"}}>
          <div style={{
            width:46,height:46,borderRadius:12,
            background:"rgba(255,80,140,0.1)",
            border:"1px solid rgba(255,80,140,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            {data.icon}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:"9px",letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,80,140,0.6)",marginBottom:3}}>Wish {data.roman}</div>
            <div style={{fontSize:13,fontWeight:500,color:"rgba(255,220,235,0.85)",letterSpacing:"0.04em"}}>{data.title}</div>
          </div>
        </div>
        <div style={{height:1,background:"linear-gradient(90deg,rgba(255,80,140,0.25),transparent)",marginBottom:"1.1rem"}}/>
        <p style={{fontSize:"0.97rem",lineHeight:1.85,color:"rgba(255,235,245,0.78)",fontStyle:"italic",fontWeight:300}}>{data.wish}</p>
        <div style={{display:"flex",gap:6,marginTop:"1.2rem"}}>
          {[0.45,0.22,0.1].map((o,i)=>(
            <div key={i} style={{width:6,height:6,borderRadius:"50%",background:`rgba(255,80,140,${o})`}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function Voeux() {
  return (
    <section id="voeux" style={{
      background:"linear-gradient(180deg,#0a0508 0%,#1a0a12 50%,#0a0508 100%)",
      position:"relative",overflow:"hidden",padding:"8rem 2rem",minHeight:"100vh",
    }}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"10%",left:"10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,80,140,0.15) 0%,transparent 70%)",filter:"blur(40px)"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,80,140,0.12) 0%,transparent 70%)",filter:"blur(40px)"}}/>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:"5rem"}}>
          <p style={{fontSize:"0.75rem",letterSpacing:"0.3em",textTransform:"uppercase",color:"#ff508c",opacity:0.65,margin:"0 0 1rem",fontWeight:500}}>For your 21st birthday</p>
          <h2 style={{fontSize:"clamp(2.5rem,6vw,4rem)",fontWeight:300,color:"#fff",margin:"0 0 1.5rem",letterSpacing:"-0.01em"}}>
           My wishes for <span style={{color:"#ff508c",fontStyle:"italic",fontWeight:400}}>you</span>
          </h2>
          <div style={{width:50,height:2,background:"linear-gradient(90deg,transparent,#ff508c,transparent)",margin:"0 auto"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"2rem",marginBottom:"4rem"}}>
          {DATA.map((d,i) => <WishCard key={i} data={d} index={i}/>)}
        </div>
        <div style={{textAlign:"center",padding:"2.5rem 2rem",borderTop:"1px solid rgba(255,80,140,0.1)",borderBottom:"1px solid rgba(255,80,140,0.1)"}}>
          <p style={{fontSize:"1.2rem",color:"rgba(255,235,245,0.55)",fontStyle:"italic",margin:0,lineHeight:1.8}}>
            With all my love and my warmest wishes for this new year of your life.
          </p>
        </div>
      </div>
    </section>
  );
}


// ─── MOOD BOARD ─────────────────────────────────────────────────────────────
import LLImg from "./assets/LL.jpg";

const USERS = { alaa: "my princess" };

const ALL_QUESTIONS = [
  { q: "What's your favorite color?", opts: ["Blue", "Pink", "Purple", "Green"], ans: "Pink" },
  { q: "What's your favorite anime?", opts: ["Naruto", "Death Note", "Attack on Titan", "One Piece"], ans: "Attack on Titan" },
  { q: "What's your favorite animal?", opts: ["Cat", "Dog", "Rabbit", "Fox"], ans: "Rabbit", isAnimal: true },
  { q: "What's your favorite football club?", opts: ["Barcelona", "PSG", "Bayern Munich", "Real Madrid"], ans: "Real Madrid" },
  { q: "Who's your favorite player?", opts: ["Messi", "Neymar", "Mbappé", "Cristiano Ronaldo"], ans: "Cristiano Ronaldo" },
  { q: "What's your favorite season?", opts: ["Spring", "Summer", "Autumn", "Winter"], ans: "Winter" },
  { q: "What's your favorite drink?", opts: ["Tea", "Juice", "Water", "Coffee"], ans: "Coffee" },
  { q: "What's your favorite fruit?", opts: ["Mango", "Apple", "Strawberry", "Banana"], ans: "Banana" },
  { q: "What's your favorite hobby?", opts: ["Drawing", "Music", "Travel", "Reading"], ans: "Reading" },
  { q: "Pick a world to live in:", opts: ["Modern Tokyo", "A fantasy kingdom", "A quiet countryside", "Victorian England"], ans: "Victorian England" },
  { q: "What's your fashion vibe?", opts: ["Modern & minimal", "Streetwear & casual", "Bohemian & free", "Victorian & romantic"], ans: "Victorian & romantic" },
  { q: "What's your favorite fictional universe?", opts: ["Harry Potter", "Attack on Titan", "Studio Ghibli", "Disney Princesses"], ans: "Disney Princesses" },
  { q: "Who holds the biggest place in your heart?", opts: ["Your mom", "Chahd", "Imen", "Your dad"], ans: "Your dad" },
  { q: "What's your ultimate comfort food?", opts: ["Pizza", "Sushi", "Pasta", "Chakhchoukha lbaskriya"], ans: "Chakhchoukha lbaskriya" },
  { q: "How do you show care for others?", opts: ["Joking & making them smile", "Protecting & defending them", "Offering help", "Listening to them"], ans: "Listening to them" },
  { q: "Are you a morning or night person?", opts: ["Night owl", "Afternoon person", "Sunset lover", "Morning person"], ans: "Morning person" },
  { q: "What's your favorite song?", opts: ["Pretty Little Baby", "Crybaby", "K-12", "Tag, You're It"], ans: "Pretty Little Baby" },
  { q: "What's your go-to late night snack? ", opts: ["Chocolate ", "Chips ", "Biscuits ", "Fruits "], ans: "Chips " },
  { q: "What do you do when you're sad? ", opts: ["Listen to music", "Watch a series", "Cry alone", "Sleep"], ans: "Cry alone" },
];

const LOVE_MSGS = {
  5: " You know yourself really well… but don’t get too confident, I know you even better than you know yourself.",
  
  4: " So close. You know yourself pretty well… almost.",
  
  3: " Half self-awareness, half lucky guessing. You still have a few secrets from yourself.",
  
  2: " Wait… were you actually answering for yourself?",
  
  1: " We may need a proper introduction, because you clearly don’t know yourself yet.",
  
  0: " A quiz about yourself… and you still failed. That’s honestly impressive.",
};

const STARS_MAP = {
  5: "✦ ✦ ✦ ✦ ✦",
  4: "✦ ✦ ✦ ✦ ✧",
  3: "✦ ✦ ✦ ✧ ✧",
  2: "✦ ✦ ✧ ✧ ✧",
  1: "✦ ✧ ✧ ✧ ✧",
  0: "✧ ✧ ✧ ✧ ✧",
};

const KEYS      = ["A", "B", "C", "D"];
const TIMER_MAX = 20;
const CIRC      = 2 * Math.PI * 22;

const PK       = "#C4587A";
const PK_DIM   = "#7A3050";
const PK_LIGHT = "#E891AD";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle options and track where the correct answer ended up
function shuffleOptions(question) {
  const shuffledOpts = shuffle(question.opts);
  const correctIdx = shuffledOpts.indexOf(question.ans);
  return { ...question, opts: shuffledOpts, ans: correctIdx };
}

// ─── Background Canvas ───────────────────────────────────────────────────────
function Background() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext("2d");
    let animId, particles = [], t = 0;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      build();
    }

    function rnd(min, max) { return Math.random() * (max - min) + min; }

    function build() {
      particles = [];
      const W = canvas.width, H = canvas.height;
      for (let i = 0; i < 120; i++)
        particles.push({ type: "star", x: rnd(0,W), y: rnd(0,H), size: rnd(0.5,2.5), alpha: rnd(0.1,0.55), speed: rnd(0.001,0.005) });
      for (let i = 0; i < 16; i++)
        particles.push({ type: "rose", x: rnd(0,W), y: rnd(0,H), size: rnd(4,12), alpha: rnd(0.06,0.2), drift: rnd(-0.15,0.15) });
      for (let i = 0; i < 24; i++)
        particles.push({ type: "diamond", x: rnd(0,W), y: rnd(0,H), size: rnd(2,6), alpha: rnd(0.06,0.22), vy: rnd(0.05,0.2) });
      for (let i = 0; i < 14; i++)
        particles.push({ type: "heart", x: rnd(0,W), y: rnd(0,H), size: rnd(4,10), alpha: rnd(0.04,0.16), vy: rnd(0.03,0.14), drift: rnd(-0.12,0.12) });
      for (let i = 0; i < 20; i++)
        particles.push({ type: "sparkle", x: rnd(0,W), y: rnd(0,H), size: rnd(1,4), alpha: rnd(0.1,0.45), speed: rnd(0.002,0.006), phase: rnd(0, Math.PI*2) });
    }

    function star8(x, y, s, a, color = "#D4678E") {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x,y-s); ctx.lineTo(x+s*0.3,y-s*0.3);
      ctx.lineTo(x+s,y); ctx.lineTo(x+s*0.3,y+s*0.3);
      ctx.lineTo(x,y+s); ctx.lineTo(x-s*0.3,y+s*0.3);
      ctx.lineTo(x-s,y); ctx.lineTo(x-s*0.3,y-s*0.3);
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function rose(x, y, s, a) {
      ctx.save(); ctx.globalAlpha = a;
      for (let p = 0; p < 5; p++) {
        const ang = (p/5)*Math.PI*2;
        ctx.beginPath();
        ctx.arc(x+Math.cos(ang)*s*0.6, y+Math.sin(ang)*s*0.6, s*0.48, 0, Math.PI*2);
        ctx.fillStyle = "#C4587A"; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(x, y, s*0.38, 0, Math.PI*2);
      ctx.fillStyle = "#7A3050"; ctx.fill();
      ctx.restore();
    }

    function diamond(x, y, s, a) {
      ctx.save(); ctx.globalAlpha = a;
      ctx.translate(x,y); ctx.rotate(Math.PI/4);
      ctx.fillStyle = "#D4678E";
      ctx.fillRect(-s/2,-s/2,s,s);
      ctx.restore();
    }

    function heart(x, y, s, a) {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#C4587A";
      ctx.beginPath();
      ctx.moveTo(x, y+s*0.3);
      ctx.bezierCurveTo(x, y-s*0.1, x-s*0.6, y-s*0.5, x-s*0.6, y);
      ctx.bezierCurveTo(x-s*0.6, y+s*0.4, x, y+s*0.8, x, y+s*0.8);
      ctx.bezierCurveTo(x, y+s*0.8, x+s*0.6, y+s*0.4, x+s*0.6, y);
      ctx.bezierCurveTo(x+s*0.6, y-s*0.5, x, y-s*0.1, x, y+s*0.3);
      ctx.fill(); ctx.restore();
    }

    function sparkle(x, y, s, a) {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#F4C0D1";
      ctx.beginPath();
      ctx.moveTo(x,y-s); ctx.lineTo(x+s*0.15,y-s*0.15);
      ctx.lineTo(x+s,y); ctx.lineTo(x+s*0.15,y+s*0.15);
      ctx.lineTo(x,y+s); ctx.lineTo(x-s*0.15,y+s*0.15);
      ctx.lineTo(x-s,y); ctx.lineTo(x-s*0.15,y-s*0.15);
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function frame() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      t += 0.01;
      particles.forEach(p => {
        if (p.type === "star") {
          star8(p.x, p.y, p.size, p.alpha*(0.5+0.5*Math.sin(t*p.speed*100+p.x)));
        } else if (p.type === "rose") {
          p.x += Math.sin(t*0.3+p.drift)*0.3;
          rose(p.x, p.y, p.size, p.alpha*(0.7+0.3*Math.sin(t*0.5+p.x)));
        } else if (p.type === "diamond") {
          p.y -= p.vy;
          if (p.y < -20) p.y = canvas.height+20;
          diamond(p.x, p.y, p.size, p.alpha);
        } else if (p.type === "heart") {
          p.y -= p.vy;
          p.x += Math.sin(t*0.5+p.drift)*0.4;
          if (p.y < -30) p.y = canvas.height+30;
          heart(p.x, p.y, p.size, p.alpha*(0.6+0.4*Math.sin(t+p.x)));
        } else if (p.type === "sparkle") {
          sparkle(p.x, p.y, p.size, p.alpha*(0.4+0.6*Math.abs(Math.sin(t*p.speed*80+p.phase))));
        }
      });
      animId = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0 }} />;
}

// ─── Shared UI pieces ─────────────────────────────────────────────────────────
function Ornament() {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:"1.5rem" }}>
      <div style={{ height:1,width:65,background:`linear-gradient(90deg,transparent,${PK_DIM})` }} />
      <div style={{ width:7,height:7,background:PK_DIM,transform:"rotate(45deg)" }} />
      <div style={{ height:1,width:65,background:`linear-gradient(90deg,${PK_DIM},transparent)` }} />
    </div>
  );
}

function Divider() {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:12,margin:"1.8rem 0" }}>
      <div style={{ flex:1,height:1,background:"#2A1520" }} />
      <div style={{ width:7,height:7,background:PK_DIM,transform:"rotate(45deg)" }} />
      <div style={{ flex:1,height:1,background:"#2A1520" }} />
    </div>
  );
}

function EnterButton({ onClick, children, auto = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: auto ? "auto" : "100%",
        padding: "clamp(13px,2vw,16px) 32px",
        marginTop: "0.5rem",
        cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "clamp(10px,1.8vw,12px)",
        letterSpacing: 4,
        textTransform: "uppercase",
        background: hov ? PK : "transparent",
        border: `1px solid ${PK}`,
        color: hov ? "#fff" : PK_LIGHT,
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "transparent",
        border: `1px solid ${hov ? PK_DIM : "#2A1520"}`,
        color: hov ? PK_LIGHT : "#F0DDE8",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "clamp(9px,1.6vw,11px)",
        letterSpacing: 3,
        textTransform: "uppercase",
        cursor: "pointer",
        padding: "clamp(11px,2vw,14px) 28px",
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      {children}
    </button>
  );
}

function OptionBtn({ baseStyle, onClick, answered, children }) {
  const [hov, setHov] = useState(false);
  const extra = !answered && hov ? { borderColor: PK, color: PK_LIGHT, background: "#1A0815" } : {};
  return (
    <button
      style={{ ...baseStyle, ...extra }}
      onClick={onClick}
      disabled={answered}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

// ─── Timer Ring ───────────────────────────────────────────────────────────────
function TimerRing({ timeLeft }) {
  const offset = CIRC * (1 - timeLeft / TIMER_MAX);
  const color  = timeLeft <= 5 ? "#E24B4A" : timeLeft <= 10 ? "#EF9F27" : PK;
  return (
    <div style={{ position:"relative",width:54,height:54,flexShrink:0 }}>
      <svg width="54" height="54" viewBox="0 0 54 54" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="27" cy="27" r="22" fill="none" stroke="#2A1520" strokeWidth="3.5" />
        <circle
          cx="27" cy="27" r="22" fill="none"
          stroke={color} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset}
          style={{ transition:"stroke-dashoffset 0.9s linear,stroke 0.3s" }}
        />
      </svg>
      <div style={{
        position:"absolute",inset:0,display:"flex",
        alignItems:"center",justifyContent:"center",
        fontSize:16,fontWeight:600,color,fontFamily:"'DM Sans',sans-serif",
      }}>
        {timeLeft}
      </div>
    </div>
  );
}

// ─── Card shell ───────────────────────────────────────────────────────────────
const card = {
  background: "#100810",
  border: "1px solid #2A1520",
  padding: "clamp(1.8rem,5vw,3.2rem)",
  width: "100%",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");

  const attempt = () => {
    if (USERS[username.trim().toLowerCase()] === password.trim()) {
      setError(""); onLogin();
    } else {
      setError("Incorrect username or password");
    }
  };

  const inp = {
    width: "100%", background: "#060406", border: "1px solid #2A1520",
    color: "#F0DDE8", fontFamily: "'DM Sans',sans-serif",
    fontSize: "clamp(14px,2.5vw,16px)",
    padding: "clamp(12px,2vw,16px) 18px",
    outline: "none", marginBottom: "1.1rem", display: "block",
    transition: "border-color .2s",
  };

  return (
    <div style={card}>
      <Ornament />
      <div style={{ fontSize:"clamp(8px,1.5vw,10px)",letterSpacing:7,textTransform:"uppercase",color:PK_DIM,textAlign:"center",marginBottom:"0.6rem",fontFamily:"'DM Sans',sans-serif" }}>
        The Love Oracle
      </div>
      <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.8rem,5vw,2.6rem)",fontWeight:400,color:"#F0DDE8",textAlign:"center",marginBottom:"0.5rem" }}>
        The <em style={{ color:PK,fontStyle:"italic" }}>Secret Quiz</em>
      </h1>
      <p style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"clamp(12px,2vw,15px)",color:PK_DIM,textAlign:"center" }}>
        Enter your details to participate in the quiz
      </p>
      <Divider />
      <input
        style={inp} placeholder="Username" value={username}
        onChange={e => setUsername(e.target.value)}
        onKeyDown={e => e.key === "Enter" && document.getElementById("quiz-pass").focus()}
        autoComplete="off"
      />
      <input
        id="quiz-pass" style={inp} type="password"
        placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === "Enter" && attempt()}
      />
      <div style={{ color:"#E24B4A",fontSize:13,marginTop:6,minHeight:18,fontFamily:"'DM Sans',sans-serif" }}>
        {error}
      </div>
      <EnterButton onClick={attempt}>Enter the Quiz</EnterButton>
    </div>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────
function QuizScreen({ onFinish }) {
  const [questions] = useState(() =>
    shuffle(ALL_QUESTIONS).slice(0, 5).map(shuffleOptions)
  );
  const [curIdx,   setCurIdx]   = useState(0);
  const [score,    setScore]    = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosen,   setChosen]   = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX);
  const [timedOut, setTimedOut] = useState(false);
  const [showImg,  setShowImg]  = useState(false);
  const timerRef = useRef(null);

  const q = questions[curIdx];

  useEffect(() => {
    setAnswered(false); setChosen(null);
    setTimeLeft(TIMER_MAX); setTimedOut(false); setShowImg(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setAnswered(true); setTimedOut(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [curIdx]);

  const pick = idx => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(true); setChosen(idx);
    if (idx === q.ans) {
      setScore(s => s + 1);
      // Show LL.png only for the animal question when correct answer selected
      if (q.isAnimal) setShowImg(true);
    }
  };

  const next = () => {
    if (curIdx + 1 >= 5) onFinish(score);
    else setCurIdx(i => i + 1);
  };

  const baseOpt = {
    background: "#060406", border: "1px solid #2A1520", color: "#F0DDE8",
    textAlign: "left",
    padding: "clamp(12px,2vw,17px) clamp(14px,3vw,22px)",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "clamp(13px,2vw,16px)",
    cursor: answered ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 14, width: "100%",
    transition: "border-color .15s,color .15s,background .15s",
  };

  const getOptStyle = i => {
    if (!answered) return baseOpt;
    if (i === q.ans)                      return { ...baseOpt, borderColor:"#639922",color:"#C0DD97",background:"#04342C" };
    if (i === chosen && chosen !== q.ans) return { ...baseOpt, borderColor:"#A32D2D",color:"#F09595",background:"#501313" };
    return { ...baseOpt, opacity: 0.4 };
  };

  let feedbackText = "", feedbackColor = "#E24B4A";
  if (answered) {
    if (timedOut)              feedbackText = "⏱ Time's up! The correct answer is highlighted in green";
    else if (chosen === q.ans) { feedbackText = "✦ Correct answer! Well done"; feedbackColor = "#97C459"; }
    else                       feedbackText = "✦ Wrong answer — the correct one is highlighted in green";
  }

  return (
    <div style={card}>
      {/* Progress */}
      <div style={{ height:4,background:"#2A1520",marginBottom:"2.2rem",borderRadius:2 }}>
        <div style={{ height:"100%",background:PK,width:`${(curIdx/5)*100}%`,transition:"width 0.4s ease",borderRadius:2 }} />
      </div>

      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.8rem",flexWrap:"wrap",gap:10 }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
          <span style={{ fontSize:"clamp(8px,1.5vw,10px)",letterSpacing:5,textTransform:"uppercase",color:PK_DIM,fontFamily:"'DM Sans',sans-serif" }}>
            Question {curIdx+1} of 5
          </span>
          <span style={{
            background:"#1A0816",border:`1px solid ${PK_DIM}`,color:PK_LIGHT,
            fontSize:"clamp(12px,2vw,14px)",padding:"5px 16px",letterSpacing:1,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            {curIdx+1} / 5
          </span>
        </div>
        <TimerRing timeLeft={timeLeft} />
      </div>

      {/* Question */}
      <div style={{
        fontFamily:"'Playfair Display',serif",
        fontSize:"clamp(1.05rem,3vw,1.35rem)",
        fontStyle:"italic",color:"#F0DDE8",lineHeight:1.75,
        marginBottom:"2rem",paddingLeft:"1.2rem",
        borderLeft:`2px solid ${PK}`,
        textAlign:"left",
      }}>
        {q.q}
      </div>

      {/* Options */}
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {q.opts.map((opt,i) => (
          <OptionBtn key={i} baseStyle={getOptStyle(i)} onClick={() => pick(i)} answered={answered}>
            <span style={{
              width:28,height:28,border:"1px solid #2A1520",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,flexShrink:0,color:PK_DIM,fontFamily:"'DM Sans',sans-serif",
            }}>
              {KEYS[i]}
            </span>
            {opt}
          </OptionBtn>
        ))}
      </div>

      {/* LL.png image — shown only on correct animal answer */}
      {showImg && (
        <div style={{
          marginTop:"1.5rem",
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          gap:10,
        }}>
          <div style={{
            border:`1px solid ${PK}`,
            padding:8,
            display:"inline-block",
            background:"#0A0608",
          }}>
            <img
              src={LLImg}
              alt="Special surprise"
              style={{
                maxWidth:"100%",
                maxHeight:260,
                display:"block",
                objectFit:"contain",
              }}
            />
          </div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontStyle:"italic",
            fontSize:"clamp(12px,2vw,14px)",
            color:PK_LIGHT,
          }}>
            🐰 You know yourself well ✦
          </div>
        </div>
      )}

      {/* Feedback */}
      <div style={{
        marginTop:"1.2rem",fontFamily:"'Playfair Display',serif",fontStyle:"italic",
        fontSize:"clamp(12px,2vw,14px)",minHeight:22,
        color:feedbackColor,textAlign:"left",
      }}>
        {feedbackText}
      </div>

      {/* Next */}
      {answered && (
        <div style={{ display:"flex",justifyContent:"flex-end",marginTop:"1.8rem" }}>
          <GhostButton onClick={next}>
            {curIdx+1 >= 5 ? "Results ✦" : "Next →"}
          </GhostButton>
        </div>
      )}
    </div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function ResultScreen({ score, onRetry, onLogout }) {
  return (
    <div style={{ ...card, textAlign:"center" }}>
      <Ornament />
      <div style={{ fontSize:"clamp(8px,1.5vw,10px)",letterSpacing:7,textTransform:"uppercase",color:PK_DIM,marginBottom:"0.6rem",fontFamily:"'DM Sans',sans-serif" }}>
        Your Result
      </div>

      <div style={{
        width:"clamp(120px,22vw,150px)",height:"clamp(120px,22vw,150px)",
        borderRadius:"50%",border:`2px solid ${PK}`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        margin:"1.8rem auto",
      }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,6vw,3.2rem)",color:PK,lineHeight:1 }}>
          {score}/5
        </div>
        <div style={{ fontSize:"clamp(10px,1.5vw,12px)",color:PK_DIM,letterSpacing:2,marginTop:6,fontFamily:"'DM Sans',sans-serif" }}>
          out of 5
        </div>
      </div>

      <div style={{ color:PK,fontSize:"clamp(18px,4vw,28px)",letterSpacing:10,margin:"0.8rem 0" }}>
        {STARS_MAP[score]}
      </div>

      <div style={{
        fontFamily:"'Playfair Display',serif",fontStyle:"italic",
        fontSize:"clamp(.95rem,2.5vw,1.2rem)",color:"#F0DDE8",
        lineHeight:1.85,margin:"1.8rem 0",padding:"1.6rem",
        border:"1px solid #2A1520",textAlign:"left",
      }}>
        {LOVE_MSGS[score]}
      </div>

      <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:"1.8rem" }}>
        <EnterButton onClick={onRetry} auto>New Quiz ✦</EnterButton>
        <GhostButton onClick={onLogout}>Logout</GhostButton>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
 function Quiz() {
  const [screen,     setScreen]     = useState("login");
  const [finalScore, setFinalScore] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0608; }
        input:focus { border-color: #7A3050 !important; outline: none; }
      `}</style>

      <div style={{
        background: "#0A0608",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem,3vw,2.5rem) clamp(0.8rem,3vw,1.5rem)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <Background />

        <div style={{ position:"relative",zIndex:1,width:"100%",maxWidth:"min(660px,95vw)" }}>
          {screen === "login"  && <LoginScreen  onLogin={() => setScreen("quiz")} />}
          {screen === "quiz"   && <QuizScreen   onFinish={s => { setFinalScore(s); setScreen("result"); }} />}
          {screen === "result" && <ResultScreen score={finalScore} onRetry={() => setScreen("quiz")} onLogout={() => setScreen("login")} />}
        </div>
      </div>
    </>
  );
}


// ─── LETTER ─────────────────────────────────────────────────────────────────

const COLORS = {
  pink:    "#ff6fb7",
  pinkDim: "rgba(255,111,183,.45)",
  bg:      "#06030a",
  page:    "#100810",
  spine:   "#1a0810",
  cream:   "rgba(240,221,232,.76)",
  creamLo: "rgba(240,221,232,.5)",
  border:  "rgba(255,111,183,.18)",
  borderLo:"rgba(255,111,183,.08)",
};
 
/* ─── tiny helpers ─── */
const Ln = (props) => <line {...props} />;
const Rc = (props) => <rect {...props} />;
 
/* ═══════════════════════════════════════════
   BACKGROUND — مكتبة كاملة خلف الكتاب
═══════════════════════════════════════════ */
function LibraryBackground() {
  /* كتاب واحد على رف */
  const Book = ({ x, y, w, h, fill, accent }) => (
    <g>
      <Rc x={x} y={y} width={w} height={h} rx="1"
        fill={fill} stroke={accent || C.borderLo} strokeWidth=".5" />
      {accent && <Rc x={x} y={y} width={w} height="3" fill={accent} opacity=".8" />}
    </g>
  );
 
  /* صف من الكتب */
  const Row = ({ startX, y, h, books }) => {
    let cx = startX;
    return books.map((b, i) => {
      const el = (
        <Book key={i} x={cx} y={y} w={b.w} h={h}
          fill={b.fill} accent={b.accent} />
      );
      cx += b.w + 2;
      return el;
    });
  };
 
  const palette = [
    "#1e0a14","#0f0a1a","#1a0d10","#0a0d18","#18080e",
    "#12080e","#0d0a16","#1a0810","#0e0814","#1c0a12",
    "#1e1430","#281020","#0f1a2a","#1a0d20","#0d1820",
  ];
  const pinkAccent = C.borderLo;
  const roseAccent = "rgba(255,111,183,.16)";
 
  // مجموعات كتب لكل رف
  const leftRow1  = [{w:16,fill:palette[0],accent:roseAccent},{w:11,fill:palette[1]},{w:18,fill:palette[2],accent:pinkAccent},{w:9,fill:palette[3]},{w:20,fill:palette[4],accent:roseAccent},{w:13,fill:palette[5]},{w:17,fill:palette[6]},{w:22,fill:palette[7],accent:pinkAccent},{w:10,fill:palette[8]},{w:18,fill:palette[9]},{w:14,fill:palette[10]},{w:20,fill:palette[11],accent:roseAccent},{w:8,fill:palette[12]},{w:16,fill:palette[13]},{w:14,fill:palette[14]}];
  const leftRow2  = [{w:20,fill:palette[2],accent:roseAccent},{w:13,fill:palette[4]},{w:22,fill:palette[0]},{w:15,fill:palette[6]},{w:24,fill:palette[8],accent:pinkAccent},{w:11,fill:palette[1]},{w:18,fill:palette[10]},{w:16,fill:palette[12]},{w:20,fill:palette[3],accent:roseAccent},{w:13,fill:palette[5]},{w:24,fill:palette[7],accent:pinkAccent},{w:12,fill:palette[9]},{w:18,fill:palette[11]},{w:15,fill:palette[13]}];
  const leftRow3  = [{w:18,fill:palette[1]},{w:15,fill:palette[3]},{w:22,fill:palette[5],accent:roseAccent},{w:13,fill:palette[7]},{w:22,fill:palette[9],accent:pinkAccent},{w:11,fill:palette[11]},{w:20,fill:palette[13]},{w:16,fill:palette[0]},{w:24,fill:palette[2],accent:roseAccent},{w:12,fill:palette[4]},{w:20,fill:palette[6]},{w:14,fill:palette[8]},{w:22,fill:palette[10],accent:pinkAccent},{w:16,fill:palette[12]}];
 
  const rightRow1 = [...leftRow1].reverse();
  const rightRow2 = [...leftRow2].reverse();
  const rightRow3 = [...leftRow3].reverse();
 
  return (
    <svg
      viewBox="0 0 1400 760"
      preserveAspectRatio="xMidYMid slice"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
      aria-hidden="true"
    >
      {/* ── GRADIENTS & FILTERS ── */}
      <defs>
        <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.pink} stopOpacity=".06"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glowCandle" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffb44a" stopOpacity=".12"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glowCandleR" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffb44a" stopOpacity=".12"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter>
        <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>
 
      {/* ── ATMOSPHERIC GLOW ── */}
      <ellipse cx="700" cy="380" rx="420" ry="260" fill="url(#glowCenter)" filter="url(#blur8)"/>
 
      {/* ── LEFT SHELF UNIT ── */}
      {/* cabinet back */}
      <Rc x="5" y="60" width="310" height="640" rx="3" fill="rgba(12,5,10,.92)" stroke="rgba(255,111,183,.05)" strokeWidth="1"/>
      {/* shelf boards */}
      {[218, 368, 518].map((y,i) => (
        <g key={i}>
          <Rc x="5" y={y} width="310" height="9" fill="rgba(50,15,28,.85)"/>
          <Rc x="5" y={y} width="310" height="1.5" fill="rgba(255,111,183,.07)"/>
          <Rc x="5" y={y+7.5} width="310" height="1.5" fill="rgba(0,0,0,.3)"/>
        </g>
      ))}
      {/* side pillars */}
      <Rc x="5"   y="60" width="6" height="640" fill="rgba(35,10,20,.9)"/>
      <Rc x="309" y="60" width="6" height="640" fill="rgba(35,10,20,.9)"/>
      {/* top / bottom trim */}
      <Rc x="5" y="60"  width="310" height="6"  fill="rgba(50,15,28,.9)"/>
      <Rc x="5" y="694" width="310" height="6"  fill="rgba(50,15,28,.9)"/>
      {/* wood grain lines */}
      {[85,110,140,165,195].map((y,i)=>(
        <Ln key={i} x1="11" y1={y} x2="313" y2={y} stroke="rgba(255,111,183,.02)" strokeWidth=".5"/>
      ))}
 
      {/* LEFT books row 1  y=68→216 */}
      <Row startX={14} y={68}  h={148} books={leftRow1} />
      {/* LEFT books row 2  y=228→366 */}
      <Row startX={14} y={228} h={138} books={leftRow2} />
      {/* LEFT books row 3  y=378→516 */}
      <Row startX={14} y={378} h={138} books={leftRow3} />
 
      {/* leaning book left */}
      <Rc x="288" y="82" width="10" height="130" rx="1" fill={palette[3]} stroke={C.borderLo} strokeWidth=".5" transform="rotate(-7,293,147)"/>
 
      {/* LEFT candle (shelf 3 top) */}
      {/* glow blob */}
      <ellipse cx="90" cy="530" rx="55" ry="55" fill="url(#glowCandle)" filter="url(#blur8)"/>
      {/* candle body */}
      <Rc x="84" y="530" width="12" height="50" rx="1.5" fill="rgba(235,210,170,.1)" stroke="rgba(220,190,130,.2)" strokeWidth=".6"/>
      <Rc x="84" y="530" width="12" height="8"  rx="1"   fill="rgba(240,215,175,.18)"/>
      {/* drips */}
      <path d="M84 542 Q82 550 83 558" stroke="rgba(240,210,160,.1)" strokeWidth="2" fill="none"/>
      <path d="M96 546 Q98 553 97 560" stroke="rgba(240,210,160,.08)" strokeWidth="1.5" fill="none"/>
      {/* flame */}
      <ellipse cx="90" cy="523" rx="4"   ry="9"  fill="rgba(255,200,80,.22)"  filter="url(#blur2)"/>
      <ellipse cx="90" cy="521" rx="2.5" ry="6"  fill="rgba(255,220,120,.35)"/>
      <ellipse cx="90" cy="519" rx="1.2" ry="3"  fill="rgba(255,240,180,.6)"/>
 
      {/* left small book stack on lower shelf */}
      <Rc x="200" y="524" width="88" height="12" rx="1" fill="rgba(18,8,14,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="204" y="513" width="80" height="12" rx="1" fill="rgba(15,8,12,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="208" y="502" width="72" height="12" rx="1" fill="rgba(20,8,16,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      {/* bookmark in stack */}
      <Rc x="240" y="496" width="3" height="22" rx=".8" fill={C.pinkDim}/>
 
      {/* ── RIGHT SHELF UNIT ── */}
      <Rc x="1085" y="60" width="310" height="640" rx="3" fill="rgba(12,5,10,.92)" stroke="rgba(255,111,183,.05)" strokeWidth="1"/>
      {[218, 368, 518].map((y,i) => (
        <g key={i}>
          <Rc x="1085" y={y} width="310" height="9" fill="rgba(50,15,28,.85)"/>
          <Rc x="1085" y={y} width="310" height="1.5" fill="rgba(255,111,183,.07)"/>
          <Rc x="1085" y={y+7.5} width="310" height="1.5" fill="rgba(0,0,0,.3)"/>
        </g>
      ))}
      <Rc x="1085" y="60" width="6"   height="640" fill="rgba(35,10,20,.9)"/>
      <Rc x="1389" y="60" width="6"   height="640" fill="rgba(35,10,20,.9)"/>
      <Rc x="1085" y="60"  width="310" height="6"  fill="rgba(50,15,28,.9)"/>
      <Rc x="1085" y="694" width="310" height="6"  fill="rgba(50,15,28,.9)"/>
      {[85,110,140,165,195].map((y,i)=>(
        <Ln key={i} x1="1091" y1={y} x2="1393" y2={y} stroke="rgba(255,111,183,.02)" strokeWidth=".5"/>
      ))}
 
      <Row startX={1091} y={68}  h={148} books={rightRow1} />
      <Row startX={1091} y={228} h={138} books={rightRow2} />
      <Row startX={1091} y={378} h={138} books={rightRow3} />
 
      <Rc x="1100" y="82" width="10" height="130" rx="1" fill={palette[6]} stroke={C.borderLo} strokeWidth=".5" transform="rotate(6,1105,147)"/>
 
      {/* RIGHT candle */}
      <ellipse cx="1310" cy="530" rx="55" ry="55" fill="url(#glowCandleR)" filter="url(#blur8)"/>
      <Rc x="1304" y="530" width="12" height="50" rx="1.5" fill="rgba(235,210,170,.1)" stroke="rgba(220,190,130,.2)" strokeWidth=".6"/>
      <Rc x="1304" y="530" width="12" height="8"  rx="1"   fill="rgba(240,215,175,.18)"/>
      <path d="M1304 542 Q1302 550 1303 558" stroke="rgba(240,210,160,.1)" strokeWidth="2" fill="none"/>
      <ellipse cx="1310" cy="523" rx="4"   ry="9"  fill="rgba(255,200,80,.22)"  filter="url(#blur2)"/>
      <ellipse cx="1310" cy="521" rx="2.5" ry="6"  fill="rgba(255,220,120,.35)"/>
      <ellipse cx="1310" cy="519" rx="1.2" ry="3"  fill="rgba(255,240,180,.6)"/>
 
      {/* right small book stack */}
      <Rc x="1108" y="524" width="88" height="12" rx="1" fill="rgba(18,8,14,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="1112" y="513" width="80" height="12" rx="1" fill="rgba(15,8,12,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="1116" y="502" width="72" height="12" rx="1" fill="rgba(20,8,16,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="1148" y="496" width="3" height="22" rx=".8" fill={C.pinkDim}/>
 
      {/* ── FLOOR SCATTER ── */}
      {/* flat open book */}
      <g transform="translate(570,660) rotate(-4)">
        <Rc x="0" y="0" width="100" height="64" rx="2" fill="rgba(14,8,12,.95)" stroke={C.borderLo} strokeWidth=".6"/>
        <Ln x1="50" y1="0" x2="50" y2="64" stroke="rgba(255,111,183,.07)" strokeWidth="1"/>
        {[12,20,28,36,44].map((y,i)=>(
          <g key={i}>
            <Ln x1="6"  y1={y} x2="44" y2={y-1} stroke="rgba(255,111,183,.06)" strokeWidth=".5"/>
            <Ln x1="56" y1={y} x2="94" y2={y+1} stroke="rgba(255,111,183,.06)" strokeWidth=".5"/>
          </g>
        ))}
        {/* drop shadow */}
        <Rc x="0" y="62" width="100" height="4" rx="1" fill="rgba(0,0,0,.4)" filter="url(#blur2)"/>
      </g>
      {/* vertical book leaning */}
      <Rc x="695" y="614" width="16" height="90" rx="1" fill={palette[2]} stroke={C.borderLo} strokeWidth=".5" transform="rotate(8,703,659)"/>
      {/* stacked books */}
      <Rc x="720" y="662" width="78" height="15" rx="1" fill="rgba(16,8,12,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="724" y="649" width="70" height="15" rx="1" fill="rgba(14,8,14,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="728" y="636" width="62" height="15" rx="1" fill="rgba(18,8,10,.95)" stroke={C.borderLo} strokeWidth=".5"/>
      <Rc x="758" y="630" width="3"  height="24" rx=".8" fill={C.pinkDim}/>
 
      {/* ink bottle */}
      <g transform="translate(430,650)">
        <Rc x="0" y="10" width="24" height="32" rx="2.5" fill="rgba(8,3,10,.95)" stroke={C.border} strokeWidth=".8"/>
        <Rc x="7" y="3"  width="10" height="10" rx="1"   fill="rgba(8,3,10,.95)" stroke={C.border} strokeWidth=".6"/>
        <ellipse cx="12" cy="3.5" rx="7" ry="2.5" fill={C.pinkDim}/>
        <Rc x="2" y="30" width="20" height="10" rx="1"   fill="rgba(255,111,183,.07)"/>
        <Rc x="4" y="12" width="16" height="28" rx="1.5" fill="rgba(255,111,183,.03)"/>
      </g>
 
      {/* quill near ink */}
      <g transform="translate(398,600) rotate(-28)">
        <path d="M8 0 C6 12 4 30 3 55 C2 75 3 95 4 115 L6 142 L8 142 L8 115 C8 95 8 75 7 55 C6 30 7 12 8 0Z" fill="rgba(232,200,122,.22)"/>
        <path d="M8 0 C10 10 14 26 14 46 C14 66 11 86 9 115 L8 142 L8 115 C8 95 8 75 7 55 C6 30 7 12 8 0Z" fill="rgba(200,160,60,.14)"/>
        <path d="M8 0 C4 8 0 20 0 36 C0 54 4 66 6 55 C6 30 7 12 8 0Z" fill="rgba(220,180,80,.12)"/>
        <path d="M8 142 Q5 150 2 157" stroke="rgba(60,38,8,.5)" strokeWidth="1.2" fill="none"/>
      </g>
 
      {/* scattered loose pages */}
      <g opacity=".1" transform="translate(445,95) rotate(-14)">
        <Rc x="0" y="0" width="44" height="58" rx="1" fill="rgba(235,215,225,.7)"/>
        {[10,18,26,34,42].map((y,i)=>(
          <Ln key={i} x1="4" x2="40" y1={y} y2={y} stroke="rgba(80,40,60,.35)" strokeWidth=".6"/>
        ))}
      </g>
      <g opacity=".08" transform="translate(920,55) rotate(11)">
        <Rc x="0" y="0" width="40" height="54" rx="1" fill="rgba(235,215,225,.7)"/>
        {[10,18,26].map((y,i)=>(
          <Ln key={i} x1="4" x2="36" y1={y} y2={y} stroke="rgba(80,40,60,.3)" strokeWidth=".5"/>
        ))}
      </g>
      <g opacity=".07" transform="translate(1010,610) rotate(-6)">
        <Rc x="0" y="0" width="36" height="48" rx="1" fill="rgba(235,215,225,.6)"/>
      </g>
 
      {/* decorative ink swirls top */}
      <g opacity=".08">
        <path d="M600 38 Q640 18 690 34 Q740 50 715 70 Q690 90 660 72 Q630 54 655 38 Q680 22 705 36" stroke={C.pink} strokeWidth="1.2" fill="none"/>
        <path d="M750 44 Q790 28 830 44 Q860 58 840 70" stroke={C.pink} strokeWidth=".9" fill="none"/>
        <path d="M540 55 Q560 42 580 50" stroke={C.pink} strokeWidth=".8" fill="none"/>
      </g>
 
      {/* ruled lines mid edges (papery feel) */}
      {[0,1,2,3].map(i => (
        <g key={i} opacity=".04">
          <Ln x1="320" y1={290+i*16} x2="390" y2={290+i*16} stroke={C.pink} strokeWidth=".5"/>
          <Ln x1="1010" y1={290+i*16} x2="1080" y2={290+i*16} stroke={C.pink} strokeWidth=".5"/>
        </g>
      ))}
 
      {/* floor line */}
      <Ln x1="0" y1="700" x2="1400" y2="700" stroke="rgba(255,111,183,.04)" strokeWidth="1"/>
    </svg>
  );
}

function Letter() {
  return (
    <>
      <style>{`
        /* ════ RESPONSIVE VARIABLES ════ */
        :root {
          --letter-padding: 4rem 1.2rem 5rem;
          --letter-max-width: 860px;
          --book-spine-width: 28px;
          --book-cover-width: 36px;
          --intro-margin: 3rem;
          --intro-font-size: clamp(2rem, 4.5vw, 3rem);
          --intro-label-size: 9px;
          --page-padding: 3rem 2.6rem 3.8rem;
          --page-font-size: 1.06rem;
          --page-line-height: 2.1;
          --quill-bottom: -30px;
          --quill-right: -20px;
          --quill-width: 90px;
          --quill-height: 220px;
          --wax-seal-size: 46px;
          --closing-font-size: 10px;
        }

        /* TABLET - 768px and below */
        @media (max-width: 768px) {
          :root {
            --letter-padding: 3rem 1rem 3.5rem;
            --letter-max-width: 100%;
            --intro-margin: 2rem;
            --intro-font-size: clamp(1.6rem, 3.5vw, 2.4rem);
            --intro-label-size: 8px;
            --page-padding: 2rem 1.8rem 2.5rem;
            --page-font-size: 0.95rem;
            --page-line-height: 1.9;
            --quill-bottom: -20px;
            --quill-right: -10px;
            --quill-width: 70px;
            --quill-height: 170px;
            --wax-seal-size: 40px;
            --closing-font-size: 9px;
          }
        }

        /* MOBILE - 480px and below */
        @media (max-width: 480px) {
          :root {
            --letter-padding: 2rem 0.75rem 2.5rem;
            --letter-max-width: 100%;
            --book-spine-width: 20px;
            --book-cover-width: 28px;
            --intro-margin: 1.5rem;
            --intro-font-size: clamp(1.3rem, 3vw, 1.8rem);
            --intro-label-size: 7px;
            --page-padding: 1.5rem 1.2rem 1.8rem;
            --page-font-size: 0.85rem;
            --page-line-height: 1.7;
            --quill-bottom: -15px;
            --quill-right: -5px;
            --quill-width: 55px;
            --quill-height: 140px;
            --wax-seal-size: 36px;
            --closing-font-size: 8px;
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400&display=swap');
        
        @keyframes letterFloat {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: .4; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }

        .drop-cap::first-letter {
          font-style: normal;
          font-size: clamp(2rem, 6vw, 3.6rem);
          font-weight: 600;
          float: left;
          line-height: .8;
          margin-right: .08em;
          margin-top: .08em;
          color: #ff6fb7;
          font-family: 'Cormorant Garamond', serif;
        }

        /* ════ SECTION STYLES ════ */
        .letter-section {
          background: #0a0608;
          position: relative;
          overflow: hidden;
          padding: var(--letter-padding);
        }

        .letter-intro {
          text-align: center;
          margin-bottom: var(--intro-margin);
          position: relative;
          z-index: 5;
        }

        .letter-intro-label {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--intro-label-size);
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(255, 111, 183, 0.5);
          margin-bottom: 0.8rem;
        }

        @media (max-width: 480px) {
          .letter-intro-label {
            letter-spacing: 3px;
          }
        }

        .letter-intro-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: var(--intro-font-size);
          font-weight: 300;
          color: #f0dde8;
          line-height: 1.1;
        }

        /* ════ BOOK WRAPPER ════ */
        .letter-book-wrapper {
          max-width: var(--letter-max-width);
          margin: 0 auto;
          position: relative;
          z-index: 5;
        }

        .letter-book {
          display: flex;
          border-radius: 3px 6px 6px 3px;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          overflow: hidden;
        }

        /* ════ BOOK SPINE ════ */
        .letter-spine {
          width: var(--book-spine-width);
          flex-shrink: 0;
          background: linear-gradient(to right, #0f0408, #1a0810, #0f0408);
          border-radius: 3px 0 0 3px;
          border-left: 2px solid #2a0d18;
          border-top: 1px solid #2a0d18;
          border-bottom: 1px solid #2a0d18;
          position: relative;
        }

        .letter-spine::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 10%;
          bottom: 10%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255, 111, 183, 0.2) 30%, rgba(255, 111, 183, 0.2) 70%, transparent);
          transform: translateX(-50%);
        }

        /* ════ BOOK COVERS ════ */
        .letter-cover {
          width: var(--book-cover-width);
          flex-shrink: 0;
          background: #100610;
          position: relative;
          overflow: hidden;
        }

        .letter-cover-left {
          border-top: 1px solid #220d1a;
          border-bottom: 1px solid #220d1a;
        }

        .letter-cover-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255, 111, 183, 0.012) 4px, rgba(255, 111, 183, 0.012) 5px);
          pointer-events: none;
        }

        .letter-cover-right {
          border-top: 1px solid #220d1a;
          border-bottom: 1px solid #220d1a;
          border-right: 3px solid #060308;
          border-radius: 0 5px 5px 0;
        }

        .letter-cover-right::before {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 9px;
          width: 10px;
          height: 55px;
          background: rgba(160, 40, 80, 0.45);
        }

        /* ════ PAGES BLOCK ════ */
        .letter-pages {
          flex: 1;
          display: flex;
          position: relative;
        }

        .letter-pages-shadow {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 4;
          pointer-events: none;
        }

        .letter-pages-shadow-left {
          left: 0;
          width: 22px;
          background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);
        }

        .letter-pages-shadow-center {
          left: 50%;
          width: 32px;
          transform: translateX(-50%);
          background: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.75) 55%, rgba(0, 0, 0, 0.5));
        }

        .letter-pages-shadow-right {
          right: 0;
          width: 22px;
          background: linear-gradient(to left, rgba(0, 0, 0, 0.7), transparent);
        }

        /* ════ PAGE STYLES ════ */
        .letter-page {
          flex: 1;
          background: #100810;
          padding: var(--page-padding);
          position: relative;
          border-top: 1px solid #1e0d18;
          border-bottom: 1px solid #1e0d18;
          overflow: hidden;
        }

        .letter-page-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(transparent, transparent 30px, rgba(255, 111, 183, 0.038) 30px, rgba(255, 111, 183, 0.038) 31px);
          background-position: 0 3rem;
        }

        .letter-page-content {
          position: relative;
          z-index: 2;
        }

        /* ════ BOOKMARK ════ */
        .letter-bookmark {
          position: absolute;
          top: -1px;
          right: 3rem;
          width: 16px;
          height: 64px;
          background: #5a0e25;
          clip-path: polygon(0 0, 100% 0, 100% 83%, 50% 100%, 0 83%);
          z-index: 5;
        }

        @media (max-width: 480px) {
          .letter-bookmark {
            right: 1rem;
            height: 50px;
          }
        }

        /* ════ CHAPTER RULE ════ */
        .letter-chapter-rule {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 480px) {
          .letter-chapter-rule {
            margin-bottom: 1.2rem;
          }
        }

        .letter-rule-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255, 111, 183, 0.18);
        }

        .letter-rule-dot {
          width: 5px;
          height: 5px;
          background: rgba(255, 111, 183, 0.35);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ════ TEXT STYLES ════ */
        .letter-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255, 111, 183, 0.45);
          margin-bottom: 1.8rem;
        }

        @media (max-width: 480px) {
          .letter-label {
            font-size: 8px;
            letter-spacing: 2px;
            margin-bottom: 1rem;
          }
        }

        .letter-paragraph {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: var(--page-font-size);
          line-height: var(--page-line-height);
          color: rgba(240, 221, 232, 0.76);
          text-align: justify;
          margin-bottom: 1.25rem;
        }

        .letter-paragraph-closing {
          color: rgba(240, 221, 232, 0.5);
          font-size: clamp(0.8rem, 2.5vw, 0.93rem);
        }

        @media (max-width: 480px) {
          .letter-paragraph {
            text-align: left;
            margin-bottom: 1rem;
          }
          .letter-paragraph-closing {
            font-size: 0.8rem;
          }
        }

        .letter-page-number {
          position: absolute;
          bottom: 1.3rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: rgba(255, 111, 183, 0.2);
          letter-spacing: 2px;
        }

        .letter-page-number-left {
          left: 2.6rem;
        }

        .letter-page-number-right {
          right: 2.6rem;
        }

        @media (max-width: 480px) {
          .letter-page-number {
            font-size: 0.8rem;
          }
          .letter-page-number-left {
            left: 1.2rem;
          }
          .letter-page-number-right {
            right: 1.2rem;
          }
        }

        /* ════ WAX SEAL & CLOSING ════ */
        .letter-closing {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-top: 2rem;
        }

        @media (max-width: 480px) {
          .letter-closing {
            gap: 0.8rem;
            margin-top: 1rem;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .letter-wax-seal {
          width: var(--wax-seal-size);
          height: var(--wax-seal-size);
          border-radius: 50%;
          flex-shrink: 0;
          background: #380d1e;
          border: 1.5px solid #6a1535;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.8rem, 2vw, 1.1rem);
          font-style: italic;
          color: rgba(255, 111, 183, 0.65);
        }

        .letter-wax-seal::before {
          content: '';
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          border: 1px solid rgba(255, 111, 183, 0.18);
        }

        .letter-closing-text {
          font-family: 'DM Sans', sans-serif;
          font-size: var(--closing-font-size);
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255, 111, 183, 0.3);
          line-height: 1.9;
        }

        @media (max-width: 480px) {
          .letter-closing-text {
            font-size: 7px;
            letter-spacing: 1px;
          }
        }

        /* ════ FIN ════ */
        .letter-fin {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 480px) {
          .letter-fin {
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
        }

        .letter-fin-line {
          flex: 1;
          height: 0.5px;
        }

        .letter-fin-line-left {
          background: linear-gradient(to right, transparent, rgba(255, 111, 183, 0.15));
        }

        .letter-fin-line-right {
          background: linear-gradient(to left, transparent, rgba(255, 111, 183, 0.15));
        }

        .letter-fin-text {
          font-size: 9px;
          letter-spacing: 4px;
          color: rgba(255, 111, 183, 0.2);
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .letter-fin-text {
            font-size: 7px;
            letter-spacing: 2px;
          }
        }

        /* ════ QUILL SVG ════ */
        .letter-quill {
          position: absolute;
          bottom: var(--quill-bottom);
          right: var(--quill-right);
          z-index: 6;
          opacity: 0.85;
          width: var(--quill-width);
          height: var(--quill-height);
        }

        @media (max-width: 768px) {
          .letter-quill {
            opacity: 0.7;
          }
        }

        @media (max-width: 480px) {
          .letter-quill {
            opacity: 0.6;
          }
        }

        /* ════ INK TRAIL ════ */
        .letter-ink-trail {
          position: absolute;
          bottom: 42px;
          right: 40px;
          z-index: 6;
          opacity: 0.3;
          width: 180px;
          height: 30px;
        }

        @media (max-width: 480px) {
          .letter-ink-trail {
            bottom: 30px;
            right: 20px;
            width: 140px;
            height: 25px;
            opacity: 0.2;
          }
        }

        /* ════ GLOW EFFECT ════ */
        .letter-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(255, 111, 183, 0.025);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .letter-glow {
            width: 400px;
            height: 400px;
          }
        }

        @media (max-width: 480px) {
          .letter-glow {
            width: 300px;
            height: 300px;
          }
        }

        /* ════ DUST PARTICLES ════ */
        .letter-dust {
          position: absolute;
          border-radius: 50%;
          background: #ff6fb7;
          pointer-events: none;
        }
      `}</style>

      <section id="Letter" className="letter-section">
        <LibraryBackground />
        
        <div className="letter-glow" />

        {/* Floating dust particles */}
        {[
          { left:"8%", top:"80%", delay:"0s", dur:"8s", size:3 },
          { left:"90%", top:"70%", delay:"2s", dur:"11s", size:2 },
          { left:"15%", top:"40%", delay:"4s", dur:"9s", size:3 },
          { left:"80%", top:"20%", delay:"1s", dur:"13s", size:2 },
          { left:"50%", top:"90%", delay:"3s", dur:"7s", size:4 },
          { left:"35%", top:"60%", delay:"5.5s", dur:"10s", size:2 },
        ].map((p,i) => (
          <div key={i} className="letter-dust" style={{
            width:p.size, 
            height:p.size,
            left:p.left, 
            top:p.top,
            animation:`letterFloat ${p.dur} linear ${p.delay} infinite`,
          }} />
        ))}

        {/* Section intro */}
        <div className="letter-intro">
          <p className="letter-intro-label">A letter for you</p>
          <h2 className="letter-intro-title">
            Dear <em style={{ fontStyle:"italic", color:"#ff6fb7" }}>My Princess</em>
          </h2>
        </div>

        {/* Book wrapper */}
        <div className="letter-book-wrapper">
          <div className="letter-book">

            {/* Spine */}
            <div className="letter-spine" />

            {/* Cover left */}
            <div className="letter-cover letter-cover-left" />

            {/* Pages block */}
            <div className="letter-pages">
              <div className="letter-pages-shadow letter-pages-shadow-left" />
              <div className="letter-pages-shadow letter-pages-shadow-center" />
              <div className="letter-pages-shadow letter-pages-shadow-right" />

              {/* LEFT PAGE */}
              <div className="letter-page">
                <div className="letter-page-lines" />
                <div className="letter-bookmark" />

                <div className="letter-page-content">
                  <div className="letter-chapter-rule">
                    <div className="letter-rule-line" />
                    <div className="letter-rule-dot" />
                    <div className="letter-rule-line" />
                  </div>

                  <p className="letter-label">Dear Alaa,</p>

                  {[
                    { text: "Tonight, the world celebrates something rare — you… Twenty-one years of a presence that has brought beauty to everything it has touched.", drop: true },
                    { text: "You have grown with a grace that few possess… You have faced hardships with your head held high, without ever losing your gentleness, your smile, or that special light that has lived within you from the very beginning." },
                    { text: "My princess… you deserve every happiness in this world. You deserve to be loved, celebrated, and admired — not just today, but every single day of your life." },
                    { text: "To me… you are the best person in this world, and the most important one in my life. I love you in an extraordinary way — a love unlike anything else… one that goes beyond words, and cannot truly be described." },
                    { text: "You are calm… and serenity. A comfort to everyone who comes close to you. You have a soul and an energy more beautiful than anything…" },
                  ].map((p, i) => (
                    <p key={i} className={`letter-paragraph ${p.drop ? 'drop-cap' : ''}`}
                      style={{ textIndent: p.drop ? 0 : "1.5em" }}>
                      {p.text}
                    </p>
                  ))}
                </div>

                <p className="letter-page-number letter-page-number-left">i</p>
              </div>

              {/* RIGHT PAGE */}
              <div className="letter-page">
                <div className="letter-page-lines" />

                <div className="letter-page-content">
                  <div className="letter-chapter-rule">
                    <div className="letter-rule-line" />
                    <div className="letter-rule-dot" />
                    <div className="letter-rule-line" />
                  </div>

                  {[
                    "…and that beauty doesn't just live within you — it reflects on your face, making you the most beautiful person in this universe.",
                    "And your smile… that smile that gives life its meaning. But your eyes… they are another story — a completely different world. When one looks into them… everything else fades away, and time and space take on an entirely different meaning.",
                    "From the bottom of my heart… I wish that sadness never comes near you, and that you always remain happy, smiling — just as you are now. I pray that God grants you a bright future… full of success and joy, where all your dreams and ambitions come true — and even more.",
                    "At twenty-one… the world is yours. Take it your way, at your own pace — you know your worth.",
                    "Thank you… for being you. Simply… for being you.",
                  ].map((text, i) => (
                    <p key={i} className={`letter-paragraph ${i === 4 ? 'letter-paragraph-closing' : ''}`}>
                      {text}
                    </p>
                  ))}

                  <div className="letter-closing">
                    <div className="letter-wax-seal">Aymen</div>
                    <p className="letter-closing-text">
                      With all the love in the world<br />— 10 May 2026
                    </p>
                  </div>
                </div>

                <p className="letter-page-number letter-page-number-right">ii</p>
              </div>

            </div>

            {/* Cover right */}
            <div className="letter-cover letter-cover-right" />

          </div>

          {/* Quill pen SVG */}
          <svg className="letter-quill" viewBox="0 0 90 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(-20,45,110)">
              <path d="M45 10 C42 30 38 55 36 85 C34 115 35 145 38 175 L40 210 L43 210 L45 175 C46 145 46 115 44 85 C42 55 44 30 45 10Z" fill="#e8c87a" opacity=".9"/>
              <path d="M45 10 C48 22 52 45 52 70 C52 95 49 125 46 155 L44 175 L45 175 C46 145 46 115 44 85 C42 55 44 30 45 10Z" fill="#c8a050" opacity=".7"/>
              <path d="M45 10 C40 20 32 35 28 55 C24 75 30 95 36 85 C38 55 42 30 45 10Z" fill="#d4b060" opacity=".6"/>
              <path d="M45 10 C50 20 58 38 60 58 C62 78 54 95 44 85 C44 55 44 30 45 10Z" fill="#e0c070" opacity=".5"/>
              <path d="M38 175 C37 185 36 195 34 205 C32 212 30 215 28 216 C30 214 34 208 36 200 C38 192 40 183 40 175Z" fill="#8b6914" opacity=".8"/>
              <path d="M45 175 C45 183 44 192 43 200 C42 208 40 214 38 218 L40 210 L43 210 L45 175Z" fill="#6b4a0a" opacity=".9"/>
              <path d="M38 175 L40 210 L43 210 L45 175" stroke="#4a3008" strokeWidth=".5" fill="none"/>
              <line x1="36" y1="90" x2="54" y2="82" stroke="#b09040" strokeWidth=".4" opacity=".5"/>
              <line x1="35" y1="110" x2="53" y2="102" stroke="#b09040" strokeWidth=".4" opacity=".5"/>
              <line x1="36" y1="130" x2="52" y2="123" stroke="#b09040" strokeWidth=".4" opacity=".4"/>
              <line x1="37" y1="150" x2="51" y2="144" stroke="#b09040" strokeWidth=".4" opacity=".4"/>
              <ellipse cx="45" cy="10" rx="8" ry="5" fill="#c8a050" opacity=".7"/>
              <path d="M37 8 C38 4 41 2 45 2 C49 2 52 4 53 8" fill="#a08030" opacity=".5"/>
            </g>
            <path d="M43 210 Q35 230 20 235 Q10 238 5 240" stroke="#4a3008" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".6"/>
            <path d="M43 212 Q32 228 18 236" stroke="rgba(255,111,183,.15)" strokeWidth=".5" fill="none"/>
          </svg>

          {/* Ink trail */}
          <svg className="letter-ink-trail" viewBox="0 0 180 30" fill="none">
            <path d="M0 15 Q45 5 90 15 Q135 25 180 15" stroke="#ff6fb7" strokeWidth=".6" fill="none"/>
            <path d="M10 20 Q55 10 100 18 Q145 26 175 18" stroke="#ff6fb7" strokeWidth=".4" fill="none"/>
          </svg>

        </div>

        {/* Fin */}
        <div className="letter-fin">
          <div className="letter-fin-line letter-fin-line-left" />
          <span className="letter-fin-text">fin</span>
          <div className="letter-fin-line letter-fin-line-right" />
        </div>

      </section>
    </>
  );
}


// ─── CLOSING ────────────────────────────────────────────────────────────────
function Petal({ style }) {
  return (
    <div style={{
      position:     "absolute",
      width:        6,
      height:       10,
      borderRadius: "50%",
      animation:    `petalFall ${style.duration}s ${style.delay}s linear infinite`,
      left:         style.left,
      background:   style.color,
      opacity:      0,
    }} />
  );
}
 
function Closing() {
  const canvasRef  = useRef(null);
  const stageRef   = useRef(null);
  const endCvRef   = useRef(null);   // canvas for "The End" background
  const startedRef = useRef(false);  // ensures sequence fires only once
 
  const petals = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      left:     `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 6,
      delay:    Math.random() * 8,
      color:    Math.random() > 0.5 ? C.rose : C.gold,
    }))
  , []);
 
  /* ── "The End" canvas: stars, pink hearts, flowers ── */
  useEffect(() => {
    const cv  = endCvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let eid;
 
    function resizeEnd() {
      cv.width  = cv.offsetWidth  || 400;
      cv.height = cv.offsetHeight || 200;
    }
    resizeEnd();
 
    // generate static elements
    const EW = cv.width, EH = cv.height;
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * EW, y: Math.random() * EH,
      r: 0.5 + Math.random() * 1.4,
      tw: Math.random() * Math.PI * 2,
      tws: 0.02 + Math.random() * 0.03,
    }));
    const hearts = Array.from({ length: 10 }, () => ({
      x: Math.random() * EW, y: Math.random() * EH,
      size: 8 + Math.random() * 14,
      angle: Math.random() * Math.PI * 2,
      speed: (0.003 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
      opacity: 0.4 + Math.random() * 0.5,
    }));
    const flowers = Array.from({ length: 8 }, () => ({
      x: Math.random() * EW, y: Math.random() * EH,
      size: 7 + Math.random() * 10,
      angle: Math.random() * Math.PI * 2,
      speed: (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1),
      opacity: 0.3 + Math.random() * 0.4,
    }));
 
    function drawHeart(ctx, x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.25);
      ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.375);
      ctx.bezierCurveTo(x - size * 0.5, y + size * 0.75, x, y + size, x, y + size);
      ctx.bezierCurveTo(x, y + size, x + size * 0.5, y + size * 0.75, x + size * 0.5, y + size * 0.375);
      ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.25);
      ctx.fill();
      ctx.restore();
    }
 
    function drawFlower(ctx, x, y, size, color, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = color;
      const petN = 5;
      for (let i = 0; i < petN; i++) {
        const angle = (i / petN) * Math.PI * 2;
        const px = x + Math.cos(angle) * size * 0.5;
        const py = y + Math.sin(angle) * size * 0.5;
        ctx.beginPath();
        ctx.ellipse(px, py, size * 0.28, size * 0.18, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      // center
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = alpha * 0.8;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
 
    function loopEnd() {
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
 
      // deep black bg
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
 
      // stars twinkle
      stars.forEach(s => {
        s.tw += s.tws;
        const a = 0.4 + 0.6 * ((Math.sin(s.tw) + 1) / 2);
        ctx.globalAlpha = a;
        ctx.fillStyle   = "#f5c2d0";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        // star cross glint on brighter ones
        if (s.r > 1.1 && a > 0.8) {
          ctx.globalAlpha = a * 0.5;
          ctx.strokeStyle = "#f5c2d0";
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 2.5, s.y);
          ctx.lineTo(s.x + s.r * 2.5, s.y);
          ctx.moveTo(s.x, s.y - s.r * 2.5);
          ctx.lineTo(s.x, s.y + s.r * 2.5);
          ctx.stroke();
        }
      });
 
      // rotating hearts
      hearts.forEach(h => {
        h.angle += h.speed;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.angle);
        ctx.translate(-h.x, -h.y);
        drawHeart(ctx, h.x - h.size / 2, h.y - h.size * 0.6, h.size,
          Math.random() < 0.5 ? "#e86190" : "#f5a0c0", h.opacity);
        ctx.restore();
      });
 
      // rotating flowers
      flowers.forEach(f => {
        f.angle += f.speed;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.translate(-f.x, -f.y);
        drawFlower(ctx, f.x, f.y, f.size,
          Math.random() < 0.5 ? "#e86190" : "#ffcfe0", f.opacity);
        ctx.restore();
      });
 
      ctx.globalAlpha = 1;
      eid = requestAnimationFrame(loopEnd);
    }
    eid = requestAnimationFrame(loopEnd);
 
    return () => cancelAnimationFrame(eid);
  }, []);
 
  /* ── main particle + poem sequence ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage  = stageRef.current;
    if (!canvas || !stage) return;
 
    const ctx = canvas.getContext("2d");
 
    let W, H, animId;
    let bgG         = 0;
    let heartActive = false;
    let heartScale  = 0;
    let nameAlpha   = 0;
    let ilyAlpha    = 0;
    let started     = false;
    let timeouts    = [];
 
    const particles = [];
    const TOTAL     = 280;
    const PCOLORS   = ["#e86190", "#f5a0c0", "#ffcfe0", "#c0406a", "#f0b0c8"];
 
    function resize() {
      W = canvas.width  = stage.offsetWidth  || 380;
      H = canvas.height = stage.offsetHeight || 600;
    }
    resize();
 
    function heartXY(t, scale, cx, cy) {
      const x =  16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return { x: cx + x * scale, y: cy + y * scale };
    }
    function randomHeartTarget(scale, cx, cy) {
      const t1 = Math.random() * Math.PI * 2;
      const t2 = Math.random() * Math.PI * 2;
      const r  = Math.random();
      const a  = heartXY(t1, scale, cx, cy);
      const b  = heartXY(t2, scale, cx, cy);
      return { x: a.x * r + b.x * (1 - r), y: a.y * r + b.y * (1 - r) };
    }
 
    function createParticle() {
      const p = {
        rx:      W / 2 + (Math.random() - 0.5) * W * 1.2,
        ry:      H / 2 + (Math.random() - 0.5) * H * 1.2,
        baseR:   0.7 + Math.random() * 1.8,
        a:       0,
        targetA: 0,
        spd:     0.014 + Math.random() * 0.02,
        col:     PCOLORS[Math.floor(Math.random() * PCOLORS.length)],
        tw:      Math.random() * Math.PI * 2,
        tws:     0.015 + Math.random() * 0.03,
        phase:   "float",
      };
      p.x = p.rx; p.y = p.ry;
      p.tx = p.rx; p.ty = p.ry;
      p.r = p.baseR;
 
      p.setHeart = (scale, cx, cy) => {
        const t   = randomHeartTarget(scale, cx, cy);
        p.tx      = t.x;
        p.ty      = t.y;
        p.targetA = 1.0;
        p.phase   = "heart";
      };
 
      p.update = () => {
        if (p.phase === "float") {
          p.x += (Math.random() - 0.5) * 0.4;
          p.y += (Math.random() - 0.5) * 0.4;
          p.a  = Math.min(p.a + 0.006, 0.35);
        } else {
          p.x += (p.tx - p.x) * p.spd;
          p.y += (p.ty - p.y) * p.spd;
          p.a += (p.targetA - p.a) * 0.04;
        }
        p.tw += p.tws;
        p.r   = p.baseR;
      };
 
      p.draw = () => {
        const tw = 0.65 + 0.35 * Math.sin(p.tw);
        ctx.globalAlpha = p.a * tw;
        ctx.fillStyle   = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      };
      return p;
    }
 
    for (let i = 0; i < TOTAL; i++) particles.push(createParticle());
 
    /* ── render loop ── */
    function loop() {
      ctx.clearRect(0, 0, W, H);
      bgG = Math.min(bgG + 0.004, 1);
      const g = ctx.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, W * 0.5);
      g.addColorStop(0,   `rgba(160,20,70,${bgG * 0.14})`);
      g.addColorStop(0.6, `rgba(80,5,30,${bgG * 0.07})`);
      g.addColorStop(1,   "rgba(5,0,2,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
 
      particles.forEach(p => { p.update(); p.draw(); });
 
      if (heartActive) {
        const cx = W / 2;
        const cy = H * 0.5;
        const fs = Math.min(W, H) * 0.052;
 
        nameAlpha = Math.min(nameAlpha + 0.012, 1);
        ctx.globalAlpha  = nameAlpha * 0.95;
        ctx.font         = `300 italic ${fs}px 'Cormorant Garamond',serif`;
        ctx.fillStyle    = "#fff";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor  = "#e86190";
        ctx.shadowBlur   = 30;
        ctx.fillText("Alaa", cx, cy);
 
        ilyAlpha = Math.min(ilyAlpha + 0.007, 1);
        ctx.globalAlpha  = ilyAlpha;
        ctx.font         = `400 italic ${fs * 0.72}px 'Cormorant Garamond',serif`;
        ctx.fillStyle    = "#f5c2d0";
        ctx.shadowColor  = "#e86190";
        ctx.shadowBlur   = 28 + 12 * Math.sin(Date.now() * 0.002);
        ctx.letterSpacing = "0.12em";
        ctx.fillText("i love you", cx, cy + heartScale * 18);
        ctx.shadowBlur   = 0;
        ctx.letterSpacing = "0";
      }
 
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
 
    /* ── sequence (fired only when visible) ── */
    function startSequence() {
      if (started) return;
      started = true;
      startedRef.current = true;
 
      const lineIds = ["cl-p1", "cl-p2", "cl-p3", "cl-p4"];
 
      function showLine(i) {
        if (i > 0) {
          const prev = document.getElementById(lineIds[i - 1]);
          if (prev) { prev.style.transition = "opacity 1.2s ease"; prev.style.opacity = "0"; }
        }
        const t = setTimeout(() => {
          const el = document.getElementById(lineIds[i]);
          if (el) el.style.opacity = "1";
        }, 400);
        timeouts.push(t);
      }
 
      lineIds.forEach((_, i) => {
        const t = setTimeout(() => showLine(i), i * 5000);
        timeouts.push(t);
      });
 
      const HEART_START = lineIds.length * 5000 + 1200;
 
      const t1 = setTimeout(() => {
        const last = document.getElementById(lineIds[lineIds.length - 1]);
        if (last) { last.style.transition = "opacity 1.4s ease"; last.style.opacity = "0"; }
 
        const t2 = setTimeout(() => {
          heartActive = true;
          heartScale  = Math.min(W, H) * 0.026;
          const cx    = W / 2;
          const cy    = H * 0.5;
          particles.forEach(p => p.setHeart(heartScale, cx, cy));
 
          /* ── curtain closes (no pulse) after heart settles — extended ── */
          const t3 = setTimeout(() => {
            // Left curtain panel
            const cl = document.getElementById("cl-curtain-l");
            const cr = document.getElementById("cl-curtain-r");
 
            if (cl) {
              cl.style.transition = "width 3.6s cubic-bezier(.6,0,.2,1)";
              cl.style.width      = "51%";
            }
            if (cr) {
              cr.style.transition = "width 3.6s cubic-bezier(.6,0,.2,1)";
              cr.style.width      = "51%";
            }
 
            /* show The End canvas + text after curtain closes */
            const t4 = setTimeout(() => {
              const endWrap = document.getElementById("cl-end-wrap");
              if (endWrap) endWrap.style.opacity = "1";
              const te = document.getElementById("cl-the-end");
              if (te) te.style.opacity = "1";
            }, 3800);
            timeouts.push(t4);
 
          }, 7500);
          timeouts.push(t3);
        }, 1200);
        timeouts.push(t2);
      }, HEART_START);
      timeouts.push(t1);
    }
 
    /* ── IntersectionObserver: start when section enters viewport ── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !startedRef.current) startSequence();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(stage);
 
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);
 
  /* ── styles ── */
  const poemLineStyle = {
    position:      "absolute",
    width:         "100%",
    textAlign:     "center",
    fontFamily:    "'Cormorant Garamond',serif",
    fontStyle:     "italic",
    fontWeight:    300,
    opacity:       0,
    pointerEvents: "none",
    transition:    "opacity 1.6s ease",
    padding:       "0 1.5rem",
    textShadow:    "0 0 60px #e8619066, 0 0 120px #c0204033",
    lineHeight:    1.3,
  };
 
  const curtainBase = {
    position:      "absolute",
    top:           0,
    zIndex:        20,
    width:         0,
    height:        "100%",
    pointerEvents: "none",
    // velvet-like gradient for theater curtain
    backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 18px, rgba(0,0,0,.08) 18px, rgba(0,0,0,.08) 19px)",
  };
 
  return (
    <section
      ref={stageRef}
      style={{
        minHeight:      "100svh",
        position:       "relative",
        overflow:       "hidden",
        background:     "#050002",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
      }}
    >
      {/* original petals */}
      {petals.map((p, i) => <Petal key={i} style={p} />)}
 
      {/* particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%" }}
      />
 
      {/* poem lines */}
      <p id="cl-p1" style={{ ...poemLineStyle, fontSize:"clamp(1rem,5vw,1.9rem)", color:"#e8a0b8" }}>
        This was not just a website…
      </p>
      <p id="cl-p2" style={{ ...poemLineStyle, fontSize:"clamp(1.3rem,6.5vw,2.8rem)", color:"#f9d0df", letterSpacing:".04em" }}>
        It was a story…
      </p>
      <p id="cl-p3" style={{ ...poemLineStyle, fontSize:"clamp(1.1rem,5.5vw,2.2rem)", color:"#e8a0b8" }}>
        A feeling…
      </p>
      <p id="cl-p4" style={{ ...poemLineStyle, fontSize:"clamp(1.4rem,7vw,3.2rem)", color:"#ffcfe0", fontWeight:400 }}>
        A piece of my heart.
      </p>
 
      {/* ── Theater curtains ── */}
      <div
        id="cl-curtain-l"
        style={{
          ...curtainBase,
          left: 0,
          background: `
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,0) 0px, rgba(0,0,0,0.07) 20px,
              rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px
            ),
            linear-gradient(to right, #3a0018, #6b0030, #4a0022)
          `,
          boxShadow: "inset -18px 0 40px rgba(0,0,0,0.5), 4px 0 20px rgba(0,0,0,0.6)",
        }}
      />
      <div
        id="cl-curtain-r"
        style={{
          ...curtainBase,
          right: 0,
          background: `
            repeating-linear-gradient(
              to bottom,
              rgba(0,0,0,0) 0px, rgba(0,0,0,0.07) 20px,
              rgba(255,255,255,0.01) 20px, rgba(255,255,255,0.01) 21px
            ),
            linear-gradient(to left, #3a0018, #6b0030, #4a0022)
          `,
          boxShadow: "inset 18px 0 40px rgba(0,0,0,0.5), -4px 0 20px rgba(0,0,0,0.6)",
        }}
      />
 
      {/* ── "The End" layer — black bg with animated canvas ── */}
      <div
        id="cl-end-wrap"
        style={{
          position:   "absolute",
          inset:      0,
          zIndex:     25,
          opacity:    0,
          transition: "opacity 2s ease 0.5s",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={endCvRef}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}
        />
        <p
          id="cl-the-end"
          style={{
            position:      "relative",
            zIndex:        2,
            fontFamily:    "'Cormorant Garamond',serif",
            fontStyle:     "italic",
            fontWeight:    300,
            fontSize:      "clamp(2.2rem,10vw,5rem)",
            color:         "#f5c2d0",
            letterSpacing: ".18em",
            opacity:       0,
            transition:    "opacity 2.5s ease 1.2s",
            textShadow:    "0 0 40px #e8619099, 0 0 80px #e8619044",
            textAlign:     "center",
          }}
        >
          The End ..
        </p>
      </div>
    </section>
  );
}


// ─── MUSIC FAB ──────────────────────────────────────────────────────────────
function MusicFab({ on, onClick, audioRef }) {
  const [volume, setVolume] = useState(45);
  const [hovered, setHovered] = useState(false);
  const trackRef = useRef(null);

  const calcVol = (clientY) => {
    const r = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, Math.round((r.bottom - clientY) / r.height * 100)));
  };

  const applyVol = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  const startDrag = () => {
    const move = e => applyVol(calcVol(e.clientY));
    const up   = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed", bottom: "2rem", right: "2rem", zIndex: 200,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}
    >
      {/* شريط الصوت — يظهر فقط عند hover */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        background: COLORS.page,
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 20, padding: "10px 0", width: 40, marginBottom: 8,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(8px)",
        transition: "opacity .2s, transform .2s",
        pointerEvents: hovered ? "all" : "none",
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.pink, fontFamily: "sans-serif" }}>
          {volume}
        </span>

        <div
          ref={trackRef}
          onClick={e => applyVol(calcVol(e.clientY))}
          style={{
            width: 4, height: 90,
            background: COLORS.borderLo,
            borderRadius: 2, position: "relative", cursor: "pointer",
          }}
        >
          <div style={{
            position: "absolute", bottom: 0, left: 0,
            width: "100%", height: `${volume}%`,
            background: COLORS.pink, borderRadius: 2,
          }} />
          <div
            onMouseDown={e => { e.preventDefault(); startDrag(); }}
            style={{
              position: "absolute", bottom: `${volume}%`,
              left: "50%", transform: "translate(-50%, 50%)",
              width: 13, height: 13, borderRadius: "50%",
              background: COLORS.pink,
              border: `2px solid ${COLORS.page}`,
              cursor: "grab",
            }}
          />
        </div>

        <svg width={13} height={13} viewBox="0 0 24 24" fill={COLORS.pinkDim}>
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
      </div>

      {/* زر التشغيل */}
      <button
        onClick={onClick}
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: COLORS.pink, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {on
          ? <svg width={18} height={18} viewBox="0 0 24 24" fill={COLORS.bg}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          : <svg width={18} height={18} viewBox="0 0 24 24" fill={COLORS.bg}><path d="M8 5v14l11-7z"/></svg>
        }
      </button>
    </div>
  );
}

// ─── MUSIC HOOK ─────────────────────────────────────────────────────────────
function useMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music.mp3");
      audioRef.current.loop   = true;
      audioRef.current.volume = 0.45;
    }
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else         { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  return { playing, toggle, audioRef };
}

// ─── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("countdown"); // "countdown" | "site"
  const { playing, toggle, audioRef } = useMusic();

  return (
    <>
      <style>{globalStyle}</style>

      {phase === "countdown" && (
        <CountdownPage onDone={() => setPhase("site")} />
      )}

      {phase === "site" && (
        <div style={{ animation:"fadeIn 1.2s ease" }}>
          <Nav musicOn={playing} onToggleMusic={toggle}/>
          <Hero/>
          <Portrait/>
          <Timeline/>
          <Voeux/>
          < Quiz/>
          <Letter/>
          <Closing/>
          <MusicFab on={playing} onClick={toggle} audioRef={audioRef}/>
        </div>
      )}
    </>
  );
}
