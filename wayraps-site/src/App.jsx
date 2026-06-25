import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#080808", gold: "#C9A56E", goldLight: "#E0C68A",
  purple: "#7B5EA7", purpleDim: "#4A3670", cream: "#F0E8D8",
  cardBg: "#0F0E0D", border: "#1A1816",
};

// Standard edition — 11 tracks on all streaming platforms
const SONGS = [
  { id: 1,  title: "On My Own",           subtitle: "BY WAY", duration: "3:49", audio: "/audio/on_my_own.mp3" },
  { id: 2,  title: "Swerv",               subtitle: "BY WAY", duration: "0:00", audio: "/audio/swerv.mp3" },
  { id: 3,  title: "Way's Birthday Song", subtitle: "BY WAY", duration: "0:00", audio: "/audio/ways_birthday_song.mp3" },
  { id: 4,  title: "Young Niggas",        subtitle: "BY WAY", duration: "0:00", audio: "/audio/young_niggas.mp3" },
  { id: 5,  title: "FOD",                 subtitle: "BY WAY", duration: "0:00", audio: "/audio/fod.mp3" },
  { id: 6,  title: "Wasting My Time",     subtitle: "BY WAY", duration: "0:00", audio: "/audio/wasting_my_time.mp3" },
  { id: 7,  title: "Dusá",               subtitle: "BY WAY", duration: "0:00", audio: "/audio/dusa.mp3" },
  { id: 8,  title: "Cars On The Moon",    subtitle: "BY WAY", duration: "0:00", audio: "/audio/cars_on_the_moon.mp3" },
  { id: 9,  title: "Down Cubed",          subtitle: "BY WAY", duration: "0:00", audio: "/audio/down_cubed.mp3" },
  { id: 10, title: "Happy",               subtitle: "BY WAY", duration: "0:00", audio: "/audio/happy.mp3" },
  { id: 11, title: "BGT",                 subtitle: "BY WAY", duration: "2:58", audio: "/audio/bgt.mp3" },
];

