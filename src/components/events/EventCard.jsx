import { useNavigate } from 'react-router-dom'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EventCard({ event }) {
  const navigate = useNavigate()

  const statusClass = `badge badge-${event.status}`

  return (
    <div className="card event-card" onClick={() => navigate(`/events/${event.id}`)}>
      {event.image_url ? (
        <img
          src={event.image_url}
          alt={event.title}
          className="event-card-image"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="event-card-image-placeholder">🎵</div>
      )}

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-meta">
          <span>📅 {formatDate(event.start_time)} · {formatTime(event.start_time)}</span>
          {event.venue && <span>📍 {event.venue.name}, {event.venue.city}</span>}
          <span>🎟 {event.available_seats} seats left</span>
        </div>

        <div className="event-card-footer">
          <span className="event-card-price">
            From ₹75
          </span>
          <span className={statusClass}>{event.status.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  )
}
