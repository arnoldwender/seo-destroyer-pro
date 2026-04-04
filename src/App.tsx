import { useState, useEffect, useRef } from "react";

const METRICS = [
  { label: "Title Tag Length", bad: "1,847 chars", icon: "\u{1F4DB}" },
  { label: "Meta Description", bad: "4,200 chars of Lorem Ipsum", icon: "\u{1F4DC}" },
  { label: "Keyword Density", bad: "97.3%", icon: "\u{1F511}" },
  { label: "Page Load Speed", bad: "47.8 seconds", icon: "\u{1F422}" },
  { label: "Mobile Friendliness", bad: "800px fixed, Flash required", icon: "\u{1F4DF}" },
  { label: "Backlink Quality", bad: "12,400 links from geocities.com", icon: "\u{1F517}" },
  { label: "Duplicate Content", bad: "100% copy of Wikipedia", icon: "\u{1F4CB}" },
  { label: "H1 Tags", bad: "847 H1s all saying CLICK HERE", icon: "\u{1F5E3}\uFE0F" },
  { label: "Alt Text", bad: "All images: alt=image", icon: "\u{1F5BC}\uFE0F" },
  { label: "Canonical URLs", bad: "Points to competitor site", icon: "\u{1F3AF}" },
  { label: "Schema Markup", bad: "Invented schema: EvilProduct", icon: "\u{1F9EC}" },
  { label: "Core Web Vitals", bad: "LCP:48s CLS:9.4 FID:Never", icon: "\u{1F480}" },
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

const RECOMMENDATIONS = [
  "Add SEO to every single word on the page",
  "Set title tag to the entire text of War and Peace",
  "Block Googlebot in robots.txt but call it Goglebot",
  "Replace all headings with the blink tag",
  "Point all canonical tags to your competitor homepage",
  "Compress images to 48MB WebP for quality",
  "Add 14000 hidden keywords in white text on white background",
  "Submit sitemap with 99999 broken links",
  "Set meta refresh to redirect to yourself every 0.001 seconds",
  "Load all content from a Geocities mirror via JavaScript",
];

const GLITCH_CHARS = "!@#$%^&*[]|/?";

function glitchText(text: string, intensity: number) {
  return text.split("").map((c) =>
    Math.random() < intensity
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      : c
  ).join("");
}

function ScoreGauge({ score }: { score: number }) {
  const [display, setDisplay] = useState(100);
  useEffect(() => {
    let cur = 100;
    const iv = setInterval(() => {
      cur -= Math.floor(Math.random() * 8) + 3;
      if (cur <= score) { setDisplay(score); clearInterval(iv); }
      else setDisplay(cur);
    }, 60);
    return () => clearInterval(iv);
  }, [score]);
  const col = display <= 5 ? "#ff0033" : display <= 20 ? "#ff6600" : "#00ff41";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3.5rem", fontFamily: "monospace", color: col, textShadow: `0 0 20px ${col}`, letterSpacing: "-2px" }}>
        {display}
      </div>
      <div style={{ fontSize: "0.6rem", color: "#00ff41", opacity: 0.6, letterSpacing: "3px" }}>SEO HEALTH %</div>
    </div>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "results">("idle");
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [shownMetrics, setShownMetrics] = useState<Array<{ label: string; bad: string; icon: string; score: number }>>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [recs, setRecs] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [titleText, setTitleText] = useState("SEO DESTROYER PRO");
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const base = "SEO DESTROYER PRO";
    const iv = setInterval(() => {
      setTitleText(glitchText(base, 0.15));
      setTimeout(() => setTitleText(base), 120);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

  function runScan() {
    if (!url.trim()) return;
    setPhase("scanning");
    setLines([]);
    setProgress(0);
    setShownMetrics([]);
    setApplied([]);
    let li = 0;
    const lineIv = setInterval(() => {
      if (li < TERMINAL_LINES.length) {
        const currentLine = TERMINAL_LINES[li];
        setLines((prev) => [...prev, currentLine]);
        setProgress(Math.round(((li + 1) / TERMINAL_LINES.length) * 100));
        li++;
      } else {
        clearInterval(lineIv);
        let mi = 0;
        const metIv = setInterval(() => {
          if (mi < METRICS.length) {
            const currentMetric = METRICS[mi];
            setShownMetrics((prev) => [...prev, { ...currentMetric, score: Math.floor(Math.random() * 4) }]);
            mi++;
          } else {
            clearInterval(metIv);
            setOverallScore(Math.floor(Math.random() * 4));
            setRecs([...RECOMMENDATIONS].sort(() => 0.5 - Math.random()).slice(0, 5));
            setPhase("results");
          }
        }, 200);
      }
    }, 220);
  }

  function applyRec(rec: string) {
    setApplied((prev) => [...prev, rec]);
    setOverallScore((s) => Math.max(0, s - Math.floor(Math.random() * 3)));
  }

  function lineColor(line: string) {
    if (line.indexOf("WARNING") !== -1) return "#ff6600";
    if (line.indexOf("COMPLETE") !== -1) return "#ff0033";
    return "#00ff41";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#00ff41", fontFamily: "monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scandown { 0%{top:-5%} 100%{top:105%} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 10px #00ff41} 50%{box-shadow:0 0 30px #00ff41,0 0 60px #00ff41} }
        .dbtn { animation: pulse 2s infinite; transition: all 0.2s; }
        .dbtn:hover { background: #00ff41 !important; color: #000 !important; }
        .rbtn:hover { background: #00ff4122 !important; cursor: pointer; }
      `}</style>
      <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.015) 2px,rgba(0,255,65,0.015) 4px)", pointerEvents:"none", zIndex:9999 }} />
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at center,transparent 60%,rgba(0,0,0,0.6) 100%)", pointerEvents:"none", zIndex:9998 }} />
      <div style={{ position:"fixed", left:0, right:0, height:"3px", background:"rgba(0,255,65,0.08)", animation:"scandown 6s linear infinite", zIndex:9997, pointerEvents:"none" }} />

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:"2rem 1.5rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem", borderBottom:"1px solid #00ff4133", paddingBottom:"1.5rem" }}>
          <div style={{ fontSize:"0.65rem", letterSpacing:"6px", color:"#00ff4166", marginBottom:"0.5rem" }}>WENDER MEDIA ANTI-OPTIMIZATION SUITE</div>
          <h1 style={{ fontSize:"clamp(1.6rem,5vw,2.8rem)", fontWeight:"normal", margin:"0 0 0.3rem", letterSpacing:"4px", textShadow:"0 0 20px #00ff41,0 0 40px #00ff41" }}>{titleText}</h1>
          <div style={{ fontSize:"0.7rem", color:"#00ff4188", letterSpacing:"2px" }}>v6.6.6 -- GUARANTEED TO DESTROY YOUR GOOGLE RANKING IN MINUTES</div>
          <div style={{ marginTop:"0.8rem", display:"flex", justifyContent:"center", gap:"1.5rem", fontSize:"0.6rem", color:"#00ff4155", flexWrap:"wrap" }}>
            <span>PANDA SAFE</span><span>PENGUIN CERTIFIED</span><span>HUMMINGBIRD HOSTILE</span><span>GDPR NON-COMPLIANT</span>
          </div>
        </div>

        <div style={{ marginBottom:"2rem" }}>
          <div style={{ fontSize:"0.65rem", letterSpacing:"3px", marginBottom:"0.5rem", color:"#00ff4188" }}>TARGET URL:</div>
          <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap" }}>
            <div style={{ flex:1, position:"relative", minWidth:"200px" }}>
              <span style={{ position:"absolute", left:"0.8rem", top:"50%", transform:"translateY(-50%)" }}>{">"}</span>
              <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runScan()} placeholder="https://your-website.com"
                style={{ width:"100%", background:"transparent", border:"1px solid #00ff4166", color:"#00ff41", fontFamily:"monospace", fontSize:"0.9rem", padding:"0.75rem 0.75rem 0.75rem 2rem", outline:"none", caretColor:"#00ff41" }} />
              <span style={{ position:"absolute", right:"0.8rem", top:"50%", transform:"translateY(-50%)", animation:"blink 1s infinite" }}>{"\u2588"}</span>
            </div>
            <button onClick={runScan} disabled={phase==="scanning"} className="dbtn"
              style={{ background:"transparent", border:"1px solid #00ff41", color:"#00ff41", fontFamily:"monospace", fontSize:"0.85rem", padding:"0.75rem 1.5rem", cursor:phase==="scanning"?"not-allowed":"pointer", letterSpacing:"2px", opacity:phase==="scanning"?0.5:1 }}>
              {phase==="scanning" ? "DESTROYING..." : "DESTROY SEO"}
            </button>
          </div>
        </div>

        {phase !== "idle" && (
          <div>
            {phase === "scanning" && (
              <div style={{ marginBottom:"0.75rem" }}>
                <div style={{ fontSize:"0.62rem", letterSpacing:"3px", marginBottom:"0.4rem", color:"#00ff4177" }}>DE-OPTIMIZING: {progress}%</div>
                <div style={{ height:"3px", background:"#00ff4122" }}>
                  <div style={{ height:"100%", width:`${progress}%`, background:"#00ff41", boxShadow:"0 0 8px #00ff41", transition:"width 0.2s" }} />
                </div>
              </div>
            )}
            <div ref={termRef} style={{ background:"#000", border:"1px solid #00ff4133", padding:"1rem", height:"180px", overflowY:"auto", marginBottom:"1.5rem", fontSize:"0.72rem", lineHeight:"1.8" }}>
              {lines.map((line, idx) => (
                <div key={idx} style={{ color:lineColor(line), textShadow:"0 0 5px currentColor" }}>{line}</div>
              ))}
              {phase==="scanning" && <span style={{ animation:"blink 0.8s infinite" }}>{"\u258A"}</span>}
            </div>
          </div>
        )}

        {phase === "results" && (
          <div>
            <div style={{ border:"1px solid #ff003344", background:"#ff00110a", padding:"1.5rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
              <div>
                <div style={{ fontSize:"0.62rem", letterSpacing:"4px", color:"#ff003399", marginBottom:"0.5rem" }}>OVERALL SEO DESTRUCTION SCORE</div>
                <div style={{ fontSize:"0.78rem", color:"#00ff4188", maxWidth:"340px", lineHeight:"1.6" }}>
                  Congratulations. Your website is now invisible to search engines. Google has added it to its do-not-crawl prayer list.
                </div>
              </div>
              <ScoreGauge score={overallScore} />
            </div>

            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"0.62rem", letterSpacing:"4px", color:"#00ff4177", marginBottom:"0.75rem" }}>DESTRUCTION REPORT</div>
              {shownMetrics.map((m, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1.8rem 1fr 1fr 60px", gap:"0.5rem", alignItems:"center", padding:"0.45rem 0.75rem", background:"#00ff410a", border:"1px solid #00ff4118", fontSize:"0.7rem", marginBottom:"0.3rem" }}>
                  <span>{m.icon}</span>
                  <span style={{ color:"#00ff4199" }}>{m.label}</span>
                  <span style={{ color:"#ff6600", fontSize:"0.62rem" }}>{m.bad}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.3rem", justifyContent:"flex-end" }}>
                    <div style={{ width:"30px", height:"3px", background:"#00ff4122" }}>
                      <div style={{ width:`${m.score}%`, height:"100%", background:m.score<=5?"#ff0033":"#ff6600" }} />
                    </div>
                    <span style={{ color:m.score<=5?"#ff0033":"#ff6600", fontSize:"0.65rem" }}>{m.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ fontSize:"0.62rem", letterSpacing:"4px", color:"#00ff4177", marginBottom:"0.75rem" }}>RECOMMENDED OPTIMIZATIONS -- CLICK TO APPLY</div>
              {recs.map((rec, i) => {
                const done = applied.includes(rec);
                return (
                  <div key={i} className={done?"":"rbtn"} onClick={() => !done && applyRec(rec)}
                    style={{ background:done?"#00ff4115":"transparent", border:`1px solid ${done?"#00ff4144":"#00ff4128"}`, color:done?"#00ff4166":"#00ff41", fontFamily:"monospace", fontSize:"0.7rem", padding:"0.55rem 0.9rem", marginBottom:"0.3rem", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.15s", cursor: done?"default":"pointer" }}>
                    <span>{done?"APPLIED -- ":"> "}{rec}</span>
                    {!done && <span style={{ opacity:0.4, fontSize:"0.6rem" }}>APPLY</span>}
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop:"1px solid #00ff4122", paddingTop:"1.5rem", textAlign:"center", fontSize:"0.6rem", color:"#00ff4144", letterSpacing:"2px", lineHeight:"2.2" }}>
              <div>SEO DESTROYER PRO IS NOT RESPONSIBLE FOR LOSS OF TRAFFIC, REVENUE, OR SANITY</div>
              <div>BUILT BY WENDER MEDIA -- 18 YEARS BUILDING WHAT WE NOW KNOW HOW TO DESTROY</div>
              <div style={{ color:"#ff003355", marginTop:"0.3rem" }}>HTTP 418 -- I AM A TEAPOT AND SO IS YOUR SITEMAP</div>
            </div>
          </div>
        )}

        {phase === "idle" && (
          <div style={{ textAlign:"center", padding:"3rem 0", color:"#00ff4133", fontSize:"0.72rem", letterSpacing:"3px" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem", filter:"drop-shadow(0 0 20px #00ff41)" }}>{"\u2620"}</div>
            <div>ENTER TARGET URL TO BEGIN DESTRUCTION</div>
            <div style={{ marginTop:"0.5rem", fontSize:"0.58rem", color:"#00ff4122" }}>TRUSTED BY 0 SATISFIED SEO PROFESSIONALS</div>
          </div>
        )}
      </div>
    </div>
  );
}
