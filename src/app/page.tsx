"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useContacts } from "@/hooks/useContacts";
import type { Person } from "@/hooks/useContacts";
import { useTypewriter } from "@/hooks/useTypewriter";

// ==========================================
// 常量
// ==========================================
type AppView = "splash" | "dashboard" | "addContact" | "chat";
const ROLE_OPTIONS = ["同事", "上级", "客户", "家人朋友", "对象"] as const;

// ---- Splash 粒子类型 ----
type WelcomeParticle = {
  id: number; size: number; left: number; top: number;
  delay: number; duration: number; class: `particle-${1 | 2 | 3}`;
};
function makeParticles(): WelcomeParticle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i, size: 2 + Math.random() * 6, left: Math.random() * 100, top: Math.random() * 100,
    delay: Math.random() * 1.5, duration: 1.5 + Math.random() * 2,
    class: `particle-${((i % 3) + 1)}` as `particle-${1 | 2 | 3}`,
  }));
}

// ---- 宇宙社交网络 ----
interface NetNode { id: number; x: number; y: number; }
interface NetEdge { from: number; to: number; }

const NET_NODES: NetNode[] = [
  { id: 0, x: 8, y: 15 }, { id: 1, x: 28, y: 22 }, { id: 2, x: 18, y: 48 },
  { id: 3, x: 42, y: 12 }, { id: 4, x: 55, y: 35 }, { id: 5, x: 52, y: 62 },
  { id: 6, x: 72, y: 20 }, { id: 7, x: 78, y: 55 }, { id: 8, x: 88, y: 38 },
  { id: 9, x: 35, y: 72 },
];
const NET_EDGES: NetEdge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 9 }, { from: 3, to: 4 }, { from: 3, to: 6 },
  { from: 4, to: 5 }, { from: 4, to: 6 }, { from: 5, to: 7 }, { from: 5, to: 9 },
  { from: 6, to: 7 }, { from: 6, to: 8 }, { from: 7, to: 8 },
];
type StarData = { id: number; x: number; y: number; size: number; delay: number; duration: number; opacity: number; };
function makeStars(): StarData[] {
  return Array.from({ length: 70 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.8, delay: Math.random() * 6,
    duration: 2 + Math.random() * 4, opacity: 0.15 + Math.random() * 0.5,
  }));
}
const BUBBLE_TEXTS = [
  "不急不急～", "好的呀", "辛苦了哈", "方便的话", "随便问问",
  "没事没事", "理解理解", "不催不催", "我就是问问", "谢谢你",
  "没关系啦", "慢慢来", "都行都行", "你看着办", "我只是了解一下",
  "别介意哈", "麻烦你了", "不好意思", "OK的", "收到收到",
];

interface Bubble { id: number; x: number; y: number; text: string; born: number; }

