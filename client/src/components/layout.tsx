import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {children}
    </div>
  );
}

export function LayoutHeader({ 
  children,
  className,
  ...props
}: { 
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <header className={cn("bg-background", className)} {...props}>
      {children}
    </header>
  );
}

export function LayoutContent({ 
  children,
  className,
  ...props
}: { 
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <main className={cn("flex-1", className)} {...props}>
      {children}
    </main>
  );
}

export function LayoutSidebar({ 
  children,
  className,
  ...props
}: { 
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <aside className={cn("w-64 border-r min-h-screen", className)} {...props}>
      {children}
    </aside>
  );
}

export function LayoutFooter({ 
  children,
  className,
  ...props
}: { 
  children: ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <footer className={cn("bg-background border-t", className)} {...props}>
      {children}
    </footer>
  );
}