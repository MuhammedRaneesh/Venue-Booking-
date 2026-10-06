import { io, Socket } from "socket.io-client"

export const socket: Socket = io("http://localhost:7000" , {
    withCredentials: true,
    autoConnect: false ,
    transports : ["websocket" , "polling"]
})
