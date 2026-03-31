import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventByIdThunk } from '../store/slices/eventsSlice'
import { eventsService } from '../services/events.service'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function EventDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selectedEvent: event, loading } = useSelector((state) => state.events)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [seats, setSeats] = useState([])

  useEffect(() => {
    if (id) {
      dispatch(fetchEventByIdThunk(id))
      eventsService.getSeats(id).then(setSeats).catch(console.error)
    }
  }, [id, dispatch])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span>Loading event...</span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <div className="empty-state-title">Event Not Found</div>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const vipCount = seats.filter((s) => s.category === 'vip' && s.status === 'available').length
  const premiumCount = seats.filter((s) => s.category === 'premium' && s.status === 'available').length
  const generalCount = seats.filter((s) => s.category === 'general' && s.status === 'available').length

  return (
    <div className="container" style={{ maxWidth: '900px', padding: '2rem 1.5rem' }}>
      {/* Back link */}
      <Link to="/events" style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
        ← Back to Events
      </Link>

      {/* Hero image */}
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="event-detail-hero" />
      )}

      <div className="event-detail-header">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>{event.title}</h1>
          <span className={`badge badge-${event.status}`}>{event.status}</span>
        </div>

        {event.status === 'published' && event.available_seats > 0 && (
          <Link
            to={isAuthenticated ? `/events/${event.id}/book` : '/login'}
            className="btn btn-primary btn-lg"
            style={{ flexShrink: 0 }}
          >
            {isAuthenticated ? 'Book Tickets' : 'Sign in to Book'}
          </Link>
        )}
      </div>

      <div className="divider" />

      {/* Event info */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            EVENT DETAILS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span>📅</span>
              <div>
                <div style={{ fontWeight: 600 }}>{formatDate(event.start_time)}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  {formatTime(event.start_time)} – {formatTime(event.end_time)}
                </div>
              </div>
            </div>
            {event.venue && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span>📍</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{event.venue.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                    {event.venue.address}, {event.venue.city}, {event.venue.country}
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span>🎟</span>
              <div>
                <div style={{ fontWeight: 600 }}>{event.available_seats} seats available</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                  of {event.total_seats} total
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            PRICING
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {vipCount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span><span className="badge badge-vip">VIP</span></span>
                <span style={{ fontWeight: 700 }}>₹250 · {vipCount} left</span>
              </div>
            )}
            {premiumCount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                <span><span className="badge badge-premium">Premium</span></span>
                <span style={{ fontWeight: 700 }}>₹150 · {premiumCount} left</span>
              </div>
            )}
            {generalCount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <span><span className="badge badge-general">General</span></span>
                <span style={{ fontWeight: 700 }}>₹75 · {generalCount} left</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>About This Event</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          {event.description}
        </p>
      </div>
    </div>
  )
}
