import { FiChevronRight } from 'react-icons/fi';
import type { FindingSummary } from '../data/dashboard';

interface FindingCardProps {
  finding: FindingSummary;
}

const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const severityClass = `severity-badge severity-${finding.severity}`;
  return (
    <article className="finding-card">
      <header>
        <span className={severityClass}>{finding.severity}</span>
        <h3>{finding.title}</h3>
        <p className="finding-meta">
          {finding.asset} · {finding.inspector}
        </p>
      </header>
      <p className="finding-description">{finding.description}</p>
      <footer>
        <span className="finding-update">{finding.updatedAt}</span>
        <button type="button" className="outline-button">
          Review details <FiChevronRight />
        </button>
      </footer>
    </article>
  );
};

export default FindingCard;
