import { eventApi } from './api'

export const eventsService = {
  async list(filter = {}) {
    const params = new URLSearchParams()
    if (filter.status) params.set('status', filter.status)
    if (filter.city) params.set('city', filter.city)
    if (filter.from) params.set('from', filter.from)
    if (filter.until) params.set('until', filter.until)
    params.set('page', String(filter.page ?? 1))
    params.set('per_page', String(filter.per_page ?? 12))

    const res = await eventApi.get(`/events?${params.toString()}`)
    return res.data.data
  },

  async getById(id) {
    const res = await eventApi.get(`/events/${id}`)
    return res.data.data
  },

  async getSeats(eventId, availableOnly = false) {
    const query = availableOnly ? '?available=true' : ''
    const res = await eventApi.get(`/events/${eventId}/seats${query}`)
    return res.data.data ?? []
  },

  async listVenues() {
    const res = await eventApi.get('/venues')
    return res.data.data ?? []
  },
}
