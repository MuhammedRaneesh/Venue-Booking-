import { Request, Response, NextFunction } from "express"
import Jwt from "jsonwebtoken"
import { AuthUser, userRole } from "../modules/auth/user.model.js"
import { User } from "../modules/auth/user.schema.js"

declare global {
    namespace Express {
        interface User {
            _id: string
            role: userRole
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            return res.status(401).json({ message: "Authentication required" })
        }
        const decode = Jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser

        const user = await User.findById(decode.userId).select("-password")

        if (!user || !user.isActive) {
            return res.status(401).json({ success: false, message: 'User no longer exists or is inactive' });
        }

        req.user = { _id: String(user._id), role: user.role }

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}


export const authorize = (roles: userRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
}
