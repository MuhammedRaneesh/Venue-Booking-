// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"

interface ProtectedRouteProps {
  Roles?: string[]
}

const ProtectedRoute = ({ Roles }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (Roles && !Roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute