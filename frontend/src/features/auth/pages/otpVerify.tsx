import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw, Loader2, ArrowLeft } from 'lucide-react'
import { otpSchema } from '../validators/authValidation'
import { useVerifyOtpMutation, useResendOtpMutation } from "../../../api/authApi"
import { setCredentials } from '../slices/authSlice'
import type { OtpSchema } from '../validators/authValidation'

function OtpVerify() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const email = location.state?.email 

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  const [timer, setTimer] = useState(60)

  useEffect(() => {
    startTimer()
  }, [])

  const startTimer = () => {
    setTimer(60)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const [verifyOtp, { isLoading: isVerifying, error: otpError }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
  })

  const onSubmit = async (data: OtpSchema) => {
    try {
      const res = await verifyOtp({ email, otpNumber: data.otpNumber }).unwrap()
      dispatch(setCredentials({ user: res.user }))
      if(res.user.role === "venue_owner"){
        navigate("/owner/onboarding")
      }else{
        navigate("/")
      }
    } catch (err) {
      console.error('OTP failed:', err)
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp({ email }).unwrap()
      startTimer()
    } catch (err) {
      console.error('Resend failed:', err)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    setValue('otpNumber', val, { shouldValidate: true })
    e.target.value = val
  }

  const getErrorMessage = (err: any): string => {
    if (!err) return ''
    if ('data' in err) return (err.data as any)?.message || 'Something went wrong'
    return 'Network error. Please try again.'
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            BookMy<span className="text-blue-600">Venue</span>
          </h1>
          <p className="text-sm text-slate-500">
            Enter the verification code sent to your email:
            <span className="font-semibold text-slate-900 block mt-0.5 break-all">{email || 'your email'}</span>
          </p>
        </div>

        {otpError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl font-medium text-center mb-4">
            {getErrorMessage(otpError)}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Verification Code
              </label>
              
              <button
                type="button"
                disabled={timer > 0 || isResending}
                onClick={handleResend}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition disabled:opacity-70 disabled:text-slate-400"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                {...register('otpNumber')}
                onChange={handleOtpChange}
                className={`w-full bg-white border text-center tracking-[0.5em] sm:tracking-[0.6em] text-2xl font-bold ${
                  errors.otpNumber
                    ? 'border-red-500 focus:ring-red-100'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-50 focus:ring-4'
                } px-4 py-3 rounded-xl text-slate-900 outline-none transition duration-200`}
              />
            </div>

            {errors.otpNumber && (
              <p className="text-xs text-red-500 font-medium text-center mt-1">
                {errors.otpNumber.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition duration-200 text-sm focus:ring-4 focus:ring-blue-100 flex items-center justify-center gap-2 shadow-sm"
          >
            {isVerifying ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="flex flex-col space-y-4 pt-4 mt-6 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center justify-center gap-1.5 transition font-medium outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Wrong address? Change account email
          </button>
        </div>

      </div>
    </div>
  )
}

export default OtpVerify
