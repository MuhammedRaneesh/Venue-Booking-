import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'sonner'

function GoogleCallback() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token') || params.get('accessToken')
        const error = params.get('error')

        if (error) {
            toast.error(error || 'Google login failed')
            navigate('/login')
            return
        }


        const fetchuser = async () => {
            try {
                dispatch(setCredentials({ user: null}))
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch user')
                }

                const data = await response.json()
                const user = data.user || data.result?.user

                if (!user) {
                    throw new Error('User not found')
                }

                dispatch(setCredentials({ user}))
                navigate("/")
            } catch (error) {
                toast.error("Google login failed")
                navigate("/login")
            }
        }

        fetchuser()
    }, [dispatch, navigate])

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm text-slate-500">Signing you in with Google...</p>
            </div>
        </div>
    )
}

export default GoogleCallback
