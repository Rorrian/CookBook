import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  uid: string | undefined
  email: string | undefined
  token: string | undefined
}

const initialState: AuthState = {
  uid: undefined,
  email: undefined,
  token: undefined,
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
      state.uid = undefined
      state.email = undefined
      state.token = undefined
    },
  },
})

export const { login, logout } = usersSlice.actions
export default usersSlice.reducer
