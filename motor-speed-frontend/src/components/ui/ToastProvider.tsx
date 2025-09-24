import { Toaster } from "sonner";
import React from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
        }}
        theme="light"
        expand={true}
        richColors={true}
        closeButton={true}
        className="toast-provider"
      />
    </>
  );
}
