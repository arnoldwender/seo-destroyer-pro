import { createContext, useContext, useState, type ReactNode } from "react";

/* ─────────────────────────────────────────────
   CLI Mode Context & Toggle
   Provides a global toggle that switches the
   entire UI to a terminal/CLI aesthetic.
   ───────────────────────────────────────────── */

interface CliModeContextType {
  cliMode: boolean;
  toggleCliMode: () => void;
}

const CliModeContext = createContext<CliModeContextType>({
  cliMode: false,
  toggleCliMode: () => {},
});

export function useCliMode() {
  return useContext(CliModeContext);
}

export function CliModeProvider({ children }: { children: ReactNode }) {
  const [cliMode, setCliMode] = useState(false);
  const toggleCliMode = () => setCliMode((p) => !p);

  return (
    <CliModeContext.Provider value={{ cliMode, toggleCliMode }}>
      {children}
    </CliModeContext.Provider>
  );
}

/** CLI mode toggle button for the header */
export function CliModeToggle() {
  const { cliMode, toggleCliMode } = useCliMode();

  return (
    <button
      onClick={toggleCliMode}
      style={{
        marginTop: "0.4rem",
        background: cliMode ? "#00ff4118" : "transparent",
        border: `1px solid ${cliMode ? "#00ff4144" : "#00ff4133"}`,
        color: cliMode ? "#00ff41cc" : "#00ff4166",
        fontFamily: "monospace",
        fontSize: "0.6rem",
        padding: "0.3rem 0.6rem",
        cursor: "pointer",
        letterSpacing: "2px",
        transition: "all 0.15s",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
      }}
    >
      <span style={{ fontSize: "0.7rem" }}>{cliMode ? ">" : "$"}</span>
      {cliMode ? "CLI MODE ON" : "CLI MODE"}
    </button>
  );
}

/* ─────────────────────────────────────────────
   CLI wrapper — renders children as terminal
   output when CLI mode is active
   ───────────────────────────────────────────── */

/** Converts regular content sections to CLI-style output */
export function CliSection({
  command,
  children,
}: {
  command: string;
  children: ReactNode;
}) {
  const { cliMode } = useCliMode();

  if (!cliMode) return <>{children}</>;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Command prompt */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: "0.72rem",
          color: "#00ff41",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span style={{ color: "#00ff4188" }}>seo-destroyer $</span>
        <span style={{ color: "#00ff41" }}>{command}</span>
        <span
          style={{
            animation: "blink 1s infinite",
            marginLeft: "0.2rem",
          }}
        >
          &#x2588;
        </span>
      </div>
      {/* Output */}
      <div
        style={{
          borderLeft: "2px solid #00ff4122",
          paddingLeft: "0.75rem",
          marginLeft: "0.25rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** CLI-formatted text output line */
export function CliOutput({
  label,
  value,
  color = "#00ff4199",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  const { cliMode } = useCliMode();
  if (!cliMode) return null;

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "0.65rem",
        lineHeight: "1.8",
        display: "flex",
        gap: "0.5rem",
      }}
    >
      <span style={{ color: "#00ff4155", minWidth: "24ch" }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}
