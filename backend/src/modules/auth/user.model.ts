// this is for the type checking 

export interface IUser {
    fullName: string
    email: string
    password?: string
    googleId?: string
    authProvider: 'local' | 'google'
    role: 'user' | 'venue_owner' | 'admin'
    phoneNumber?: string
    profileImage: string
    isActive: boolean
    isVerified: boolean
    refreshToken?: string
    ownerStatus: string
}

export interface AuthUser {
    userId: string ;
    role: string ;
}

export type userRole = "user" | "venue_owner" | "admin"

export interface AuthUserPayload {
    userId : string
    role : userRole 
    email : string
}