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
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5h-1.5v-2h-4v2H8.5V14h-2c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1h2.5V9h-2c-.55 0-1-.45-1-1V6.5c0-.55.45-1 1-1h2.5V4h1.5v1.5h2.5c.55 0 1 .45 1 1V8c0 .55-.45 1-1 1h-2.5v1.5h2.5c.55 0 1 .45 1 1V14c0 .55-.45 1-1 1z"/>
    </svg>
  );
}
