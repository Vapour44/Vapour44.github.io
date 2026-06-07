import { useState, useEffect, useRef } from "react";

// ─── DATA ───
const LABS = [
  { id: "01", label: "UI Design", title: "Static UI Layout", video: "0_qGG-9xhS4", reflection: "In Lab 1, I built my first static UI using Jetpack Compose. I learned how to use basic composables like Column, Row, and Text to structure a layout. This lab gave me a solid foundation for thinking in terms of composable components." },
  { id: "02", label: "Interaction", title: "State & Interaction", video: "efptMjtFKE0", reflection: "Lab 2 introduced me to state management using mutableStateOf and remember. I added interactivity to the UI, learning how user input triggers recomposition and how Compose reacts to state changes automatically." },
  { id: "03", label: "Material Design", title: "Material Design 3", video: "oi6mXVmL-DI", reflection: "In Lab 3, I applied Material Design 3 principles using Compose's built-in components such as Card, Button, and MaterialTheme. I learned how to create a consistent and professional visual identity across the app." },
  { id: "04", label: "Navigation", title: "Navigation & ViewModel", video: "Z5fk8zRjtmk", reflection: "Lab 4 taught me multi-screen navigation using Navigation Compose and how to share state across screens with ViewModel. I implemented a user profile form that persists data throughout the app's navigation flow." },
  { id: "05", label: "Room Database", title: "Local Persistence with Room", video: "uHeCKrcthuo", reflection: "Lab 5 introduced Room Database for persistent local storage. I learned the Entity-DAO-Repository-ViewModel architecture and how Flow enables automatic UI updates when the database changes, making data survive app restarts." },
];

const PROJECTS = [
  {
    id: "01", title: "IELTS Master", tags: ["Compose", "Navigation", "ViewModel", "SDG 4"],
    problem: "Many learners worldwide struggle to build English vocabulary effectively. IELTS Master provides a structured mobile learning experience to help users achieve their target band scores.",
    lessons: "I learned how to build a complete multi-screen app with shared ViewModel state. Understanding how NavHost and composable routes work together was a key breakthrough. Managing state across screens using a single ViewModel instance made the app flow cohesive.",
    vsr: "eF1KXfvtHNI", vsrLink: "https://youtu.be/eF1KXfvtHNI",
    github: "https://github.com/Vapour44/vocabularylearing-SDG4/tree/project1"
  },
  {
    id: "02", title: "IELTS Master — Advanced", tags: ["Room", "Firebase", "Retrofit", "Sensor", "SDG 4"],
    problem: "Extending IELTS Master with hybrid data persistence, live dictionary API, and hardware sensor integration to create a fully connected and hardware-aware vocabulary learning experience.",
    lessons: "I learned how to integrate Room for local persistence, Firebase Firestore for cloud sharing, Retrofit for live API calls, and the Accelerometer sensor for shake detection. The most valuable lesson was understanding how these technologies work together in a clean MVVM architecture.",
    vsr: "OjiYA8EI2_Y", vsrLink: "https://youtu.be/OjiYA8EI2_Y",
    github: "https://github.com/Vapour44/vocabularylearing-SDG4"
  },
];

const SKILLS = [
  { name: "Kotlin", color: "#c8c8c8" }, { name: "Jetpack Compose", color: "#c8c8c8" },
  { name: "Room Database", color: "#888888" }, { name: "Firebase Firestore", color: "#888888" },
  { name: "Retrofit", color: "#888888" }, { name: "Accelerometer Sensor", color: "#aaaaaa" },
  { name: "Navigation Compose", color: "#c8c8c8" }, { name: "ViewModel", color: "#c8c8c8" },
  { name: "Material Design 3", color: "#888888" }, { name: "MVVM Architecture", color: "#ffffff" },
  { name: "KSP", color: "#aaaaaa" }, { name: "Git & GitHub", color: "#ffffff" },
];

const RESOURCES = [
  { icon: "API", title: "Dictionary API — dictionaryapi.dev", desc: "Free public REST API used in Project 2 to fetch live word definitions and examples for the Self-Test screen." },
  { icon: "DB", title: "Firebase Firestore — firebase.google.com", desc: "Cloud NoSQL database used for community wordbook sharing. Enables real-time data synchronisation across users." },
  { icon: "LIB", title: "Android Jetpack Libraries", desc: "Room, Navigation Compose, ViewModel, and Lifecycle libraries from Android Jetpack formed the core architecture of both projects." },
  { icon: "AI", title: "AI Assistance — Claude (Anthropic)", desc: "Claude was used as a learning and debugging assistant throughout the course. All code was reviewed, understood, and modified by the student." },
];

