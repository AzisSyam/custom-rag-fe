import React from 'react';
import Cookies from 'js-cookie';
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { LogoutUseCase } from '../../usecases/auth/LogoutUseCase';

interface SidebarProps {
    currentPath: string;
}

const navItems = [
    { name: 'Chat', icon: 'chat_bubble', path: '/chat' },
    { name: 'Documents', icon: 'description', path: '/documents' },
    // { name: 'Profile', icon: 'person', path: '/profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
    const [user, setUser] = React.useState<{ name: string } | null>(null);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    React.useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const repository = new ApiAuthRepository();
            const logoutUseCase = new LogoutUseCase(repository);
            await logoutUseCase.execute();
            
            // Clear auth data
            Cookies.remove('auth_token', { path: '/' });
            localStorage.clear();
        } finally {
            window.location.href = '/login';
        }
    };


    return (
        <aside className="w-72 h-screen bg-surface-container-low border-r border-outline-variant flex flex-col">
            <div className="p-6 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center elevation-1">
                        <span className="material-symbols-outlined text-on-primary">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-on-surface">DocuMind AI</h1>
                        <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Enterprise Analysis</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = currentPath.startsWith(item.path);
                    return (
                        <a
                            key={item.path}
                            href={item.path}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group
                ${isActive
                                    ? 'bg-secondary-container text-on-secondary-container font-semibold elevation-1'
                                    : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                                }
              `}
                        >
                            <span className={`
                material-symbols-outlined 
                ${isActive ? 'fill-1' : 'group-hover:scale-110 transition-transform'}
              `}>
                                {item.icon}
                            </span>
                            <span className="text-sm tracking-wide">{item.name}</span>
                        </a>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-on-surface-variant truncate">Enterprise User</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isLoggingOut ? "Logging out..." : "Logout"}
                    >
                        <span className="material-symbols-outlined">
                            {isLoggingOut ? 'sync' : 'logout'}
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
