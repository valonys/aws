const PlaybookPanel: React.FC = () => {
  return (
    <section className="panel" id="playbook">
      <header className="panel-header">
        <h2>Operational Playbooks</h2>
        <p>Guided procedures bridging inspection findings, AI recommendations, and AWS automations.</p>
      </header>
      <div className="playbook-grid">
        <article>
          <h3>1. Imaging to Insight</h3>
          <p>
            Automate ingestion from drone or ROV captures into the corrosion scoring pipeline. Runs on AWS Batch with S3 event
            triggers and publishes metrics via EventBridge.
          </p>
        </article>
        <article>
          <h3>2. Mitigation Workflow</h3>
          <p>
            Draft work orders from VaLTwin Copilot prompts, sync with ServiceNow, and track completion SLAs through App Runner
            hosted APIs.
          </p>
        </article>
        <article>
          <h3>3. Executive Reporting</h3>
          <p>
            Generate synchronized PDF and web reports with image-first cards, severity callouts, and budget impact insights for
            leadership reviews.
          </p>
        </article>
      </div>
    </section>
  );
};

export default PlaybookPanel;
