import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

// Using an img tag to reference an image in the public folder.
// The user will need to ensure 'public/Bovino Pro Logo 2.png' exists.
export function Logo({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <div className={cn("relative h-12 w-12", className)}>
        <Image 
            src="/Bovino Pro Logo 2.png" 
            alt="BovinoPro Logo" 
            fill
            style={{ objectFit: "contain" }}
            {...props}
        />
    </div>
  );
}
