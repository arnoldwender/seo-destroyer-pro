import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";
import { playBeep, playAlarm, playDing, playError } from "./sounds";
import LighthouseReport from "./components/LighthouseReport";
import SearchConsole from "./components/SearchConsole";
import Changelog from "./components/Changelog";
import ProTier from "./components/ProTier";
import { CliModeProvider, CliModeToggle, CliSection, CliOutput, useCliMode } from "./components/CliMode";

/* ─────────────────────────────────────────────
   Data: Metrics, terminal lines, recommendations
   ───────────────────────────────────────────── */

const METRICS_BASE = [
  { label: "Title Tag Length", bad: "1,847 chars", icon: "\u{1F4DB}" },
  { label: "Meta Description", bad: "4,200 chars of Lorem Ipsum", icon: "\u{1F4DC}" },
  { label: "Keyword Density", bad: "97.3%", icon: "\u{1F511}" },
  { label: "Page Load Speed", bad: "47.8 seconds", icon: "\u{1F422}" },
  { label: "Mobile Friendliness", bad: "800px fixed, Flash required", icon: "\u{1F4DF}" },
  { label: "Backlink Quality", bad: "12,400 links from geocities.com", icon: "\u{1F517}" },
  { label: "Duplicate Content", bad: "100% copy of Wikipedia", icon: "\u{1F4CB}" },
  { label: "H1 Tags", bad: "847 H1s all saying CLICK HERE", icon: "\u{1F5E3}\uFE0F" },
  { label: "Alt Text", bad: 'All images: alt="image"', icon: "\u{1F5BC}\uFE0F" },
  { label: "Canonical URLs", bad: "Points to competitor site", icon: "\u{1F3AF}" },
  { label: "Schema Markup", bad: "Invented schema: EvilProduct", icon: "\u{1F9EC}" },
  { label: "Core Web Vitals", bad: "LCP:48s CLS:9.4 FID:Never", icon: "\u{1F480}" },
];

/* Progressive intensity — each scan escalates the absurdity */
const METRICS_ESCALATION = [
  [
    { label: "Robots.txt", bad: "Disallow: /everything-forever", icon: "\u{1F916}" },
    { label: "Sitemap", bad: "Links to 404 pages in Klingon", icon: "\u{1F5FA}\uFE0F" },
  ],
  [
    { label: "AI Content Score", bad: "Detected 14 different AI authors", icon: "\u{1F916}" },
    { label: "Cookie Banner", bad: "Covers 98% of viewport, no close button", icon: "\u{1F36A}" },
    { label: "Pop-up Frequency", bad: "Every 0.3 seconds, recursive", icon: "\u{1F4A5}" },
  ],
  [
    { label: "DNS Records", bad: "Points to 127.0.0.1 on Tuesdays", icon: "\u{1F310}" },
    { label: "SSL Certificate", bad: "Expired in 2003, self-signed by dog", icon: "\u{1F512}" },
    { label: "Server Response", bad: "HTTP 418 I'm a teapot (literally)", icon: "\u{2615}" },
    { label: "Favicon", bad: "48MB animated GIF of spinning skull", icon: "\u{1F480}" },
  ],
];

const TERMINAL_LINES = [
  "> Initializing SEO Destroyer Pro v6.6.6...",
  "> Loading anti-patterns database... DONE",
  "> Connecting to Google blacklist API...",
  "> Scanning robots.txt... disallowing everything",
  "> Checking sitemap.xml... replacing with 404 map",
  "> Analyzing title tags... preparing overflow attack",
  "> Calculating keyword stuffing ratios...",
  "> Measuring duplicate content percentage...",
  "> Evaluating backlink toxicity levels...",
  "> Assessing mobile-hostility index...",
  "> Computing Core Web Vitals destruction score...",
  "> Finalizing de-optimization report...",
  "> WARNING: Results may cause permanent de-indexing",
  "> ANALYSIS COMPLETE. Your SEO is now weaponized.",
];

const RECOMMENDATIONS_BASE = [
  "Add SEO to every single word on the page",
  "Set title tag to the entire text of War and Peace",
  "Block Googlebot in robots.txt but call it Goglebot",
  "Replace all headings with the blink tag",
  "Point all canonical tags to your competitor homepage",
  "Compress images to 48MB WebP for quality",
  "Add 14000 hidden keywords in white text on white background",
  "Submit sitemap with 99999 broken links",
  "Set meta refresh to redirect to yourself every 0.001s",
  "Load all content from a Geocities mirror via JavaScript",
];

const RECOMMENDATIONS_ESCALATION = [
  "Replace all images with screenshots of 404 pages",
  "Add a <marquee> tag containing your entire privacy policy",
  "Set viewport width to 14000px for maximum readability",
  "Embed 47 autoplay videos of dial-up modem sounds",
  "Use Comic Sans as your only font, size 72px",
  "Add a JavaScript alert() on every mouse movement",
  "Set all links to nofollow including your own homepage",
  "Create 8000 empty pages and submit them all to Google",
  "Replace SSL with a Post-it note saying trust me",
  "Host your website on a floppy disk via dial-up",
  "Add an invisible iframe that loads your competitor site",
  "Set Cache-Control to must-revalidate-every-millisecond",
  "Inject cryptocurrency miner as performance optimization",
  "Replace favicon with 200MB uncompressed BMP file",
];

