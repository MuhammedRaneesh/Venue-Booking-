import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { registerSchema } from '../validators/authValidation'
import { useRegisterMutation } from '@/features/auth/authApi'
import type { RegisterSchema } from '../validators/authValidation'
import { Eye, EyeOff, Building2, Ticket } from 'lucide-react'
import { setCredentials } from '../slices/authSlice'
import { useDispatch } from 'react-redux'
function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'user' | 'venue_owner'>('user')

  const [register, { isLoading, error }] = useRegisterMutation()

  const { register: registerField, handleSubmit, setValue, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user'
    }
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await register(data).unwrap()
      dispatch(setCredentials({ user: res.user}))
      navigate('/otp-verify', { state: { email: data.email } })
    } catch (err) {
      console.error('Register failed:', err)
    }
  }

  const handleRoleChange = (role: 'user' | 'venue_owner') => {
    setSelectedRole(role)
    setValue('role', role)
  }

  const getErrorMessage = (err: any): string => {
    if (!err) return ''
    if ('data' in err) {
      return (err.data as any)?.message || (err.data as any)?.result?.message || 'Something went wrong'
    }
    return 'Network error. Please try again.'
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full bg-white grid grid-cols-1 lg:grid-cols-12 antialiased">

      {/* ─── LEFT SIDE: PREMIUM BRAND HERO (Hidden on Mobile) ────────────────── */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-900">
        {/* Decorative Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        <div className="relative z-10">
          <div className="text-xl font-bold text-white tracking-tight">
            BookMy<span className="text-blue-500">Venue</span>
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 BookMyVenue · All rights reserved.
        </div>
      </div>

      {/* ─── RIGHT SIDE: UTILITY FORM CONTAINER ──────────────────────────────── */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center bg-slate-50/50 p-6 sm:p-12">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight lg:hidden">
              BookMy<span className="text-blue-600">Venue</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {selectedRole === 'user'
                ? 'Create an account to start booking premium venues'
                : 'Register as a partner to host your premium properties'}
            </p>
          </div>

          {/* ─── PREMIUM SEGMENTED SLIDER TOGGLE ─── */}
          <div className="relative bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 mb-6 border border-slate-200/40">
            {/* Sliding Background Block */}
            <div
              className={`absolute top-1 bottom-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-slate-200/50 transition-all duration-300 ease-out ${selectedRole === 'venue_owner' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
            />

            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 ${selectedRole === 'user' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              User
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('venue_owner')}
              className={`relative z-10 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 ${selectedRole === 'venue_owner' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              List Venue
            </button>
          </div>
          {selectedRole === "user" ?
            <div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition duration-200 text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  or register with email
                </span>
              </div>
            </div> : ""}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl font-medium">
                {getErrorMessage(error)}
              </div>
            )}

            {/* Hidden Input field syncing our fancy slide component to react-hook-form */}
            <input type="hidden" {...registerField('role')} />

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                {...registerField('userName')}
                className={`w-full bg-white border ${errors.userName ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50 focus:ring-4'} px-4 py-2.5 rounded-xl text-sm text-slate-900 outline-none transition duration-200`}
              />
              {errors.userName && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.userName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...registerField('email')}
                className={`w-full bg-white border ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50 focus:ring-4'} px-4 py-2.5 rounded-xl text-sm text-slate-900 outline-none transition duration-200`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...registerField('password')}
                  className={`w-full bg-white border ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50 focus:ring-4'} px-4 py-2.5 rounded-xl text-sm text-slate-900 outline-none transition duration-200 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <EyeOff className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 text-sm focus:ring-4 focus:ring-blue-100 outline-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register
