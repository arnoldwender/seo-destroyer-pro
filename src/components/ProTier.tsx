import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────
   Pro Tier Mockup
   Greyed-out "Pro" features with a fake
   upgrade modal that reveals the joke
   ───────────────────────────────────────────── */

interface ProFeature {
  name: string;
  description: string;
  tag: string;
}

const PRO_FEATURES: ProFeature[] = [
  {
    name: "Enterprise Destruction Suite",
    description: "Destroy up to 10,000 sites simultaneously with distributed deindexing",
    tag: "ENTERPRISE",
  },
  {
    name: "AI-Powered Anti-Optimization",
    description: "GPT-5 Turbo generates maximally harmful meta descriptions in 47 languages",
    tag: "AI PRO",
  },
  {
    name: "SOC 2 Compliant SEO Demolition",
    description: "Certified audit trail of every ranking destroyed — for compliance purposes",
    tag: "COMPLIANCE",
  },
  {
    name: "Competitor Intelligence Sabotage",
    description: "Monitor and actively worsen competitors' SEO scores (allegedly legal)",
    tag: "ESPIONAGE",
  },
  {
    name: "White-Label Destruction Reports",
    description: "Brand the destruction as your own — perfect for SEO agencies in denial",
    tag: "AGENCY",
  },
  {
    name: "Scheduled Deindexing (Cron Jobs)",
    description: "Automate daily ranking destruction — set it and forget it",
    tag: "AUTOMATION",
  },
];

const PLANS = [
  {
    name: "STARTER",
    price: "$0/mo",
    features: ["1 site destruction", "Basic deindexing", "Community support (none)"],
    highlight: false,
  },
  {
    name: "PRO",
    price: "$0/mo",
    features: [
      "Unlimited destruction",
      "AI anti-optimization",
      "Priority deindexing",
      "Competitor sabotage",
      "SOC 2 certification",
    ],
    highlight: true,
  },
  {
    name: "ENTERPRISE",
    price: "$0/mo",
    features: [
      "Everything in Pro",
      "Dedicated destruction manager",
      "Custom deindexing SLA",
      "On-premise deployment",
      "24/7 phone support (disconnected)",
    ],
    highlight: false,
  },
];

export default function ProTier() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
          <span style={{ fontSize: "0.9rem" }}>&#x1F512;</span>
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                letterSpacing: "3px",
                color: "#00ff41cc",
              }}
            >
              PRO FEATURES
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: "#00ff4155",
                letterSpacing: "2px",
              }}
            >
              UNLOCK THE FULL DESTRUCTION POTENTIAL
            </div>
          </div>
        </div>

        {/* Greyed-out feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          {PRO_FEATURES.map((feat, i) => (
            <motion.div
              key={feat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              onClick={() => setModalOpen(true)}
              style={{
                padding: "0.75rem 1rem",
                border: "1px solid #00ff4115",
                background: "#00ff4105",
                cursor: "pointer",
                filter: "grayscale(0.6)",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              whileHover={{ opacity: 0.7, filter: "grayscale(0.3)" }}
            >
              {/* Lock overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "0.4rem",
                  right: "0.4rem",
                  fontSize: "0.45rem",
                  padding: "0.1rem 0.35rem",
                  border: "1px solid #ff660044",
                  color: "#ff660088",
                  letterSpacing: "1px",
                }}
              >
                {feat.tag}
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#00ff4188",
                  marginBottom: "0.3rem",
                  paddingRight: "4rem",
                }}
              >
                {feat.name}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "#00ff4144",
                  lineHeight: "1.5",
                }}
              >
                {feat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "transparent",
            border: "1px solid #ff660044",
            color: "#ff6600",
            fontFamily: "monospace",
            fontSize: "0.72rem",
            letterSpacing: "3px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ff660015";
            e.currentTarget.style.borderColor = "#ff660088";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#ff660044";
          }}
        >
          &#x26A1; UPGRADE TO PRO
        </button>
      </motion.div>

      {/* Fake upgrade modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              zIndex: 10002,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "720px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#0a0a0a",
                border: "1px solid #00ff4133",
                padding: "2rem",
              }}
            >
              {/* Modal header */}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "4px",
                    color: "#ff660066",
                    marginBottom: "0.5rem",
                  }}
                >
                  SEO DESTROYER PRO
                </div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    color: "#00ff41",
                    letterSpacing: "3px",
                    textShadow: "0 0 10px #00ff4144",
                    marginBottom: "0.5rem",
                  }}
                >
                  CHOOSE YOUR PLAN
                </div>
              </div>

              {/* Pricing cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    style={{
                      padding: "1.25rem 1rem",
                      border: `1px solid ${plan.highlight ? "#00ff4144" : "#00ff4118"}`,
                      background: plan.highlight ? "#00ff4108" : "transparent",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "3px",
                        color: plan.highlight ? "#00ff41cc" : "#00ff4177",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {plan.name}
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontFamily: "monospace",
                        color: plan.highlight ? "#00ff41" : "#00ff4188",
                        textShadow: plan.highlight ? "0 0 8px #00ff4133" : "none",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {plan.price}
                    </div>
                    {plan.features.map((f, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: "0.55rem",
                          color: "#00ff4177",
                          padding: "0.2rem 0",
                          borderBottom: "1px solid #00ff410a",
                        }}
                      >
                        &#x2713; {f}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* The punchline */}
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  border: "1px solid #ff660033",
                  background: "#ff660008",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#ff6600",
                    letterSpacing: "2px",
                    marginBottom: "0.3rem",
                  }}
                >
                  ALL PLANS ARE FREE
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "#ff660088",
                    lineHeight: "1.6",
                  }}
                >
                  Because this is a joke. You cannot actually pay us to destroy
                  your SEO. We do it for the love of chaos.
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: "transparent",
                  border: "1px solid #00ff4133",
                  color: "#00ff4188",
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "2px",
                  cursor: "pointer",
                }}
              >
                CLOSE (DESTRUCTION CONTINUES EITHER WAY)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
