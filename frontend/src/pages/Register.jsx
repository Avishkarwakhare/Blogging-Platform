import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data.name, data.email, data.password);
            if (res.success) {
                toast.success('Account created successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg transition-colors">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">Join Us</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-2 rounded-lg border dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        className="w-full px-4 py-2 rounded-lg border dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min length 6' } })}
                        type="password"
                        className="w-full px-4 py-2 rounded-lg border dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                    Create Account
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default Register;
