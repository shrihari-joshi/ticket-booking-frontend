import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/auth.service'

const initialState = {
  user: null,
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const auth = await authService.login(email, password)
      authService.saveTokens(auth)
      return auth
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Login failed')
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const auth = await authService.register(data)
      authService.saveTokens(auth)
      return auth
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Registration failed')
    }
  }
)

export const fetchProfileThunk = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    return await authService.getProfile()
  } catch (err) {
    return rejectWithValue(err.response?.data?.error ?? 'Failed to fetch profile')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.clearTokens()
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.isAuthenticated = true
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Register
    builder.addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.isAuthenticated = true
    })
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Profile
    builder.addCase(fetchProfileThunk.fulfilled, (state, action) => {
      state.user = action.payload
    })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
