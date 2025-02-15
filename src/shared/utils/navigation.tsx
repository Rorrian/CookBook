import { ReactNode } from 'react'

import {
  HomePage,
  FavoritesPage,
  SettingsPage,
  LoginPage,
  RegisterPage,
  CategoriesPage,
  RecipePage,
  GettingStartedPage,
  AccountRecoveryPage,
  ResetPasswordPage,
} from '../../pages'

export interface IRoute {
  path: string
  title: string
  element: ReactNode
  isAuth: boolean
  onlyForUnauth?: boolean
  isHideInHeaderMenu?: boolean
}

export enum RoutePaths {
  REGISTER = '/register',
  LOGIN = '/login',
  ACCOUNT_RECOVERY = '/account-recovery',
  RESET_PASSWORD = 'reset-password',
  CATEGORIES = '/categories',
  GETTING_STARTED = '/getting-started',
  HOME = '/',
  RECIPE = '/recipe/:id',
  FAVORITES = '/favorites',
  SETTINGS = '/settings',
}

export const routes: IRoute[] = [
  {
    path: RoutePaths.REGISTER,
    title: 'Регистрация',
    element: <RegisterPage />,
    isAuth: false,
    onlyForUnauth: true,
  },
  {
    path: RoutePaths.LOGIN,
    title: 'Авторизация',
    element: <LoginPage />,
    isAuth: false,
    onlyForUnauth: true,
  },
  {
    path: RoutePaths.ACCOUNT_RECOVERY,
    title: 'Восстановление аккаунта',
    element: <AccountRecoveryPage />,
    isAuth: false,
    onlyForUnauth: true,
    isHideInHeaderMenu: true,
  },
  {
    path: RoutePaths.RESET_PASSWORD,
    title: 'Сброс пароля',
    element: <ResetPasswordPage />,
    isAuth: false,
    onlyForUnauth: true,
    isHideInHeaderMenu: true,
  },
  {
    path: RoutePaths.GETTING_STARTED,
    title: 'Начало работы',
    element: <GettingStartedPage />,
    isAuth: false,
  },
  {
    path: RoutePaths.HOME,
    title: 'Рецепты',
    element: <HomePage />,
    isAuth: true,
  },
  {
    path: RoutePaths.RECIPE,
    title: 'Текущий рецепт',
    element: <RecipePage />,
    isAuth: true,
  },
  {
    path: RoutePaths.CATEGORIES,
    title: 'Категории',
    element: <CategoriesPage />,
    isAuth: true,
  },
  {
    path: RoutePaths.FAVORITES,
    title: 'Избранное',
    element: <FavoritesPage />,
    isAuth: true,
  },
  {
    path: RoutePaths.SETTINGS,
    title: 'Настройки',
    element: <SettingsPage />,
    isAuth: true,
  },
]
