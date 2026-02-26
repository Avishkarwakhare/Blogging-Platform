import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Save, Eye, EyeOff, Image as ImageIcon, Tag, Layout, X, FileUp } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isPreview, setIsPreview] = useState(false);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            status: 'draft',
            category: 'Other',
            tags: ''
        }
    });

    const content = watch('content');
    const title = watch('title');

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const { data } = await api.get(`/blogs/${id}`);
                    if (data.success) {
                        setValue('title', data.blog.title);
                        setValue('content', data.blog.content);
                        setValue('category', data.blog.category);
                        setValue('status', data.blog.status);
                        setValue('coverImage', data.blog.coverImage);
                        setValue('tags', data.blog.tags.join(', '));
                    }
                } catch (error) {
                    toast.error('Failed to load blog post');
                }
            };
            fetchBlog();
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
        };

        try {
            if (id) {
                await api.put(`/blogs/${id}`, formattedData);
                toast.success('Post updated!');
            } else {
                await api.post('/blogs', formattedData);
                toast.success('Post created!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save post');
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            return toast.error('Please upload a PDF file');
        }

        const formData = new FormData();
        formData.append('pdf', file);

        setIsPdfLoading(true);
        try {
            const { data } = await api.post('/pdf/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                const currentContent = watch('content') || '';
                setValue('content', currentContent + (currentContent ? '\n\n' : '') + data.text);
                toast.success('PDF content extracted!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'PDF upload failed');
        }
        setIsPdfLoading(false);
    };

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col space-y-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex-1 min-w-[300px]">
                        <input
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Post Title..."
                            className="w-full text-2xl font-bold bg-transparent outline-none border-b border-transparent focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="file"
                            id="pdfUpload"
                            className="hidden"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('pdfUpload').click()}
                            disabled={isPdfLoading}
                            className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 transition-colors"
                            title="Upload PDF"
                        >
                            <FileUp size={20} className={isPdfLoading ? 'animate-pulse' : ''} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
                            title={isPreview ? "Hide Preview" : "Show Preview"}
                        >
                            {isPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
                        >
                            <Save size={20} /> Save
                        </button>
                    </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 flex gap-6 overflow-hidden">
                    {/* Settings Sidebar */}
                    <div className="w-80 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-y-auto transition-colors">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-500">
                                <Layout size={16} /> Category
                            </label>
                            <select
                                {...register('category')}
                                className="w-full p-2.5 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                            >
                                {['Technology', 'Lifestyle', 'Education', 'Health', 'Finance', 'Other'].map(cat => (
                                    <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-500">
                                <ImageIcon size={16} /> Cover Image
                            </label>
                            <div className="space-y-3">
                                {watch('coverImage') && (
                                    <div className="relative group rounded-xl overflow-hidden border dark:border-slate-800 aspect-video bg-slate-50 dark:bg-slate-900">
                                        <img
                                            src={getImageUrl(watch('coverImage'))}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setValue('coverImage', '')}
                                            className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-700 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    id="coverUpload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('coverImage', file);

                                        try {
                                            const { data } = await api.post('/blogs/upload', formData, {
                                                headers: { 'Content-Type': 'multipart/form-data' }
                                            });
                                            if (data.success) {
                                                setValue('coverImage', data.url);
                                                toast.success('Image uploaded!');
                                            }
                                        } catch (error) {
                                            toast.error('Upload failed');
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('coverUpload').click()}
                                    className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm font-bold flex items-center justify-center gap-2 border border-dashed border-slate-300 dark:border-slate-700"
                                >
                                    <ImageIcon size={16} /> {watch('coverImage') ? 'Change Photo' : 'Upload from computer'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-500">
                                <Tag size={16} /> Tags (comma separated)
                            </label>
                            <input
                                {...register('tags')}
                                placeholder="tech, react, markdown"
                                className="w-full p-2.5 rounded-xl border dark:border-slate-800 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <div className="pt-4 border-t dark:border-slate-800">
                            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-slate-500">
                                Status
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" {...register('status')} value="draft" className="text-indigo-600" />
                                    <span className="text-sm">Draft</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" {...register('status')} value="published" className="text-indigo-600" />
                                    <span className="text-sm font-medium text-emerald-600">Publish</span>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* Text Area */}
                    <div className={`flex-1 flex gap-4 ${isPreview ? 'grid grid-cols-2' : ''}`}>
                        <textarea
                            {...register('content', { required: 'Content is required' })}
                            placeholder="Start writing in Markdown..."
                            className="w-full h-full p-8 rounded-2xl border dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 text-lg leading-relaxed resize-none transition-colors"
                        />

                        {isPreview && (
                            <div className="h-full p-8 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 overflow-y-auto transition-colors">
                                <div className="prose prose-slate dark:prose-invert max-w-none">
                                    <h1 className="text-3xl font-bold mb-4">{title}</h1>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Editor;