// ─── HOOKS ───
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.07;
      current.current.y += (target.current.y - current.current.y) * 0.07;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return pos;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function useReveal() {
  const ref = useRef(null);
  // state: "below" | "visible" | "past"
  const [state, setState] = useState("below");
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
        } else {
          const rect = entry.boundingClientRect;
          setState(rect.top < 0 ? "past" : "below");
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, state];
}

function useTilt() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / rect.width) * 12;
      const y = -((e.clientY - cy) / rect.height) * 12;
      setTilt({ x, y });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return [ref, tilt];
}

// ─── COMPONENTS ───
function RevealSection({ children, delay = 0 }) {
  const [ref, state] = useReveal();
  const styles = {
    below:   { opacity: 0, transform: "translateY(36px)" },
    visible: { opacity: 1, transform: "translateY(0)" },
    past:    { opacity: 0, transform: "translateY(-24px)" },
  }[state];
  const dur = state === "past" ? "0.4s" : "0.65s";
  const del = state === "visible" ? `${delay}s` : "0s";
  return (
    <div ref={ref} style={{
      ...styles,
      transition: `opacity ${dur} cubic-bezier(0.4,0,0.2,1) ${del}, transform ${dur} cubic-bezier(0.4,0,0.2,1) ${del}`,
    }}>
      {children}
    </div>
  );
}

