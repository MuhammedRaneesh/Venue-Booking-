import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuthmeQuery } from "@/features/auth/authApi";
import { setCredentials, logout } from "../slices/authSlice";
import { socket } from "@/services/socket";

interface AuthInitializerProps {
    children: ReactNode
}

function AuthInitializer({ children }: AuthInitializerProps) {
    const dispatch = useDispatch();
    const { data, isError, isLoading } = useAuthmeQuery();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (data?.user) {
            dispatch(setCredentials({ user: data.user }));
            socket.connect()
            const userId = data.user.id || (data.user as any)._id;
            socket.emit("join", userId)

        } else if (isError) {
            dispatch(logout());
            socket.disconnect()
        }

        setInitialized(true);
    }, [data, isError, isLoading, dispatch]);

    if (!initialized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}

export default AuthInitializer; 
