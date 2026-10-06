import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotEmailSchema, forgotEmailSchema } from '../validators/authValidation';
import { useForgotPasswordMutation } from '@/features/auth/authApi';
import { toast } from 'sonner';

function ForgotPassword() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotEmailSchema>({ 
        resolver: zodResolver(forgotEmailSchema) 
    });

    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const onSubmit = async (data: ForgotEmailSchema) => {
        try {
            const res = await forgotPassword(data).unwrap();
            toast.success(res.result.message || "OTP sent successfully!");
            navigate(`/verify-forgot-otp?email=${encodeURIComponent(data.email)}`);
        } catch (error: any) {
            console.error('Reset request failed:', error);
            toast.error(error?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-slate-800">
            <div className="max-w-sm w-full space-y-5 bg-white p-7 rounded-2xl shadow-sm border border-gray-100/70 text-center">

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        BookMy<span className="text-blue-600">Venue</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">
                        Forgot Password?
                    </h2>
                    <p className="mt-1.5 text-xs font-medium text-gray-400 max-w-72.5 mx-auto leading-relaxed">
                        No worries! Enter your email address and we'll send you a verification code.
                    </p>
                </div>

                <div className="flex justify-center py-0.5">
                    <div className="relative w-16 h-16 bg-blue-50/60 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <div className="absolute bottom-0 right-1 bg-blue-600 p-0.5 rounded-full text-white shadow-sm ring-2 ring-white">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className={`h-4 w-4 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="email"
                                {...register("email")}
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-white text-sm outline-none transition-all ${
                                    errors.email 
                                    ? 'border-red-400 text-red-900 focus:border-red-500 ring-1 ring-red-100' 
                                    : 'border-gray-200 text-gray-950 focus:border-blue-500'
                                }`}
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500 font-medium pl-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </div>
                </form>
                <div className="relative flex items-center justify-center py-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <span className="relative bg-white px-2.5 text-[10px] font-bold text-slate-400 tracking-widest uppercase">Or</span>
                </div>
                <div className="text-center py-0.5">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors group mx-auto"
                    >
                        <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform text-blue-600" />
                        <span className="text-slate-500">Back to <strong className="text-blue-600 font-bold">Sign In</strong></span>
                    </a>
                </div>
                <div className="bg-blue-50/40 border border-blue-100/40 rounded-xl p-3.5 flex items-start gap-2.5 text-left">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800">We care about your security</h4>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                            Your information is 100% secure with us.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ForgotPassword;
