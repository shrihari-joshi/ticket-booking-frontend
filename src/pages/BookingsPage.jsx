import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { fetchBookingsThunk, cancelBookingThunk } from '../store/slices/bookingsSlice'
import PropTypes from 'prop-types'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function BookingStatusBadge({ status }) {
  const map = {
    pending: 'badge badge-pending',
    confirmed: 'badge badge-confirmed',
    cancelled: 'badge badge-cancelled',
    expired: 'badge badge-expired',
    refunded: 'badge badge-expired',
  }
  return <span className={map[status] ?? 'badge'}>{status}</span>
}

BookingStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export default function BookingsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { bookings, loading, error } = useSelector((state) => state.bookings)

  useEffect(() => {
    dispatch(fetchBookingsThunk())
  }, [dispatch])

  const handleCancel = (e, id) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBookingThunk(id))
    }
  }

  const generateQRPayload = (booking) => {
    const seatsList = (booking.items || []).map(i => `${i.row}${i.number}(${i.category})`).join(', ');
    return JSON.stringify({
      ID: booking.id,
      Amount: `INR ${booking.total_amount.toFixed(2)}`,
      Mode: "Online (NetBanking)",
      Date: formatDate(booking.created_at),
      Seats: seatsList
    }, null, 2);
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Tickets & Bookings</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          {bookings.length} total bookings
        </p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span>Syncing your passes...</span>
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginBottom: '2rem' }}>{error}</div>}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎟</div>
          <div className="empty-state-title">No bookings yet</div>
          <p style={{ marginBottom: '1.5rem' }}>Browse Indian blockbusters and grab your seats!</p>
          <button onClick={() => navigate('/events')} className="btn btn-primary">Explore Movies</button>
        </div>
      )}

      {/* Grid of 2 cards per row */}
      <div className="grid-2">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => {
              // Expand behavior or navigate, currently just a placeholder click
            }}
          >
            {/* Top Row: Meta and Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <BookingStatusBadge status={booking.status} />
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {formatDate(booking.created_at)}
                </div>
                <div style={{ marginTop: '0.3rem', fontSize: '0.80rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  ID: {booking.id.split('-')[0].toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ₹{booking.total_amount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {booking.items?.length ?? 0} seats
                </div>
              </div>
            </div>

            {/* Split Bottom: Seats + Actions / QR Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>

              <div style={{ flex: 1 }}>
                {booking.items && booking.items.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {booking.items.map((item) => (
                      <span key={item.id} className={`badge badge-${item.category}`} style={{ fontSize: '0.7rem' }}>
                        Row {item.row} · {item.number}
                      </span>
                    ))}
                  </div>
                )}

                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => handleCancel(e, booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              {/* QR Code */}
              {booking.status === 'confirmed' && (
                <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                  <QRCodeSVG
                    value={generateQRPayload(booking)}
                    size={80}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                  />
                  <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#000', marginTop: '4px', fontWeight: 'bold' }}>SCAN TICKET</div>
                </div>
              )}
            </div>

            {/* Edge accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--color-primary)' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
