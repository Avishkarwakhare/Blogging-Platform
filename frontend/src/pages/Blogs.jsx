import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('latest');
    const [status, setStatus] = useState('');

    const categories = ['Technology', 'Lifestyle', 'Education', 'Health', 'Finance', 'Other'];

    useEffect(() => {
        fetchBlogs();
    }, [category, sort, status]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/blogs?search=${search}&category=${category}&sort=${sort}&status=${status}`);
            setBlogs(data.blogs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBlogs();
    };

    const getPageTitle = () => {
        if (status === 'draft') return 'My Drafts';
        if (status === 'published') return 'My Published';
        return 'Discover Stories';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{getPageTitle()}</h1>

                <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search blogs or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </form>

                <div className="flex items-center gap-2">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="px-4 py-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    >
                        <option value="latest">Latest</option>
                        <option value="views">Most Viewed</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                    >
                        <option value="">All Stories</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>)}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <Link key={blog._id} to={`/blogs/${blog._id}`} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all">
                            {blog.coverImage && (
                                <img src={getImageUrl(blog.coverImage)} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                            )}
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-3">
                                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">{blog.category}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors uppercase truncate">{blog.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{blog.excerpt || blog.content.substring(0, 100)}...</p>
                                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={14} />
                                        {blog.views}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {!loading && blogs.length === 0 && (
                <div className="text-center py-20 bg-slate-100 dark:bg-slate-900 rounded-2xl">
                    <p className="text-slate-500">No blogs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Blogs;
