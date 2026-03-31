import { bookingApi } from './api'

export const bookingsService = {
  async create(eventId, seatIds) {
    const res = await bookingApi.post('/bookings', {
      event_id: eventId,
      seat_ids: seatIds,
    })
    return res.data.data
  },

  async list() {
    const res = await bookingApi.get('/bookings')
    return res.data.data ?? []
  },

  async getById(id) {
    const res = await bookingApi.get(`/bookings/${id}`)
    return res.data.data
  },

  async cancel(id) {
    await bookingApi.delete(`/bookings/${id}`)
  },
}
