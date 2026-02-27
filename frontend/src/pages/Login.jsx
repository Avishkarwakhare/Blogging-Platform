import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await login(data.email, data.password);
            if (res.success) {
                toast.success('LoggedIn Successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">Welcome Back</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w-\.]+@(gmail\.com|outlook\.in|outlook\.com|yahoo\.com|hotmail\.com|icloud\.com)$/i,
                                message: "Please enter a valid email"
                            }
                        })}
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="you@gmail.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 rounded-lg border dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                    Sign In
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
            </p>
        </div>
    );
};

export default Login;
