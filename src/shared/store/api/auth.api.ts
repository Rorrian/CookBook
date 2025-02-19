import { AuthCredentials } from '@/src/types'
import { supabase } from '@libs/supabase'
import { RoutePaths } from '@shared/utils/navigation'

export const authApi = {
  async signIn(
    { email, password }: AuthCredentials,
    validateCurrentPassword = false,
  ) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message === 'Invalid login credentials') {
        if (validateCurrentPassword) {
          throw new Error('Текущий пароль указан неверный!')
        } else {
          throw new Error('Почта или пароль не верны!')
        }
      }
      throw error
    }

    return data
  },

  async signUp({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (data && data?.user) {
      await supabase.from('users').insert({ id: data.user.id })
    }

    if (error) throw error

    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },

  async resetPassword(email: string) {
    const redirectUrl = `${window.location.origin}/${RoutePaths.RESET_PASSWORD}`
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })
    if (error) throw error

    return data
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return data
  },
}
