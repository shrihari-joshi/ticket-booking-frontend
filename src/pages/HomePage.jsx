import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function HomePage() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div>
      {/* Dynamic Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            The Ultimate <span className="hero-highlight">Indian Movie</span> Experience
          </h1>
          <p className="hero-subtitle">
            Secure your seats for the biggest blockbusters hitting the screens. Fast, secure, and hassle-free booking on TicketKhidki.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              Book Tickets Now 🎟️
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="section" style={{ background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>⚡</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Flash Booking</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Event-driven architecture means you secure your seats in milliseconds. No more waiting in long digital queues.
              </p>
            </div>
            
            <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>💺</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>120-Seat Layouts</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Interactive 120-seat maps. Choose from Economy, Premium, or Balcony categories instantly.
              </p>
            </div>

            <div className="card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>📱</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Dynamic QR Codes</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Your ticket is on your phone. Instantly generated QR codes to seamlessly scan and walk into the cinema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div 
            className="card" 
            style={{
              padding: '4rem 2rem',
              background: 'linear-gradient(135deg, var(--color-surface-2) 0%, var(--color-surface) 100%)',
              border: '2px solid var(--color-primary)',
              boxShadow: '0 0 40px var(--color-primary-glow)'
            }}
          >
            <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Are you ready to grab your Khidki seats?</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
              Join thousands of cinephiles experiencing movies the right way.
            </p>
            {isAuthenticated ? (
              <Link to="/events" className="btn btn-primary btn-lg">Browse Movies →</Link>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
