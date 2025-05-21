import { Navigate } from 'react-router'
import useAuthStore from '../store/authStore'

function useAuthGuard() {
    const { user, loading } = useAuthStore()

    const ProtectedRoute = ({ children }) => {
        if (loading) {
            return <></>
        }

        if (!user) {
            return <Navigate to={'/login'} />
        }

        return children
    }

    const PublicRoute = ({ children }) => {
        if (loading) {
            return <></>
        }

        if (user) {
            return <Navigate to={'/'} />
        }

        return children
    }
    return {ProtectedRoute, PublicRoute};
}

export default useAuthGuard;