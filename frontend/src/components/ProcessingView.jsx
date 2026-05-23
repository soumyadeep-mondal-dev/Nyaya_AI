import { useEffect, useMemo, useState } from "react";

export default function ProcessingView({ isLoading, onBack }) {
  const steps = useMemo(
    () => [
      { title: "📋 Intake Agent", desc: "Extracting key facts from your grievance..." },
      { title: "⚖️ Law-Sleuth Agent", desc: "Searching BNS/BNSS legal database..." },
      { title: "📄 Compliance Agent", desc: "Drafting legal document..." },
      { title: "🗺️ Action Agent", desc: "Identifying correct authority..." },
      { title: "🤝 Matchmaking Agent", desc: "Finding legal support options..." },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    setActiveIndex(0);
    setDoneCount(0);

    const timers = [];
    for (let i = 0; i < steps.length; i += 1) {
      timers.push(
        setTimeout(() => {
          setActiveIndex(i);
          setDoneCount(i);
        }, i * 2000),
      );
    }

    const finishTimer = setTimeout(() => {
      setDoneCount(steps.length);
      setActiveIndex(steps.length - 1);
    }, steps.length * 2000);
    timers.push(finishTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isLoading, steps.length]);

  function statusFor(i) {
    if (doneCount > i) return "done";
    if (activeIndex === i) return "active";
    return "inactive";
  }

  return (
    <div className="nyaya-card" style={{ maxWidth: 820, margin: "26px auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div className="nyaya-h1">Analyzing your case</div>
          <div className="nyaya-subtitle">Nyaya AI is running a multi-agent legal workflow. Please wait…</div>
        </div>
        <button className="nyaya-btn nyaya-btn-ghost" onClick={onBack} type="button">
          Cancel
        </button>
      </div>

      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {steps.map((s, i) => {
          const status = statusFor(i);
          const isActive = status === "active";
          const isDone = status === "done";
          return (
            <div
              key={s.title}
              className={[
                "nyaya-step",
                status === "inactive" ? "nyaya-step-inactive" : "",
                isActive ? "nyaya-step-active" : "",
                isDone ? "nyaya-step-done" : "",
              ].join(" ")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, color: "white" }}>{s.title}</div>
                  <div className="nyaya-muted" style={{ marginTop: 6 }}>
                    {s.desc}
                  </div>
                </div>
                <div style={{ minWidth: 110, display: "flex", justifyContent: "flex-end" }}>
                  {isDone ? (
                    <div className="nyaya-check">✓ Done</div>
                  ) : isActive ? (
                    <div className="nyaya-pulse">Processing</div>
                  ) : (
                    <div className="nyaya-muted">Waiting</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }} className="nyaya-muted">
        If this takes long the first time, the legal knowledge index is being loaded and embedded.
      </div>
    </div>
  );
}
