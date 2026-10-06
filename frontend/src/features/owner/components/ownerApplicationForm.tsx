import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Building2, User, Phone, MapPin,
    FileText, CalendarDays, Lock, Send
} from 'lucide-react';
import { toast } from 'sonner';
import { useApplicationFormMutation } from '@/features/owner/ownerApi';
import { OwnerApplicationSchema, ownerApplicationSchema } from '../validators/ownerValidation';
import image from "../../../assets/image.jpg.png"

function OwnerApplication() {
    const navigate = useNavigate();
    const [ApplicationForm, { isLoading }] = useApplicationFormMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<OwnerApplicationSchema>({
        resolver: zodResolver(ownerApplicationSchema)
    });

    const onSubmit = async (data: OwnerApplicationSchema) => {
        try {
            const res = await ApplicationForm(data).unwrap();
            toast.success(res.message || "Application submitted successfully!");
            navigate('/');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const inputClass = (hasError: boolean) =>
        `block w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs outline-none transition-all ${hasError
            ? 'border-red-400 bg-red-50/30 ring-1 ring-red-100'
            : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100'
        }`

    const plainInputClass = (hasError: boolean) =>
        `block w-full px-3 py-2.5 border rounded-xl text-xs outline-none transition-all ${hasError
            ? 'border-red-400 bg-red-50/30 ring-1 ring-red-100'
            : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100'
        }`

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 font-sans">
            <div className="w-full h-screen flex">

                <div className="relative hidden md:flex md:w-[42%] flex-col justify-between overflow-hidden">

                    <img
                        src={image}
                        alt="venue"
                        className="absolute inset-0 w-full h-full object-cover brightness-125"
                    />

                    <div className="absolute inset-0 bg-gradient-to-br from-[#010914]/55 via-[#1a366a]/50 to-[#6fa2ee]/40" />

                    <div className="relative z-10 flex flex-col justify-between h-full p-8">

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <CalendarDays className="h-4 w-4 text-white" />
                            </div>

                            <span className="text-white font-bold text-sm tracking-tight">
                                BookMy<span className="text-blue-400">Venue</span>
                            </span>
                        </div>
                        <div>
                            <h1 className="text-[32px] font-extrabold text-white leading-tight tracking-tight mb-3">
                                Become a
                                <br />
                                <span className="text-blue-400">Venue Owner</span>
                                <br />
                                Today
                            </h1>

                            <p className="text-slate-300 text-sm leading-relaxed max-w-[260px]">
                                List your venues, manage bookings and grow your business with us.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-blue-400" />
                            <span className="text-slate-300 text-xs">
                                256-bit SSL encrypted · Your data is safe
                            </span>
                        </div>

                    </div>
                </div>
                <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10 overflow-y-auto">

                    <div className="max-w-lg w-full mx-auto">

                        <div className="mb-7">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Owner Application
                            </h2>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                Please provide your business details below. Our team will review
                                your application and approve it within 48 hours.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className={`h-3.5 w-3.5 ${errors.fullName ? 'text-red-400' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            {...register('fullName')}
                                            placeholder="Enter your full name"
                                            disabled={isLoading}
                                            className={inputClass(!!errors.fullName)}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-[11px] text-red-500 font-medium">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className={`h-3.5 w-3.5 ${errors.phoneNumber ? 'text-red-400' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="tel"
                                            {...register('phoneNumber')}
                                            placeholder="Enter 10-digit phone number"
                                            disabled={isLoading}
                                            className={inputClass(!!errors.phoneNumber)}
                                        />
                                    </div>
                                    {errors.phoneNumber && (
                                        <p className="text-[11px] text-red-500 font-medium">{errors.phoneNumber.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Business Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 className={`h-3.5 w-3.5 ${errors.businessName ? 'text-red-400' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('businessName')}
                                        placeholder="Enter your business name"
                                        disabled={isLoading}
                                        className={inputClass(!!errors.businessName)}
                                    />
                                </div>
                                {errors.businessName && (
                                    <p className="text-[11px] text-red-500 font-medium">{errors.businessName.message}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute top-2.5 left-3 pointer-events-none">
                                        <MapPin className={`h-3.5 w-3.5 ${errors.address ? 'text-red-400' : 'text-slate-400'}`} />
                                    </div>
                                    <textarea
                                        rows={2}
                                        {...register('address')}
                                        placeholder="Enter your full address"
                                        disabled={isLoading}
                                        className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs outline-none transition-all resize-none ${errors.address
                                                ? 'border-red-400 bg-red-50/30 ring-1 ring-red-100'
                                                : 'border-slate-200 bg-slate-50 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100'
                                            }`}
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-[11px] text-red-500 font-medium">{errors.address.message}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('city')}
                                        placeholder="Enter city"
                                        disabled={isLoading}
                                        className={plainInputClass(!!errors.city)}
                                    />
                                    {errors.city && (
                                        <p className="text-[11px] text-red-500 font-medium">{errors.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('state')}
                                        placeholder="Enter state"
                                        disabled={isLoading}
                                        className={plainInputClass(!!errors.state)}
                                    />
                                    {errors.state && (
                                        <p className="text-[11px] text-red-500 font-medium">{errors.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('pincode')}
                                        placeholder="6-digit pincode"
                                        maxLength={6}
                                        disabled={isLoading}
                                        className={plainInputClass(!!errors.pincode)}
                                    />
                                    {errors.pincode && (
                                        <p className="text-[11px] text-red-500 font-medium">{errors.pincode.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    GST Number
                                    <span className="normal-case font-normal text-slate-400">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        {...register('gstNumber')}
                                        placeholder="Enter GST number (e.g. 22AAAAA0000A1Z5)"
                                        disabled={isLoading}
                                        className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>
                                <p className="text-[10.5px] text-slate-400">Optional – Used for business verification</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Submit Application
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-1.5 pt-1">
                                <Lock className="h-3 w-3 text-slate-400" />
                                <span className="text-[10.5px] text-slate-400">
                                    Your information is safe with us and will not be shared with anyone.
                                </span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OwnerApplication;
