import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Eye, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFullAvatarUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                api.get('/analytics/overview'),
                api.get('/analytics/activity')
            ]);
            setStats(statsRes.data.stats);
            setActivities(activityRes.data.activities);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    if (loading) return <div className="space-y-8 animate-pulse"><div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-3xl"></div><div className="h-96 bg-slate-100 dark:bg-slate-900 rounded-3xl"></div></div>;

    const statCards = [
        { label: 'Total Posts', value: stats?.totalPosts || 0, icon: <FileText size={20} />, color: 'bg-indigo-500' },
        { label: 'Published', value: stats?.publishedPosts || 0, icon: <CheckCircle size={20} />, color: 'bg-emerald-500' },
        { label: 'Total Views', value: stats?.totalViews || 0, icon: <Eye size={20} />, color: 'bg-orange-500' },
        { label: 'Drafts', value: stats?.draftPosts || 0, icon: <Clock size={20} />, color: 'bg-slate-500' },
    ];

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-800 shadow-sm">
                    {user.avatar ? (
                        <img src={getFullAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={40} className="text-indigo-600" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Welcome, {user.name} 👋</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your blogs today.</p>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                        <div className={`w-12 h-12 ${card.color} text-white rounded-2xl flex items-center justify-center mb-4`}>
                            {card.icon}
                        </div>
                        <p className="text-sm font-medium text-slate-500">{card.label}</p>
                        <h3 className="text-3xl font-bold mt-1">{card.value}</h3>
                    </div>
                ))}
            </section>

            {/* Recent Activity */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <Link to="/analytics" className="text-sm font-medium text-indigo-600 hover:underline inline-flex items-center">
                        View Analytics <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                    {activities.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activities.map((act) => (
                                <div key={act._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${act.action === 'published' ? 'bg-emerald-500' :
                                            act.action === 'created' ? 'bg-indigo-500' :
                                                act.action === 'viewed' ? 'bg-orange-500' : 'bg-slate-400'
                                            }`}></div>
                                        <div>
                                            <p className="text-sm">
                                                Post <span className="font-bold">{act.blogId?.title || 'Unknown'}</span> was <span className="font-medium">{act.action}</span>
                                            </p>
                                            <p className="text-xs text-slate-400">{new Date(act.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {act.blogId && (
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/blogs/${act.blogId._id}`}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                title="View Post"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center text-slate-500">No recent activity detected.</div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
