import { useLocation, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import JobList from '@/pages/JobList/JobListPage';
import JobDetail from '@/pages/JobDetail';
import JobApply from '@/pages/JobApply/JobApplyPage';
import JobApplySuccess from '@/pages/JobApplySuccess';
import MyApplications from '@/pages/MyApplications';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import AuthGuard from '@/routes/AuthGuard';
import { AnimatePresence } from 'framer-motion';
import { TransitionType } from '@/constant/transitions';
import Transition from '@/components/Transition';

type RouteType = {
	path: string;
	fullPath?: string;
	icon?: string;
	element: JSX.Element;
	transition?: TransitionType;
	requiresAuth?: boolean;
};

const APP_ROUTE_LIST: RouteType[] = [
	{
		path: '/',
		element: <Index />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/profile',
		element: <Profile />,
		requiresAuth: true,
	},
	{
		path: '/jobs',
		element: <JobList />,
		requiresAuth: true,
	},
	{
		path: '/jobs/:id',
		element: <JobDetail />,
		requiresAuth: true,
	},
	{
		path: '/jobs/:id/apply',
		element: <JobApply />,
		requiresAuth: true,
	},
	{
		path: '/jobs/apply/success',
		element: <JobApplySuccess />,
		requiresAuth: true,
	},
	{
		path: '/my-applications',
		element: <MyApplications />,
		requiresAuth: true,
	},
];

const AppRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode='wait'>
			<main className='app-container'>
				<Routes location={location} key={location.pathname}>
					{APP_ROUTE_LIST.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={
								<Transition className='h-full w-full' type='fade'>
									{route.requiresAuth ? (
										<AuthGuard>{route.element}</AuthGuard>
									) : (
										route.element
									)}
								</Transition>
							}
						/>
					))}
					<Route path='*' element={<NotFound />} />
				</Routes>
			</main>
		</AnimatePresence>
	);
};

export default AppRoutes;
