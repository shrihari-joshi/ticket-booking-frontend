import PropTypes from 'prop-types'
import { useState } from 'react'

export default function SeatMap({
  seats,
  selectedSeatIds,
  onSeatToggle,
  maxSelectable = 6,
}) {
  const [hoveredSeat, setHoveredSeat] = useState(null)

  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = []
    acc[seat.row].push(seat)
    return acc
  }, {})

  const sortedRows = Object.keys(rows).sort()

  const getSeatClass = (seat) => {
    const base = 'seat'
    const category = `seat-${seat.category}`

    if (seat.status === 'booked') return `${base} seat-booked ${category}`
    if (seat.status === 'held') return `${base} seat-held ${category}`
    if (selectedSeatIds.includes(seat.id)) return `${base} seat-selected ${category}`
    return `${base} seat-available ${category}`
  }

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return
    if (!selectedSeatIds.includes(seat.id) && selectedSeatIds.length >= maxSelectable) return
    onSeatToggle(seat.id)
  }

  return (
    <div className="seat-map">
      {/* Stage */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        padding: '0.5rem 2rem',
        background: 'var(--color-surface-2)',
        borderRadius: '4px',
        color: 'var(--color-text-muted)',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: 3,
        maxWidth: '300px',
        margin: '0 auto 1.5rem',
      }}>
        STAGE
      </div>

      {/* Legend */}
      <div className="seat-legend">
        {[
          { label: 'Economy (₹75)', color: 'rgba(239, 68, 68, 0.2)', border: '#ef4444' },
          { label: 'Premium (₹112)', color: 'rgba(239, 68, 68, 0.5)', border: '#dc2626' },
          { label: 'Balcony (₹150)', color: 'rgba(239, 68, 68, 0.8)', border: '#b91c1c' },
          { label: 'Selected', color: 'var(--color-primary)', border: 'var(--color-primary)' },
          { label: 'Booked', color: 'var(--color-surface)', border: 'var(--color-border)' },
        ].map((item) => (
          <div key={item.label} className="seat-legend-item">
            <div className="seat-legend-dot" style={{ background: item.color, borderColor: item.border }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Seat Grid */}
      <div className="seat-grid">
        {sortedRows.map((row) => (
          <div key={row} className="seat-row">
            <span className="seat-row-label">{row}</span>
            {rows[row]
              .sort((a, b) => a.number - b.number)
              .map((seat) => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  title={`Row ${seat.row} Seat ${seat.number} — ${seat.category} — ₹${seat.price}`}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                >
                  {seat.number}
                </div>
              ))}
          </div>
        ))}
      </div>

      {hoveredSeat && (() => {
        const seat = seats.find((s) => s.id === hoveredSeat)
        if (!seat || seat.status !== 'available') return null
        return (
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.5rem',
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
          }}>
            Row {seat.row} · Seat {seat.number} · <strong>{seat.category}</strong> · <strong>₹{seat.price}</strong>
          </div>
        )
      })()}
    </div>
  )
}

SeatMap.propTypes = {
  seats: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    row: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
  selectedSeatIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSeatToggle: PropTypes.func.isRequired,
  maxSelectable: PropTypes.number,
}