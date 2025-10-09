import { Link, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';

const BottomNav = () => {
	const location = useLocation();
	const isAndroid = Capacitor.getPlatform() === 'android';

	const isActive = (path: string) => location.pathname === path;

	const navItems = [
		{ path: '/jobs', icon: Briefcase, label: 'Jobs' },
		{ path: '/my-applications', icon: FileText, label: 'Applications' },
		{ path: '/profile', icon: User, label: 'Profile' },
	];

	return (
		<nav className='md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 backdrop-blur-sm'>
			<div
				className={cn('flex items-center justify-around p-4 ', {
					'pb-safe-bottom': !isAndroid,
				})}
			>
				{navItems.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.path);

					return (
						<Link
							key={item.path}
							to={item.path}
							className={`flex flex-col items-center gap-1 transition-all duration-200 ${
								active
									? 'text-primary scale-105'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							<Icon className={`h-5 w-5 ${active ? '' : ''}`} />
							<span className='text-xs font-medium'>{item.label}</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

export default BottomNav;
