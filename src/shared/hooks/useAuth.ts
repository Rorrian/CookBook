import { useTypedSelector } from "./useTypedSelector"

export const useAuth = () => {
  const { uid, email } = useTypedSelector(state => state.users)

  return {
    uid,
    email,
    isAuth: !!email,
  }
}
