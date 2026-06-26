import { useState, useEffect, useRef, useCallback } from "react";
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// ─── Brand constants ────────────────────────────────────────────────────────
const C = {
  bg: "#080808", gold: "#C9A56E", goldLight: "#E0C68A",
  purple: "#7B5EA7", purpleDim: "#4A3670", cream: "#F0E8D8",
  cardBg: "#0F0E0D", border: "#1A1816",
};

// ─── PayPal config (Ways World LLC — REST API app "Way Raps Website") ────────
const PAYPAL_CLIENT_ID = "AXigwdcaFDkksJOs9snSdrgMsojZ-yhQsEs-MJwHumgXyj0nHvaN065K4q0nXwnn6cr61fahc1uSh9Wg";

// ─── TRACK LIST ─────────────────────────────────────────────────────────────
// Audio hosted on GitHub Releases — lossless FLAC, streamed directly.
const GH = "https://github.com/dreamteammarketing/wayraps2026/releases/download/gemini-deluxe-audio";

const SONGS = [
  // ── Standard Edition · on all streaming platforms ──────────────────────────
  { id: 1,  title: "On My Own",          duration: "3:49", disc: "standard", url: `${GH}/01_on_my_own.flac` },
  { id: 2,  title: "Swerv",              duration: "3:36", disc: "standard", url: `${GH}/02_swerv.flac` },
  { id: 3,  title: "Way's Birthday Song",duration: "3:49", disc: "standard", url: `${GH}/03_birthday_song.flac` },
  { id: 4,  title: "Young Niggas",       duration: "3:25", disc: "standard", url: `${GH}/06_young_niggas.flac` },
  { id: 5,  title: "FOD",                duration: "3:01", disc: "standard", url: `${GH}/09_fod.flac` },
  { id: 6,  title: "Wasting My Time",    duration: "3:25", disc: "standard", url: `${GH}/07_wasting_my_time.flac` },
  { id: 7,  title: "Dusá",              duration: "4:22", disc: "standard", url: `${GH}/11_dusa.flac` },
  { id: 8,  title: "Cars On The Moon",   duration: "3:26", disc: "standard", url: `${GH}/15_cars_on_the_moon.flac` },
  { id: 9,  title: "Down Cubed",         duration: "3:08", disc: "standard", url: `${GH}/14_down_cubed.flac` },
  { id: 10, title: "Happy On My Own",    duration: "3:50", disc: "standard", url: `${GH}/16_happy_on_my_own.flac` },
  { id: 11, title: "BGT",                duration: "2:58", disc: "standard", url: `${GH}/17_bgt.flac` },

  // ── Deluxe Bonus Tracks · exclusive to wayraps.com ─────────────────────────
  { id: 12, title: "Jets",               duration: "2:03", disc: "deluxe",   url: `${GH}/04_jets.flac` },
  { id: 13, title: "Too Far",            duration: "2:20", disc: "deluxe",   url: `${GH}/05_too_far.flac` },
  { id: 14, title: "Dance Girl",         duration: "2:39", disc: "deluxe",   url: `${GH}/08_dance_girl.flac` },
  { id: 15, title: "Mama's Day",         duration: "3:40", disc: "deluxe",   url: `${GH}/10_mamas_day.flac` },
  { id: 16, title: "4th Quarter",        duration: "4:08", disc: "deluxe",   url: `${GH}/12_4th_quarter.flac` },
  { id: 17, title: "Walk In",            duration: "2:04", disc: "deluxe",   url: `${GH}/13_walk_in.flac` },
  { id: 18, title: "Cucumber",           duration: "2:55", disc: "deluxe",   url: `${GH}/18_cucumber.flac` },
  { id: 19, title: "Hey",                duration: "3:29", disc: "deluxe",   url: `${GH}/19_hey.flac` },
  { id: 20, title: "No Versace",         duration: "1:36", disc: "deluxe",   url: `${GH}/20_no_versace.flac` },
  { id: 21, title: "The Last",           duration: "2:58", disc: "deluxe",   url: `${GH}/21_the_last.flac` },
];