const SOCIALS = [
  { label: "TikTok", url: "https://www.tiktok.com/@wayraps", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" },
  { label: "Instagram", url: "https://www.instagram.com/wayraps", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "Facebook", url: "https://www.facebook.com/wayraps", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "YouTube", url: "https://www.youtube.com/channel/UCQHV1Y5ar_xF6v-BMXZ5zbA?view_as=subscriber", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

const CSS_TEXT = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
@keyframes pulse { from{transform:scaleY(1)} to{transform:scaleY(1.6)} }
@keyframes grainAnim { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 50%{transform:translate(-2%,6%)} 90%{transform:translate(-1%,2%)} }
@keyframes glowPulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.04)} }
@keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
::selection { background:#7B5EA7; color:#F0E8D8; }
* { box-sizing:border-box; margin:0; padding:0; }
body { background: #080808; }
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:#080808; }
::-webkit-scrollbar-thumb { background:#2A2520; border-radius:3px; }
@media (max-width: 640px) {
  .footer-inner { flex-direction: column !important; gap: 24px !important; align-items: center !important; }
  .footer-inner > * { text-align: center; }
  .header-bar { padding: 16px 20px !important; }
  .header-socials { position: static !important; }
  .song-card-inner { gap: 12px !important; }
  .song-number { font-size: 32px !important; }
  .song-waveform { display: none !important; }
  .deluxe-banner { flex-direction: column !important; gap: 12px !important; text-align: center; }
}
`;

function WaveformBar({ active, index, playing }) {
  const h = 10 + Math.sin(index * 1.7) * 7 + Math.cos(index * 0.9) * 5;
  return (
    <div style={{
      width: 2.5, height: `${h}px`, borderRadius: 2,
      background: active ? (playing ? C.gold : C.purple) : "#1A1816",
      transition: "background 0.3s",
      animation: active && playing ? `pulse ${0.4 + (index % 5) * 0.1}s ease-in-out infinite alternate` : "none",
    }} />
  );
}

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function SongCard({ song, isActive, isPlaying, onClick, index, progress, currentTime, duration }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: isActive ? "#14120F" : hov ? "#12100D" : C.cardBg,
        border: `1px solid ${isActive ? C.gold + "33" : C.border}`,
        borderRadius: 14, padding: "22px 26px", cursor: "pointer",
        transition: "all 0.4s cubic-bezier(.22,1,.36,1)",
        transform: hov && !isActive ? "translateY(-3px)" : "none",
        position: "relative", overflow: "hidden",
      }}>
      {isActive && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 0% 50%, ${C.gold}08 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, ${C.purple}06 0%, transparent 50%)`, pointerEvents: "none" }} />}
      <div className="song-card-inner" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div className="song-number" style={{ fontFamily: "'Cinzel', serif", fontSize: 42, fontWeight: 700, color: isActive ? C.gold : "#1A1816", lineHeight: 1, minWidth: 44, transition: "color 0.3s" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 600, letterSpacing: "0.08em", color: isActive ? C.cream : "#665E50", transition: "color 0.3s" }}>{song.title}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: isActive ? C.gold : "#3A352D", letterSpacing: "0.3em", marginTop: 3, transition: "color 0.3s" }}>{song.subtitle}</div>
        </div>
        <div className="song-waveform" style={{ display: "flex", gap: 2.5, alignItems: "center", height: 30 }}>
          {Array.from({ length: 18 }).map((_, i) => <WaveformBar key={i} active={isActive} index={i} playing={isPlaying} />)}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${isActive ? C.gold : "#1A1816"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 0.3s" }}>
          {isActive && isPlaying ? (
            <div style={{ display: "flex", gap: 3.5 }}>
              <div style={{ width: 3.5, height: 14, background: C.gold, borderRadius: 2 }} />
              <div style={{ width: 3.5, height: 14, background: C.gold, borderRadius: 2 }} />
            </div>
          ) : (
            <div style={{ width: 0, height: 0, borderLeft: `10px solid ${isActive ? C.gold : "#3A352D"}`, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", marginLeft: 2, transition: "border-color 0.3s" }} />
          )}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3A352D", minWidth: 36, textAlign: "right" }}>
          {isActive && currentTime > 0 ? formatTime(currentTime) : song.duration}
        </div>
      </div>
      {isActive && (
        <div style={{ marginTop: 12, marginLeft: 62, position: "relative" }}>
          <div style={{ height: 3, background: "#1A1816", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress || 0}%`, background: `linear-gradient(to right, ${C.gold}, ${C.purple})`, borderRadius: 2, transition: "width 0.3s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A352D" }}>{formatTime(currentTime)}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A352D" }}>{formatTime(duration)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeSong, setActiveSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const ct = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(ct);
      setDuration(dur);
      if (dur > 0) setProgress((ct / dur) * 100);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => { setIsPlaying(false); setProgress(0); setCurrentTime(0); });
    return () => { audio.removeEventListener("timeupdate", updateProgress); };
  }, [activeSong, updateProgress]);

  const handleSongClick = (id) => {
    if (activeSong === id) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play(); setIsPlaying(true); }
    } else {
      if (audioRef.current) audioRef.current.pause();
      setActiveSong(id);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  useEffect(() => {
    if (activeSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [activeSong]);

  const activeSongData = SONGS.find(s => s.id === activeSong);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.cream, fontFamily: "'Space Mono', monospace", position: "relative", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS_TEXT }} />
      {activeSongData && <audio ref={audioRef} src={activeSongData.audio} preload="auto" />}

      {/* Grain */}
      <div style={{ position: "fixed", inset: "-50%", width: "200%", height: "200%", background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`, animation: "grainAnim 8s steps(10) infinite", pointerEvents: "none", zIndex: 100 }} />

      {/* Ambient gradients */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "50%", height: "100%", background: `radial-gradient(ellipse at 20% 30%, ${C.gold}06 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "50%", height: "100%", background: `radial-gradient(ellipse at 80% 30%, ${C.purple}06 0%, transparent 60%)`, pointerEvents: "none" }} />

      {/* Header */}
      <div className="header-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 48px", borderBottom: `1px solid ${C.border}`, opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.2s", position: "relative", zIndex: 10 }}>
        <img src="/images/logo.png" alt="Way Raps" style={{ height: 48, width: "auto", objectFit: "contain" }} />
        <div className="header-socials" style={{ position: "absolute", right: 48, display: "flex", alignItems: "center", gap: 18 }}>
          {SOCIALS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} style={{ color: "#3A352D", transition: "color 0.3s", display: "flex" }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#3A352D"; }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path}/></svg>
            </a>
          ))}
        </div>
      </div>

      {/* Hero - Album Cover */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 24px 30px", position: "relative" }}>
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle, ${C.gold}10 0%, ${C.purple}08 40%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -55%)", animation: "glowPulse 5s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{
          width: 340, height: 340, borderRadius: 16, overflow: "hidden",
          border: `1px solid ${C.gold}22`,
          boxShadow: `0 30px 80px -20px rgba(0,0,0,0.8), 0 0 40px ${C.gold}08, 0 0 40px ${C.purple}06`,
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "all 1.2s cubic-bezier(.22,1,.36,1) 0.3s",
        }}>
          <img src="/images/gemini-cover.png" alt="Gemini" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </div>

      {/* Album Title */}
      <div style={{ textAlign: "center", padding: "10px 24px 0", opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.8s" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.5em", color: "#3A352D", textTransform: "uppercase", marginBottom: 12 }}>Way&apos;s Official Album</div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 700,
          letterSpacing: "0.2em", lineHeight: 1,
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 40%, ${C.purple} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>GEMINI</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.4em", color: C.gold, marginTop: 14, opacity: 0.6 }}>2026 · 11 TRACKS</div>
      </div>

      {/* Deluxe Edition banner */}
      <div style={{ maxWidth: 780, margin: "36px auto 0", padding: "0 24px", opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1s" }}>
        <a
          href="/gemini-deluxe"
          className="deluxe-banner"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", textDecoration: "none",
            background: "#0C0B09",
            border: `1px solid ${C.gold}2A`,
            borderRadius: 12, transition: "border-color 0.3s, background 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold + "55"; e.currentTarget.style.background = "#10100D"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.gold + "2A"; e.currentTarget.style.background = "#0C0B09"; }}
        >
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: "0.25em", color: C.gold, marginBottom: 4 }}>
              GEMINI DELUXE EDITION
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "#554E40" }}>
              21 TRACKS · LOSSLESS FLAC · PAY WHAT YOU WANT · DOWNLOAD INCLUDED
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: C.purple, border: `1px solid ${C.purpleDim}55`, padding: "3px 8px", borderRadius: 4 }}>
              EXCLUSIVE
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </a>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "44px auto 0", maxWidth: 300, opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1s" }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold}33)` }} />
        <div style={{ width: 4, height: 4, background: C.gold, borderRadius: "50%", opacity: 0.5 }} />
        <div style={{ width: 6, height: 6, border: `1px solid ${C.purple}44`, borderRadius: "50%", transform: "rotate(45deg)" }} />
        <div style={{ width: 4, height: 4, background: C.purple, borderRadius: "50%", opacity: 0.5 }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.purple}33)` }} />
      </div>

      {/* Songs */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "30px 0 28px", opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.1s" }}>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${C.border})` }} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.4em", color: "#3A352D", fontWeight: 600 }}>LISTEN</span>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${C.border})` }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SONGS.map((song, i) => (
            <div key={song.id} style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)", transition: `all 0.8s cubic-bezier(.22,1,.36,1) ${1.3 + i * 0.08}s` }}>
              <SongCard song={song} index={i} isActive={activeSong === song.id} isPlaying={activeSong === song.id && isPlaying} onClick={() => handleSongClick(song.id)} progress={activeSong === song.id ? progress : 0} currentTime={activeSong === song.id ? currentTime : 0} duration={activeSong === song.id ? duration : 0} />
            </div>
          ))}
        </div>

        {/* Streaming link */}
        <div style={{ textAlign: "center", marginTop: 40, opacity: loaded ? 1 : 0, transition: "opacity 1s ease 2.2s" }}>
          <a
            href="https://artists.landr.com/991043894223"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 24px", border: `1px solid ${C.border}`, borderRadius: 100,
              fontSize: 9, letterSpacing: "0.3em", color: "#3A352D", textDecoration: "none",
              transition: "border-color 0.3s, color 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold + "44"; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = "#3A352D"; }}
          >
            STREAM ON ALL PLATFORMS
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "36px 24px", opacity: loaded ? 1 : 0, transition: "opacity 1s ease 2.4s" }}>
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/images/logo.png" alt="" style={{ height: 24, width: "auto", objectFit: "contain", opacity: 0.3 }} />
            <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#2A2520" }}>WAYRAPS.COM</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} style={{ color: "#2A2520", transition: "color 0.3s", display: "flex" }}
                onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#2A2520"; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d={s.path}/></svg>
              </a>
            ))}
          </div>
          <a href="mailto:way@wayraps.com" style={{ fontSize: 10, letterSpacing: "0.15em", color: "#2A2520", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => { e.target.style.color = C.gold; }}
            onMouseLeave={e => { e.target.style.color = "#2A2520"; }}>
            way@wayraps.com
          </a>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 9, letterSpacing: "0.3em", color: "#1A1816" }}>&copy; 2026 WAY RAPS. ALL RIGHTS RESERVED.</div>
      </div>
    </div>
  );
}
