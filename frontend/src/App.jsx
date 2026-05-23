import GrievanceInput from "./components/GrievanceInput.jsx";
import ProcessingView from "./components/ProcessingView.jsx";
import ResultsDashboard from "./components/ResultsDashboard.jsx";
import { Component, useMemo, useRef, useState } from "react";
import { analyzeGrievance } from "./api.js";
import { getDemoResult } from "./demoData.js";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="nyaya-card" style={{ maxWidth: 780, margin: "34px auto" }}>
          <div className="nyaya-h1">Something went wrong</div>
          <div className="nyaya-subtitle" style={{ marginTop: 8 }}>
            Nyaya AI hit an unexpected error. You can try again.
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="nyaya-btn nyaya-btn-primary" type="button" onClick={this.props.onReset}>
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const API_BASE = useMemo(() => "http://localhost:8000", []);

  const [currentScreen, setCurrentScreen] = useState("input");
  const [grievanceData, setGrievanceData] = useState({ grievance: "", location: "Kolkata" });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const [appKey, setAppKey] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  async function handleSubmit({ grievance, location, sampleId }) {
    const trimmed = (grievance ?? "").trim();
    if (trimmed.length < 20) {
      setError("Please enter at least 20 characters so Nyaya AI can analyze your case.");
      setCurrentScreen("input");
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setError("");
    setIsLoading(true);
    setAnalysisResult(null);
    setGrievanceData({ grievance: trimmed, location: location || "Kolkata" });
    setCurrentScreen("processing");

    try {
      if (demoMode) {
        const demo = getDemoResult({ sampleId, grievance: trimmed, location: location || "Kolkata" });
        await new Promise((r) => setTimeout(r, 900));
        setAnalysisResult(demo);
        setCurrentScreen("results");
      } else {
        const data = await analyzeGrievance(trimmed, location || "Kolkata", { signal: controller.signal });
        setAnalysisResult(data);
        setCurrentScreen("results");
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e?.message ? String(e.message) : "Something went wrong. Please try again.");
      setCurrentScreen("input");
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
    setError("");
    setCurrentScreen("input");
  }

  function resetAll() {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setCurrentScreen("input");
    setGrievanceData({ grievance: "", location: "Kolkata" });
    setAnalysisResult(null);
    setIsLoading(false);
    setError("");
    setAppKey((k) => k + 1);
  }

  const navbarStyle = {
    background: "#0A0F2C",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  };

  const navbarInnerStyle = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  };

  const brandStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    color: "white",
  };

  const logoStyle = {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "rgba(0, 201, 167, 0.12)",
    border: "1px solid rgba(0, 201, 167, 0.35)",
    display: "grid",
    placeItems: "center",
    fontSize: 18,
  };

  const taglineStyle = {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    marginTop: 2,
  };

  return (
    <div className="nyaya-page" key={appKey}>
      <div style={navbarStyle}>
        <div style={navbarInnerStyle}>
          <div style={brandStyle}>
            <div style={logoStyle}>⚖️</div>
            <div>
              <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>Nyaya AI</div>
              <div style={taglineStyle}>Justice for Every Citizen</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className={demoMode ? "nyaya-btn nyaya-btn-primary" : "nyaya-btn nyaya-btn-ghost"}
              type="button"
              onClick={() => setDemoMode((v) => !v)}
            >
              Demo Mode: {demoMode ? "On" : "Off"}
            </button>
            {currentScreen !== "input" ? (
              <button className="nyaya-btn nyaya-btn-ghost" onClick={handleBack} type="button">
                ← Back
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="nyaya-container">
        <ErrorBoundary onReset={resetAll}>
          {currentScreen === "input" ? (
            <GrievanceInput
              apiBase={API_BASE}
              defaultLocation={grievanceData.location || "Kolkata"}
              initialGrievance={grievanceData.grievance}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          ) : null}

          {currentScreen === "processing" ? (
            <ProcessingView isLoading={isLoading} onBack={handleBack} />
          ) : null}

          {currentScreen === "results" ? (
            <ResultsDashboard
              apiBase={API_BASE}
              grievanceData={grievanceData}
              analysisResult={analysisResult}
              onBack={handleBack}
              onReset={resetAll}
            />
          ) : null}
        </ErrorBoundary>
      </div>
    </div>
  );
}
