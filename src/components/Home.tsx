import './Home.css';

interface HomeProps {
  onLogout: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const userEmail = localStorage.getItem('userEmail');

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-brand">
          <img src="/kodotakai-logo.svg" alt="Kodotakai" className="home-logo" />
          <h1>Kodotakai Dashboard</h1>
        </div>
                <button 
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      
      <div className="home-content">
        <div className="welcome-section">
          <h2>Welcome back!</h2>
          <p>Logged in as: <strong>{userEmail}</strong></p>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View your business analytics and reports</p>
          </div>
          <div className="dashboard-card">
            <h3>Cloud Infrastructure</h3>
            <p>Manage your cloud resources and services</p>
          </div>
          <div className="dashboard-card">
            <h3>Customer Support</h3>
            <p>Access 24/7 customer support system</p>
          </div>
          <div className="dashboard-card">
            <h3>Security</h3>
            <p>Enterprise-grade security management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
