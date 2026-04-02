import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createBookingThunk } from '../store/slices/bookingsSlice'
import { eventsService } from '../services/events.service'
import SeatMap from '../components/seats/SeatMap'

export default function BookingPage() {
  const { id: eventId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.bookings)

  const [event, setEvent] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeatIds, setSelectedSeatIds] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (!eventId) return
    Promise.all([
      eventsService.getById(eventId),
      eventsService.getSeats(eventId),
    ]).then(([ev, seatList]) => {
      setEvent(ev)
      setSeats(seatList)
    }).finally(() => setLoadingData(false))
  }, [eventId])

  const handleSeatToggle = (seatId) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    )
  }

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id))
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0)

  const handleConfirmBooking = async () => {
    if (!eventId || selectedSeatIds.length === 0) return
    const result = await dispatch(createBookingThunk({ eventId, seatIds: selectedSeatIds }))
    if (createBookingThunk.fulfilled.match(result)) {
      setBookingSuccess(true)
      setTimeout(() => navigate('/bookings'), 2500)
    }
  }

  if (loadingData) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <span>Loading seat map...</span>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem' }}>🎉</div>
        <h2>Booking Created!</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Payment is being processed. You&apos;ll receive a confirmation shortly.
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Redirecting to your bookings...</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '1100px', padding: '2rem 1.5rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Choose Your Seats</h1>
      {event && (
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          {event.title} — Select up to 6 seats
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        {/* Seat Map */}
        <div className="card" style={{ padding: '2rem' }}>
          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onSeatToggle={handleSeatToggle}
            maxSelectable={6}
          />
        </div>

        {/* Booking Summary */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>

          {selectedSeats.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              Click on green seats to select them
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {selectedSeats.map((seat) => (
                  <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Row {seat.row} · Seat {seat.number}
                    </span>
                    <span style={{ fontWeight: 600 }}>₹{seat.price}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary-light)' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading || selectedSeatIds.length === 0}
                onClick={handleConfirmBooking}
              >
                {loading ? 'Processing...' : `Confirm Booking · ₹${totalAmount.toFixed(2)}`}
              </button>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                Seats held for 15 minutes after booking
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
