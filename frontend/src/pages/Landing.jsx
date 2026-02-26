import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FileText,
    Search,
    TrendingUp,
    Zap,
    Shield,
    Globe,
    Mail,
    MapPin,
    HelpCircle,
    Instagram,
    Twitter,
    Github,
    Linkedin,
    ArrowRight,
    X,
    FileUp,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';

const Landing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isTicketOpen, setIsTicketOpen] = useState(false);


    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onTicketSubmit = async (data) => {
        try {
            const res = await api.post('/responses', data);
            if (res.data.success) {
                toast.success('Ticket submitted successfully!');
                setIsTicketOpen(false);
                reset();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit ticket');
        }
    };

    return (
        <div className="flex flex-col gap-0 -mt-8 font-sans overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden">

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 mb-8 leading-tight">
                        Write, Share, <br /> Inspire.
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        The ultimate destination for modern creators. Harness the power of Markdown,
                        beautiful analytics, and detailed insights to build your legacy.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <Link to="/register" className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2">
                            Get Started Free
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="px-10 py-5 bg-slate-100 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl font-bold text-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* IMAGE PLACEHOLDER: HERO VISUAL (Lottie file or screenshot of dashboard)
                    Location: c:\Users\avish\Documents\coding\markblog\frontend\src\pages\Landing.jsx
                    Tip: Add a large transparent PNG or SVG below the CTA for more impact.
                */}
            </section>

            {/* Premium Features Section */}
            <section className="py-32 bg-white dark:bg-slate-900 transition-colors px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for Excellence</h2>
                        <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Markdown Section */}
                        <div className="group p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10">
                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Markdown Mastery</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                The purity of text with the power of visual. Use our split-pane editor to see your beautiful Markdown themes come to life instantly.
                            </p>
                        </div>

                        {/* Analytics Section */}
                        <div className="group p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-orange-500/50 transition-all hover:shadow-2xl hover:shadow-orange-500/10">
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Data Storytelling</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Go beyond simple views. Understand your audience with deep charts and activity tracking that helps you grow faster.
                            </p>
                        </div>

                        {/* PDF Section */}
                        <div className="group p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
                            <div className="w-16 h-16 bg-indigo-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                                <FileUp size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Smart PDF Extraction</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Transform static documents into dynamic blog posts. Upload PDFs to automatically extract text and accelerate your writing workflow.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlight Section with Image Placeholder */}
            <section className="py-24 bg-indigo-50 dark:bg-indigo-950/20 px-6 overflow-hidden">
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold uppercase tracking-widest leading-relaxed">
                            A New Era of Blogging
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">Your Words Deserve <br /> A Better Home.</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            MarkBlog isn't just another CMS. It's an ecosystem built for those who care about typography,
                            speed, and intelligence. Every pixel is crafted to make your reading and writing experience feel premium.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Shield size={20} className="text-indigo-600" /></div>
                                <span className="font-bold">Secure Auth</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Globe size={20} className="text-indigo-600" /></div>
                                <span className="font-bold">Global Reach</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[50px] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-700">
                            <img src="/images/showcase.png" alt="MarkBlog Showcase" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                    </div>
                </div>
            </section>

            {/* Know Your Audience Section */}
            <section className="py-24 bg-white dark:bg-slate-900 px-6 overflow-hidden">
                <div className="container mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Growth & Insights
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">Know Your <br /> Audience.</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Understand exactly who is reading your work and what they love most.
                            Our beautiful charts give you a crystal-clear view of your growth, engagement, and reach.
                            Turn data into direction and watch your influence expand.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
                                <span className="font-bold">Real-time Visitors</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600"><Globe size={20} /></div>
                                <span className="font-bold">Global Demographics</span>
                            </li>
                        </ul>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-800 rounded-[50px] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-700">
                            <img src="/images/analytics.png" alt="Analytics Dashboard" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    </div>
                </div>
            </section>

            {/* Share Your Experience Section */}
            <section className="py-24 bg-purple-50 dark:bg-purple-950/20 px-6 overflow-hidden">
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full text-sm font-bold uppercase tracking-widest leading-relaxed">
                            Community & Connection
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">Share Your <br /> Experience.</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Blogging is more than just writing—it's connecting with like-minded people.
                            Share your journey, learn from others, and build a community around your passion.
                            MarkBlog makes it easy to broadcast your voice to the world.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 font-bold">Community-led</div>
                            <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 font-bold">Social Sharing</div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[50px] shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-700">
                            <img src="/images/community.png" alt="Community Sharing" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-relaxed">
                            MarkBlog.
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            Empowering creators with the world's most intelligent Markdown platform.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Twitter size={18} />
                            </a>
                            <a href="https://github.com/Avishkarwakhare" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Github size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/avishkar-wakhare/" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <HelpCircle size={20} className="text-indigo-600" />
                            Resources
                        </h4>
                        <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-indigo-600 transition-colors">Tutorials</a></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Mail size={20} className="text-indigo-600" />
                            Reach Out
                        </h4>
                        <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                            <li className="flex items-center gap-3">
                                <Mail size={16} />
                                <span className="text-sm">support@markblog.io</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HelpCircle size={16} />
                                <span className="text-sm">24/7 Live Support</span>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsTicketOpen(true)}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all"
                                >
                                    Submit a Ticket
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Visit Us Section */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-indigo-600" />
                            Visit Us
                        </h4>
                        <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="mt-1 shrink-0" />
                                <span className="text-sm">
                                    123 Creative Studio, <br />
                                    Innovation District, <br />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-medium">
                    <p>© 2026 MarkBlog Hub. Built with passion for creators.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </footer>
            {/* Support Ticket Modal */}
            {isTicketOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsTicketOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsTicketOpen(false)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-orange-500 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black mb-2">Submit a Ticket</h3>
                            <p className="text-slate-500 font-medium">We'll get back to you as soon as possible.</p>
                        </div>

                        <form onSubmit={handleSubmit(onTicketSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 px-1">Full Name</label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="John Doe"
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-1 px-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 px-1">Email Address</label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                                    })}
                                    placeholder="john@example.com"
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                />
                                {errors.email && <p className="text-rose-500 text-xs mt-1 px-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2 px-1">Your Message</label>
                                <textarea
                                    {...register('message', { required: 'Message is required' })}
                                    placeholder="How can we help?"
                                    rows="4"
                                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                                />
                                {errors.message && <p className="text-rose-500 text-xs mt-1 px-1">{errors.message.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-xl shadow-orange-600/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Landing;
