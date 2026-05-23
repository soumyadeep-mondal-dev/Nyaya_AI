const BASE_URL = "http://localhost:8000";

const BACKEND_NOT_REACHABLE = "Backend not reachable — make sure the server is running on port 8000";

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (e) {
    if (e?.name === "AbortError") throw e;
    throw new Error(BACKEND_NOT_REACHABLE);
  }
}

export async function analyzeGrievance(grievance, location, options = {}) {
  const payload = {
    grievance: String(grievance ?? ""),
    location: String(location ?? "Kolkata"),
  };

  const res = await safeFetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const detail = data?.detail ? String(data.detail) : "Unable to analyze right now. Please try again.";
    throw new Error(detail);
  }

  return data;
}

export async function getSampleCases() {
  const res = await safeFetch(`${BASE_URL}/sample-cases`);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const detail = data?.detail ? String(data.detail) : "Unable to load sample cases.";
    throw new Error(detail);
  }

  return Array.isArray(data) ? data : [];
}