const SOCIALS = [
  { label: "TikTok", url: "https://www.tiktok.com/@wayraps", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.87a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.3z" },
  { label: "Instagram", url: "https://www.instagram.com/wayraps", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { label: "Facebook", url: "https://www.facebook.com/wayraps", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "YouTube", url: "https://www.youtube.com/channel/UCQHV1Y5ar_xF6v-BMXZ5zbA", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
  @keyframes pulse { from{transform:scaleY(1)} to{transform:scaleY(1.6)} }
  @keyframes grainAnim { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 50%{transform:translate(-2%,6%)} 90%{transform:translate(-1%,2%)} }
  @keyframes glowPulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.04)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#080808; }
  ::selection { background:#7B5EA7; color:#F0E8D8; }
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:#080808; }
  ::-webkit-scrollbar-thumb { background:#2A2520; border-radius:3px; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
  input[type=number] { -moz-appearance:textfield; }
  .deluxe-fade { animation: fadeUp 0.7s ease both; }
  @media (max-width: 860px) {
    .deluxe-layout { flex-direction: column !important; }
    .deluxe-sidebar { position: static !important; width: 100% !important; max-width: 340px !important; margin: 0 auto; }
    .deluxe-header { padding: 16px 20px !important; }
    .deluxe-hero { padding: 36px 20px 28px !important; }
    .deluxe-content { padding: 0 16px 80px !important; }
    .deluxe-footer { padding: 28px 20px !important; flex-direction: column !important; gap: 16px !important; align-items: center !important; text-align: center; }
    .track-waveform { display: none !important; }
    .track-num { font-size: 28px !important; min-width: 32px !important; }
  }
`;

// ─── Shared helpers ──────────────────────────────────────────────────────────

function WaveformBar({ active, index, playing }) {
  const h = 10 + Math.sin(index * 1.7) * 7 + Math.cos(index * 0.9) * 5;
  return (
    <div style={{
      width: 2.5, height: `${h}px`, borderRadius: 2,
      background: active ? (playing ? C.gold : C.purple) : "#1A1816",
      transition: "background 0.3s",
      animation: active && playing
        ? `pulse ${0.4 + (index % 5) * 0.1}s ease-in-out infinite alternate`
        : "none",
    }} />
  );
}

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// ─── Track card ──────────────────────────────────────────────────────────────

function TrackCard({ song, globalIndex, isActive, isPlaying, unlocked, onClick, progress, currentTime, duration }) {
  const [hov, setHov] = useState(false);
  const isDeluxe = song.disc === "deluxe";
  const canPlay = unlocked;

  return (
    <div
      onClick={canPlay ? onClick : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isActive ? "#14120F" : hov && canPlay ? "#12100D" : C.cardBg,
        border: `1px solid ${isActive ? C.gold + "33" : isDeluxe ? C.purple + "18" : C.border}`,
        borderRadius: 12, padding: "16px 20px",
        cursor: canPlay ? "pointer" : "default",
        transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
        transform: hov && !isActive && canPlay ? "translateY(-2px)" : "none",
        position: "relative", overflow: "hidden",
        opacity: canPlay ? 1 : 0.65,
      }}
    >
      {isActive && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 0% 50%, ${C.gold}07 0%, transparent 55%),
                       radial-gradient(ellipse at 100% 50%, ${C.purple}05 0%, transparent 55%)`,
          pointerEvents: "none",
        }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Number */}
        <div className="track-num" style={{
          fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 700, lineHeight: 1,
          color: isActive ? C.gold : "#1A1816", minWidth: 38, transition: "color 0.3s",
        }}>
          {String(globalIndex + 1).padStart(2, "0")}
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600,
              letterSpacing: "0.07em", color: isActive ? C.cream : "#665E50",
              transition: "color 0.3s", whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {song.title}
            </div>
            {isDeluxe && (
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 7,
                letterSpacing: "0.2em", color: C.purpleDim,
                border: `1px solid ${C.purpleDim}55`, padding: "1px 5px", borderRadius: 3,
                flexShrink: 0,
              }}>
                DELUXE
              </span>
            )}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 8,
            color: isActive ? C.gold : "#3A352D",
            letterSpacing: "0.3em", marginTop: 3, transition: "color 0.3s",
          }}>
            BY WAY
          </div>
        </div>

        {/* Waveform */}
        <div className="track-waveform" style={{ display: "flex", gap: 2.5, alignItems: "center", height: 26 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <WaveformBar key={i} active={isActive} index={i} playing={isPlaying} />
          ))}
        </div>

        {/* Play / lock button */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: `1.5px solid ${isActive ? C.gold : canPlay ? "#1A1816" : "#232018"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "border-color 0.3s",
        }}>
          {!canPlay ? (
            <svg width="11" height="13" viewBox="0 0 12 15" fill="none">
              <rect x="1.5" y="6.5" width="9" height="8" rx="1.5" stroke="#2A2520" strokeWidth="1.3"/>
              <path d="M4 6.5V4.5a2 2 0 014 0v2" stroke="#2A2520" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="6" cy="10.5" r="1" fill="#2A2520"/>
            </svg>
          ) : isActive && isPlaying ? (
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ width: 3, height: 12, background: C.gold, borderRadius: 2 }} />
              <div style={{ width: 3, height: 12, background: C.gold, borderRadius: 2 }} />
            </div>
          ) : (
            <div style={{
              width: 0, height: 0, marginLeft: 2,
              borderLeft: `9px solid ${isActive ? C.gold : "#3A352D"}`,
              borderTop: "6px solid transparent", borderBottom: "6px solid transparent",
              transition: "border-color 0.3s",
            }} />
          )}
        </div>

        {/* Duration */}
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 10,
          color: "#3A352D", minWidth: 32, textAlign: "right",
        }}>
          {isActive && currentTime > 0 ? formatTime(currentTime) : song.duration}
        </div>
      </div>

      {/* Progress bar */}
      {isActive && canPlay && (
        <div style={{ marginTop: 10, marginLeft: 52 }}>
          <div style={{ height: 2, background: "#1A1816", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress || 0}%`,
              background: `linear-gradient(to right, ${C.gold}, ${C.purple})`,
              borderRadius: 2, transition: "width 0.25s linear",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A352D" }}>
              {formatTime(currentTime)}
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A352D" }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PayPal button inner (needs PayPalScriptProvider above it) ───────────────
// Uses Hosted Buttons — client ID is scoped to this integration type.
// To enable "customer sets own price", edit the hosted button in your PayPal
// Business account → Hosted Buttons → Edit → Pricing: Customer enters amount.

// Standard PayPalButtons — requires REST API client ID (not Hosted Button ID).
function PayPalButtonInner({ amount, onUnlock }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isRejected) return (
    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#554E40", padding: "10px 0" }}>
      PayPal failed to load. Check your connection and refresh.
    </div>
  );

  return (
    <div style={{ minHeight: 48 }}>
      {isPending && (
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: "0.2em",
          color: "#3A352D", textAlign: "center", padding: "14px 0", textTransform: "uppercase" }}>
          Loading PayPal…
        </div>
      )}
      <PayPalButtons
        forceReRender={[amount]}
        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 48 }}
        createOrder={(_data, actions) =>
          actions.order.create({
            purchase_units: [{
              amount: { value: String(Math.max(parseFloat(amount) || 1, 1).toFixed(2)), currency_code: "USD" },
              description: "Gemini Deluxe Edition – Way Raps",
            }],
          })
        }
        onApprove={(_data, actions) =>
          actions.order.capture().then(() => onUnlock())
        }
        onError={(err) => console.error("PayPal error:", err)}
      />
    </div>
  );
}

