import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Award, PieChart as PieIcon, Activity } from 'lucide-react';

const Analytics = () => {
    const [viewData, setViewData] = useState([]);
    const [topPosts, setTopPosts] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#f97316', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [viewsRes, topRes, catRes] = await Promise.all([
                    api.get('/analytics/views-over-time'),
                    api.get('/analytics/top-posts'),
                    api.get('/analytics/category-distribution')
                ]);
                setViewData(viewsRes.data.data);
                setTopPosts(topRes.data.data);
                setCategoryData(catRes.data.data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    const getProInsight = () => {
        if (!categoryData || categoryData.length === 0) return {
            text: "Start writing to see your content distribution and growth insights!",
            suggestion: "Post your first blog to begin tracking your reach."
        };

        const sorted = [...categoryData].sort((a, b) => b.count - a.count);
        const top = sorted[0]._id;

        const insights = {
            'Technology': {
                text: `Content reach has grown consistently. "Technology" is your most engaging category.`,
                suggestion: `Consider posting more deep-dives into React and MERN stack to leverage current trends.`
            },
            'Lifestyle': {
                text: `Your "Lifestyle" posts are resonating well with your audience.`,
                suggestion: `Share more personal stories or daily routines to further increase engagement.`
            },
            'Education': {
                text: `Educational content is driving high engagement on your profile.`,
                suggestion: `Create more tutorial-style posts or "How-to" guides to help your readers learn.`
            },
            'Health': {
                text: `Your focus on "Health" is attracting a health-conscious audience.`,
                suggestion: `Explore trending wellness topics or research-based health tips for your next post.`
            },
            'Finance': {
                text: `Insights into "Finance" are proving to be very popular.`,
                suggestion: `Discuss market trends or personal budgeting tips to provide more value.`
            },
            'Other': {
                text: `Your diverse topics in the "Other" category are grabbing attention.`,
                suggestion: `Try to identify which specific topics within "Other" are most popular to create focused series.`
            }
        };

        return insights[top] || {
            text: `Your content in "${top}" is showing great promise.`,
            suggestion: `Keep exploring this category to see how your audience responds!`
        };
    };

    const insight = getProInsight();

    if (loading) return <div className="grid md:grid-cols-2 gap-8 animate-pulse">{[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl"></div>)}</div>;

    return (
        <div className="space-y-10 pb-10">
            <header>
                <h1 className="text-3xl font-bold">Analytics & Insights</h1>
                <p className="text-slate-500 mt-1">Deep dive into your content performance.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Views Over Time */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center gap-3 mb-8 text-indigo-600">
                        <TrendingUp size={24} />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Views Over Time (30 Days)</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={viewData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={4} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Top Posts */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center gap-3 mb-8 text-emerald-600">
                        <Award size={24} />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Performing Posts</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPosts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="title" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={100} />
                                <Tooltip />
                                <Bar dataKey="views" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Category Split */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center gap-3 mb-8 text-orange-600">
                        <PieIcon size={24} />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Category Distribution</h2>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="count"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={60}
                                    paddingAngle={5}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Summary Info */}
                <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-lg overflow-hidden relative">
                    <Activity className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
                    <h2 className="text-2xl font-bold mb-4">Pro Insight</h2>
                    <p className="text-indigo-100 leading-relaxed mb-6">
                        {insight.text} {insight.suggestion}
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1">
                            <p className="text-xs text-indigo-200">Growth Rate</p>
                            <p className="text-2xl font-bold">+12.5%</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1">
                            <p className="text-xs text-indigo-200">Engagement</p>
                            <p className="text-2xl font-bold">High</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Analytics;