// ==========================================
// Splash — 2s
// ==========================================
function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<WelcomeParticle[]>([]);

  useEffect(() => {
    // 仅在客户端生成随机粒子，避免 SSR hydration 不匹配
    setParticles(makeParticles());
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setVisible(false), 1800);
    const t4 = setTimeout(() => onDone(), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${phase === 2 ? "opacity-0" : "opacity-100"}`}
      style={{ background: "radial-gradient(ellipse at center, #1a1030 0%, #0a0614 70%)" }}>
      {particles.map((p) => (
        <div key={p.id} className={`absolute rounded-full pointer-events-none ${p.class}`}
          style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            opacity: phase >= 1 ? 0.6 : 0.2, transition: "opacity 0.6s ease" }} />
      ))}
      <div className="absolute rounded-full transition-all duration-[800ms] ease-out"
        style={{ width: phase >= 1 ? "60vw" : "0px", height: phase >= 1 ? "60vw" : "0px", maxWidth: 500, maxHeight: 500,
          background: "radial-gradient(circle, rgba(232,121,249,0.25) 0%, rgba(168,85,247,0.12) 30%, transparent 70%)",
          filter: "blur(18px)", opacity: phase === 2 ? 0 : phase >= 1 ? 1 : 0 }} />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extralight tracking-[0.3em] transition-all duration-[800ms] ease-out"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.92)",
            filter: phase >= 1 ? "blur(0)" : "blur(10px)",
            background: "linear-gradient(135deg, #e9d5ff, #fbcfe8, #e0e7ff, #ffffff)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          MESSAGE INTENT<br />TRANSLATOR
        </h1>
        <p className="text-[10px] tracking-[0.35em] uppercase font-mono mt-4 transition-all duration-[800ms] delay-150"
          style={{ opacity: phase >= 1 ? 0.6 : 0, color: "#c4b5fd" }}>
          Subconscious Communication Layer Analyzer
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 宇宙社交网络背景（收敛版）
// ==========================================
function CosmicNetworkBg({ pulse }: { pulse: number }) {
  const walkers = NET_EDGES.flatMap((edge, ei) => {
    const f = NET_NODES[edge.from]; const t = NET_NODES[edge.to];
    return [0, 1].map((wi) => ({
      id: `${ei}-${wi}`, x1: f.x, y1: f.y, x2: t.x, y2: t.y,
      duration: 6 + (ei * 3 + wi * 7) % 10, delay: (ei * 1.7 + wi * 4.3) % 14,
      bright: (ei + wi) % 3 === 0,
    }));
  });

  const [stars, setStars] = useState<StarData[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleId = useRef(0);

  useEffect(() => {
    setStars(makeStars());
  }, []);

  useEffect(() => {
    const spawn = () => {
      const w = walkers[Math.floor(Math.random() * walkers.length)];
      const progress = (Date.now() / 1000 + w.delay) % w.duration / w.duration;
      const cx = w.x1 + (w.x2 - w.x1) * progress;
      const cy = w.y1 + (w.y2 - w.y1) * progress;
      const id = bubbleId.current++;
      setBubbles((prev) => {
        const now = Date.now();
        const alive = prev.filter((b) => now - b.born < 2000);
        return [...alive, { id, x: cx + (Math.random() - 0.5) * 5, y: cy - 2 - Math.random() * 3, text: BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)], born: now }].slice(-5);
      });
    };
    const interval = setInterval(spawn, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setBubbles((prev) => prev.filter((b) => now - b.born < 2000));
    }, 800);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 20%, rgba(80,40,140,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(120,50,160,0.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(60,30,120,0.08) 0%, transparent 40%)",
      }} />
      {stars.map((s) => (
        <div key={s.id} className="cosmic-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.duration}s`, opacity: s.opacity }} />
      ))}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: pulse > 0 ? 0.6 : 0.10, transition: "opacity 0.4s ease" }}>
        {NET_EDGES.map((edge, ei) => {
          const f = NET_NODES[edge.from]; const t = NET_NODES[edge.to];
          return <line key={ei} x1={`${f.x}%`} y1={`${f.y}%`} x2={`${t.x}%`} y2={`${t.y}%`} stroke="rgba(180,150,220,1)" strokeWidth="0.4" strokeLinecap="round" />;
        })}
      </svg>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: pulse > 0 ? 0.8 : 0.35, transition: "opacity 0.4s ease" }}>
        {NET_NODES.map((node) => (
          <circle key={node.id} cx={`${node.x}%`} cy={`${node.y}%`} r="2" fill="rgba(240,230,255,0.4)"
            style={{ animation: `nodeBreathe ${2.5 + node.id * 0.7}s ease-in-out infinite`, animationDelay: `${node.id * 0.4}s` }} />
        ))}
      </svg>
      {walkers.map((w) => (
        <div key={w.id} className={`cosmic-dot ${w.bright ? "" : "dim"}`}
          style={{ left: `${w.x1}%`, top: `${w.y1}%`, animation: `walk-${w.id} ${w.duration}s ${w.delay}s linear infinite` }} />
      ))}
      {bubbles.map((b) => {
        const age = Date.now() - b.born;
        const phase = Math.min(age / 2000, 1);
        const fadeIn = phase < 0.25 ? phase / 0.25 : 1;
        const fadeOut = phase > 0.7 ? (1 - phase) / 0.3 : 1;
        return (
          <div key={b.id} className="absolute pointer-events-none"
            style={{ left: `${b.x}%`, top: `${b.y}%`, opacity: Math.min(fadeIn, fadeOut) * 0.28,
              transform: `translate(-50%, -100%) translateY(${-5 * phase}px)`, transition: "opacity 0.6s ease" }}>
            <div style={{ background: "rgba(30,20,55,0.45)", backdropFilter: "blur(3px)", border: "1px solid rgba(180,150,220,0.12)",
              borderRadius: "8px 8px 8px 2px", padding: "2px 8px", fontSize: "11px", fontWeight: 300,
              color: "rgba(220,210,245,0.65)", whiteSpace: "nowrap", letterSpacing: "0.03em" }}>
              {b.text}
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: "3px solid rgba(180,150,220,0.08)", marginLeft: "6px" }} />
          </div>
        );
      })}
      <style>
        {walkers.map((w) => `
          @keyframes walk-${w.id} {
            0%   { left: ${w.x1}%; top: ${w.y1}%; opacity: 0; }
            10%  { opacity: ${w.bright ? 0.75 : 0.35}; }
            90%  { opacity: ${w.bright ? 0.75 : 0.35}; }
            100% { left: ${w.x2}%; top: ${w.y2}%; opacity: 0; }
          }
        `).join("\n")}
      </style>
    </div>
  );
}

