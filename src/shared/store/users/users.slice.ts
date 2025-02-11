import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  uid: string | null
  email: string | null
  token: string | null
}

const initialState: AuthState = {
  uid: null,
  email: null,
  token: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.uid = action.payload.uid
      state.email = action.payload.email
      state.token = action.payload.token
    },

    logout: state => {
      state.uid = null
      state.email = null
      state.token = null
    },
  },
})

export const { login, logout } = usersSlice.actions
export default usersSlice.reducer
