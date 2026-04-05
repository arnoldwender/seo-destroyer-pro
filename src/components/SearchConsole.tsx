import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   Search Console Destruction Dashboard
   Google Search Console-style metrics going
   the wrong direction — animated line chart
   ───────────────────────────────────────────── */

/** Generate cratering data points for the impressions chart */
function generateCrateringData(points: number): number[] {
  const data: number[] = [];
  let val = 85000 + Math.random() * 15000;
  for (let i = 0; i < points; i++) {
    /* Steep decline with some noise */
    const decay = 1 - (i / points) * 0.97;
    const noise = (Math.random() - 0.5) * val * 0.08;
    val = Math.max(0, val * decay + noise);
    data.push(Math.round(val));
  }
  return data;
}

/** Animated SVG line chart — impressions cratering to zero */
function CrateringChart() {
  const [data] = useState(() => generateCrateringData(30));
  const [visiblePoints, setVisiblePoints] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxVal = Math.max(...data);
  const width = 600;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 25, left: 50 };

  /* Animate points appearing one by one */
  useEffect(() => {
    if (visiblePoints >= data.length) return;
    const t = setTimeout(() => setVisiblePoints((p) => p + 1), 60);
    return () => clearTimeout(t);
  }, [visiblePoints, data.length]);

  /* Draw on canvas for crisp rendering */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    /* Grid lines */
    ctx.strokeStyle = "#00ff4112";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    /* Y-axis labels */
    ctx.fillStyle = "#00ff4144";
    ctx.font = "9px monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = Math.round(maxVal * (1 - i / 4));
      ctx.fillText(val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val), padding.left - 6, y + 3);
    }

    /* X-axis labels */
    ctx.fillStyle = "#00ff4133";
    ctx.textAlign = "center";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    months.forEach((m, i) => {
      const x = padding.left + (chartW / (months.length - 1)) * i;
      ctx.fillText(m, x, height - 5);
    });

    if (visiblePoints < 2) return;

    /* Data line */
    const points = data.slice(0, visiblePoints);
    ctx.beginPath();
    ctx.strokeStyle = "#ff0033";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff003366";
    ctx.shadowBlur = 8;

    points.forEach((val, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y = padding.top + chartH - (val / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    /* Gradient fill under line */
    ctx.shadowBlur = 0;
    const lastX = padding.left + (chartW / (data.length - 1)) * (points.length - 1);
    const lastY = padding.top + chartH - (points[points.length - 1] / maxVal) * chartH;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, "#ff003322");
    grad.addColorStop(1, "#ff003305");
    ctx.fillStyle = grad;
    ctx.fill();
  }, [visiblePoints, data, maxVal]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", maxWidth: `${width}px`, height: `${height}px` }}
    />
  );
}

/** Single metric card */
function MetricCard({
  label,
  value,
  subtext,
  color,
  delay,
}: {
  label: string;
  value: string;
  subtext: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{
        padding: "0.75rem 1rem",
        border: `1px solid ${color}22`,
        background: `${color}08`,
        flex: "1 1 140px",
        minWidth: "130px",
      }}
    >
      <div
        style={{
          fontSize: "0.5rem",
          letterSpacing: "2px",
          color: "#00ff4166",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "1.3rem",
          fontFamily: "monospace",
          color,
          textShadow: `0 0 8px ${color}44`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.5rem",
          color: `${color}88`,
          marginTop: "0.2rem",
        }}
      >
        {subtext}
      </div>
    </motion.div>
  );
}

export default function SearchConsole() {
  const [deindexProgress, setDeindexProgress] = useState(0);

  /* Animate deindexing progress */
  useEffect(() => {
    const target = 73;
    const iv = setInterval(() => {
      setDeindexProgress((p) => {
        if (p >= target) {
          clearInterval(iv);
          return target;
        }
        return p + 1;
      });
    }, 40);
    return () => clearInterval(iv);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ marginBottom: "2rem" }}
    >
      {/* Section header */}
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
            fontSize: "1rem",
            filter: "drop-shadow(0 0 4px #ff003366)",
          }}
        >
          &#x1F4C9;
        </div>
        <div>
          <div
            style={{
              fontSize: "0.75rem",
              letterSpacing: "3px",
              color: "#00ff41cc",
            }}
          >
            SEARCH CONSOLE DESTRUCTION
          </div>
          <div
            style={{
              fontSize: "0.55rem",
              color: "#00ff4155",
              letterSpacing: "2px",
            }}
          >
            GOOGLE SEARCH PERFORMANCE -- LAST 6 MONTHS
          </div>
        </div>
      </div>

      {/* Metric cards row */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <MetricCard
          label="TOTAL IMPRESSIONS"
          value="12"
          subtext="-99.99% vs prior period"
          color="#ff0033"
          delay={0.1}
        />
        <MetricCard
          label="AVG CTR"
          value="0.001%"
          subtext="Industry avg: 3.2%"
          color="#ff6600"
          delay={0.2}
        />
        <MetricCard
          label="AVG POSITION"
          value="847"
          subtext="Page 85 of results"
          color="#ff0033"
          delay={0.3}
        />
        <MetricCard
          label="TOTAL CLICKS"
          value="0"
          subtext="Even bots won't click"
          color="#ff6600"
          delay={0.4}
        />
      </div>

      {/* Impressions chart */}
      <div
        style={{
          border: "1px solid #ff003322",
          background: "#ff001108",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            fontSize: "0.55rem",
            letterSpacing: "2px",
            color: "#ff003388",
            marginBottom: "0.75rem",
          }}
        >
          IMPRESSIONS OVER TIME (CRATERING IN PROGRESS)
        </div>
        <CrateringChart />
      </div>

      {/* Deindexing progress bar */}
      <div
        style={{
          border: "1px solid #ff003322",
          padding: "0.75rem 1rem",
          background: "#ff001108",
        }}
      >
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
              fontSize: "0.6rem",
              letterSpacing: "2px",
              color: "#ff003399",
            }}
          >
            DEINDEXING PROGRESS
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              fontFamily: "monospace",
              color: "#ff0033",
              textShadow: "0 0 8px #ff003344",
            }}
          >
            {deindexProgress}%
          </div>
        </div>
        <div
          style={{
            height: "6px",
            background: "#ff003315",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${deindexProgress}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #ff6600, #ff0033)",
              borderRadius: "3px",
              boxShadow: "0 0 10px #ff003366",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "0.48rem",
            color: "#ff003355",
            marginTop: "0.4rem",
            letterSpacing: "1px",
          }}
        >
          ESTIMATED TIME TO FULL DEINDEXING: 3 HOURS 47 MINUTES
        </div>
      </div>
    </motion.div>
  );
}
