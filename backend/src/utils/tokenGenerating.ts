import  Jwt  from "jsonwebtoken";

export const accessToken = (userId : string , role : string ) =>{
    return  Jwt.sign({userId , role} , process.env.JWT_SECRET as string , {expiresIn : "15m"} )
}

export const refreshToken = (userId : string) =>{
    return Jwt.sign({userId} , process.env.JWT_REFRESH_TOKEN  as string , { expiresIn : "14d"})
}