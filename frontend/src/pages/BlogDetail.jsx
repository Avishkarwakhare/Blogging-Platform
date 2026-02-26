import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import { Calendar, Eye, User, ChevronLeft } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${id}`);
                setBlog(data.blog);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        fetchBlog();
    }, [id]);

    if (loading) return <div className="max-w-4xl mx-auto py-20 animate-pulse bg-slate-100 dark:bg-slate-900 rounded-3xl h-96"></div>;
    if (!blog) return <div className="text-center py-20">Blog not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Link to="/blogs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Back to Blogs
            </Link>

            {blog.coverImage && (
                <img src={getImageUrl(blog.coverImage)} alt={blog.title} className="w-full h-[400px] object-cover rounded-3xl shadow-xl" />
            )}

            <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{blog.title}</h1>

                <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">{blog.userId.name}</p>
                            <p className="text-xs text-slate-500">Author</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={18} />
                        <span className="text-sm">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                        <Eye size={18} />
                        <span className="text-sm">{blog.views} Views</span>
                    </div>
                    <div className="ml-auto">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase">{blog.category}</span>
                    </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {blog.content}
                    </ReactMarkdown>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                    <div className="pt-10 flex flex-wrap gap-2">
                        {blog.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogDetail;
