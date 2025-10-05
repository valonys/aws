import { FiArrowDownRight, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import type { Metric } from '../data/dashboard';

interface MetricCardProps {
  metric: Metric;
}

const TrendIcon = ({ trend }: { trend: Metric['trend'] }) => {
  switch (trend) {
    case 'up':
      return <FiArrowUpRight aria-hidden />;
    case 'down':
      return <FiArrowDownRight aria-hidden />;
    default:
      return <FiArrowRight aria-hidden />;
  }
};

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const trendClass = `trend-indicator trend-${metric.trend}`;
  return (
    <article className="metric-card">
      <header>
        <span className="metric-label">{metric.label}</span>
      </header>
      <div className="metric-body">
        <span className="metric-value">{metric.value}</span>
        <span className={trendClass}>
          <TrendIcon trend={metric.trend} />
          {metric.change}
        </span>
      </div>
    </article>
  );
};

export default MetricCard;
