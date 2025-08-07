import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-12 w-12 text-white", className)}
      {...props}
    >
        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M8.5,14H7.25C6.84,14,6.5,13.66,6.5,13.25V12 c0-0.41,0.34-0.75,0.75-0.75h2.81c0.3,0,0.56-0.19,0.67-0.47C10.84,10.49,11,10.27,11,10c0-0.55-0.45-1-1-1H7c-0.55,0-1-0.45-1-1 s0.45-1,1-1h3c1.65,0,3,1.35,3,3c0,0.88-0.39,1.67-1,2.23V13c0,0.55-0.45,1-1,1h-1.5V14z M17,14h-2.5v-1h1.75 c0.41,0,0.75-0.34,0.75-0.75V11.5c0-0.41-0.34-0.75-0.75-0.75H14c-0.55,0-1-0.45-1-1s0.45-1,1-1h3c0.55,0,1,0.45,1,1V13 c0,0.55-0.45,1-1,1H17z" />
    </svg>
  );
}
