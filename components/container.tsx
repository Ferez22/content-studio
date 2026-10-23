import { cn } from "@/lib/utils";
import React from "react";

export const Container = ({
  className,
  children,
  id,
}: {
  className?: string;
  children: React.ReactNode;
  id?: string;
}) => {
  return (
    <div id={id} className={cn("max-w-7xl px-4 md:px-8 mx-auto", className)}>
      {children}
    </div>
  );
};
