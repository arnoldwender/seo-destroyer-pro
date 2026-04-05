import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Fake Changelog — "What's New in v6.6.6"
   Collapsible section with absurd release notes
   ───────────────────────────────────────────── */

interface ChangelogEntry {
  version: string;
  date: string;
  tag: string;
  tagColor: string;
  notes: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v6.6.6",
    date: "2026-04-01",
    tag: "LATEST",
    tagColor: "#ff0033",
    notes: [
      "Added support for destroying competitors' SEO (Enterprise only)",
      "Fixed bug where sites accidentally ranked on page 1",
      "Removed robots.txt parser (we don't need their permission)",
      "New: AI-powered keyword unstuffing algorithm",
      "Improved 404 page generator now creates 404s in 14 languages",
      "Added WebSocket support for real-time ranking deterioration",
      "Security: Removed all security features for maximum vulnerability",
    ],
  },
  {
    version: "v6.6.5",
    date: "2026-03-15",
    tag: "STABLE",
    tagColor: "#ff6600",
    notes: [
      "Fixed issue where deindexing was too slow (now 3x faster)",
      "Added bulk URL removal API (removed the API instead)",
      "Meta descriptions now support emojis-only mode",
      "Deprecated: actual SEO improvements (never used anyway)",
      "Core Web Vitals destruction now covers INP metric",
    ],
  },
  {
    version: "v6.6.4",
    date: "2026-02-28",
    tag: "HOTFIX",
    tagColor: "#ffcc00",
    notes: [
      "Emergency fix: tool accidentally improved someone's PageRank",
      "Reverted helpful suggestion that slipped through QA",
      "Added 'chaos mode' — randomly shuffles all heading tags",
      "New easter egg: typing 'please help' shows a crying robot",
    ],
  },
  {
    version: "v6.6.3",
    date: "2026-02-01",
    tag: "BREAKING",
    tagColor: "#ff0033",
    notes: [
      "BREAKING: Renamed all functions to be less helpful",
      "Schema markup now outputs abstract poetry instead of JSON-LD",
      "Added support for destroying AMP pages (already dead but still)",
      "Internal links now form infinite redirect loops",
      "Fixed: confetti was accidentally accessible (added seizure mode)",
    ],
  },
];

export default function Changelog() {
  const [open, setOpen] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<number>(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: "2rem" }}
    >
      {/* Toggle header */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          border: "1px solid #00ff4122",
          background: "#00ff4108",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.9rem" }}>&#x1F4CB;</span>
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "2px",
                color: "#00ff41cc",
              }}
            >
              WHAT'S NEW IN v6.6.6
            </div>
            <div
              style={{
                fontSize: "0.5rem",
                color: "#00ff4155",
                letterSpacing: "1px",
              }}
            >
              CHANGELOG -- BREAKING EVERYTHING SINCE 2026
            </div>
          </div>
        </div>
        <span
          style={{
            color: "#00ff4166",
            fontSize: "0.8rem",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          &#x25BC;
        </span>
      </div>

      {/* Changelog body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                border: "1px solid #00ff4118",
                borderTop: "none",
                padding: "1rem",
              }}
            >
              {CHANGELOG.map((entry, i) => (
                <div key={entry.version} style={{ marginBottom: i < CHANGELOG.length - 1 ? "1rem" : 0 }}>
                  {/* Version header */}
                  <div
                    onClick={() => setExpandedVersion(expandedVersion === i ? -1 : i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontFamily: "monospace",
                        color: "#00ff41cc",
                      }}
                    >
                      {entry.version}
                    </span>
                    <span
                      style={{
                        fontSize: "0.48rem",
                        padding: "0.15rem 0.4rem",
                        border: `1px solid ${entry.tagColor}66`,
                        color: entry.tagColor,
                        letterSpacing: "1px",
                      }}
                    >
                      {entry.tag}
                    </span>
                    <span
                      style={{
                        fontSize: "0.5rem",
                        color: "#00ff4144",
                      }}
                    >
                      {entry.date}
                    </span>
                  </div>

                  {/* Notes */}
                  <AnimatePresence>
                    {expandedVersion === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        {entry.notes.map((note, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: j * 0.04 }}
                            style={{
                              fontSize: "0.62rem",
                              color: "#00ff4188",
                              padding: "0.25rem 0 0.25rem 1rem",
                              borderLeft: `1px solid ${entry.tagColor}33`,
                              lineHeight: "1.5",
                            }}
                          >
                            <span style={{ color: entry.tagColor, marginRight: "0.5rem" }}>-</span>
                            {note}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
