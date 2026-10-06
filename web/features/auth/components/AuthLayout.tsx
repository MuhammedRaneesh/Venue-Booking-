import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-white px-4 sm:px-6 overflow-hidden selection:bg-[#FF5A5F]/15 selection:text-[#FF5A5F]">
      <div 
        aria-label="Authentication" 
        className="w-full max-w-[390px] sm:max-w-[410px] mx-auto"
      >
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
