import { useNavigate, useSearchParams } from "react-router-dom"
import { useResetPasswordMutation } from "@/api/authApi";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordSchemaZ } from "../validators/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, ArrowLeft } from "lucide-react"
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'
function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || ""
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [ResetPassword, { isLoading }] = useResetPasswordMutation()

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordSchemaZ>({ resolver: zodResolver(resetPasswordSchema) })

    const onSubmit = async (data: ResetPasswordSchemaZ) => {
        try {
            const res = await ResetPassword({ email, newPassword: data.password }).unwrap();
            toast.success(res.message);
            navigate("/login")
        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong")
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" >
            <div className="max-w-sm w-full space-y-5 bg-white p-7 rounded-2xl shadow-sm border border-gray-100/70 text-center animate-fade-in">

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        BookMy<span className="text-blue-600">Venue</span>
                    </h1>
                    <h2 className="text-xl font-bold text-slate-800 mt-3 tracking-tight">
                        Reset Password
                    </h2>
                    <p className="mt-1.5 text-xs font-medium text-gray-400 max-w-70 mx-auto leading-relaxed">
                        Please enter your new secure password below to update your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left pt-1">

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={`h-4 w-4 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password")}
                                className={`block w-full pl-10 pr-10 py-2.5 border rounded-xl bg-white text-sm outline-none transition-all ${errors.password
                                    ? 'border-red-400 text-red-900 focus:border-red-500 ring-1 ring-red-100'
                                    : 'border-gray-200 text-gray-950 focus:border-blue-500'
                                    }`}
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 font-medium pl-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={`h-4 w-4 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-white text-sm outline-none transition-all ${errors.confirmPassword
                                    ? 'border-red-400 text-red-900 focus:border-red-500 ring-1 ring-red-100'
                                    : 'border-gray-200 text-gray-950 focus:border-blue-500'
                                    }`}
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 font-medium pl-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>


                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
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
                        <span className="text-slate-500">Cancel and <strong className="text-blue-600 font-bold">Sign In</strong></span>
                    </a>
                </div>

            </div>
        </div>
    )
}

export default ResetPassword     