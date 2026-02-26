import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, FileText, LayoutDashboard, User } from 'lucide-react';
import { getFullAvatarUrl } from '../utils/imageUrl';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    MarkBlog
                </Link>

                <div className="flex items-center gap-1 md:gap-2">
                    {user && (
                        <>
                            <Link to="/blogs" className="px-2 py-1 hover:text-indigo-500 transition-colors text-sm font-medium">Blogs</Link>
                            <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Dashboard">
                                <LayoutDashboard size={20} />
                            </Link>
                            <Link to="/editor" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="New Post">
                                <FileText size={20} />
                            </Link>
                        </>
                    )}

                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Theme">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all flex items-center justify-center bg-slate-100 dark:bg-slate-800" title="Profile">
                                {user.avatar ? (
                                    <img src={getFullAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} />
                                )}
                            </Link>
                            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-3 py-2 text-sm font-medium hover:text-indigo-500 transition-colors">Login</Link>
                            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-shadow">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
