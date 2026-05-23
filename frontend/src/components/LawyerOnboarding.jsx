import { useMemo, useState } from "react";
import { submitLawyerProfile } from "../api";

const cityOptions = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad"
];

const caseTypeOptions = [
  { value: "consumer", label: "Consumer" },
  { value: "criminal", label: "Criminal" },
  { value: "property/civil", label: "Property / Civil" }
];

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  website: "",
  city: "Kolkata",
  case_type: "consumer",
  specialization: "",
  firm_name: "",
  office_address: "",
  practice_court: "",
  bar_council_enrollment: "",
  bar_council_state: "",
  experience_years: 5,
  license_year: new Date().getFullYear() - 5,
  languages: "English, Hindi",
  free_consultation: true,
  advocate_declaration: false
};

const lawyerChecks = [
  "Bar Council enrollment number",
  "Bar Council state",
  "Primary court of practice",
  "Firm or chamber information",
  "Advocate declaration confirmation"
];

export default function LawyerOnboarding() {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const preview = useMemo(
    () => ({
      name: form.name || "Advocate name",
      specialization: form.specialization || "Practice area",
      city: form.city,
      practiceCourt: form.practice_court || "Primary court of practice",
      firmName: form.firm_name || "Chamber / firm",
      languages: form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }),
    [form]
  );

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.advocate_declaration) {
      setError("Please confirm the advocate declaration before submitting.");
      return;
    }

    if (String(form.bar_council_enrollment).trim().length < 6) {
      setError("Please enter a valid Bar Council enrollment number.");
      return;
    }

    const payload = {
      ...form,
      experience_years: Number(form.experience_years),
      license_year: Number(form.license_year),
      languages: form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      setSubmitting(true);
      const result = await submitLawyerProfile(payload);
      setSuccess(result?.message || "Lawyer profile saved successfully.");
    } catch (submitError) {
      setError(submitError.message || "Could not save the lawyer profile.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-grid animate-up">
      <article className="glass-panel form-panel">
        <div className="section-heading">
          <div>
            <span className="status-pill">For Lawyers</span>
            <h2 style={{ marginTop: 10 }}>Create or update your advocate profile</h2>
            <p style={{ marginTop: 8 }}>
              Submitted profiles become available for citizens when the system recommends lawyer
              consultation for matching case types and cities.
            </p>
          </div>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="lawyer-form-grid">
            <label className="field-group">
              <span>Advocate name</span>
              <input
                className="text-input"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Adv. Aditi Sharma"
                required
              />
            </label>

            <label className="field-group">
              <span>Email</span>
              <input
                className="text-input"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="aditi@chambers.in"
                required
              />
            </label>

            <label className="field-group">
              <span>Phone</span>
              <input
                className="text-input"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+91 98XXXXXXXX"
                required
              />
            </label>

            <label className="field-group">
              <span>Website</span>
              <input
                className="text-input"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
                placeholder="https://yourfirm.com"
              />
            </label>

            <label className="field-group">
              <span>City</span>
              <select
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              >
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Practice category</span>
              <select
                value={form.case_type}
                onChange={(event) => updateField("case_type", event.target.value)}
              >
                {caseTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Specialization</span>
              <input
                className="text-input"
                value={form.specialization}
                onChange={(event) => updateField("specialization", event.target.value)}
                placeholder="Cyber fraud, bail, consumer filings"
                required
              />
            </label>

            <label className="field-group">
              <span>Firm / chamber name</span>
              <input
                className="text-input"
                value={form.firm_name}
                onChange={(event) => updateField("firm_name", event.target.value)}
                placeholder="Sharma Legal Chambers"
                required
              />
            </label>

            <label className="field-group">
              <span>Primary court of practice</span>
              <input
                className="text-input"
                value={form.practice_court}
                onChange={(event) => updateField("practice_court", event.target.value)}
                placeholder="Calcutta High Court / District Courts"
                required
              />
            </label>

            <label className="field-group">
              <span>Bar Council enrollment number</span>
              <input
                className="text-input"
                value={form.bar_council_enrollment}
                onChange={(event) => updateField("bar_council_enrollment", event.target.value)}
                placeholder="WB/1234/2018"
                required
              />
            </label>

            <label className="field-group">
              <span>Bar Council state</span>
              <input
                className="text-input"
                value={form.bar_council_state}
                onChange={(event) => updateField("bar_council_state", event.target.value)}
                placeholder="West Bengal"
                required
              />
            </label>

            <label className="field-group">
              <span>Year of enrollment</span>
              <input
                className="text-input"
                type="number"
                min="1970"
                max={new Date().getFullYear()}
                value={form.license_year}
                onChange={(event) => updateField("license_year", event.target.value)}
                required
              />
            </label>

            <label className="field-group">
              <span>Years of experience</span>
              <input
                className="text-input"
                type="number"
                min="0"
                max="60"
                value={form.experience_years}
                onChange={(event) => updateField("experience_years", event.target.value)}
                required
              />
            </label>

            <label className="field-group">
              <span>Languages</span>
              <input
                className="text-input"
                value={form.languages}
                onChange={(event) => updateField("languages", event.target.value)}
                placeholder="English, Hindi, Bengali"
                required
              />
            </label>

            <label className="field-group lawyer-form-full">
              <span>Office address</span>
              <textarea
                value={form.office_address}
                onChange={(event) => updateField("office_address", event.target.value)}
                placeholder="Chamber address, court complex, area, city"
                rows={4}
                required
              />
            </label>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.free_consultation}
              onChange={(event) => updateField("free_consultation", event.target.checked)}
            />
            <span>I offer a free initial consultation.</span>
          </label>

          <label className="checkbox-row checkbox-row-strong">
            <input
              type="checkbox"
              checked={form.advocate_declaration}
              onChange={(event) => updateField("advocate_declaration", event.target.checked)}
              required
            />
            <span>
              I confirm that I am a licensed advocate enrolled with the Bar Council and that the
              above information is accurate.
            </span>
          </label>

          {error ? <div className="alert-banner">{error}</div> : null}
          {success ? <div className="success-banner">{success}</div> : null}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Saving profile..." : "Save Lawyer Profile"}
            </button>
            <p className="support-copy">
              Resubmitting the same email or Bar Council enrollment number updates the existing
              profile instead of creating a duplicate.
            </p>
          </div>
        </form>
      </article>

      <aside className="sidebar-stack">
        <article className="glass-panel sidebar-panel">
          <span className="status-pill">Lawyer Verification</span>
          <h3 style={{ marginTop: 10 }}>Lawyer-only fields required</h3>
          <div className="lawyer-note-list">
            {lawyerChecks.map((item) => (
              <div className="lawyer-note-item" key={item}>
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-panel sidebar-panel">
          <span className="status-pill">Profile Preview</span>
          <div className="lawyer-preview-card">
            <strong>{preview.name}</strong>
            <span>{preview.specialization}</span>
            <p>{preview.firmName}</p>
            <p>{preview.practiceCourt}</p>
            <p>{preview.city}</p>
            <p>{preview.languages.length ? preview.languages.join(", ") : "Languages pending"}</p>
          </div>
        </article>
      </aside>
    </section>
  );
}