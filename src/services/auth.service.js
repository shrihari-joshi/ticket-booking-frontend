import { userApi } from './api'

export const authService = {
  async register(data) {
    const res = await userApi.post('/auth/register', data)
    return res.data.data
  },

  async login(email, password) {
    const res = await userApi.post('/auth/login', { email, password })
    return res.data.data
  },

  async getProfile() {
    const res = await userApi.get('/users/me')
    return res.data.data
  },

  async updateProfile(data) {
    const res = await userApi.patch('/users/me', data)
    return res.data.data
  },

  async changePassword(old_password, new_password) {
    const res = await userApi.put('/users/me/password', { old_password, new_password })
    return res.data.data
  },

  saveTokens(auth) {
    localStorage.setItem('access_token', auth.access_token)
    localStorage.setItem('refresh_token', auth.refresh_token)
  },

  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}
