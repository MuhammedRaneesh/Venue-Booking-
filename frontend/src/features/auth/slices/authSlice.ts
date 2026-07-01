import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type  { AuthState, User } from '../types/auth.types'

const initialState: AuthState = {
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state,action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user
    },
    logout: (state) => {
      state.user = null
      state.token = null
    },
  },
})

export const { setCredentials, logout   } = authSlice.actions

export default authSlice.reducer