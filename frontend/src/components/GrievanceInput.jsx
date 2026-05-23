import { useEffect, useMemo, useState } from "react";
import { getSampleCases } from "../api.js";

export default function GrievanceInput({
  apiBase,
  defaultLocation,
  initialGrievance,
  onSubmit,
  isLoading,
  error,
}) {
  const [grievance, setGrievance] = useState(initialGrievance || "");
  const [location, setLocation] = useState(defaultLocation || "Kolkata");
  const [sampleCases, setSampleCases] = useState([]);
  const [samplesLoading, setSamplesLoading] = useState(true);
  const [samplesError, setSamplesError] = useState("");
  const [selectedSampleId, setSelectedSampleId] = useState("");

  const minChars = 20;
  const chars = grievance.length;
  const canSubmit = useMemo(() => chars >= minChars && !isLoading, [chars, isLoading]);

  useEffect(() => {
    setLocation(defaultLocation || "Kolkata");
  }, [defaultLocation]);

  useEffect(() => {
    setGrievance(initialGrievance || "");
  }, [initialGrievance]);

  useEffect(() => {
    let cancelled = false;
    async function loadSamples() {
      setSamplesLoading(true);
      setSamplesError("");
      try {
        const data = await getSampleCases();
        if (cancelled) return;
        setSampleCases(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (e) {
        if (cancelled) return;
        const msg = e?.message ? String(e.message) : "Could not load sample cases right now.";
        setSamplesError(msg);
        setSampleCases([
          {
            id: "sample-1",
            title: "Security deposit dispute",
            grievance_text:
              "My landlord is refusing to return my security deposit of ₹40,000 even after I vacated the flat and handed over the keys. He is not sharing any proof of damages and keeps delaying payment.",
            location: "Kolkata",
            expected_category: "property",
          },
          {
            id: "sample-2",
            title: "Online shopping fraud",
            grievance_text:
              "I ordered a phone online and paid in full, but I received a fake product. The seller stopped responding and the platform is denying my refund. I have invoice and chat screenshots.",
            location: "Delhi",
            expected_category: "fraud",
          },
          {
            id: "sample-3",
            title: "Salary not paid",
            grievance_text:
              "My employer has not paid my salary for the last two months despite repeated follow-ups. I have my offer letter, attendance logs, and emails acknowledging pending salary.",
            location: "Bangalore",
            expected_category: "labour",
          },
        ]);
      } finally {
        if (!cancelled) setSamplesLoading(false);
      }
    }
    loadSamples();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  function handlePickSample(sample) {
    setGrievance(sample.grievance_text || "");
    setLocation(sample.location || "Kolkata");
    setSelectedSampleId(sample.id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit({ grievance, location, sampleId: selectedSampleId });
  }

  const cities = ["Kolkata", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Other"];

  return (
    <div className="nyaya-grid">
      <div className="nyaya-card">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="nyaya-h1">Describe your grievance</div>
            <div className="nyaya-subtitle">Plain language is perfect. Nyaya AI will structure it into a legal case.</div>
          </div>
          <div className="nyaya-badge">Hackathon Prototype</div>
        </div>

        <form onSubmit={handleFormSubmit} style={{ marginTop: 16 }}>
          <label className="nyaya-label" htmlFor="grievance">
            Grievance
          </label>
          <textarea
            id="grievance"
            className="nyaya-textarea"
            value={grievance}
            onChange={(e) => {
              setGrievance(e.target.value);
              setSelectedSampleId("");
            }}
            placeholder={
              "Describe your legal issue in plain language...\n(e.g. My landlord refused to return my security deposit of ₹40,000)"
            }
            rows={10}
          />

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div className={chars >= minChars ? "nyaya-muted" : "nyaya-warn"}>
              {chars}/{minChars} characters minimum
            </div>
            {error ? <div className="nyaya-error">{error}</div> : null}
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="nyaya-label" htmlFor="location">
                Location
              </label>
              <select
                id="location"
                className="nyaya-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <button className="nyaya-btn nyaya-btn-primary" type="submit" disabled={!canSubmit}>
                {isLoading ? "Analyzing..." : "Analyze My Case →"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="nyaya-card">
        <div className="nyaya-h2">Sample Cases</div>
        <div className="nyaya-subtitle" style={{ marginTop: 6 }}>
          Click a sample to auto-fill and run a demo analysis.
        </div>
        {samplesError ? (
          <div className="nyaya-error" style={{ marginTop: 10 }}>
            {samplesError}
          </div>
        ) : null}

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          {samplesLoading ? (
            <>
              <div className="nyaya-skeleton" style={{ height: 96 }} />
              <div className="nyaya-skeleton" style={{ height: 96 }} />
              <div className="nyaya-skeleton" style={{ height: 96 }} />
            </>
          ) : (
            sampleCases.map((s) => (
              <button
                key={s.id}
                type="button"
                className="nyaya-sample-card"
                onClick={() => handlePickSample(s)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700, color: "white" }}>{s.title}</div>
                  <div className="nyaya-pill">{s.expected_category}</div>
                </div>
                <div className="nyaya-muted" style={{ marginTop: 8, textAlign: "left" }}>
                  {(s.grievance_text || "").slice(0, 140)}
                  {(s.grievance_text || "").length > 140 ? "…" : ""}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="nyaya-dot" />
                  <div className="nyaya-muted">{s.location}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
