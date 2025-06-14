"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Database, Settings } from "lucide-react";

const navItems = [
  {
    title: "Today's Listings",
    href: "/",
    icon: Clock,
  },
  {
    title: "Weekly Listings",
    href: "/weekly",
    icon: Calendar,
  },
  {
    title: "All Listings",
    href: "/all",
    icon: Database,
  },
  {
    title: "Email Configuration",
    href: "/email-config",
    icon: Settings,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image
                src="/jurek-logo.svg"
                alt="Jurek Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <div className="hidden sm:block">
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Data Lake
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105",
                      isActive
                        ? "text-primary border-b-2 border-primary pb-4 -mb-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 px-3 py-1 rounded-t-lg"
                        : "text-muted-foreground hover:bg-accent/50 px-3 py-1 rounded-lg"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Mobile menu placeholder */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 