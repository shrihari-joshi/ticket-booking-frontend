import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingsService } from '../../services/bookings.service'

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
}

export const fetchBookingsThunk = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingsService.list()
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to load bookings')
    }
  }
)

export const createBookingThunk = createAsyncThunk(
  'bookings/create',
  async ({ eventId, seatIds }, { rejectWithValue }) => {
    try {
      return await bookingsService.create(eventId, seatIds)
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Booking failed')
    }
  }
)

export const cancelBookingThunk = createAsyncThunk(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      await bookingsService.cancel(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Cancel failed')
    }
  }
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookingsThunk.pending, (state) => { state.loading = true })
    builder.addCase(fetchBookingsThunk.fulfilled, (state, action) => {
      state.loading = false
      state.bookings = action.payload
    })
    builder.addCase(fetchBookingsThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(createBookingThunk.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(createBookingThunk.fulfilled, (state, action) => {
      state.loading = false
      state.bookings.unshift(action.payload)
      state.selectedBooking = action.payload
    })
    builder.addCase(createBookingThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(cancelBookingThunk.fulfilled, (state, action) => {
      const booking = state.bookings.find((b) => b.id === action.payload)
      if (booking) booking.status = 'cancelled'
    })
  },
})

export default bookingsSlice.reducer