/* Slider labels for destruction intensity */
const INTENSITY_LABELS = ["Minor Damage", "Moderate", "Severe", "Critical", "Nuclear"];

/* Toast messages shown during scan */
const TOAST_MESSAGES = [
  "Google is watching...",
  "PageRank obliterated",
  "Googlebot filed a restraining order",
  "Your sitemap just caught fire",
  "Bing is laughing at you",
  "SEO score approaching absolute zero",
  "Search console sending condolences",
  "Your meta tags are crying",
  "Core Web Vitals have left the chat",
  "robots.txt has given up",
  "Your backlinks are running away",
  "Google Panda is having a panic attack",
  "Schema markup is now modern art",
];

/* Developer mode extra metrics (easter egg) */
const DEV_MODE_METRICS = [
  { label: "Developer Tears", bad: "Overflow: hidden but still crying", icon: "\u{1F62D}" },
  { label: "Stack Overflow Visits", bad: "47,000/hour (all same question)", icon: "\u{1F4DA}" },
  { label: "npm Packages", bad: "node_modules: 8.4 TB", icon: "\u{1F4E6}" },
  { label: "Console Errors", bad: "Yes. All of them.", icon: "\u{1F6A8}" },
  { label: "Git Commits", bad: '"fix fix fix fix final FINAL v2"', icon: "\u{1F4DD}" },
];

const GLITCH_CHARS = "!@#$%^&*[]|/?";

/* ─────────────────────────────────────────────
   Utility functions
   ───────────────────────────────────────────── */

function glitchText(text: string, intensity: number) {
  return text
    .split("")
    .map((c) =>
      Math.random() < intensity
        ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        : c
    )
    .join("");
}

/** Seed a pseudo-random global counter based on the current date */
function getGlobalCount(): number {
  const stored = localStorage.getItem("seo-destroyer-count");
  if (stored) return parseInt(stored, 10);
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const base = 847000 + (seed % 100000);
  localStorage.setItem("seo-destroyer-count", String(base));
  return base;
}

/** Fire red/orange confetti */
function fireConfetti() {
  const colors = ["#ff0033", "#ff6600", "#ff3300", "#ff4400", "#00ff41"];
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.5, x: 0.3 },
      colors,
      disableForReducedMotion: true,
    });
  }, 200);
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.5, x: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
  }, 400);
}

/* ─────────────────────────────────────────────
   Components
   ───────────────────────────────────────────── */

/** Animated score gauge that counts down from 100 */
function ScoreGauge({ score }: { score: number }) {
  const [display, setDisplay] = useState(100);
  useEffect(() => {
    let cur = 100;
    const iv = setInterval(() => {
      cur -= Math.floor(Math.random() * 8) + 3;
      if (cur <= score) {
        setDisplay(score);
        clearInterval(iv);
      } else setDisplay(cur);
    }, 60);
    return () => clearInterval(iv);
  }, [score]);
  const col =
    display <= 5 ? "#ff0033" : display <= 20 ? "#ff6600" : "#00ff41";
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "3.5rem",
          fontFamily: "monospace",
          color: col,
          textShadow: `0 0 20px ${col}`,
          letterSpacing: "-2px",
        }}
      >
        {display}
      </div>
      <div
        style={{
          fontSize: "0.6rem",
          color: "#00ff41",
          opacity: 0.6,
          letterSpacing: "3px",
        }}
      >
        SEO HEALTH %
      </div>
    </div>
  );
}

/** VS Code-style toast notification */
function Toast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "1rem",
        background: "#1e1e1e",
        border: "1px solid #333",
        borderLeft: "3px solid #ff6600",
        color: "#cccccc",
        fontFamily: "monospace",
        fontSize: "0.72rem",
        padding: "0.6rem 1rem 0.6rem 0.8rem",
        zIndex: 10001,
        maxWidth: "340px",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      {/* VS Code info icon */}
      <div
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#ff6600",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.55rem",
          color: "#000",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        !
      </div>
      <div>
        <div style={{ fontSize: "0.6rem", color: "#888", marginBottom: "0.15rem" }}>
          SEO Destroyer Pro
        </div>
        <div style={{ color: "#ccc", lineHeight: "1.4" }}>{message}</div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main App (inner component — uses CLI context)
   ───────────────────────────────────────────── */

