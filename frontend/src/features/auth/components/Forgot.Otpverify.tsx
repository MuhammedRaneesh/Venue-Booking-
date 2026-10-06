import { useSearchParams } from "react-router-dom"
import { useVerifyForgotOtpMutation } from "@/features/auth/authApi"
import { useForm } from "react-hook-form"
import { ForgotOtpSchema, forgotOtpSchema } from "../validators/authValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ShieldCheck } from 'lucide-react';

function OtpVerifyPassword() {
    
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email") || ""
    const navigate = useNavigate()
    const [verifyForgotOtp, { isLoading }] = useVerifyForgotOtpMutation()
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotOtpSchema>({
        resolver: zodResolver(forgotOtpSchema)
    })

    const onSubmit = async (data: ForgotOtpSchema) => {
        try {
            const res = await verifyForgotOtp({ otp: data.otp, email }).unwrap();
            toast.success(res.message || "OTP verified!");
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: any) {
            toast.error(error?.data?.message || "Invalid OTP");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans text-slate-800">
            <div className="max-w-sm w-full space-y-5 bg-white p-7 rounded-2xl shadow-sm border border-gray-100/70 text-center">

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        BookMy<span className="text-blue-600">Venue</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">
                        Check your email
                    </h2>
                    <p className="mt-1.5 text-xs font-medium text-gray-400 mx-auto leading-relaxed">
                        We sent a 6-digit code to <strong className="text-slate-600">{email}</strong>
                    </p>
                </div>

                <div className="flex justify-center py-0.5">
                    <div className="w-16 h-16 bg-blue-50/60 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left pt-1">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            6-Digit OTP
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            {...register("otp")}
                            className={`block w-full px-4 py-3 border rounded-xl bg-white text-center text-2xl font-bold tracking-[0.5em] outline-none transition-all ${errors.otp
                                ? 'border-red-400 text-red-900 ring-1 ring-red-100'
                                : 'border-gray-200 text-gray-950 focus:border-blue-500'
                                }`}
                            placeholder="······"
                            disabled={isLoading}
                        />
                        {errors.otp && (
                            <p className="text-xs text-red-500 font-medium pl-1">{errors.otp.message}</p>
                        )}
                    </div>
                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>

                <div className="text-center py-0.5">
                    <a href="/forgot-password"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors group">
                        <ArrowLeft className="h-4 w-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-slate-500">Back to <strong className="text-blue-600">Forgot Password</strong></span>
                    </a>
                </div>

            </div>
        </div>
    )
}

export default OtpVerifyPassword
