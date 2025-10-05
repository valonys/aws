export type DashboardSummary = {
  assetsMonitored: number;
  anomaliesDetected: number;
  reportsGenerated: number;
};

export type DashboardFinding = {
  id: string;
  severity: string;
  severityRank: number;
  description: string;
  location?: string;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  findings: DashboardFinding[];
  error?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function normalizeSummary(payload: any): DashboardSummary {
  const summary = payload?.summary ?? {};
  return {
    assetsMonitored: Number(summary.assets_monitored ?? summary.assetsMonitored ?? 0),
    anomaliesDetected: Number(summary.anomalies_detected ?? summary.anomaliesDetected ?? 0),
    reportsGenerated: Number(summary.reports_generated ?? summary.reportsGenerated ?? 0),
  };
}

function normalizeFindings(payload: any[]): DashboardFinding[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((finding) => ({
    id: String(finding.id ?? finding.image_id ?? ""),
    severity: String(finding.severity ?? finding.severity_label ?? "UNKNOWN"),
    severityRank: Number(finding.severity_rank ?? finding.severityRank ?? 0),
    description: String(finding.description ?? finding.notes ?? ""),
    location: finding.location ?? finding.page,
  }));
}

export async function fetchDashboardData(signal?: AbortSignal): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  const payload = await response.json();
  return {
    summary: normalizeSummary(payload),
    findings: normalizeFindings(payload.findings),
    error: payload.error,
  };
}
