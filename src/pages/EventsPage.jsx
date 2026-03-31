import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventsThunk } from '../store/slices/eventsSlice'
import EventCard from '../components/events/EventCard'

export default function EventsPage() {
  const dispatch = useDispatch()
  const { events, loading, error, total, perPage } = useSelector((state) => state.events)
  const [cityFilter, setCityFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchEventsThunk({
      status: 'published',
      city: cityFilter || undefined,
      page: currentPage,
      per_page: 12,
    }))
  }, [dispatch, cityFilter, currentPage])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          {total > 0 ? `${total} events found` : 'No events available'}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          className="form-input"
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1) }}
          style={{ maxWidth: '280px' }}
        />
        {cityFilter && (
          <button className="btn btn-secondary btn-sm" onClick={() => setCityFilter('')}>
            Clear
          </button>
        )}
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span>Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎭</div>
          <div className="empty-state-title">No events found</div>
          <p>Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span style={{ padding: '0.4rem 1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
