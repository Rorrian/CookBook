import { AuthCredentials } from '@/src/types'
import { supabase } from '@libs/supabase'
import { BASE_URL } from '@shared/utils/constants'

export const authApi = {
  async signIn({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return data
  },

  async signUp({ email, password }: AuthCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: BASE_URL,
      },
    })

    if (error) throw error

    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },
}
