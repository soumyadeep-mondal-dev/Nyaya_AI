import { useEffect, useMemo, useState } from "react";
import { getDemoLawyerRecommendations } from "../demoData.js";

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function parseStatuteCards(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const lines = raw.split("\n");
  const chunks = [];
  let current = [];

  for (const line of lines) {
    const isNew = /^\s*\d+[\).\]]\s+/.test(line);
    if (isNew && current.length) {
      chunks.push(current.join("\n").trim());
      current = [line];
      continue;
    }
    current.push(line);
  }
  if (current.length) chunks.push(current.join("\n").trim());

  const cards = chunks
    .map((c) => {
      const m = c.match(/(Section\s+\d+[A-Za-z-]*)/i);
      const badge = m ? m[1] : "Law";
      return { badge, body: c };
    })
    .filter((c) => c.body);

  if (cards.length) return cards;

  return [{ badge: "Law", body: raw }];
}

function normalizeCaseType(issueType) {
  const t = String(issueType || "").trim().toLowerCase();
  if (t === "consumer") return "consumer";
  if (t === "criminal") return "criminal";
  if (t === "property") return "property/civil";
  if (t === "fraud") return "criminal";
  if (t === "labour") return "property/civil";
  if (t === "family") return "criminal";
  return "consumer";
}

