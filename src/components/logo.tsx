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
      <path d="M18.2,10.3C18.8,12,18,14,17,14.7c-1.5,1.1-3.3-0.5-3.3-0.5s-2-1.6-3.5-0.2c-1.1,1-1,2.5-1,2.5s0.5,2.1-1.2,2.4c-1.8,0.3-3.2-1-3.2-1s-1.1-1.7-2.3-1.4" />
      <path d="M5.3,13.6c0,0-0.2,1.2,0.8,2.3c0.7,0.8,1.8,1.1,2.9,0.7" />
      <path d="M12.2,6.5C12.2,6.5,11,8,11,9.5s1.2,2.5,1.2,2.5" />
      <path d="M14.5,6.5C14.5,6.5,16,8,16,9.5s-1.5,2.5-1.5,2.5" />
      <path d="M14.2,4.5c0,0-1.2,1.3-1.2,2.8" />
      <path d="M12.5,2.5C12.5,2.5,11,4,11,5.5" />
      <path d="M17.8,4.5c0,0,1.2,1.3,1.2,2.8" />
      <path d="M15.5,2.5C15.5,2.5,17,4,17,5.5" />
      <path d="M7,18.7c0,0,2.2,1.3,4.5,0.3s3.5-2.3,3.5-2.3" />
    </svg>
  );
}
