import { ReactNode } from 'react'

import {
  HomePage,
  FavoritesPage,
  LKPage,
  LoginPage,
  RegisterPage,
  CategoriesPage,
  RecipePage,
  GettingStartedPage,
} from '../../pages'

export interface IRoute {
  path: string
  title: string
  element: ReactNode
  isAuth: boolean
  onlyForUnauth?: boolean
}

export enum RoutePaths {
  CATEGORIES = '/categories',
  REGISTER = '/register',
  LOGIN = '/login',
  GETTING_STARTED = '/getting-started',
  HOME = '/',
  FAVORITES = '/favorites',
  LK = '/lk',
  RECIPE = '/recipe/:id',
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
    path: RoutePaths.LK,
    title: 'Профиль',
    element: <LKPage />,
    isAuth: true,
  },
]
