import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, FileText, Edit, Trash2, Settings, Save, X, ImageIcon, Upload } from 'lucide-react';
import { getFullAvatarUrl } from '../utils/imageUrl';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            bio: user?.bio || '',
            avatar: user?.avatar || ''
        }
    });

    const avatarUrl = watch('avatar');

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const { data } = await api.get('/blogs?status=all');
                setBlogs(data.blogs);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
        if (user?._id) fetchMyBlogs();
    }, [user?._id]);


    const onSubmit = async (data) => {
        try {
            await updateProfile(data);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File is too large (max 2MB)');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await api.post('/auth/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.success) {
                setValue('avatar', data.url);
                toast.success('Image uploaded!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/blogs/${id}`);
                setBlogs(blogs.filter(b => b._id !== id));
                toast.success('Post deleted');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Profile Header */}
            <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm transition-colors relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden shrink-0 border-4 border-white dark:border-slate-800 shadow-sm">
                        {isEditing ? (
                            avatarUrl ? (
                                <img src={getFullAvatarUrl(avatarUrl)} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={64} />
                            )
                        ) : user.avatar ? (
                            <img src={getFullAvatarUrl(user.avatar)} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} />
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-medium text-xs w-fit mx-auto md:mx-0"
                                >
                                    <Settings size={14} /> Edit Profile
                                </button>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-slate-500">
                                <span className="flex items-center gap-1 text-sm"><Mail size={16} /> {user.email}</span>
                                <span className="flex items-center gap-1 text-sm"><FileText size={16} /> {blogs.length} Posts</span>
                            </div>
                            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl">
                                {user.bio || "No bio yet. Tell the world about yourself!"}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name</label>
                                    <input
                                        {...register('name', { required: 'Name is required' })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                                    <input
                                        {...register('email', { required: 'Email is required' })}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avatar URL</label>
                                    <div className="relative">
                                        <input
                                            {...register('avatar')}
                                            placeholder="https://example.com/avatar.jpg"
                                            className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                        />
                                        <ImageIcon size={18} className="absolute right-3 top-3 text-slate-400" />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 rounded-xl transition-all text-sm font-medium text-slate-600 dark:text-slate-400"
                                    >
                                        {uploading ? (
                                            <>Uploading...</>
                                        ) : (
                                            <><Upload size={16} /> Upload from computer</>
                                        )}
                                    </button>
                                    {avatarUrl && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setValue('avatar', '', { shouldDirty: true, shouldValidate: true });
                                                toast.success('Photo removed locally. Save to confirm.');
                                            }}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all text-sm font-medium border border-red-100 dark:border-red-900/30"
                                            title="Remove Photo"
                                        >
                                            <Trash2 size={16} /> <span className="sm:hidden lg:inline">Remove</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                                <textarea
                                    {...register('bio')}
                                    rows="2"
                                    placeholder="Tell us about yourself..."
                                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none shadow-sm"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                                    <Save size={18} /> Save Changes
                                </button>
                                <button type="button" onClick={() => { setIsEditing(false); reset(); }} className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all font-bold">
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            {/* My Posts */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Posts</h2>
                    <Link to="/editor" className="text-sm font-bold text-indigo-600 hover:underline">New Post</Link>
                </div>
                <div className="grid gap-4">
                    {blogs.map(blog => (
                        <div key={blog._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${blog.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <FileText size={20} />
                                </div>
                                <div className="truncate">
                                    <h3 className="font-bold truncate">{blog.title}</h3>
                                    <p className="text-xs text-slate-400">{new Date(blog.createdAt).toLocaleDateString()} • <span className="capitalize">{blog.status}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link to={`/editor/${blog._id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit">
                                    <Edit size={18} />
                                </Link>
                                <button onClick={() => handleDelete(blog._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {blogs.length === 0 && !loading && (
                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 mb-4">You haven't written any posts yet.</p>
                            <Link to="/editor" className="inline-block px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl active:scale-95 transition-all">Start Writing</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Profile;
