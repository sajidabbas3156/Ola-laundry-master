import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
}

export function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div className="flex justify-center py-8">
      <div className={cn(
        "w-[375px] h-[812px] border-8 border-gray-800 rounded-[25px] bg-black p-2 shadow-2xl",
        className
      )}>
        <div className="w-full h-full bg-white rounded-[20px] overflow-hidden relative flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