// ==========================================
// AmbientBg 包装
// ==========================================
function AmbientBg({ children, pulse = 0 }: { children: React.ReactNode; pulse?: number }) {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (ref.current) { const r = ref.current.getBoundingClientRect(); setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top }); }
  }, []);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className="animate-fluid-dream relative min-h-screen w-full overflow-hidden">
      <CosmicNetworkBg pulse={pulse} />
      <div className="absolute pointer-events-none z-0" style={{ left: mousePos.x, top: mousePos.y,
          width: 500, height: 500, transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(232,121,249,0.03) 30%, transparent 60%)",
          borderRadius: "50%", opacity: hover ? 1 : 0, transition: "opacity 0.6s ease", filter: "blur(40px)" }} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/5 blur-[140px] mix-blend-screen animate-ripple-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-fuchsia-600/10 to-indigo-500/5 blur-[120px] mix-blend-screen animate-ripple-slow [animation-delay:3s]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ==========================================
// 联系人卡片（带 3D 翻转）
// ==========================================
function ContactCard({ person, onOpen, onDelete, flipped, onFlip, onToast }: {
  person: Person; onOpen: () => void; onDelete: () => void; flipped: boolean; onFlip: () => void;
  onToast: (msg: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete();
      onToast(`已删除「${person.name}」`);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className={`flip-card ${flipped ? "flipped" : ""}`}>
      <div className="flip-card-inner" style={{ minHeight: 72 }}>
        {/* 正面 */}
        <div className="flip-card-front glass-card-premium rounded-2xl p-4 cursor-pointer flex items-center justify-between"
          onClick={(e) => { e.stopPropagation(); }}>
          <div className="flex items-center gap-3.5 flex-1 min-w-0" onClick={onOpen}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(232,121,249,0.2))", border: "1px solid rgba(232,121,249,0.3)", color: "#f1f0f4" }}>
              {person.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{person.name}</p>
              <p className="text-[10px] text-purple-300/45 font-mono uppercase tracking-wider mt-0.5">{person.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button onClick={(e) => { e.stopPropagation(); onFlip(); }}
              className="text-purple-300/35 hover:text-purple-200/70 text-xs transition-colors px-1.5 py-1 rounded hover:bg-white/5"
              title="查看画像">↻</button>
            <button onClick={handleDelete}
              className={`text-xs transition-all px-2 py-1 rounded font-medium ${confirmDelete ? "text-red-300 bg-red-500/15 border border-red-400/30" : "text-purple-300/35 hover:text-red-300/60 hover:bg-red-500/8"}`}>
              {confirmDelete ? "确认删除?" : "✕"}
            </button>
            <span className="text-purple-300/25 text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
          </div>
        </div>
        {/* 背面 — 画像预览，整面点击翻转 */}
        <div className="flip-card-back glass-card-premium rounded-2xl p-5 flex flex-col justify-center items-center text-center cursor-pointer group/back"
          onClick={onFlip}>
          <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-purple-300/50 mb-2">PERSONA INSIGHT</p>
          <p className="text-xs font-light text-purple-200/70 leading-relaxed">
            基于{person.role}身份画像，{person.name}在沟通中倾向于使用<span className="text-pink-200/80">高频礼貌词</span>包装真实意图，
            焦虑阈值<span className="text-purple-200/80">中等偏低</span>，对确定性需求<span className="text-fuchsia-200/80">较高</span>。
          </p>
          <div className="mt-3 text-[10px] text-purple-300/25 group-hover/back:text-purple-300/50 transition-colors tracking-wider">
            点击任意位置翻回 ↻
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Dashboard
// ==========================================
function Dashboard({ people, onDelete, onOpen, onAdd }: {
  people: Person[]; onDelete: (id: string) => void; onOpen: (p: Person) => void; onAdd: () => void;
}) {
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const grouped: Record<string, Person[]> = {};
  for (const p of people) { if (!grouped[p.role]) grouped[p.role] = []; grouped[p.role].push(p); }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <AmbientBg>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-float-in">
          <div className="glass-card-premium rounded-xl px-5 py-3 text-sm font-light text-purple-100/90 border-purple-400/30 shadow-lg">
            {toast}
          </div>
        </div>
      )}
      <div className="min-h-screen px-4 sm:px-8 md:px-16 py-12 flex flex-col">
        <header className="w-full max-w-3xl mx-auto mb-12 text-center animate-float-in">
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-pink-100 to-white">
            MESSAGE INTENT TRANSLATOR
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-purple-300/50 mt-2 uppercase font-mono">Contact Dashboard</p>
        </header>

        <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col gap-10">
          {Object.keys(grouped).length > 0 ? (
            Object.entries(grouped).map(([role, list], gi) => (
              <section key={role} className="animate-float-in" style={{ animationDelay: `${gi * 80}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs tracking-[0.2em] uppercase font-mono text-purple-300/50">{role}</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-400/20 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {list.map((person) => (
                    <ContactCard key={person.id} person={person}
                      onOpen={() => onOpen(person)}
                      onDelete={() => onDelete(person.id)}
                      flipped={flippedId === person.id}
                      onFlip={() => setFlippedId(flippedId === person.id ? null : person.id)}
                      onToast={showToast} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-16 animate-float-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ background: "radial-gradient(circle, rgba(232,121,249,0.1), transparent)", border: "1px dashed rgba(232,121,249,0.2)" }}>
                <span className="text-2xl text-purple-300/30">+</span>
              </div>
              <p className="text-sm text-purple-300/40 font-light">还没有联系人</p>
              <p className="text-[11px] text-purple-300/25 mt-1 font-light">点击下方按钮添加第一个对话对象</p>
            </div>
          )}

          <div className="text-center animate-float-in [animation-delay:200ms]">
            <button onClick={onAdd}
              className="glass-card-premium rounded-2xl px-8 py-4 inline-flex items-center gap-3 hover:border-purple-400/40 transition-all duration-500 group">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-light text-purple-300/60 group-hover:text-white transition-colors"
                style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>+</span>
              <span className="text-xs tracking-[0.2em] font-light text-purple-300/80 group-hover:text-purple-100 transition-colors">添加联系人</span>
            </button>
          </div>
        </main>

        <footer className="w-full max-w-3xl mx-auto mt-16 pt-6 border-t border-white/5 text-center animate-float-in [animation-delay:400ms]">
          <p className="text-[10px] font-extralight tracking-widest text-purple-300/25">* 风险提示：本工具分析结论仅供人际策略参考。</p>
        </footer>
      </div>
    </AmbientBg>
  );
}

// ==========================================
// 通用 DropZone
// ==========================================
function DropZone({ accept, multiple, label, hint, icon, files, onFiles }: {
  accept: string; multiple?: boolean; label: string; hint: string; icon: string;
  files: File[]; onFiles: (f: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [thumbs, setThumbs] = useState<Record<number, string>>({});

  useEffect(() => {
    const t: Record<number, string> = {};
    files.forEach((f, i) => { if (f.type.startsWith("image/")) t[i] = URL.createObjectURL(f); });
    setThumbs(t);
    return () => { Object.values(t).forEach((u) => URL.revokeObjectURL(u)); };
  }, [files]);

  return (
    <div className="space-y-3">
      <div className={`drop-zone p-6 text-center ${dragOver ? "drag-over" : ""}`}
        onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; if (dragCounter.current === 1) setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragOver(false); }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); dragCounter.current = 0; const d = Array.from(e.dataTransfer.files); if (d.length) onFiles(d); }}
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple}
          onChange={(e) => { if (e.target.files?.length) onFiles(Array.from(e.target.files)); e.target.value = ""; }} className="hidden" />
        <div className="text-2xl mb-2" style={{ animation: dragOver ? "uploadFloat 0.6s ease-in-out infinite" : "none" }}>{icon}</div>
        <p className="text-xs font-medium text-purple-200/80 tracking-wider">{label}</p>
        <p className="text-[10px] text-purple-300/40 mt-1.5 font-light">{hint}</p>
        {dragOver && <p className="text-[10px] text-pink-300/70 mt-2 font-medium animate-pulse">RELEASE TO UPLOAD</p>}
      </div>
      {files.length > 0 && (
        <div className="thumb-grid">
          {files.map((f, i) => (
            <div key={i} className="thumb-item">
              {thumbs[i] ? <img src={thumbs[i]} alt={f.name} /> : <div className="w-full h-full flex items-center justify-center bg-white/5 text-[9px] text-purple-300/50 px-1">{f.name.slice(0, 12)}</div>}
              <button className="remove-thumb" onClick={(e) => { e.stopPropagation(); onFiles(files.filter((_, j) => j !== i)); }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// AddContact
// ==========================================
function AddContactView({ onSave, onBack }: { onSave: (name: string, role: string) => void; onBack: () => void }) {
  const [role, setRole] = useState("同事");
  const [name, setName] = useState("");
  const [chatFiles, setChatFiles] = useState<File[]>([]);
  const [chatText, setChatText] = useState("");

  const save = () => { if (name.trim()) { onSave(name.trim(), role); setName(""); } };

  return (
    <AmbientBg>
      <div className="min-h-screen px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-lg animate-float-in">
          <button onClick={onBack} className="text-xs tracking-wider text-purple-300/40 hover:text-purple-200/70 transition-colors mb-8 font-light">← 返回</button>
          <div className="glass-card-premium rounded-3xl p-6 sm:p-8 space-y-7">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase font-mono text-purple-300/50 mb-1">NEW CONTACT PROFILE</p>
              <h2 className="text-xl font-extralight text-white/90 tracking-wider">新建联系人画像</h2>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-purple-300/60 tracking-widest pl-1">RELATIONSHIP</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`text-xs py-2.5 rounded-xl font-light tracking-wider transition-all duration-400 ${role === r ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/35 shadow-md" : "text-purple-300/40 border border-transparent hover:text-purple-200/60 hover:border-white/5"}`}>{r}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[11px] font-medium text-purple-300/60 tracking-widest pl-1">NAME TAG</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder={`给这位${role}起个称呼，如 "小王"、"李总"…`}
                className="glass-input-premium w-full rounded-xl px-4 py-3 text-sm font-light"
                onKeyDown={(e) => e.key === "Enter" && save()} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="block text-[11px] font-medium text-purple-300/60 tracking-widest pl-1">CHAT HISTORY</label>
                <span className="text-[9px] text-purple-300/30 font-mono uppercase border border-purple-300/15 rounded px-1.5 py-0.5">OPTIONAL</span>
              </div>
              <p className="text-[10px] text-purple-300/35 font-light pl-1 -mt-1">上传历史聊天截图或文本，帮助构建该联系人的沟通画像。</p>
              <DropZone accept="image/*" multiple files={chatFiles} onFiles={setChatFiles} icon="🖼️" label="拖拽或点击上传微信截图" hint="支持 PNG / JPG / WEBP，可多选" />
              <div className="relative"><div className="absolute left-0 right-0 top-1/2 h-px bg-white/5" /><div className="relative flex justify-center"><span className="text-[9px] text-purple-300/25 font-mono uppercase px-2" style={{ background: "#0a0614" }}>OR</span></div></div>
              <textarea value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="或直接粘贴历史聊天文本…" rows={4} className="glass-input-premium w-full rounded-xl p-4 text-xs resize-none font-light leading-relaxed" />
            </div>
            <div className="pt-2 flex justify-center">
              <button onClick={save} disabled={!name.trim()}
                className="relative px-10 py-3 rounded-xl overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none border border-purple-400/40 hover:border-pink-300/60"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", backdropFilter: "blur(12px)" }}>
                <span className="relative text-xs tracking-[0.2em] font-medium text-purple-100">SAVE / 保存联系人</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AmbientBg>
  );
}

// ==========================================
// ChatView — 含打字机 + OCR 扫描动画
// ==========================================
function ChatView({ person, onBack }: { person: Person; onBack: () => void }) {
  const [inputMode, setInputMode] = useState<"text" | "screenshot">("text");
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"wechat" | "email">("wechat");
  const [shots, setShots] = useState<File[]>([]);
  const [pulse, setPulse] = useState(0);

  // 分析状态
  const [phase, setPhase] = useState<"idle" | "scanning" | "typing" | "done">("idle");
  const [rawResult, setRawResult] = useState<{ trueIntent: string; actionPlan: string; replyText: string } | null>(null);
  const [scanDone, setScanDone] = useState(false);
  const [error, setError] = useState("");

  // 打字机：意图 & 策略
  const intentTypewriter = useTypewriter(rawResult?.trueIntent ?? "", 28, phase === "typing");
  const planTypewriter = useTypewriter(rawResult?.actionPlan ?? "", 24, phase === "typing" && intentTypewriter.done);
  const replyTypewriter = useTypewriter(rawResult?.replyText ?? "", 22, phase === "typing" && planTypewriter.done);

  const hasInput = inputMode === "text" ? !!text.trim() : shots.length > 0;

  const handleAnalyze = async () => {
    if (!hasInput) return;
    setPulse((p) => p + 1);
    setRawResult(null);
    setError("");

    if (inputMode === "screenshot" && shots.length > 0) {
      setPhase("scanning");
      const file = shots[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const imageDataUrl = reader.result as string;
        setScanDone(true);
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text.trim() || undefined,
              imageDataUrl,
              identity: person.role,
              outputFormat: format === "wechat" ? "微信" : "邮件",
              personName: person.name || undefined,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          const r = data.result;
          setRawResult({
            trueIntent: r.realIntent.join("；"),
            actionPlan: r.solutionOutline.join("\n"),
            replyText: r.reply ?? "",
          });
          setTimeout(() => setPhase("typing"), 400);
        } catch (err) {
          setError(err instanceof Error ? err.message : "分析失败");
          setPhase("idle");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPhase("typing");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            identity: person.role,
            outputFormat: format === "wechat" ? "微信" : "邮件",
            personName: person.name || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const r = data.result;
        setRawResult({
          trueIntent: r.realIntent.join("；"),
          actionPlan: r.solutionOutline.join("\n"),
          replyText: r.reply ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "分析失败");
        setPhase("idle");
      }
    }
  };

  // 打字全部完成后标记 done
  useEffect(() => {
    if (replyTypewriter.done) setPhase("done");
  }, [replyTypewriter.done]);

  return (
    <AmbientBg pulse={pulse}>
      <div className="min-h-screen px-4 sm:px-8 md:px-16 py-12 flex flex-col">
        <header className="w-full max-w-3xl mx-auto mb-10 animate-float-in">
          <button onClick={onBack} className="text-xs tracking-wider text-purple-300/40 hover:text-purple-200/70 transition-colors mb-6 font-light">← 返回联系人</button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-medium shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.35), rgba(232,121,249,0.25))", border: "1px solid rgba(232,121,249,0.35)", color: "#f1f0f4" }}>{person.name[0]}</div>
            <div><h1 className="text-xl font-light text-white/90 tracking-wider">{person.name}</h1>
              <p className="text-[10px] text-purple-300/45 font-mono uppercase tracking-wider mt-0.5">{person.role}</p></div>
          </div>
        </header>

        <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col gap-8">
          {/* 输入卡片 */}
          <section className="glass-card-premium rounded-3xl p-6 sm:p-8 animate-float-in [animation-delay:100ms]">
            <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {(["text", "screenshot"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setInputMode(m); setPhase("idle"); setRawResult(null); setScanDone(false); }}
                  className={`flex-1 text-xs py-2.5 rounded-lg font-light tracking-wider transition-all duration-400 ${inputMode === m ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30 shadow-sm" : "text-purple-300/35 hover:text-purple-200/60"}`}>
                  {m === "text" ? "📋 粘贴文本" : "📸 上传截图"}
                </button>
              ))}
            </div>

            {inputMode === "text" ? (
              <div className="space-y-2">
                <label className="block text-[11px] font-medium text-purple-300/60 tracking-widest pl-1">MESSAGE FROM {person.name.toUpperCase()}</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  placeholder={`在此粘贴${person.name}发来的消息…`} rows={4}
                  className="glass-input-premium w-full rounded-2xl p-4 text-sm resize-none font-light leading-relaxed" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-[11px] font-medium text-purple-300/60 tracking-widest pl-1">WECHAT SCREENSHOT</label>
                {/* OCR 扫描动画叠加层 */}
                <div className="relative">
                  {phase === "scanning" && shots.length > 0 && !scanDone && shots.map((_, i) => (
                    <div key={i} className="scan-line" style={{ top: `${i * (100 / shots.length)}%`, animationDelay: `${i * 0.3}s` }} />
                  ))}
                  <DropZone accept="image/*" multiple files={shots} onFiles={setShots} icon="📸" label="拖拽或点击上传微信聊天截图" hint="支持 PNG / JPG / WEBP，可一次选择多张" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-white/5">
              <span className="text-[10px] text-purple-300/40 tracking-wider shrink-0">REPLY STYLE</span>
              <div className="glass-input-premium rounded-xl p-1 flex h-[40px] flex-1 max-w-xs">
                {(["wechat", "email"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setFormat(s)}
                    className={`flex-1 text-[10px] tracking-wider transition-all duration-400 py-1.5 rounded-lg font-medium ${format === s ? "bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-white border border-purple-400/40" : "text-purple-300/40 hover:text-purple-100/70"}`}>
                    {s === "wechat" ? "微信" : "邮件"}</button>
                ))}
              </div>
              <div className="flex-1 flex justify-end">
                <button onClick={handleAnalyze} disabled={phase !== "idle" && phase !== "done" || !hasInput}
                  className="relative px-10 py-3 rounded-xl overflow-hidden transition-all duration-500 active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none border border-purple-400/40 hover:border-pink-300/60"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", backdropFilter: "blur(12px)" }}>
                  <span className="relative text-xs tracking-[0.2em] font-medium text-purple-100">
                    {phase === "scanning" ? "SCANNING…" : phase === "typing" ? "ANALYZING…" : "ANALYZE / 穿透真实意图"}
                  </span>
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-300/80">{error}</p>
            )}
          </section>

          {/* 结果区 — 打字机输出 */}
          {(phase === "scanning" || phase === "typing" || phase === "done") && (
            <section className="space-y-5 animate-float-in [animation-delay:100ms]">
              {/* 意图卡片 */}
              <div className="glass-card-result rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-purple-400/50 to-transparent" />
                <h3 className="text-[10px] tracking-[0.2em] font-mono text-purple-300/50 mb-4 uppercase">{"// 01 /"} CORE INTENT ANALYSIS</h3>
                {phase === "scanning" ? (
                  <div className="space-y-3 py-1">
                    <div className="skeleton-line h-3.5 w-3/4" />
                    <div className="skeleton-line h-3.5 w-5/6" />
                  </div>
                ) : (
                  <div className="space-y-4 font-light text-sm leading-relaxed">
                    <div className="p-4 rounded-2xl bg-purple-500/[0.06] border border-purple-400/15">
                      <span className="inline-block text-pink-200 font-medium text-xs border border-pink-400/30 px-2 py-0.5 rounded bg-pink-500/10 mb-2">隐藏情绪</span>
                      <p className={`text-purple-50/95 ${phase === "done" ? "typewriter-cursor done" : "typewriter-cursor"}`}>
                        {intentTypewriter.displayed}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-fuchsia-500/[0.06] border border-fuchsia-400/15 whitespace-pre-line">
                      <span className="text-purple-200 font-medium block mb-2 text-xs">💡 解决策略:</span>
                      <p className={`text-purple-50/90 ${planTypewriter.done ? "typewriter-cursor done" : "typewriter-cursor"}`}>
                        {planTypewriter.displayed || (intentTypewriter.done ? "" : "")}
                        {intentTypewriter.done && planTypewriter.displayed ? planTypewriter.displayed : (intentTypewriter.done ? planTypewriter.displayed : "")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 回复卡片 */}
              {(phase === "typing" || phase === "done") && (
                <div className="glass-card-result rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-pink-400/50 to-transparent" />
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] tracking-[0.2em] font-mono text-purple-300/50 uppercase">{"// 02 /"} GENERATED RESPONSE</h3>
                    {phase === "done" && (
                      <button onClick={() => navigator.clipboard.writeText(replyTypewriter.displayed)}
                        className="text-[10px] tracking-wider text-purple-300/50 hover:text-white transition-all border border-purple-300/15 rounded-lg px-2.5 py-1">COPY</button>
                    )}
                  </div>
                  <div className="p-5 rounded-2xl bg-black/15 border border-white/8 font-light text-sm text-purple-50/95 leading-relaxed">
                    <span className={replyTypewriter.done ? "typewriter-cursor done" : "typewriter-cursor"}>{replyTypewriter.displayed}</span>
                  </div>
                </div>
              )}

              {/* 一键跳到结尾 */}
              {phase === "typing" && !replyTypewriter.done && (
                <div className="text-center">
                  <button onClick={() => { intentTypewriter.skip(); planTypewriter.skip(); replyTypewriter.skip(); }}
                    className="text-[10px] text-purple-300/30 hover:text-purple-300/60 transition-colors">跳过动画 →</button>
                </div>
              )}
            </section>
          )}
        </main>

        <footer className="w-full max-w-3xl mx-auto mt-12 pt-6 border-t border-white/5 text-center animate-float-in [animation-delay:400ms]">
          <p className="text-[10px] font-extralight tracking-widest text-purple-300/25">* 风险提示：本工具分析结论仅供人际策略参考。</p>
        </footer>
      </div>
    </AmbientBg>
  );
}

// ==========================================
// 主应用入口
// ==========================================
export default function App() {
  const [view, setView] = useState<AppView>("splash");
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const { people, addPerson, removePerson } = useContacts();

  if (view === "splash") return <Splash onDone={() => setView("dashboard")} />;

  if (view === "dashboard") {
    return <Dashboard people={people} onDelete={removePerson}
      onOpen={(p) => { setActivePerson(p); setView("chat"); }}
      onAdd={() => setView("addContact")} />;
  }

  if (view === "addContact") {
    return <AddContactView onSave={(name, role) => { addPerson(name, role); setView("dashboard"); }} onBack={() => setView("dashboard")} />;
  }

  if (view === "chat" && activePerson) {
    return <ChatView person={activePerson} onBack={() => setView("dashboard")} />;
  }

  return null;
}
