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
import { AnimatePresence } from 'framer-motion';
import { TransitionType } from '@/constant/transitions';
import Transition from '@/components/Transition';

type RouteType = {
	path: string;
	fullPath?: string;
	icon?: string;
	element: JSX.Element;
	transition?: TransitionType;
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
	},
	{
		path: '/jobs',
		element: <JobList />,
	},
	{
		path: '/jobs/:id',
		element: <JobDetail />,
	},
	{
		path: '/jobs/:id/apply',
		element: <JobApply />,
	},
	{
		path: '/jobs/apply/success',
		element: <JobApplySuccess />,
	},
	{
		path: '/my-applications',
		element: <MyApplications />,
	},
];

const AppRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				{APP_ROUTE_LIST.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={
							<Transition className='h-full w-full' type='fade'>
								{route.element}
							</Transition>
						}
					/>
				))}
				<Route path='*' element={<NotFound />} />
			</Routes>
		</AnimatePresence>
	);
};

export default AppRoutes;