export default function ResultsDashboard({ apiBase, grievanceData, analysisResult, onBack, onReset }) {
  const [tab, setTab] = useState("Document");
  const [copied, setCopied] = useState(false);
  const [lawyerPayload, setLawyerPayload] = useState(null);
  const [lawyerLoading, setLawyerLoading] = useState(false);
  const [lawyerError, setLawyerError] = useState("");
  const [evidenceChecked, setEvidenceChecked] = useState({});

  const facts = analysisResult?.facts || {};
  const statutesText = analysisResult?.statutes || "";
  const documentText = analysisResult?.document || "";
  const jurisdiction = analysisResult?.jurisdiction || {};
  const routing = analysisResult?.routing || {};

  const statuteCards = useMemo(() => parseStatuteCards(statutesText), [statutesText]);

  const complexityScore = Number.isFinite(Number(routing?.complexity_score)) ? Number(routing.complexity_score) : null;
  const successProbability = routing?.success_probability ? String(routing.success_probability) : "";
  const caseType = normalizeCaseType(facts?.issue_type);

  useEffect(() => {
    setTab("Document");
  }, [analysisResult]);

  useEffect(() => {
    async function loadLawyers() {
      if (!analysisResult) return;
      if (analysisResult?.__demo) {
        const demoCaseId = analysisResult?.__demo_case_id;
        setLawyerPayload(getDemoLawyerRecommendations(demoCaseId));
        setLawyerError("");
        setLawyerLoading(false);
        return;
      }
      const score = Number.isFinite(Number(routing?.complexity_score)) ? Number(routing.complexity_score) : 5;
      const city = grievanceData?.location || "Kolkata";
      setLawyerLoading(true);
      setLawyerError("");
      try {
        const res = await fetch(`${apiBase}/recommend-lawyer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, case_type: caseType, complexity_score: Math.round(score) }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.detail ? String(data.detail) : "Failed to load lawyer recommendations");
        }
        setLawyerPayload(data);
      } catch (e) {
        const rawMsg = e?.message ? String(e.message) : "";
        const isNetwork =
          e?.name === "TypeError" ||
          rawMsg.includes("Failed to fetch") ||
          rawMsg.toLowerCase().includes("networkerror") ||
          rawMsg.toLowerCase().includes("load failed");
        const msg = isNetwork
          ? "Backend not reachable — make sure the server is running on port 8000"
          : rawMsg || "Failed to load lawyer recommendations";
        setLawyerError(msg);
        setLawyerPayload(null);
      } finally {
        setLawyerLoading(false);
      }
    }
    loadLawyers();
  }, [apiBase, analysisResult, caseType, grievanceData?.location, routing?.complexity_score]);

  async function handleCopyDocument() {
    try {
      await navigator.clipboard.writeText(String(documentText || ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function probabilityClass(p) {
    const v = String(p || "").toLowerCase();
    if (v === "high") return "nyaya-pill nyaya-pill-green";
    if (v === "medium") return "nyaya-pill nyaya-pill-teal";
    if (v === "low") return "nyaya-pill nyaya-pill-red";
    return "nyaya-pill";
  }

  const tabs = ["Document", "Laws", "Next Steps", "Lawyer Match"];

  function complexityFillColor(score) {
    const s = Number.isFinite(Number(score)) ? Number(score) : 0;
    if (s <= 3) return "#4FE697";
    if (s <= 6) return "#FFCB46";
    return "#FF5C7A";
  }

  function buildFullReport() {
    const lines = [];
    lines.push("NYAYA AI — FULL REPORT");
    lines.push("");
    lines.push(`Location: ${grievanceData?.location || "Kolkata"}`);
    lines.push(`Issue type: ${facts?.issue_type || "—"}`);
    lines.push("");
    lines.push("=== DOCUMENT ===");
    lines.push(documentText ? String(documentText) : "—");
    lines.push("");
    lines.push("=== LAWS ===");
    lines.push(statutesText ? String(statutesText) : "—");
    lines.push("");
    lines.push("=== NEXT STEPS ===");
    lines.push(`Authority: ${jurisdiction?.authority_type || "—"}`);
    lines.push(`Specific authority: ${jurisdiction?.specific_authority || "—"}`);
    lines.push(`Time limit: ${jurisdiction?.time_limit || "—"}`);
    lines.push(`Filing fee: ${jurisdiction?.filing_fee || "—"}`);
    lines.push("");
    lines.push("Steps:");
    const steps = Array.isArray(jurisdiction?.next_steps) ? jurisdiction.next_steps : [];
    if (steps.length) {
      steps.forEach((s, i) => lines.push(`${i + 1}. ${String(s)}`));
    } else {
      lines.push("—");
    }
    lines.push("");
    lines.push("=== LAWYER MATCH ===");
    lines.push(`Complexity score: ${complexityScore ?? "—"} / 10`);
    lines.push(`Success probability: ${successProbability || "—"}`);
    lines.push(`Lawyer type: ${routing?.lawyer_type || "—"}`);
    lines.push(`Needs lawyer: ${typeof routing?.needs_lawyer === "boolean" ? (routing.needs_lawyer ? "Yes" : "No") : "—"}`);
    lines.push(`Estimated legal fee: ${routing?.estimated_legal_fee || "—"}`);
    lines.push(`Estimated resolution time: ${routing?.estimated_resolution_time || "—"}`);
    lines.push(routing?.reason ? `Reason: ${String(routing.reason)}` : "");
    lines.push("");
    lines.push("Key evidence needed:");
    const evidence = Array.isArray(routing?.key_evidence_needed) ? routing.key_evidence_needed : [];
    if (evidence.length) {
      evidence.forEach((e, i) => lines.push(`- ${String(e)}`));
    } else {
      lines.push("—");
    }
    lines.push("");
    lines.push("Recommendations:");
    const recs = Array.isArray(lawyerPayload?.recommendations) ? lawyerPayload.recommendations : [];
    if (recs.length) {
      recs.forEach((r) => {
        lines.push(`- ${r.name || "—"} | ${r.phone || ""} | ${r.email || ""}`);
      });
    } else {
      lines.push("—");
    }
    lines.push("");
    lines.push("Self-help resources:");
    const resources = Array.isArray(lawyerPayload?.self_help_resources) ? lawyerPayload.self_help_resources : [];
    if (resources.length) {
      resources.forEach((r) => lines.push(`- ${r.name}: ${r.url}`));
    } else {
      lines.push("—");
    }
    return lines.filter((l) => l !== "").join("\n");
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="nyaya-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="nyaya-h1">Case Results</div>
            <div className="nyaya-subtitle">
              Location: <span style={{ color: "white" }}>{grievanceData?.location || "Kolkata"}</span> · Issue:{" "}
              <span style={{ color: "white" }}>{facts?.issue_type || "—"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              className="nyaya-btn nyaya-btn-ghost"
              type="button"
              onClick={() => downloadText("nyaya_ai_full_report.txt", buildFullReport())}
            >
              Download Full Report
            </button>
            <button className="nyaya-btn nyaya-btn-ghost" onClick={onBack} type="button">
              Analyze another case
            </button>
            <button className="nyaya-btn nyaya-btn-primary" onClick={onReset} type="button">
              Start New Case
            </button>
          </div>
        </div>

        <div className="nyaya-tabs" style={{ marginTop: 16 }}>
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              className={t === tab ? "nyaya-tab nyaya-tab-active" : "nyaya-tab"}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Document" ? (
        <div className="nyaya-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div className="nyaya-h2">Generated Legal Document</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="nyaya-btn nyaya-btn-ghost" type="button" onClick={handleCopyDocument}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                className="nyaya-btn nyaya-btn-primary"
                type="button"
                onClick={() => downloadText("nyaya_ai_document.txt", String(documentText || ""))}
              >
                Download .txt
              </button>
            </div>
          </div>

          <div className="nyaya-codebox" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {documentText ? documentText : "No document generated."}
          </div>
        </div>
      ) : null}

      {tab === "Laws" ? (
        <div className="nyaya-card">
          <div className="nyaya-h2">Applicable Laws</div>
          <div className="nyaya-subtitle" style={{ marginTop: 6 }}>
            Based on your facts and the retrieved legal sections.
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            {statuteCards.map((c, idx) => (
              <div key={idx} className="nyaya-law-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div className="nyaya-law-badge">{c.badge}</div>
                  <div className="nyaya-muted">AI analysis</div>
                </div>
                <div style={{ marginTop: 10, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "Next Steps" ? (
        <div className="nyaya-card">
          <div className="nyaya-h2">Next Steps</div>
          <div className="nyaya-subtitle" style={{ marginTop: 6 }}>
            Where to file and what to do next.
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="nyaya-info-card">
              <div className="nyaya-muted">Authority</div>
              <div style={{ marginTop: 6, fontWeight: 800, color: "white" }}>
                {jurisdiction?.authority_type || "—"}
              </div>
              <div className="nyaya-muted" style={{ marginTop: 6 }}>
                {jurisdiction?.specific_authority || ""}
              </div>
            </div>
            <div className="nyaya-info-card">
              <div className="nyaya-muted">Time & Fee</div>
              <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
                <div>
                  <span className="nyaya-muted">Time limit:</span>{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>{jurisdiction?.time_limit || "—"}</span>
                </div>
                <div>
                  <span className="nyaya-muted">Filing fee:</span>{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>{jurisdiction?.filing_fee || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }} className="nyaya-info-card">
            <div className="nyaya-muted">Action plan</div>
            <ol style={{ marginTop: 10, paddingLeft: 18, lineHeight: 1.8 }}>
              {(Array.isArray(jurisdiction?.next_steps) ? jurisdiction.next_steps : []).map((s, i) => (
                <li key={i} style={{ color: "white" }}>
                  {String(s)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}

      {tab === "Lawyer Match" ? (
        <div className="nyaya-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div className="nyaya-h2">Lawyer Match</div>
              <div className="nyaya-subtitle" style={{ marginTop: 6 }}>
                Recommended support options based on complexity and jurisdiction.
              </div>
            </div>
            {successProbability ? <div className={probabilityClass(successProbability)}>{successProbability}</div> : null}
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="nyaya-info-card">
              <div className="nyaya-muted">Complexity score</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: "white" }}>{complexityScore ?? "—"}</div>
                <div className="nyaya-muted">/ 10</div>
              </div>
              <div style={{ marginTop: 10 }} className="nyaya-meter">
                <div
                  className="nyaya-meter-fill"
                  style={{
                    width: `${Math.max(0, Math.min(100, ((complexityScore ?? 0) / 10) * 100))}%`,
                    background: complexityFillColor(complexityScore ?? 0),
                  }}
                />
              </div>
              <div className="nyaya-muted" style={{ marginTop: 10 }}>
                {routing?.lawyer_type ? String(routing.lawyer_type) : "—"}
              </div>
            </div>

            <div className="nyaya-info-card">
              <div className="nyaya-muted">Estimates</div>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <div>
                  <span className="nyaya-muted">Needs lawyer:</span>{" "}
                  <span style={{ color: "white", fontWeight: 800 }}>
                    {typeof routing?.needs_lawyer === "boolean" ? (routing.needs_lawyer ? "Yes" : "No") : "—"}
                  </span>
                </div>
                <div>
                  <span className="nyaya-muted">Fee:</span>{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>{routing?.estimated_legal_fee || "—"}</span>
                </div>
                <div>
                  <span className="nyaya-muted">Timeline:</span>{" "}
                  <span style={{ color: "white", fontWeight: 700 }}>{routing?.estimated_resolution_time || "—"}</span>
                </div>
                <div className="nyaya-muted">{routing?.reason ? String(routing.reason) : ""}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="nyaya-info-card">
              <div className="nyaya-muted">Key evidence checklist</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {(Array.isArray(routing?.key_evidence_needed) ? routing.key_evidence_needed : []).map((item, idx) => {
                  const id = `ev-${idx}`;
                  return (
                    <label key={id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={Boolean(evidenceChecked[id])}
                        onChange={(e) =>
                          setEvidenceChecked((prev) => ({ ...prev, [id]: e.target.checked }))
                        }
                      />
                      <span style={{ color: "white" }}>{String(item)}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="nyaya-info-card">
              <div className="nyaya-muted">Self-help resources</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {(Array.isArray(lawyerPayload?.self_help_resources) ? lawyerPayload.self_help_resources : []).map(
                  (r, idx) => (
                    <a key={idx} href={r.url} target="_blank" rel="noreferrer" className="nyaya-link-card">
                      <div style={{ fontWeight: 800, color: "white" }}>{r.name}</div>
                      <div className="nyaya-muted" style={{ marginTop: 6 }}>
                        {r.description}
                      </div>
                      <div className="nyaya-muted" style={{ marginTop: 8 }}>
                        {r.url}
                      </div>
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }} className="nyaya-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div className="nyaya-h2" style={{ margin: 0 }}>
                Recommendations
              </div>
              <div className="nyaya-muted">
                {lawyerLoading ? "Loading…" : lawyerPayload?.tier ? `Tier: ${lawyerPayload.tier}` : ""}
              </div>
            </div>

            {lawyerError ? <div className="nyaya-error" style={{ marginTop: 10 }}>{lawyerError}</div> : null}

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
              {(Array.isArray(lawyerPayload?.recommendations) ? lawyerPayload.recommendations : []).map((l, idx) => (
                <div key={idx} className="nyaya-lawyer-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 900, color: "white" }}>{l.name}</div>
                      <div className="nyaya-muted" style={{ marginTop: 6 }}>
                        {Array.isArray(l.specialization) ? l.specialization.join(", ") : l.specialization || ""}
                      </div>
                    </div>
                    <div className="nyaya-pill nyaya-pill-teal">
                      {l.rating ? `${Number(l.rating).toFixed(1)}★` : "—"}
                    </div>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {l.experience_years ? (
                      <div className="nyaya-muted">Experience: {l.experience_years} yrs</div>
                    ) : null}
                    {Array.isArray(l.languages) ? (
                      <div className="nyaya-muted">Languages: {l.languages.join(", ")}</div>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {l.phone ? (
                      <a className="nyaya-btn nyaya-btn-primary" href={`tel:${String(l.phone).replace(/\s/g, "")}`}>
                        Call
                      </a>
                    ) : null}
                    {l.email ? (
                      <a className="nyaya-btn nyaya-btn-ghost" href={`mailto:${l.email}`}>
                        Email
                      </a>
                    ) : null}
                    {l.website ? (
                      <a className="nyaya-btn nyaya-btn-ghost" href={l.website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    ) : null}
                    {typeof l.free_consultation === "boolean" ? (
                      <div className={l.free_consultation ? "nyaya-pill nyaya-pill-green" : "nyaya-pill"}>
                        {l.free_consultation ? "Free consult" : "Paid consult"}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
