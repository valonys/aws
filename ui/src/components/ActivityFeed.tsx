import { FiAlertTriangle, FiCamera, FiCpu, FiGitBranch } from 'react-icons/fi';
import type { ActivityItem } from '../data/dashboard';

const iconMap: Record<ActivityItem['type'], JSX.Element> = {
  alert: <FiAlertTriangle aria-hidden />,
  analysis: <FiCpu aria-hidden />,
  deployment: <FiGitBranch aria-hidden />,
  inspection: <FiCamera aria-hidden />,
};

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <section className="panel" id="activity">
      <header className="panel-header">
        <h2>Mission Activity</h2>
        <p>Latest updates from AI copilots, inspectors, and deployment pipelines.</p>
      </header>
      <ul className="activity-feed">
        {activities.map((activity) => (
          <li key={activity.id}>
            <div className={`activity-icon activity-${activity.type}`}>{iconMap[activity.type]}</div>
            <div className="activity-content">
              <div className="activity-title-row">
                <h3>{activity.title}</h3>
                <span>{activity.timestamp}</span>
              </div>
              <p className="activity-actor">{activity.actor}</p>
              <p className="activity-details">{activity.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityFeed;