// ─── PWYW section ────────────────────────────────────────────────────────────

function PaywallSection({ amount, setAmount, onUnlock }) {
  const PRESETS = [1, 5, 10, 20];
  const [customVal, setCustomVal] = useState("");

  const handlePreset = (v) => { setAmount(v); setCustomVal(""); };
  const handleCustom = (e) => {
    const v = e.target.value;
    setCustomVal(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n >= 0) setAmount(n);
  };

  const isPreset = PRESETS.includes(amount);

  return (
    <div style={{
      background: "#0B0A08",
      border: `1px solid ${C.gold}2A`,
      borderRadius: 14, padding: "26px 24px", marginBottom: 22,
    }}>
      {/* Header */}
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: "0.35em", color: C.gold, marginBottom: 5 }}>
        SUPPORT THE ARTIST
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 10,
        color: "#554E40", letterSpacing: "0.08em", lineHeight: 1.75, marginBottom: 22,
      }}>
        Unlock all 21 lossless tracks + download in FLAC quality.<br/>
        Pay what feels right — 100% goes directly to Way.
      </div>

      {/* Preset buttons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            style={{
              background: (isPreset && amount === p) ? C.gold : "transparent",
              color: (isPreset && amount === p) ? C.bg : "#665E50",
              border: `1px solid ${(isPreset && amount === p) ? C.gold : "#2A2520"}`,
              borderRadius: 8, padding: "7px 18px", cursor: "pointer",
              fontFamily: "'Space Mono', monospace", fontSize: 12,
              transition: "all 0.2s",
            }}
          >
            ${p}
          </button>
        ))}
        {/* Custom amount */}
        <div style={{
          display: "flex", alignItems: "center",
          border: `1px solid ${!isPreset && amount > 0 ? C.gold : "#2A2520"}`,
          borderRadius: 8, overflow: "hidden",
        }}>
          <span style={{
            padding: "7px 10px", fontFamily: "'Space Mono', monospace",
            fontSize: 12, color: "#554E40", borderRight: "1px solid #2A2520",
            background: "transparent",
          }}>$</span>
          <input
            type="number" min="0" max="9999" placeholder="other"
            value={customVal}
            onChange={handleCustom}
            style={{
              background: "transparent", border: "none", outline: "none",
              fontFamily: "'Space Mono', monospace", fontSize: 12, color: C.cream,
              width: 64, padding: "7px 10px",
            }}
          />
        </div>
      </div>

      {/* Big amount display */}
      <div style={{
        fontFamily: "'Cinzel', serif", fontSize: 44, fontWeight: 700,
        color: C.gold, letterSpacing: "0.05em", lineHeight: 1, marginBottom: 22,
      }}>
        {amount === 0 ? "FREE" : `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`}
      </div>

      {/* Free option */}
      {amount === 0 ? (
        <button
          onClick={onUnlock}
          style={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.purple})`,
            color: C.bg, border: "none", borderRadius: 10,
            padding: "14px 28px", width: "100%",
            fontFamily: "'Space Mono', monospace", fontSize: 11,
            letterSpacing: "0.18em", fontWeight: 700, cursor: "pointer",
          }}
        >
          LISTEN FOR FREE →
        </button>
      ) : (
        /* Real PayPal checkout — auto-unlocks on payment capture */
        <PayPalButtonInner amount={amount} onUnlock={onUnlock} />
      )}

      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.18em",
        color: "#2A2520", marginTop: 12, textAlign: "center",
      }}>
        ENTER $0 TO LISTEN FREE · FLAC LOSSLESS · 21 TRACKS · UNLIMITED DOWNLOADS
      </div>
    </div>
  );
}

// ─── Unlock confirmation banner ───────────────────────────────────────────────

function ThankYouBanner() {
  return (
    <div style={{
      background: "#0B0A08",
      border: `1px solid ${C.gold}2A`,
      borderRadius: 14, padding: "20px 22px", marginBottom: 22,
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${C.gold}18, ${C.purple}18)`,
        border: `1px solid ${C.gold}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: "0.25em",
          color: C.gold, marginBottom: 5,
        }}>
          UNLOCKED — ALL 21 TRACKS
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.1em",
          color: "#665E50", lineHeight: 1.6,
        }}>
          Thank you for supporting Way. Streaming in lossless FLAC quality.
        </div>
      </div>
    </div>
  );
}

// ─── Download panel ──────────────────────────────────────────────────────────

function DownloadPanel({ songs }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginTop: 22 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "15px 20px", background: C.cardBg, border: "none",
          cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#665E50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em", color: "#665E50" }}>
            DOWNLOAD LOSSLESS FILES
          </span>
        </div>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="#3A352D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {open && (
        <div style={{ background: "#09080A" }}>
          {songs.map((song, i) => (
            <a
              key={song.id}
              href={song.url}
              download={`${String(i + 1).padStart(2, "0")}_Way_${song.title.replace(/\s+/g, "_")}.flac`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "10px 20px",
                textDecoration: "none", borderBottom: `1px solid ${C.border}`,
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#12100D"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A352D", minWidth: 22 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: "#665E50", flex: 1 }}>
                {song.title}
              </span>
              {song.disc === "deluxe" && (
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: "0.2em",
                  color: C.purpleDim, border: `1px solid ${C.purpleDim}44`,
                  padding: "1px 5px", borderRadius: 3,
                }}>
                  DELUXE
                </span>
              )}
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#3A352D", letterSpacing: "0.2em" }}>
                FLAC
              </span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="#3A352D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
          ))}
          <div style={{ padding: "14px 20px", fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.2em", color: "#2A2520" }}>
            LOSSLESS FLAC · 44.1 kHz · © 2026 WAY RAPS
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section divider ─────────────────────────────────────────────────────────

function Divider({ label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "6px 0 14px" }}>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${color}33)` }} />
      <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.4em", color: color + "88" }}>
        {label}
      </span>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${color}33)` }} />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

function GeminiDeluxe() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeSong, setActiveSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [donationAmount, setDonationAmount] = useState(5);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef(null);

  // ── Restore unlock state ────────────────────────────────────────────────────
  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
    if (sessionStorage.getItem("gemini_unlocked") === "true") setUnlocked(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("unlocked") === "true") {
      setUnlocked(true);
      sessionStorage.setItem("gemini_unlocked", "true");
    }
  }, []);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    sessionStorage.setItem("gemini_unlocked", "true");
  }, []);

  // ── Audio progress ──────────────────────────────────────────────────────────
  const updateProgress = useCallback(() => {
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(ct);
    setAudioDuration(dur);
    if (dur > 0) setProgress((ct / dur) * 100);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
      setIsPlaying(false); setProgress(0); setCurrentTime(0);
    });
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [activeSong, updateProgress]);

  // ── Song click ──────────────────────────────────────────────────────────────
  const handleSongClick = (id) => {
    if (!unlocked) return;
    if (activeSong === id) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play(); setIsPlaying(true); }
    } else {
      if (audioRef.current) audioRef.current.pause();
      setActiveSong(id); setIsPlaying(true); setProgress(0); setCurrentTime(0);
    }
  };

  useEffect(() => {
    if (activeSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [activeSong]);

  const activeSongData = SONGS.find(s => s.id === activeSong);

  const standardTracks = SONGS.filter(s => s.disc === "standard");
  const deluxeTracks = SONGS.filter(s => s.disc === "deluxe");

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.cream,
      fontFamily: "'Space Mono', monospace", position: "relative", overflow: "hidden",
    }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Audio element — loads lossless file */}
      {activeSongData && (
        <audio ref={audioRef} src={activeSongData.url} preload="auto" />
      )}

      {/* Grain */}
      <div style={{
        position: "fixed", inset: "-50%", width: "200%", height: "200%",
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        animation: "grainAnim 8s steps(10) infinite", pointerEvents: "none", zIndex: 100,
      }} />

      {/* Ambient glows */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "50%", height: "100%", background: `radial-gradient(ellipse at 20% 30%, ${C.gold}05 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "50%", height: "100%", background: `radial-gradient(ellipse at 80% 30%, ${C.purple}05 0%, transparent 60%)`, pointerEvents: "none" }} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="deluxe-header"
        style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 48px", borderBottom: `1px solid ${C.border}`,
          position: "relative", zIndex: 10,
          opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.1s",
        }}
      >
        {/* Back link */}
        <a
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#3A352D", transition: "color 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = "#3A352D"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.25em" }}>WAYRAPS.COM</span>
        </a>

        {/* Logo */}
        <img
          src="/images/logo.png" alt="Way Raps"
          style={{ height: 40, width: "auto", objectFit: "contain", position: "absolute", left: "50%", transform: "translateX(-50%)" }}
        />

        {/* Socials */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {SOCIALS.map(s => (
            <a
              key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              title={s.label} style={{ color: "#3A352D", transition: "color 0.3s", display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = "#3A352D"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={s.path}/></svg>
            </a>
          ))}
        </div>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div
        className="deluxe-hero"
        style={{
          textAlign: "center", padding: "52px 24px 36px",
          opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease 0.4s",
        }}
      >
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.5em", color: "#3A352D", marginBottom: 10 }}>
          GEMINI · THE COMPLETE EXPERIENCE
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif", fontSize: "clamp(28px, 5.5vw, 54px)",
          fontWeight: 700, letterSpacing: "0.2em", lineHeight: 1,
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 45%, ${C.purple} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          DELUXE EDITION
        </div>

        {/* Stat badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          {[["21", "TRACKS"], ["FLAC", "LOSSLESS"], ["44.1 kHz", "24-BIT"], ["∞", "DOWNLOADS"]].map(([a, b]) => (
            <div key={a} style={{
              border: `1px solid ${C.border}`, borderRadius: 100,
              padding: "5px 14px", display: "flex", alignItems: "center", gap: 7,
            }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold }}>{a}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 7, letterSpacing: "0.3em", color: "#3A352D" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────────── */}
      <div
        className="deluxe-content"
        style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 24px 100px",
          opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease 0.8s",
        }}
      >
        <div className="deluxe-layout" style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* ── Sidebar: album art ─────────────────────────────────────────── */}
          <div className="deluxe-sidebar" style={{ width: 290, flexShrink: 0, position: "sticky", top: 36 }}>
            <div style={{
              borderRadius: 12, overflow: "hidden",
              border: `1px solid ${C.gold}1A`,
              boxShadow: `0 24px 60px -12px rgba(0,0,0,0.85), 0 0 30px ${C.gold}06`,
              marginBottom: 18,
            }}>
              <img src="/images/gemini-cover.png" alt="Gemini Deluxe" style={{ width: "100%", display: "block" }} />
            </div>

            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.1em", color: C.cream, marginBottom: 3 }}>GEMINI</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.3em", color: "#3A352D", marginBottom: 14 }}>
              WAY · 2026 · DELUXE EDITION
            </div>

            {[
              "21 TRACKS · ~75 MIN",
              "LOSSLESS FLAC",
              "44.1 kHz / 24-BIT",
              "11 STREAMING + 10 EXCLUSIVE",
            ].map(line => (
              <div key={line} style={{
                fontFamily: "'Space Mono', monospace", fontSize: 8,
                letterSpacing: "0.2em", color: "#2A2520", marginBottom: 6,
              }}>
                {line}
              </div>
            ))}

            {/* Streaming links */}
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: "0.3em", color: "#3A352D", marginBottom: 12 }}>
                ALSO ON
              </div>
              <a
                href="https://artists.landr.com/991043894223"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "block", padding: "9px 14px",
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  textDecoration: "none", marginBottom: 6, transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.gold + "44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: "#554E40" }}>
                  ALL STREAMING PLATFORMS →
                </span>
              </a>
            </div>
          </div>

          {/* ── Track list ────────────────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* PWYW or thank-you */}
            {!unlocked ? (
              <PaywallSection
                amount={donationAmount}
                setAmount={setDonationAmount}
                onUnlock={handleUnlock}
              />
            ) : (
              <ThankYouBanner />
            )}

            {/* Standard tracks */}
            <Divider label="STANDARD EDITION" color={C.gold} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 24 }}>
              {standardTracks.map((song, i) => (
                <TrackCard
                  key={song.id} song={song} globalIndex={i}
                  isActive={activeSong === song.id}
                  isPlaying={activeSong === song.id && isPlaying}
                  unlocked={unlocked}
                  onClick={() => handleSongClick(song.id)}
                  progress={activeSong === song.id ? progress : 0}
                  currentTime={activeSong === song.id ? currentTime : 0}
                  duration={activeSong === song.id ? audioDuration : 0}
                />
              ))}
            </div>

            {/* Deluxe bonus tracks */}
            <Divider label="DELUXE BONUS TRACKS" color={C.purple} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {deluxeTracks.map((song, i) => (
                <TrackCard
                  key={song.id} song={song} globalIndex={i + standardTracks.length}
                  isActive={activeSong === song.id}
                  isPlaying={activeSong === song.id && isPlaying}
                  unlocked={unlocked}
                  onClick={() => handleSongClick(song.id)}
                  progress={activeSong === song.id ? progress : 0}
                  currentTime={activeSong === song.id ? currentTime : 0}
                  duration={activeSong === song.id ? audioDuration : 0}
                />
              ))}
            </div>

            {/* Download panel — only shows after unlock */}
            {unlocked && <DownloadPanel songs={SONGS} />}
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div
        className="deluxe-footer"
        style={{
          borderTop: `1px solid ${C.border}`, padding: "32px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease 1.2s",
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#2A2520" }}>WAYRAPS.COM</div>
        <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#1A1816" }}>© 2026 WAY RAPS. ALL RIGHTS RESERVED.</div>
        <a href="mailto:way@wayraps.com" style={{ fontSize: 9, letterSpacing: "0.2em", color: "#2A2520", textDecoration: "none" }}>
          way@wayraps.com
        </a>
      </div>
    </div>
  );
}

// ─── Root export — wraps in PayPal provider ───────────────────────────────────
export default function GeminiDeluxeRoot() {
  return (
    <PayPalScriptProvider options={{
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
    }}>
      <GeminiDeluxe />
    </PayPalScriptProvider>
  );
}
