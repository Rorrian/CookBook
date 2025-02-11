import { Navigate, Routes, Route } from 'react-router-dom'

import { IRoute, RoutePaths, routes } from '@shared/utils/navigation'
import { useAuth } from '@shared/hooks'
import { Error404 } from '@pages/Error404'

import { Layout } from '../Layout/Layout'

const filterRoutes = (routes: IRoute[], isAuth: boolean): IRoute[] => {
  return routes.filter(route => {
    if (route.onlyForUnauth && isAuth) return false
    if (route.isAuth && !isAuth) return false
    return true
  })
}

export const Navigation = () => {
  const { isAuth } = useAuth()

  const filteredRoutes = filterRoutes(routes, isAuth)

  return (
    <Routes>
      <Route element={<Layout />}>
        {filteredRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {isAuth && (
          <>
            <Route
              path={RoutePaths.REGISTER}
              element={<Navigate to={RoutePaths.HOME} replace />}
            />
            <Route
              path={RoutePaths.LOGIN}
              element={<Navigate to={RoutePaths.HOME} replace />}
            />
          </>
        )}

        {!isAuth && (
          <Route
            path="*"
            element={<Navigate to={RoutePaths.LOGIN} replace />}
          />
        )}

        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  )
}
