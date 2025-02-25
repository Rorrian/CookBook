import { AccountRecoveryPage } from '@pages/account-recovery'
import { CategoriesPage } from '@pages/categories'
import { FavoritesPage } from '@pages/favorites'
import { GettingStartedPage } from '@pages/getting-started'
import { HomePage } from '@pages/home'
import { LoginPage } from '@pages/login'
import { RecipePage } from '@pages/recipe'
import { RegisterPage } from '@pages/register'
import { ResetPasswordPage } from '@pages/reset-password'
import { SettingsPage } from '@pages/settings'
import { lazy, ReactNode } from 'react'

// const RegisterPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.RegisterPage })),
// )
// const LoginPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.LoginPage })),
// )
// const AccountRecoveryPage = lazy(() =>
//   import('../../pages').then(module => ({
//     default: module.AccountRecoveryPage,
//   })),
// )
// const ResetPasswordPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.ResetPasswordPage })),
// )
// const GettingStartedPage = lazy(() =>
//   import('../../pages').then(module => ({
//     default: module.GettingStartedPage,
//   })),
// )
// const HomePage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.HomePage })),
// )
// const RecipePage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.RecipePage })),
// )
// const CategoriesPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.CategoriesPage })),
// )
// const FavoritesPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.FavoritesPage })),
// )
// const SettingsPage = lazy(() =>
//   import('../../pages').then(module => ({ default: module.SettingsPage })),
// )

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
