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
      className={cn("text-white", className)}
      {...props}
    >
      <path d="M15.182 12.318A4.5 4.5 0 0 1 12 16.5a4.5 4.5 0 0 1-3.182-1.318" />
      <path d="M9.5 3A1.5 1.5 0 0 1 11 4.5V6h2V4.5A1.5 1.5 0 0 1 14.5 3c1.422 0 2.5 1.5 2.5 3v1.119a1 1 0 0 1-.412.811L14.5 9.5M4.5 7.5c0-1.5 1.078-3 2.5-3A1.5 1.5 0 0 1 8.5 6H10v-1.5A1.5 1.5 0 0 1 11.5 3" />
      <path d="M4.5 7.5C3.079 7.5 2 9 2 10.5v1.119a1 1 0 0 0 .412.811L5.5 14.5m12-7c1.421 0 2.5 1.5 2.5 3v1.119a1 1 0 0 1-.412.811L18.5 14.5" />
      <path d="M5.5 14.5A3.5 3.5 0 0 0 9 17.5c.098.632.42 1.2.858 1.602A3.001 3.001 0 0 1 7.5 21H6a2 2 0 0 1-2-2v-1" />
      <path d="M18.5 14.5a3.5 3.5 0 0 1 3.5 3c-.098.632-.42 1.2-.858 1.602A3.001 3.001 0 0 0 16.5 21H18a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}
