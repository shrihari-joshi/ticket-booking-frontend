import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { eventsService } from '../../services/events.service'

const initialState = {
  events: [],
  selectedEvent: null,
  total: 0,
  page: 1,
  perPage: 12,
  loading: false,
  error: null,
}

export const fetchEventsThunk = createAsyncThunk(
  'events/fetchAll',
  async (filter = {}, { rejectWithValue }) => {
    try {
      return await eventsService.list(filter)
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Failed to load events')
    }
  }
)

export const fetchEventByIdThunk = createAsyncThunk(
  'events/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await eventsService.getById(id)
    } catch (err) {
      return rejectWithValue(err.response?.data?.error ?? 'Event not found')
    }
  }
)

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selectedEvent = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEventsThunk.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(fetchEventsThunk.fulfilled, (state, action) => {
      state.loading = false
      state.events = action.payload.events ?? []
      state.total = action.payload.total
      state.page = action.payload.page
      state.perPage = action.payload.per_page
    })
    builder.addCase(fetchEventsThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(fetchEventByIdThunk.pending, (state) => { state.loading = true })
    builder.addCase(fetchEventByIdThunk.fulfilled, (state, action) => {
      state.loading = false
      state.selectedEvent = action.payload
    })
    builder.addCase(fetchEventByIdThunk.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})

export const { clearSelected } = eventsSlice.actions
export default eventsSlice.reducer
