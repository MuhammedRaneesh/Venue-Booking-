import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    })

    io.on("connection", (socket: Socket) => {
        console.log("user Connected", socket.id)
        
        socket.on("join", (userId: string) => {
            socket.join(userId)
            console.log(`User ${userId} joined their room`)
        })

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id)
        })
    })
}

export const getIo = (): Server => {
    if (!io) throw new Error("Socket.io not initailzed")
    return io
}