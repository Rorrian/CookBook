import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { supabase } from '@libs/supabase'

import { login, logout } from '../store/users/users.slice'
import { useAuth } from './useAuth'

export const useAuthListener = () => {
  const dispatch = useDispatch()
  const { isAuth } = useAuth()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && isAuth) {
        const { user, access_token } = session
        dispatch(
          login({ uid: user.id, email: user.email, token: access_token }),
        )
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && isAuth) {
        const { user, access_token } = session
        dispatch(
          login({ uid: user.id, email: user.email, token: access_token }),
        )
      } else {
        dispatch(logout())
      }
    })

    return () => subscription?.unsubscribe()
  }, [dispatch, isAuth])
}