function TiltCard({ children, style }) {
  const [ref, tilt] = useTilt();
  return (
    <div ref={ref} style={{
      ...style,
      transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(0)`,
      transition: "transform 0.15s ease",
      willChange: "transform",
    }}>
      {children}
    </div>
  );
}

function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      setRing({ x: current.current.x, y: current.current.y });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const addHover = (el) => {
      el.addEventListener("mouseenter", () => setHovered(true));
      el.addEventListener("mouseleave", () => setHovered(false));
    };
    document.querySelectorAll("a, button, .tilt-card").forEach(addHover);

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div style={{
        position: "fixed", left: pos.x, top: pos.y, width: hovered ? 20 : 10, height: hovered ? 20 : 10,
        background: "#c8c8c8", borderRadius: "50%", pointerEvents: "none", zIndex: 9999,
        transform: "translate(-50%, -50%)", transition: "width 0.2s, height 0.2s",
        mixBlendMode: "screen",
      }} />
      <div style={{
        position: "fixed", left: ring.x, top: ring.y,
        width: hovered ? 52 : 34, height: hovered ? 52 : 34,
        border: `1px solid rgba(200,200,200,${hovered ? 0.7 : 0.4})`,
        borderRadius: "50%", pointerEvents: "none", zIndex: 9998,
        transform: "translate(-50%, -50%)", transition: "width 0.2s, height 0.2s, border-color 0.2s",
      }} />
    </>
  );
}

// ─── MAIN APP ───
export default function Portfolio() {
  const mouse = useMouseParallax();
  const scrollProgress = useScrollProgress();

  const S = {
    bg: "#0a0a0a", surface: "#111111", surface2: "#1a1a1a",
    accent: "#c8c8c8", accent2: "#e8e8e8", text: "#ffffff",
    muted: "#888888", border: "rgba(200,200,200,0.15)",
  };

  return (
    <div style={{ background: S.bg, color: S.text, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { cursor: none; }
        a { cursor: none; }
        @keyframes bobUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      <Cursor />

      {/* PROGRESS BAR */}
      <div style={{
        position: "fixed", top: 60, left: 0, height: 2,
        width: `${scrollProgress * 100}%`,
        background: "linear-gradient(90deg, #ffffff, #888888)",
        zIndex: 99, transition: "width 0.1s",
      }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        background: "rgba(10,10,10,0.88)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${S.border}`,
        padding: "0 2rem", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 60,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: S.accent, letterSpacing: "0.1em", fontWeight: 700 }}>A207404</span>
        <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
          {["home", "labs", "projects", "reflection", "skills", "resources"].map(s => (
            <li key={s}><a href={`#${s}`} style={{ color: S.muted, textDecoration: "none", fontSize: "0.85rem", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = S.accent2}
              onMouseLeave={e => e.target.style.color = S.muted}
            >{s.charAt(0).toUpperCase() + s.slice(1)}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 2rem 2rem", position: "relative", overflow: "hidden" }}>
        {/* Parallax BG */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(200,200,200,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 50%)",
          transform: `translate3d(${mouse.x * 12}px, ${mouse.y * 8}px, 0)`,
          willChange: "transform",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${S.border} 1px, transparent 1px), linear-gradient(90deg, ${S.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px", opacity: 0.3,
          transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 4}px, 0)`,
          willChange: "transform",
        }} />

        {/* Hero Content */}
        <div style={{ position: "relative", textAlign: "center", maxWidth: 700 }}>
          {[
            <div key="tag" style={{ display: "inline-block", fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: S.accent, border: `1px solid ${S.accent}`, padding: "0.3rem 0.8rem", borderRadius: 2, marginBottom: "1.5rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Mobile Application Programming</div>,
            <h1 key="name" style={{ fontFamily: "'Space Mono',monospace", fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 700, lineHeight: 1.1, background: "linear-gradient(135deg, #ffffff 0%, #c8c8c8 50%, #888888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "1rem" }}>ZHANG KAIYI</h1>,
            <p key="sub" style={{ color: S.muted, fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 500, margin: "0 auto 2rem" }}>A mobile developer passionate about building meaningful apps that contribute to education and lifelong learning through modern Android technologies.</p>,
            <div key="meta" style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
              {[["Matric", "A207404"], ["Programme", "Mobile Application Programming"], ["Instructor", "Cikgulzwan"]].map(([k, v]) => (
                <span key={k} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: S.muted }}><strong style={{ color: S.accent }}>{k}</strong> {v}</span>
              ))}
            </div>,
            <div key="sdg" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg, rgba(200,200,200,0.08), rgba(150,150,150,0.08))", border: "1px solid rgba(200,200,200,0.2)", padding: "0.6rem 1.2rem", borderRadius: 4, fontSize: "0.85rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: S.accent }} />
              SDG 4: Quality Education — Making quality English learning accessible to all learners worldwide.
            </div>
          ].map((el, i) => (
            <div key={i} style={{ animation: `fadeUp 0.6s ease ${0.1 + i * 0.1}s forwards`, opacity: 0 }}>{el}</div>
          ))}
        </div>

        {/* Scroll Cue */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "fadeUp 0.6s ease 1s forwards", opacity: 0 }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Scroll</span>
          <div style={{ width: 34, height: 34, border: "1px solid rgba(200,200,200,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "bobUp 1.8s ease-in-out infinite", color: "rgba(200,200,200,0.6)", fontSize: 14 }}>↓</div>
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)" }} />

      {/* LABS */}
      <section id="labs" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// 01</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600 }}>Lab Submissions</h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #ffffff, #888888)", marginTop: "0.8rem" }} />
          </div>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {LABS.map((lab, i) => (
            <RevealSection key={lab.id} delay={i * 0.08}>
              <TiltCard style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, overflow: "hidden" }} className="tilt-card">
                <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>Lab {lab.id}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.muted }}>{lab.label}</span>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.8rem" }}>{lab.title}</div>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 4, marginBottom: "1rem", background: S.surface2 }}>
                    <iframe src={`https://www.youtube.com/embed/${lab.video}`} allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} title={lab.title} />
                  </div>
                  <div style={{ background: S.surface2, borderLeft: `2px solid ${S.accent}`, padding: "0.8rem 1rem", borderRadius: "0 4px 4px 0", fontSize: "0.82rem", color: S.muted, lineHeight: 1.6 }}>{lab.reflection}</div>
                </div>
              </TiltCard>
            </RevealSection>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)" }} />

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// 02</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600 }}>Project Submissions</h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #ffffff, #888888)", marginTop: "0.8rem" }} />
          </div>
        </RevealSection>
        {PROJECTS.map((p, i) => (
          <RevealSection key={p.id} delay={i * 0.1}>
            <TiltCard style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, overflow: "hidden", marginBottom: "2rem" }} className="tilt-card">
              <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg, rgba(200,200,200,0.04), rgba(100,100,100,0.02))", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Project {p.id}</div>
                  <h3 style={{ fontSize: "1.2rem" }}>{p.title}</h3>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", padding: "0.2rem 0.5rem", background: "rgba(200,200,200,0.08)", border: "1px solid rgba(200,200,200,0.2)", borderRadius: 2, color: S.accent }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: S.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Problem Statement</div>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{p.problem}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: S.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Lessons Learned</div>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{p.lessons}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                    <a href={p.vsrLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: 4, fontSize: "0.8rem", fontFamily: "'Space Mono',monospace", textDecoration: "none", background: "#c8c8c8", color: "#0a0a0a", border: "1px solid #c8c8c8", fontWeight: 700, transition: "all 0.2s", marginTop: "0.8rem" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#c8c8c8"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >▶ Watch VSR</a>
                    <a href={p.github} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: 4, fontSize: "0.8rem", fontFamily: "'Space Mono',monospace", textDecoration: "none", background: "transparent", color: "#c8c8c8", border: "1px solid rgba(200,200,200,0.4)", transition: "all 0.2s", marginTop: "0.8rem" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,200,200,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >⌥ GitHub</a>
                  </div>
                </div>
                <div>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 4, background: S.surface2 }}>
                    <iframe src={`https://www.youtube.com/embed/${p.vsr}`} allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }} title={p.title} />
                  </div>
                </div>
              </div>
            </TiltCard>
          </RevealSection>
        ))}
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)" }} />

      {/* REFLECTION */}
      <section id="reflection" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// 03</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600 }}>Reflection & Learning Journey</h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #ffffff, #888888)", marginTop: "0.8rem" }} />
          </div>
        </RevealSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {[
            { h: "Growth", p: "Starting from a static UI in Lab 1, I gradually built up to a fully connected app with cloud storage, live APIs, and hardware sensors. Each lab built on the previous, making the learning curve manageable and rewarding." },
            { h: "Challenges", p: "The biggest challenge was integrating Room with KSP in a project using AGP 9.x. Version compatibility issues took significant time to resolve, but taught me the importance of understanding the full dependency chain." },
            { h: "SDG Impact", p: "Building an IELTS learning app directly supports SDG 4 by making quality English vocabulary learning accessible on any mobile device. The community sharing feature extends this impact by enabling learners to share resources." },
            { h: "Going Forward", p: "This course has given me the foundation to build production-ready Android apps. I now understand the full stack from UI design to data persistence and external integrations, skills I plan to apply in real-world projects." },
          ].map((item, i) => (
            <RevealSection key={item.h} delay={i * 0.08}>
              <TiltCard style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, padding: "1.5rem" }} className="tilt-card">
                <h3 style={{ fontSize: "0.9rem", color: S.accent, marginBottom: "0.8rem", fontFamily: "'Space Mono',monospace" }}>{item.h}</h3>
                <p style={{ fontSize: "0.85rem", color: S.muted, lineHeight: 1.7 }}>{item.p}</p>
              </TiltCard>
            </RevealSection>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)" }} />

      {/* SKILLS */}
      <section id="skills" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// 04</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600 }}>Skills & Tech Stack</h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #ffffff, #888888)", marginTop: "0.8rem" }} />
          </div>
        </RevealSection>
        <RevealSection delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
            {SKILLS.map((skill) => (
              <div key={skill.name} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 4, fontSize: "0.82rem", color: S.text, transition: "border-color 0.2s, color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,200,200,0.5)"; e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.text; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: skill.color, flexShrink: 0 }} />
                {skill.name}
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(200,200,200,0.2), transparent)" }} />

      {/* RESOURCES */}
      <section id="resources" style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <RevealSection>
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", color: S.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>// 05</div>
            <h2 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 600 }}>Resources & References</h2>
            <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #ffffff, #888888)", marginTop: "0.8rem" }} />
          </div>
        </RevealSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {RESOURCES.map((r, i) => (
            <RevealSection key={r.icon} delay={i * 0.08}>
              <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, padding: "1rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1rem", transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,200,200,0.35)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                <div style={{ width: 32, height: 32, background: "rgba(200,200,200,0.08)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.8rem", color: S.accent, fontFamily: "'Space Mono',monospace" }}>{r.icon}</div>
                <div>
                  <h4 style={{ fontSize: "0.9rem", marginBottom: "0.2rem" }}>{r.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: S.muted, lineHeight: 1.5 }}>{r.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${S.border}`, padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.75rem", color: S.muted }}>
          ZHANG KAIYI &nbsp;·&nbsp; <span style={{ color: S.accent }}>A207404</span> &nbsp;·&nbsp; Mobile Application Programming &nbsp;·&nbsp; <span style={{ color: S.accent }}>2025</span>
        </p>
      </footer>
    </div>
  );
}
