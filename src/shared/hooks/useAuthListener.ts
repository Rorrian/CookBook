import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '@heroui/react'

import { supabase } from '@libs/supabase'

import { login, logout } from '../store/users/users.slice'
import { useAuth } from './useAuth'

export const updateSession = async (
  dispatch: Function,
  isAuth: boolean = true,
) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session && isAuth) {
      const { user, access_token } = sessionData.session
      dispatch(login({ uid: user.id, email: user.email, token: access_token }))
    }
  } catch (error) {
    console.error(error)
    addToast({
      title: 'Не удалось обновить сессию:',
      description: error?.toString(),
      color: 'danger',
      timeout: 5000,
    })
  }
}

export const useAuthListener = () => {
  const dispatch = useDispatch()
  const { isAuth } = useAuth()

  useEffect(() => {
    updateSession(dispatch, isAuth)

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
