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
      <path d="M16 5.237V5a3 3 0 0 0-6 0v.237a2.5 2.5 0 0 0-3.5 0V5a5 5 0 0 1 10 0v.237a2.5 2.5 0 0 1-1.123 2.05L14.5 8h-5l-.877-.713A2.5 2.5 0 0 1 5.123 5.237V5a5 5 0 0 1 8.326-3.818A4.998 4.998 0 0 1 18 5v.237a2.5 2.5 0 0 0-2 0ZM12 11a3.5 3.5 0 0 0-3.5 3.5v.5a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1a4 4 0 0 1 4-4h7a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1h-1a2 2 0 0 1-2-2v-.5A3.5 3.5 0 0 0 12 11Z" />
      <path d="M7.5 17a1.5 1.5 0 0 0-3 0h3Zm9 0a1.5 1.5 0 0 0-3 0h3Z" />
    </svg>
  );
}
