import { Outlet, Link, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Jobs', path: '/jobs', icon: '💼' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-border flex flex-col flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Bookipi ATS</h1>
          <p className="text-xs text-text-secondary mt-1">Business Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                isActive(item.path)
                  ? 'bg-white text-primary shadow-subtle'
                  : 'text-text-secondary hover:bg-white hover:text-text-primary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* <div className="p-4 border-t border-border">
          <div className="text-xs text-text-secondary">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-medium">Mock Mode Active</span>
            </div>
            <p className="text-[10px] leading-relaxed">
              Switch to live API in <code className="bg-gray-200 px-1 rounded">src/api/config.ts</code>
            </p>
          </div>
        </div> */}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
