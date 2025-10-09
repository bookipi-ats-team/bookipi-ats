import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/user.store';

interface AuthGuardProps {
	children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
	const { isAuthenticated, email } = useUserStore();
	const location = useLocation();

	// Check if user is authenticated (has email in store)
	if (!isAuthenticated || !email) {
		// Redirect to login page with the attempted location
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return <>{children}</>;
};

export default AuthGuard;
