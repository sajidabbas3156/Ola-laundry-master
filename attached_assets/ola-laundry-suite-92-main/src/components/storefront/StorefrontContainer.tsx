
import { ReactNode } from "react";

interface StorefrontContainerProps {
  children: ReactNode;
}

export function StorefrontContainer({ children }: StorefrontContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {children}
      </div>
    </div>
  );
}
