import { Navigate } from 'react-router'
import useAuthStore from '../store/authStore'

interface Props {
    children?: React.ReactNode
}

function useAuthGuard() {
    const { user, loading } = useAuthStore()

    const ProtectedRoute = ({ children }: Props) => {
        if (loading) {
            return <></>
        }

        if (!user) {
            return <Navigate to={'/login'} />
        }

        return children
    }

    const PublicRoute = ({ children }: Props) => {
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