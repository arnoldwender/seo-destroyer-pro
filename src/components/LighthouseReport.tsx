import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Reverse Lighthouse Report
   Circular SVG gauges where 0/100 is the GOAL.
   Red = bad = 100, Green = good = 0.
   ───────────────────────────────────────────── */

interface Category {
  name: string;
  score: number;
  achievements: string[];
}

const CATEGORIES: Category[] = [
  {
    name: "Performance Destruction",
    score: 97,
    achievements: [
      "Successfully added 47 render-blocking scripts",
      "Largest Contentful Paint: 48.2s (goal: >30s)",
      "Total Blocking Time: 14,700ms",
      "Cumulative Layout Shift: 9.4 (everything moves)",
      "Loaded jQuery 7 times from different CDNs",
      "Inline CSS: 2.4MB of !important declarations",
    ],
  },
  {
    name: "Accessibility Sabotage",
    score: 84,
    achievements: [
      "Color contrast ratio: 1.02:1 (nearly invisible)",
      "All images use alt=\"image\" or alt=\"photo\"",
      "Tab order randomized on every page load",
      "Form labels point to wrong inputs",
      "Skip-to-content link goes to 404 page",
      "ARIA roles: role=\"none\" on all interactive elements",
    ],
  },
  {
    name: "SEO Demolition",
    score: 100,
    achievements: [
      "robots.txt: Disallow: / (full site blocked)",
      "847 H1 tags on a single page",
      "Meta description: 4,200 characters of lorem ipsum",
      "Canonical URL points to competitor's homepage",
      "Sitemap.xml returns HTTP 418 I'm a Teapot",
      "Keyword density: 97.3% (just one word repeated)",
      "Structured data uses invented schema: EvilProduct",
    ],
  },
  {
    name: "Best Anti-Practices",
    score: 91,
    achievements: [
      "Mixed content: HTTP images on HTTPS pages",
      "Console.log on every render (847 logs/second)",
      "eval() used for JSON parsing",
      "Passwords stored in localStorage as plaintext",
      "API keys hardcoded in client-side bundle",
      "No error boundaries — crashes propagate to root",
    ],
  },
];

/** SVG circular gauge — animated stroke-dasharray */
function CircularGauge({ score, size = 120 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  /* Animate score from 0 to target */
  useEffect(() => {
    let current = 0;
    const iv = setInterval(() => {
      current += Math.ceil((score - current) * 0.12) || 1;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(iv);
      } else {
        setAnimatedScore(current);
      }
    }, 30);
    return () => clearInterval(iv);
  }, [score]);

  /* Color based on reverse scale: high = red (bad SEO = good for us) */
  const color =
    animatedScore >= 90
      ? "#ff0033"
      : animatedScore >= 50
        ? "#ff6600"
        : "#00ff41";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#00ff4115"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.3s ease",
            filter: `drop-shadow(0 0 6px ${color}88)`,
          }}
        />
      </svg>
      {/* Score number */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <span
          style={{
            fontSize: size * 0.28,
            fontFamily: "monospace",
            color,
            textShadow: `0 0 10px ${color}66`,
            fontWeight: "bold",
          }}
        >
          {animatedScore}
        </span>
      </div>
    </div>
  );
}

export default function LighthouseReport() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: "2rem" }}
    >
      {/* Section header — mimics Lighthouse branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #00ff4122",
          paddingBottom: "0.75rem",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ff0033",
            boxShadow: "0 0 10px #ff003366",
          }}
        />
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "3px",
              color: "#00ff41cc",
            }}
          >
            REVERSE LIGHTHOUSE REPORT
          </div>
          <div
            style={{
              fontSize: "0.55rem",
              color: "#00ff4155",
              letterSpacing: "2px",
            }}
          >
            LOWER IS BETTER -- 0/100 IS THE GOAL
          </div>
        </div>
      </div>

      {/* Category gauges grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "1.25rem 0.75rem",
              border: `1px solid ${expanded === i ? "#00ff4144" : "#00ff4118"}`,
              background: expanded === i ? "#00ff4108" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <CircularGauge score={cat.score} size={100} />
            <div
              style={{
                fontSize: "0.6rem",
                letterSpacing: "1px",
                color: "#00ff4199",
                marginTop: "0.75rem",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              {cat.name.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: "0.5rem",
                color: "#00ff4144",
                marginTop: "0.3rem",
                letterSpacing: "1px",
              }}
            >
              {expanded === i ? "COLLAPSE" : "VIEW DETAILS"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded achievements panel */}
      <AnimatePresence>
        {expanded !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: "1rem" }}
          >
            <div
              style={{
                border: "1px solid #00ff4122",
                padding: "1rem",
                background: "#00ff4108",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "3px",
                  color: "#ff660088",
                  marginBottom: "0.75rem",
                }}
              >
                ACHIEVEMENTS UNLOCKED -- {CATEGORIES[expanded].name.toUpperCase()}
              </div>
              {CATEGORIES[expanded].achievements.map((a, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: j * 0.05 }}
                  style={{
                    fontSize: "0.68rem",
                    color: "#00ff4199",
                    padding: "0.35rem 0.5rem",
                    borderLeft: "2px solid #ff003366",
                    marginBottom: "0.25rem",
                    background: "#ff001108",
                  }}
                >
                  <span style={{ color: "#ff0033", marginRight: "0.5rem" }}>&#x2713;</span>
                  {a}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