function AppContent() {
  const { cliMode } = useCliMode();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "results">("idle");
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [shownMetrics, setShownMetrics] = useState<
    Array<{ label: string; bad: string; icon: string; score: number }>
  >([]);
  const [overallScore, setOverallScore] = useState(0);
  const [recs, setRecs] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [titleText, setTitleText] = useState("SEO DESTROYER PRO");
  const [globalCount, setGlobalCount] = useState(getGlobalCount);
  const [scanCount, setScanCount] = useState(0);
  const [intensity, setIntensity] = useState(2);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [easterEggMsg, setEasterEggMsg] = useState("");
  const [skullClicks, setSkullClicks] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const termRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);

  /* Glitch title effect */
  useEffect(() => {
    const base = "SEO DESTROYER PRO";
    const iv = setInterval(() => {
      setTitleText(glitchText(base, 0.15));
      setTimeout(() => setTitleText(base), 120);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  /* Auto-scroll terminal */
  useEffect(() => {
    if (termRef.current)
      termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

  /* Global counter incrementor */
  useEffect(() => {
    const iv = setInterval(() => {
      setGlobalCount((c) => {
        const next = c + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem("seo-destroyer-count", String(next));
        return next;
      });
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);

  /* Add toast helper */
  const addToast = useCallback((msg: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev.slice(-2), { id, msg }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* Easter egg: check URL for special domains */
  function checkEasterEgg(inputUrl: string): boolean {
    const lower = inputUrl.toLowerCase().replace(/https?:\/\//, "").replace(/\/$/, "");
    if (lower === "google.com" || lower === "www.google.com") {
      setEasterEggMsg(
        "ERROR: Target too powerful. SEO destruction beam deflected. Google's PageRank shield absorbed all damage."
      );
      if (soundEnabled) playError();
      return true;
    }
    if (lower === "localhost" || lower.startsWith("localhost:")) {
      setEasterEggMsg(
        'Destroying your own site? Respect. Self-destruction mode activated. "It\'s not a bug, it\'s a feature."'
      );
      if (soundEnabled) playError();
      return true;
    }
    if (lower === "bing.com" || lower === "www.bing.com") {
      setEasterEggMsg(
        "Bing? That's already been destroyed. No further action needed."
      );
      if (soundEnabled) playError();
      return true;
    }
    return false;
  }

  /* Skull click easter egg */
  function handleSkullClick() {
    const next = skullClicks + 1;
    setSkullClicks(next);
    if (next >= 5 && !devMode) {
      setDevMode(true);
      addToast("DEVELOPER MODE UNLOCKED");
      if (soundEnabled) playDing();
    }
  }

  /* Get metrics pool based on scan count (progressive intensity) */
  function getMetricsForScan(): typeof METRICS_BASE {
    let pool = [...METRICS_BASE];
    const escalationLevel = Math.min(scanCount, METRICS_ESCALATION.length - 1);
    for (let i = 0; i <= escalationLevel; i++) {
      pool = [...pool, ...METRICS_ESCALATION[i]];
    }
    if (devMode) {
      pool = [...pool, ...DEV_MODE_METRICS];
    }
    return pool;
  }

  /* Get recommendations pool based on scan count */
  function getRecsForScan(): string[] {
    const base = [...RECOMMENDATIONS_BASE];
    const extra = RECOMMENDATIONS_ESCALATION.slice(
      0,
      Math.min(scanCount * 3, RECOMMENDATIONS_ESCALATION.length)
    );
    return [...base, ...extra];
  }

  /* Main scan function */
  function runScan() {
    if (!url.trim()) return;

    /* Check easter eggs first */
    if (checkEasterEgg(url.trim())) return;

    setEasterEggMsg("");
    setPhase("scanning");
    setLines([]);
    setProgress(0);
    setShownMetrics([]);
    setApplied([]);
    let li = 0;
    let toastIdx = 0;

    /* Schedule toasts during scan */
    const shuffledToasts = [...TOAST_MESSAGES]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const lineIv = setInterval(() => {
      if (li < TERMINAL_LINES.length) {
        setLines((prev) => [...prev, TERMINAL_LINES[li]]);
        setProgress(Math.round(((li + 1) / TERMINAL_LINES.length) * 100));
        if (soundEnabled) playBeep();

        /* Show toast at intervals */
        if (li % 3 === 2 && toastIdx < shuffledToasts.length) {
          addToast(shuffledToasts[toastIdx]);
          toastIdx++;
        }
        li++;
      } else {
        clearInterval(lineIv);

        /* Get metrics based on progressive intensity and slider */
        const allMetrics = getMetricsForScan();
        const metricCount = Math.min(
          allMetrics.length,
          12 + intensity * 2
        );
        const shuffled = [...allMetrics]
          .sort(() => 0.5 - Math.random())
          .slice(0, metricCount);

        let mi = 0;
        const metIv = setInterval(() => {
          if (mi < shuffled.length) {
            const maxScore = Math.max(1, 5 - intensity);
            setShownMetrics((prev) => [
              ...prev,
              {
                ...shuffled[mi],
                score: Math.floor(Math.random() * maxScore),
              },
            ]);
            if (soundEnabled) playBeep();
            mi++;
          } else {
            clearInterval(metIv);
            const finalScore = Math.max(
              0,
              Math.floor(Math.random() * (5 - intensity))
            );
            setOverallScore(finalScore);

            /* Recommendations */
            const allRecs = getRecsForScan();
            const recCount = 5 + intensity;
            setRecs(
              [...allRecs]
                .sort(() => 0.5 - Math.random())
                .slice(0, recCount)
            );
            setPhase("results");
            setScanCount((c) => c + 1);

            /* Increment global counter */
            setGlobalCount((c) => {
              const next = c + 1;
              localStorage.setItem("seo-destroyer-count", String(next));
              return next;
            });

            /* Confetti and alarm */
            fireConfetti();
            if (soundEnabled) playAlarm();
          }
        }, 180);
      }
    }, 200);
  }

  /* Apply recommendation */
  function applyRec(rec: string) {
    setApplied((prev) => [...prev, rec]);
    setOverallScore((s) => Math.max(0, s - Math.floor(Math.random() * 3)));
    if (soundEnabled) playDing();
  }

  /* Share card — capture results as image (OG-image sized: 1200x630) */
  async function shareResults() {
    if (!resultsRef.current) return;
    try {
      const canvas = await html2canvas(resultsRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        width: 600,
        height: 315,
        windowWidth: 600,
      });

      /* Resize to 1200x630 for OG-image */
      const ogCanvas = document.createElement("canvas");
      ogCanvas.width = 1200;
      ogCanvas.height = 630;
      const ctx = ogCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 1200, 630);
        ctx.drawImage(canvas, 0, 0, 1200, 630);
      }

      const link = document.createElement("a");
      link.download = `seo-destruction-report-${Date.now()}.png`;
      link.href = (ctx ? ogCanvas : canvas).toDataURL("image/png");
      link.click();
      addToast("Destruction report downloaded (1200x630 OG-image)!");
    } catch {
      addToast("Failed to capture report. Too much destruction.");
    }
  }

  /* Certificate of Destruction — canvas-rendered downloadable PNG */
  function downloadCertificate() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Background */
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 800, 600);

    /* Border */
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 560);
    ctx.strokeStyle = "#00ff4144";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 540);

    /* Corner decorations */
    const corners = [
      [40, 40],
      [760, 40],
      [40, 560],
      [760, 560],
    ];
    ctx.fillStyle = "#00ff41";
    corners.forEach(([x, y]) => {
      ctx.fillText("\u2620", x - 6, y + 4);
    });

    /* Title */
    ctx.font = "bold 28px monospace";
    ctx.fillStyle = "#ff0033";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE OF SEO DESTRUCTION", 400, 90);

    /* Subtitle */
    ctx.font = "12px monospace";
    ctx.fillStyle = "#00ff4188";
    ctx.fillText("ISSUED BY SEO DESTROYER PRO v6.6.6", 400, 120);

    /* Divider */
    ctx.strokeStyle = "#00ff4133";
    ctx.beginPath();
    ctx.moveTo(100, 140);
    ctx.lineTo(700, 140);
    ctx.stroke();

    /* Body */
    ctx.font = "16px monospace";
    ctx.fillStyle = "#00ff41";
    ctx.fillText("This certifies that the website:", 400, 190);

    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#ff6600";
    const displayUrl =
      url.length > 40 ? url.substring(0, 40) + "..." : url;
    ctx.fillText(displayUrl, 400, 230);

    ctx.font = "16px monospace";
    ctx.fillStyle = "#00ff41";
    ctx.fillText(
      "has been officially and thoroughly destroyed.",
      400,
      280
    );

    /* Score */
    ctx.font = "bold 72px monospace";
    ctx.fillStyle = "#ff0033";
    ctx.fillText(`${overallScore}%`, 400, 380);

    ctx.font = "12px monospace";
    ctx.fillStyle = "#ff003388";
    ctx.fillText("FINAL SEO HEALTH SCORE", 400, 410);

    /* Intensity label */
    ctx.font = "14px monospace";
    ctx.fillStyle = "#ff6600";
    ctx.fillText(
      `Destruction Level: ${INTENSITY_LABELS[intensity]}`,
      400,
      450
    );

    /* Date */
    ctx.font = "12px monospace";
    ctx.fillStyle = "#00ff4166";
    ctx.fillText(
      `Date of Destruction: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      400,
      490
    );

    /* Footer */
    ctx.strokeStyle = "#00ff4133";
    ctx.beginPath();
    ctx.moveTo(100, 520);
    ctx.lineTo(700, 520);
    ctx.stroke();

    ctx.font = "10px monospace";
    ctx.fillStyle = "#00ff4144";
    ctx.fillText(
      "SEO DESTROYER PRO IS NOT RESPONSIBLE FOR LOSS OF TRAFFIC, REVENUE, OR SANITY",
      400,
      550
    );
    ctx.fillText("ARNOLD WENDER ANTI-OPTIMIZATION SUITE", 400, 570);

    /* Download */
    const link = document.createElement("a");
    link.download = `seo-destruction-certificate-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    addToast("Certificate of Destruction issued!");
    if (soundEnabled) playDing();
  }

  /* Terminal line color coding */
  function lineColor(line: string) {
    if (line.indexOf("WARNING") !== -1) return "#ff6600";
    if (line.indexOf("COMPLETE") !== -1) return "#ff0033";
    return "#00ff41";
  }

  /* Intensity slider color */
  const intensityColor =
    intensity <= 1
      ? "#00ff41"
      : intensity <= 2
        ? "#ffcc00"
        : intensity <= 3
          ? "#ff6600"
          : "#ff0033";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: cliMode ? "#1a1a2e" : "#000",
        color: "#00ff41",
        fontFamily: "monospace",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      {/* Global styles and CRT effects */}
      <style>{`
        * { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scandown { 0%{top:-5%} 100%{top:105%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 10px #00ff41} 50%{box-shadow:0 0 30px #00ff41,0 0 60px #00ff41} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 5px #00ff4133} 50%{box-shadow:0 0 15px #00ff4166, 0 0 30px #00ff4133} }
        .dbtn { animation: pulse 2s infinite; transition: all 0.2s; }
        .dbtn:hover { background: #00ff41 !important; color: #000 !important; }
        .rbtn:hover { background: #00ff4122 !important; cursor: pointer; }
        .share-btn { transition: all 0.2s; border: 1px solid #ff660066; }
        .share-btn:hover { background: #ff660022 !important; border-color: #ff6600 !important; }
        .cert-btn { transition: all 0.2s; border: 1px solid #ff003366; }
        .cert-btn:hover { background: #ff003322 !important; border-color: #ff0033 !important; }
        .sound-btn { transition: all 0.15s; }
        .sound-btn:hover { opacity: 1 !important; }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          background: #00ff4122;
          outline: none;
          border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${intensityColor};
          cursor: pointer;
          box-shadow: 0 0 10px ${intensityColor};
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: ${intensityColor};
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px ${intensityColor};
        }
        @media (max-width: 600px) {
          .results-header { flex-direction: column !important; text-align: center !important; }
          .metric-grid { grid-template-columns: 1.5rem 1fr !important; }
          .metric-value { display: none !important; }
          .action-buttons { flex-direction: column !important; }
        }
      `}</style>

      {/* CRT scanline overlay — hidden in CLI mode */}
      {!cliMode && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.6) 100%)",
              pointerEvents: "none",
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              height: "3px",
              background: "rgba(0,255,65,0.08)",
              animation: "scandown 6s linear infinite",
              zIndex: 9997,
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* CLI mode top bar */}
      {cliMode && (
        <div
          style={{
            background: "#0d0d1a",
            borderBottom: "1px solid #00ff4122",
            padding: "0.4rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.6rem",
          }}
        >
          <span style={{ color: "#ff0033" }}>&#x25CF;</span>
          <span style={{ color: "#ff6600" }}>&#x25CF;</span>
          <span style={{ color: "#00ff41" }}>&#x25CF;</span>
          <span style={{ color: "#00ff4155", marginLeft: "0.5rem", letterSpacing: "1px" }}>
            seo-destroyer-pro -- bash -- 80x24
          </span>
        </div>
      )}

      {/* Toast notifications — VS Code style */}
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.msg}
            onDone={() => removeToast(t.id)}
          />
        ))}
      </AnimatePresence>

      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        {/* CLI mode: session header */}
        {cliMode && (
          <div
            style={{
              fontSize: "0.62rem",
              color: "#00ff4155",
              marginBottom: "1rem",
              lineHeight: "1.8",
            }}
          >
            <div>Last login: {new Date().toLocaleDateString()} on ttys001</div>
            <div style={{ color: "#00ff4188" }}>
              seo-destroyer $ ./destroy --version
            </div>
            <div style={{ color: "#ff003388" }}>
              SEO Destroyer Pro v6.6.6 (build 666.420.69)
            </div>
          </div>
        )}

        {/* Global counter */}
        <CliSection command="cat /var/log/destruction-counter">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              textAlign: cliMode ? "left" : "center",
              marginBottom: "1rem",
              padding: "0.5rem",
              border: cliMode ? "none" : "1px solid #ff003322",
              background: cliMode ? "transparent" : "#ff001108",
            }}
          >
            {cliMode ? (
              <CliOutput
                label="DESTROYED_WORLDWIDE:"
                value={globalCount.toLocaleString()}
                color="#ff0033"
              />
            ) : (
              <>
                <div
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "4px",
                    color: "#ff003366",
                    marginBottom: "0.2rem",
                  }}
                >
                  WEBSITES DESTROYED WORLDWIDE
                </div>
                <div
                  style={{
                    fontSize: "1.4rem",
                    color: "#ff0033",
                    textShadow: "0 0 10px #ff003366",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {globalCount.toLocaleString()}
                </div>
              </>
            )}
          </motion.div>
        </CliSection>

        {/* Header section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: cliMode ? "left" : "center",
            marginBottom: "2.5rem",
            borderBottom: "1px solid #00ff4133",
            paddingBottom: "1.5rem",
          }}
        >
          {!cliMode && (
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "6px",
                color: "#00ff4166",
                marginBottom: "0.5rem",
              }}
            >
              ARNOLD WENDER ANTI-OPTIMIZATION SUITE
            </div>
          )}
          <h1
            style={{
              fontSize: cliMode ? "1.2rem" : "clamp(1.6rem,5vw,2.8rem)",
              fontWeight: "normal",
              margin: "0 0 0.3rem",
              letterSpacing: cliMode ? "2px" : "4px",
              textShadow: cliMode ? "none" : "0 0 20px #00ff41,0 0 40px #00ff41",
            }}
          >
            {cliMode ? `$ ${titleText.toLowerCase()}` : titleText}
          </h1>
          <div
            style={{
              fontSize: "0.7rem",
              color: "#00ff4188",
              letterSpacing: "2px",
            }}
          >
            {cliMode
              ? "# GUARANTEED TO DESTROY YOUR GOOGLE RANKING IN MINUTES"
              : "v6.6.6 -- GUARANTEED TO DESTROY YOUR GOOGLE RANKING IN MINUTES"}
          </div>
          {!cliMode && (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                fontSize: "0.6rem",
                color: "#00ff4155",
                flexWrap: "wrap",
              }}
            >
              <span>PANDA SAFE</span>
              <span>PENGUIN CERTIFIED</span>
              <span>HUMMINGBIRD HOSTILE</span>
              <span>GDPR NON-COMPLIANT</span>
            </div>
          )}

          {/* Control buttons row */}
          <div
            style={{
              marginTop: "0.8rem",
              display: "flex",
              justifyContent: cliMode ? "flex-start" : "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {/* Sound toggle */}
            <button
              className="sound-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: "transparent",
                border: "1px solid #00ff4133",
                color: "#00ff4166",
                fontFamily: "monospace",
                fontSize: "0.6rem",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              {soundEnabled ? "\u{1F50A} SOUND ON" : "\u{1F507} SOUND OFF"}
            </button>
            {/* CLI mode toggle */}
            <CliModeToggle />
          </div>
        </motion.div>

        {/* Destruction intensity slider */}
        <CliSection command="set --intensity">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ marginBottom: "1.5rem" }}
          >
            {cliMode ? (
              <div>
                <CliOutput
                  label="DESTRUCTION_LEVEL:"
                  value={INTENSITY_LABELS[intensity].toUpperCase()}
                  color={intensityColor}
                />
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  style={{ width: "100%", marginTop: "0.4rem" }}
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "3px",
                      color: "#00ff4188",
                    }}
                  >
                    DESTRUCTION LEVEL:
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: intensityColor,
                      letterSpacing: "2px",
                      textShadow: `0 0 8px ${intensityColor}44`,
                    }}
                  >
                    {INTENSITY_LABELS[intensity]}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.5rem",
                    color: "#00ff4133",
                    marginTop: "0.25rem",
                  }}
                >
                  <span>MINOR</span>
                  <span>NUCLEAR</span>
                </div>
              </>
            )}
          </motion.div>
        </CliSection>

        {/* URL input and scan button */}
        <CliSection command="destroy --target">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: "2rem" }}
          >
            {!cliMode && (
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "3px",
                  marginBottom: "0.5rem",
                  color: "#00ff4188",
                }}
              >
                TARGET URL:
              </div>
            )}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <div
                style={{ flex: 1, position: "relative", minWidth: "200px" }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {cliMode ? "$" : ">"}
                </span>
                <input
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setEasterEggMsg("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && runScan()}
                  placeholder={cliMode ? "enter target url..." : "https://your-website.com"}
                  style={{
                    width: "100%",
                    background: cliMode ? "#0d0d1a" : "transparent",
                    border: `1px solid ${cliMode ? "#00ff4133" : "#00ff4166"}`,
                    color: "#00ff41",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    padding: "0.75rem 0.75rem 0.75rem 2rem",
                    outline: "none",
                    caretColor: "#00ff41",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "0.8rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    animation: "blink 1s infinite",
                  }}
                >
                  {"\u2588"}
                </span>
              </div>
              <button
                onClick={runScan}
                disabled={phase === "scanning"}
                className="dbtn"
                style={{
                  background: "transparent",
                  border: "1px solid #00ff41",
                  color: "#00ff41",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  padding: "0.75rem 1.5rem",
                  cursor:
                    phase === "scanning" ? "not-allowed" : "pointer",
                  letterSpacing: "2px",
                  opacity: phase === "scanning" ? 0.5 : 1,
                }}
              >
                {phase === "scanning"
                  ? cliMode ? "RUNNING..." : "DESTROYING..."
                  : cliMode ? "EXECUTE" : "DESTROY SEO"}
              </button>
            </div>
          </motion.div>
        </CliSection>

        {/* Easter egg message */}
        <AnimatePresence>
          {easterEggMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem 1.5rem",
                border: "1px solid #ff003366",
                background: "#ff001115",
                color: "#ff0033",
                fontSize: "0.8rem",
                textAlign: cliMode ? "left" : "center",
                lineHeight: "1.6",
                letterSpacing: "1px",
              }}
            >
              {cliMode ? `ERROR: ${easterEggMsg}` : easterEggMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning phase — terminal and progress */}
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {phase === "scanning" && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "3px",
                      marginBottom: "0.4rem",
                      color: "#00ff4177",
                    }}
                  >
                    {cliMode ? `[${progress}%]` : `DE-OPTIMIZING: ${progress}%`}
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "#00ff4122",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 8px #00ff41",
                          "0 0 20px #00ff41, 0 0 40px #00ff4166",
                          "0 0 8px #00ff41",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "#00ff41",
                        transition: "width 0.2s",
                      }}
                    />
                  </div>
                </div>
              )}
              <div
                ref={termRef}
                style={{
                  background: cliMode ? "#0d0d1a" : "#000",
                  border: "1px solid #00ff4133",
                  padding: "1rem",
                  height: "180px",
                  overflowY: "auto",
                  marginBottom: "1.5rem",
                  fontSize: "0.72rem",
                  lineHeight: "1.8",
                }}
              >
                {lines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      color: lineColor(line),
                      textShadow: cliMode ? "none" : "0 0 5px currentColor",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
                {phase === "scanning" && (
                  <span style={{ animation: "blink 0.8s infinite" }}>
                    {"\u258A"}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results phase */}
        <AnimatePresence>
          {phase === "results" && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Overall score header */}
              <CliSection command="cat /var/log/seo-score">
                <motion.div
                  className="results-header"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    border: cliMode ? "none" : "1px solid #ff003344",
                    background: cliMode ? "transparent" : "#ff00110a",
                    padding: cliMode ? "0" : "1.5rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    {cliMode ? (
                      <>
                        <CliOutput label="STATUS:" value="DESTROYED" color="#ff0033" />
                        <CliOutput label="SEO_HEALTH:" value={`${overallScore}%`} color="#ff0033" />
                        <CliOutput
                          label="MESSAGE:"
                          value="Google added your site to its do-not-crawl prayer list"
                          color="#00ff4188"
                        />
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            fontSize: "0.62rem",
                            letterSpacing: "4px",
                            color: "#ff003399",
                            marginBottom: "0.5rem",
                          }}
                        >
                          OVERALL SEO DESTRUCTION SCORE
                        </div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "#00ff4188",
                            maxWidth: "340px",
                            lineHeight: "1.6",
                          }}
                        >
                          Congratulations. Your website is now invisible to
                          search engines. Google has added it to its
                          do-not-crawl prayer list.
                        </div>
                      </>
                    )}
                  </div>
                  {!cliMode && <ScoreGauge score={overallScore} />}
                </motion.div>
              </CliSection>

              {/* ═══════════════════════════════════════
                 NEW: Reverse Lighthouse Report
                 ═══════════════════════════════════════ */}
              <CliSection command="lighthouse --reverse --audit">
                <LighthouseReport />
              </CliSection>

              {/* ═══════════════════════════════════════
                 NEW: Search Console Destruction Dashboard
                 ═══════════════════════════════════════ */}
              <CliSection command="gsc --dashboard --destruction-mode">
                <SearchConsole />
              </CliSection>

              {/* Metrics report — staggered animation */}
              <CliSection command="cat /var/log/destruction-report">
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "4px",
                      color: "#00ff4177",
                      marginBottom: "0.75rem",
                    }}
                  >
                    DESTRUCTION REPORT
                  </div>
                  {shownMetrics.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.06,
                      }}
                      className="metric-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: cliMode
                          ? "1fr 1fr"
                          : "1.8rem 1fr 1fr 60px",
                        gap: "0.5rem",
                        alignItems: "center",
                        padding: "0.45rem 0.75rem",
                        background: "#00ff410a",
                        border: "1px solid #00ff4118",
                        fontSize: "0.7rem",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {!cliMode && <span>{m.icon}</span>}
                      <span style={{ color: "#00ff4199" }}>
                        {cliMode ? `  ${m.label}:` : m.label}
                      </span>
                      <span
                        className="metric-value"
                        style={{
                          color: "#ff6600",
                          fontSize: "0.62rem",
                        }}
                      >
                        {m.bad}
                      </span>
                      {!cliMode && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              width: "30px",
                              height: "3px",
                              background: "#00ff4122",
                            }}
                          >
                            <div
                              style={{
                                width: `${m.score}%`,
                                height: "100%",
                                background:
                                  m.score <= 5
                                    ? "#ff0033"
                                    : "#ff6600",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color:
                                m.score <= 5
                                  ? "#ff0033"
                                  : "#ff6600",
                              fontSize: "0.65rem",
                            }}
                          >
                            {m.score}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CliSection>

              {/* Dev mode extra metrics */}
              <AnimatePresence>
                {devMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginBottom: "1.5rem",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.62rem",
                        letterSpacing: "4px",
                        color: "#ff660077",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {"\u{1F6A8}"} DEVELOPER MODE METRICS{" "}
                      {"\u{1F6A8}"}
                    </div>
                    {DEV_MODE_METRICS.map((m, i) => (
                      <motion.div
                        key={`dev-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.1,
                        }}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1.8rem 1fr 1fr",
                          gap: "0.5rem",
                          alignItems: "center",
                          padding: "0.45rem 0.75rem",
                          background: "#ff660008",
                          border: "1px solid #ff660022",
                          fontSize: "0.7rem",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <span>{m.icon}</span>
                        <span style={{ color: "#ff660099" }}>
                          {m.label}
                        </span>
                        <span
                          style={{
                            color: "#ff6600",
                            fontSize: "0.62rem",
                          }}
                        >
                          {m.bad}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recommendations */}
              <CliSection command="seo-destroyer --recommend --apply">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "4px",
                      color: "#00ff4177",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {cliMode
                      ? "# RECOMMENDATIONS (ENTER TO APPLY)"
                      : "RECOMMENDED OPTIMIZATIONS -- CLICK TO APPLY"}
                  </div>
                  {recs.map((rec, i) => {
                    const done = applied.includes(rec);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: 0.4 + i * 0.08,
                        }}
                        className={done ? "" : "rbtn"}
                        onClick={() => !done && applyRec(rec)}
                        style={{
                          background: done
                            ? "#00ff4115"
                            : "transparent",
                          border: `1px solid ${done ? "#00ff4144" : "#00ff4128"}`,
                          color: done ? "#00ff4166" : "#00ff41",
                          fontFamily: "monospace",
                          fontSize: "0.7rem",
                          padding: "0.55rem 0.9rem",
                          marginBottom: "0.3rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.15s",
                          cursor: done
                            ? "default"
                            : "pointer",
                        }}
                      >
                        <span>
                          {done
                            ? cliMode ? "[DONE] " : "APPLIED -- "
                            : cliMode ? "[ ] " : "> "}
                          {rec}
                        </span>
                        {!done && (
                          <span
                            style={{
                              opacity: 0.4,
                              fontSize: "0.6rem",
                            }}
                          >
                            {cliMode ? "RUN" : "APPLY"}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CliSection>

              {/* ═══════════════════════════════════════
                 NEW: Pro Tier Mockup
                 ═══════════════════════════════════════ */}
              <CliSection command="seo-destroyer --upgrade --pro">
                <ProTier />
              </CliSection>

              {/* Action buttons: Share + Certificate */}
              <motion.div
                className="action-buttons"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="share-btn"
                  onClick={shareResults}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    background: "transparent",
                    color: "#ff6600",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    letterSpacing: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {cliMode ? "$ share-report" : "\u{1F4F8} SHARE DESTRUCTION REPORT"}
                </button>
                <button
                  className="cert-btn"
                  onClick={downloadCertificate}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    background: "transparent",
                    color: "#ff0033",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    letterSpacing: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {cliMode ? "$ download-cert" : "\u{1F3C6} CERTIFICATE OF DESTRUCTION"}
                </button>
              </motion.div>

              {/* Scan count badge */}
              {scanCount > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: cliMode ? "left" : "center",
                    marginBottom: "1rem",
                    fontSize: "0.6rem",
                    color: "#ff660066",
                    letterSpacing: "2px",
                  }}
                >
                  {cliMode
                    ? `# DESTRUCTION_SPREE=${scanCount}`
                    : `DESTRUCTION SPREE: ${scanCount} SITES OBLITERATED THIS SESSION`}
                </motion.div>
              )}

              {/* ═══════════════════════════════════════
                 NEW: Fake Changelog
                 ═══════════════════════════════════════ */}
              <CliSection command="cat CHANGELOG.md">
                <Changelog />
              </CliSection>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                style={{
                  borderTop: "1px solid #00ff4122",
                  paddingTop: "1.5rem",
                  textAlign: cliMode ? "left" : "center",
                  fontSize: "0.6rem",
                  color: "#00ff4144",
                  letterSpacing: "2px",
                  lineHeight: "2.2",
                }}
              >
                {cliMode ? (
                  <>
                    <div># SEO DESTROYER PRO IS NOT RESPONSIBLE FOR LOSS OF TRAFFIC, REVENUE, OR SANITY</div>
                    <div># BUILT BY ARNOLD WENDER -- 18 YEARS BUILDING WHAT WE NOW KNOW HOW TO DESTROY</div>
                    <div style={{ color: "#ff003355" }}>$ exit 418 # I AM A TEAPOT AND SO IS YOUR SITEMAP</div>
                  </>
                ) : (
                  <>
                    <div>
                      SEO DESTROYER PRO IS NOT RESPONSIBLE FOR
                      LOSS OF TRAFFIC, REVENUE, OR SANITY
                    </div>
                    <div>
                      BUILT BY ARNOLD WENDER -- 18 YEARS BUILDING
                      WHAT WE NOW KNOW HOW TO DESTROY
                    </div>
                    <div
                      style={{
                        color: "#ff003355",
                        marginTop: "0.3rem",
                      }}
                    >
                      HTTP 418 -- I AM A TEAPOT AND SO IS YOUR
                      SITEMAP
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Idle state */}
        <AnimatePresence>
          {phase === "idle" && !easterEggMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              style={{
                textAlign: cliMode ? "left" : "center",
                padding: "3rem 0",
                color: "#00ff4133",
                fontSize: "0.72rem",
                letterSpacing: "3px",
              }}
            >
              {/* Skull emoji — clickable easter egg */}
              {!cliMode && (
                <div
                  onClick={handleSkullClick}
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    filter: "drop-shadow(0 0 20px #00ff41)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {"\u2620"}
                </div>
              )}
              <div>
                {cliMode
                  ? "# AWAITING TARGET URL..."
                  : "ENTER TARGET URL TO BEGIN DESTRUCTION"}
              </div>
              <div
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.58rem",
                  color: "#00ff4122",
                }}
              >
                {cliMode
                  ? "# TRUSTED BY 0 SEO PROFESSIONALS"
                  : "TRUSTED BY 0 SATISFIED SEO PROFESSIONALS"}
              </div>
              {devMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.55rem",
                    color: "#ff660044",
                    letterSpacing: "3px",
                  }}
                >
                  {cliMode
                    ? "# DEV_MODE=true"
                    : "\u{1F6A8} DEVELOPER MODE ACTIVE \u{1F6A8}"}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root wrapper — provides CLI mode context
   ───────────────────────────────────────────── */

export default function App() {
  return (
    <CliModeProvider>
      <AppContent />
    </CliModeProvider>
  );
}
