import ActivityFeed from './components/ActivityFeed';
import CopilotPanel from './components/CopilotPanel';
import FindingCard from './components/FindingCard';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PlaybookPanel from './components/PlaybookPanel';
import Sidebar from './components/Sidebar';
import WorkstreamCard from './components/WorkstreamCard';
import { activities, findings, metrics, workstreams } from './data/dashboard';

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <Header />
        <section className="section" id="overview">
          <div className="section-header">
            <div>
              <h2>Platform Overview</h2>
              <p>Operational health across corrosion intelligence, inspection workloads, and AI copilots.</p>
            </div>
            <button type="button" className="primary-button">
              Sync with AWS
            </button>
          </div>
          <div className="metric-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section className="section" id="workstreams">
          <div className="section-header">
            <div>
              <h2>Strategic Workstreams</h2>
              <p>Trace delivery progress against the prototype iteration plan.</p>
            </div>
            <button type="button" className="outline-button">
              View iteration plan
            </button>
          </div>
          <div className="workstream-grid">
            {workstreams.map((workstream) => (
              <WorkstreamCard key={workstream.id} workstream={workstream} />
            ))}
          </div>
        </section>

        <section className="section" id="findings">
          <div className="section-header">
            <div>
              <h2>Priority Findings</h2>
              <p>AI-ranked corrosion insights requiring immediate mitigation.</p>
            </div>
            <button type="button" className="outline-button">
              Export report
            </button>
          </div>
          <div className="finding-grid">
            {findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        </section>

        <div className="section two-column">
          <ActivityFeed activities={activities} />
          <CopilotPanel />
        </div>

        <section className="section">
          <PlaybookPanel />
        </section>

        <footer className="footer">
          <p>
            © {new Date().getFullYear()} Valony Labs. Deployed via AWS App Runner with observability in CloudWatch and budgets
            guardrails active.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
