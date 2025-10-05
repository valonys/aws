import { FiActivity, FiAnchor, FiBookOpen, FiCpu, FiLayers } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <h2 className="sidebar-heading">Navigation</h2>
        <ul>
          <li>
            <a className="active" href="#overview">
              <FiActivity /> Overview
            </a>
          </li>
          <li>
            <a href="#workstreams">
              <FiLayers /> Workstreams
            </a>
          </li>
          <li>
            <a href="#findings">
              <FiAnchor /> Findings
            </a>
          </li>
          <li>
            <a href="#copilot">
              <FiCpu /> AI Copilot
            </a>
          </li>
          <li>
            <a href="#playbook">
              <FiBookOpen /> Playbooks
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <span className="sidebar-label">App Runner · us-east-1</span>
        <p>Connected to AWS infrastructure with IAM role `VaLTwinOperatorRole`.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
