import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const discoverySlides = [
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    title: 'Health Insurance',
    desc: 'Comprehensive coverage for medical expenses, hospital stays, and preventive care.',
    color: 'linear-gradient(135deg, rgba(102,126,234,0.82) 0%, rgba(118,75,162,0.82) 100%)',
    tag: 'Most Popular',
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    title: 'Vehicle Insurance',
    desc: 'Protect your vehicle against accidents, theft, and third-party liabilities.',
    color: 'linear-gradient(135deg, rgba(240,147,251,0.78) 0%, rgba(245,87,108,0.82) 100%)',
    tag: 'Best Value',
  },
  {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    title: 'Home Insurance',
    desc: 'Safeguard your home and belongings from natural disasters and unforeseen events.',
    color: 'linear-gradient(135deg, rgba(79,172,254,0.78) 0%, rgba(0,242,254,0.78) 100%)',
    tag: 'Trending',
  },
  {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    title: 'Travel Insurance',
    desc: 'Travel worry-free with coverage for trip cancellations, medical emergencies abroad.',
    color: 'linear-gradient(135deg, rgba(67,233,123,0.78) 0%, rgba(56,249,215,0.78) 100%)',
    tag: 'New',
  },
  {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    title: 'Business Insurance',
    desc: 'Protect your business assets, employees, and operations from unexpected risks.',
    color: 'linear-gradient(135deg, rgba(250,112,154,0.80) 0%, rgba(254,225,64,0.80) 100%)',
    tag: 'Enterprise',
  },
  {
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    title: 'Dental & Vision',
    desc: 'Affordable plans covering routine dental checkups, eyewear, and specialist visits.',
    color: 'linear-gradient(135deg, rgba(161,140,209,0.80) 0%, rgba(251,194,235,0.80) 100%)',
    tag: 'Affordable',
  },
];

const features = [
  { icon: '⚡', title: 'Instant Claims', desc: 'Submit and track claims in real-time with instant status updates.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Bank-grade encryption keeps your data safe at all times.' },
  { icon: '📊', title: 'Smart Dashboard', desc: 'Visual analytics to monitor all your policies and claims at a glance.' },
  { icon: '🤝', title: '24/7 Support', desc: 'Our team is always available to assist you with any queries.' },
];

const stats = [
  { value: '50K+', label: 'Policies Managed' },
  { value: '98%', label: 'Claim Approval Rate' },
  { value: '24h', label: 'Avg. Processing Time' },
  { value: '10K+', label: 'Happy Customers' },
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % discoverySlides.length);
        setAnimating(false);
      }, 300);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const slide = discoverySlides[current];

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-badge">🛡️ Trusted Insurance Platform</span>
          <h1 className="home-title">
            Manage Your Insurance<br />
            <span className="home-title-accent">Simply & Securely</span>
          </h1>
          <p className="home-subtitle">
            One platform to handle all your policies, file claims, and track everything in real-time.
          </p>
          <div className="home-hero-buttons">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn-home-outline">Sign In →</Link>
          </div>
        </div>
        <div className="home-hero-visual">
          <div className="hero-float-card hero-float-1">✅ Claim Approved</div>
          <div className="hero-float-card hero-float-2">📋 3 Active Policies</div>
          <div className="hero-shield">🛡️</div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats">
        {stats.map(s => (
          <div key={s.label} className="home-stat-item">
            <span className="home-stat-value">{s.value}</span>
            <span className="home-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Discovery Panel */}
      <section className="home-discovery">
        <div className="discovery-header">
          <h2>Discover Insurance Plans</h2>
          <p>Explore the right coverage for every aspect of your life</p>
        </div>
        <div className="discovery-panel">
          <div className={`discovery-slide ${animating ? 'slide-out' : 'slide-in'}`}>
            <img src={slide.image} alt={slide.title} className="discovery-bg-img" />
            <div className="discovery-overlay" style={{ background: slide.color }} />
            <div className="discovery-content">
              <span className="discovery-tag">{slide.tag}</span>
              <h3 className="discovery-title">{slide.title}</h3>
              <p className="discovery-desc">{slide.desc}</p>
              <Link to="/register" className="discovery-cta">Explore Plan →</Link>
            </div>
          </div>
          <div className="discovery-thumbnails">
            {discoverySlides.map((s, i) => (
              <button
                key={i}
                className={`discovery-thumb ${i === current ? 'thumb-active' : ''}`}
                onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 300); }}
              >
                <img src={s.image} alt={s.title} className="thumb-img" />
                <div className="thumb-img-overlay" style={{ background: s.color }} />
                <span className="thumb-label">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="discovery-dots">
          {discoverySlides.map((_, i) => (
            <button key={i} className={`discovery-dot ${i === current ? 'dot-active' : ''}`}
              onClick={() => setCurrent(i)} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2>Ready to get protected?</h2>
        <p>Join thousands of customers who trust us with their insurance needs.</p>
        <div className="home-hero-buttons">
          <Link to="/register" className="btn-primary">Create Free Account</Link>
          <Link to="/login" className="btn-home-outline">Already have an account?</Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
