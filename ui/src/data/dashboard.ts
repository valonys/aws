export interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export interface WorkstreamStatus {
  id: string;
  name: string;
  owner: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'blocked';
  nextMilestone: string;
}

export interface FindingSummary {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  asset: string;
  inspector: string;
  updatedAt: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  type: 'analysis' | 'deployment' | 'inspection' | 'alert';
  title: string;
  timestamp: string;
  actor: string;
  details: string;
}

export const metrics: Metric[] = [
  {
    label: 'Assets Monitored',
    value: '128',
    change: '+12%',
    trend: 'up',
  },
  {
    label: 'Critical Findings',
    value: '6',
    change: '-25%',
    trend: 'down',
  },
  {
    label: 'Average Response Time',
    value: '2h 13m',
    change: '-14%',
    trend: 'up',
  },
  {
    label: 'Reports Published',
    value: '42',
    change: '+9%',
    trend: 'up',
  },
];

export const workstreams: WorkstreamStatus[] = [
  {
    id: 'ws-1',
    name: 'Report Layout & Rendering',
    owner: 'M. Tanaka',
    progress: 68,
    status: 'on-track',
    nextMilestone: 'Beta PDF parity review (Apr 28)',
  },
  {
    id: 'ws-2',
    name: 'Model Strategy (RAG)',
    owner: 'A. Mensah',
    progress: 45,
    status: 'at-risk',
    nextMilestone: 'Bedrock evaluation sign-off (May 3)',
  },
  {
    id: 'ws-3',
    name: 'Deployment to App Runner',
    owner: 'S. Gupta',
    progress: 32,
    status: 'on-track',
    nextMilestone: 'CI/CD pipeline dry run (May 6)',
  },
  {
    id: 'ws-4',
    name: 'UI/UX Polish',
    owner: 'E. Rodrigues',
    progress: 54,
    status: 'on-track',
    nextMilestone: 'Accessibility audit (May 10)',
  },
];

export const findings: FindingSummary[] = [
  {
    id: 'finding-1',
    title: 'Pitting corrosion near flange weld',
    severity: 'critical',
    asset: 'Compressor A-14',
    inspector: 'S. Williams',
    updatedAt: 'Updated 2 hours ago',
    description: 'Localized pitting reaching 40% wall loss detected via phased-array UT scan. Immediate mitigation recommended.',
  },
  {
    id: 'finding-2',
    title: 'Coating delamination on pipeline 3B',
    severity: 'high',
    asset: 'Pipeline 3B',
    inspector: 'J. Alvarez',
    updatedAt: 'Updated yesterday',
    description: 'Progressive delamination exposing substrate to seawater; schedule blasting & re-coating within 72 hours.',
  },
  {
    id: 'finding-3',
    title: 'Cathodic protection imbalance',
    severity: 'medium',
    asset: 'Offshore riser R-22',
    inspector: 'K. Chen',
    updatedAt: 'Updated 3 days ago',
    description: 'Potential drop indicates anode depletion approaching threshold. Plan replacement during next maintenance window.',
  },
];

export const activities: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'analysis',
    title: 'AI insight package generated for Pipeline 3B',
    timestamp: 'Today · 09:24',
    actor: 'VaLTwin Copilot',
    details:
      'Generated recommended mitigation plan and budget impact summary leveraging historical inspection corpus.',
  },
  {
    id: 'activity-2',
    type: 'inspection',
    title: 'Thermal drone sweep uploaded',
    timestamp: 'Yesterday · 17:08',
    actor: 'S. Williams',
    details: 'New imagery available for Compressor A-14. Auto-segmentation queued for corrosion scoring.',
  },
  {
    id: 'activity-3',
    type: 'deployment',
    title: 'App Runner staging refreshed',
    timestamp: 'Yesterday · 11:42',
    actor: 'CI Pipeline',
    details: 'FastAPI + React bundle deployed with enhanced PDF renderer endpoints.',
  },
  {
    id: 'activity-4',
    type: 'alert',
    title: 'Mitigation deadline approaching',
    timestamp: 'Apr 18 · 16:20',
    actor: 'VaLTwin Copilot',
    details: 'Pipeline 3B coating repair due in 36 hours. Budget variance +4% vs plan.',
  },
];
