import { useState, useEffect } from "react";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "@/api/userProfileApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Mail, Phone, ShieldCheck, Camera, Edit2, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/slices/authSlice";

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, refetch } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (data?.user) {
      setUserName(data.user.userName || "");
      setPhoneNumber(data.user.phoneNumber || "");
      setProfileImage(data.user.profileImage || "");
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 animate-spin text-[#2e0052]" />
        </div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 font-semibold mb-4">Failed to load profile.</p>
          <Button onClick={() => refetch()} variant="outline">Try Again</Button>
        </div>
      </div>
    );
  }

  const user = data.user;

  const handleSave = async () => {
    try {
      if (userName.trim().length < 2) {
        return toast.error("Name must be at least 2 characters");
      }
      
      if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
        return toast.error("Phone number must be exactly 10 digits");
      }

      const formData = new FormData();
      formData.append("userName", userName);
      if (phoneNumber) formData.append("phoneNumber", phoneNumber);
      if (profileImageFile) formData.append("profileImage", profileImageFile);

      const result = await updateProfile(formData).unwrap();
      dispatch(setCredentials({ user: result.user }));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-[Manrope,sans-serif] pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <h1 className="font-[EB_Garamond,serif] text-3xl sm:text-4xl font-bold text-[#2e0052] tracking-tight mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* LEFT SIDEBAR - Avatar & Basic Info */}
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden h-fit">
            <div className="h-24 bg-gradient-to-r from-[#2e0052] to-[#4b0082]"></div>
            <CardContent className="px-6 pb-6 relative pt-0">
              <div className="relative w-28 h-28 mx-auto -mt-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md overflow-hidden group">
                {profileImageFile ? (
                  <img src={URL.createObjectURL(profileImageFile)} alt="Profile" className="w-full h-full object-cover" />
                ) : profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
                
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-6 h-6" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setProfileImageFile(e.target.files[0]);
                        }
                      }} 
                    />
                  </label>
                )}
              </div>

              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-slate-800">{user.userName}</h2>
                <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="capitalize bg-purple-50 text-[#2e0052] hover:bg-purple-100">
                    {user.role.replace("_", " ")}
                  </Badge>
                  {user.isVerified && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT SIDE - Editable Details */}
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-[#2e0052]">Personal Information</CardTitle>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl font-bold text-slate-600 border-slate-200"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setIsEditing(false);
                      setUserName(user.userName);
                      setPhoneNumber(user.phoneNumber || "");
                      setProfileImageFile(null);
                    }}
                    className="rounded-xl font-bold text-slate-500"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="rounded-xl font-bold bg-[#2e0052] text-white hover:bg-[#400073]"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  {isEditing ? (
                    <Input 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      className="bg-slate-50 h-11 border-slate-200 rounded-xl"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 h-11 flex items-center px-3 bg-slate-50/50 rounded-xl border border-transparent">
                      {user.userName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  {isEditing ? (
                    <Input 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="10-digit number"
                      className="bg-slate-50 h-11 border-slate-200 rounded-xl"
                    />
                  ) : (
                    <p className="font-medium text-slate-800 h-11 flex items-center px-3 bg-slate-50/50 rounded-xl border border-transparent">
                      {user.phoneNumber || <span className="text-slate-400 italic">Not provided</span>}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <p className="font-medium text-slate-500 h-11 flex items-center px-3 bg-slate-100 rounded-xl border border-slate-200 cursor-not-allowed">
                    {user.email}
                  </p>
                  {isEditing && <p className="text-xs text-slate-400 pl-1">Email address cannot be changed.</p>}
                </div>
              </div>

              {/* Security Banner */}
              <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Your data is secure</h4>
                  <p className="text-xs text-emerald-700/80 mt-1 leading-relaxed">
                    We use industry-standard encryption to protect your personal information. 
                    Your contact details are only shared with venue owners when you confirm a booking.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
