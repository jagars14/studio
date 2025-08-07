import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-beef", className)}
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17h2a2.5 2.5 0 0 0 2.5-2.5V12" />
      <path d="M4.028 12.158c-1.32-.782-2.45-2.125-2.7-3.66.02-1.74.87-3.34 2.18-4.32A5.5 5.5 0 0 1 8 2.5c1.42 0 2.75.53 3.75 1.42" />
      <path d="M12 12h1.5a2.5 2.5 0 0 1 2.5 2.5V17" />
      <path d="M19.972 12.158c1.32-.782 2.45-2.125 2.7-3.66-.02-1.74-.87-3.34-2.18-4.32A5.5 5.5 0 0 0 16 2.5c-1.42 0-2.75.53-3.75 1.42" />
      <path d="M12.01 21.501c-4.417 0-8.13-2.49-8.65-6.052a1.2 1.2 0 0 1 .83-1.442 1.2 1.2 0 0 1 1.44.83c.422 2.89 3.41 4.662 6.38 4.662s5.958-1.771 6.38-4.662a1.2 1.2 0 0 1 1.44-.83 1.2 1.2 0 0 1 .83 1.442c-.52 3.562-4.233 6.052-8.66 6.052Z" />
    </svg>
  );
}
