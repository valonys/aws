import { FiBell } from 'react-icons/fi';

const LOGO_URL =
  'https://github.com/valonys/DigiTwin/blob/29dd50da95bec35a5abdca4bdda1967f0e5efff6/ValonyLabs_Logo.png?raw=true';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-stack">
        <img src={LOGO_URL} alt="Valony Labs" className="logo" />
        <span className="logo-tagline">AI Beyond Compare</span>
      </div>
      <div className="header-meta">
        <div className="platform-title">
          <h1>VaLTwin - InspectorEngineer</h1>
          <p>Unified command center for corrosion intelligence &amp; inspection orchestration</p>
        </div>
        <div className="header-actions">
          <button type="button" className="notification-button" aria-label="Notifications">
            <FiBell />
          </button>
          <div className="user-profile">
            <img
              src="https://raw.githubusercontent.com/achilela/vila_fofoka_analysis/9904d9a0d445ab0488cf7395cb863cce7621d897/USER_AVATAR.png"
              alt="Operator avatar"
            />
            <div>
              <span className="user-name">Morgan Ellis</span>
              <span className="user-role">Inspection Lead</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
