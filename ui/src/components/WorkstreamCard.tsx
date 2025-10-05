import { FiArrowRightCircle } from 'react-icons/fi';
import type { WorkstreamStatus } from '../data/dashboard';

interface WorkstreamCardProps {
  workstream: WorkstreamStatus;
}

const WorkstreamCard: React.FC<WorkstreamCardProps> = ({ workstream }) => {
  const statusClass = `status-badge status-${workstream.status}`;
  return (
    <article className="workstream-card" id={`workstream-${workstream.id}`}>
      <header>
        <div>
          <h3>{workstream.name}</h3>
          <p>Owner: {workstream.owner}</p>
        </div>
        <span className={statusClass}>{workstream.status.replace('-', ' ')}</span>
      </header>
      <div className="workstream-progress">
        <div className="progress-bar">
          <span style={{ width: `${workstream.progress}%` }} />
        </div>
        <span className="progress-label">{workstream.progress}% complete</span>
      </div>
      <footer>
        <span>{workstream.nextMilestone}</span>
        <button type="button" className="outline-button">
          View details <FiArrowRightCircle />
        </button>
      </footer>
    </article>
  );
};

export default WorkstreamCard;
