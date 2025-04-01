"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Plus, X, Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { UserButton } from "@clerk/nextjs";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { ModeToggle } from "./ModeToggleButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: "STUDENT" | "LANDLORD";
  userId?: string;
}

export function DashboardLayout({
  children,
  userRole = "STUDENT",
  userId = "user123",
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Close mobile sidebar when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    // This would be a server action in a real implementation
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar userId={userId} userRole={userRole} />

        <SidebarInset className="flex flex-col w-full min-w-0">
          {/* Header */}
          <header className="border-b sticky top-0 z-10 bg-background w-full">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center w-full max-w-full">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <SidebarTrigger className="mr-2" />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-sidebar">
                      <AppSidebar userId={userId} userRole={userRole} />
                    </SheetContent>
                  </Sheet>
                )}
                {!isMobile && <SidebarTrigger className="mr-2" />}
                <Link
                  href={`/dashboard/${userId}`}
                  className="flex items-center gap-2"
                >
                  <Building className="h-5 w-5 text-primary" />
                  <span className="font-semibold hidden sm:inline-block">
                    StudentNest
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {/* {userRole === "LANDLORD" && (
                  <Link href={`/dashboard/${userId}/properties/new`}>
                    <Button
                      size="sm"
                      className="hidden sm:flex gradient-bg border-none"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                    <Button
                      size="icon"
                      variant="default"
                      className="sm:hidden gradient-bg border-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                )} */}

                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNotificationCount(0)}
                        className="h-auto p-1 text-xs"
                      >
                        Mark all as read
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-3 border-b">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              New message from Jane Doe
                            </p>
                            <p className="text-xs text-muted-foreground">
                              "Hi, I'm interested in your property at..."
                            </p>
                            <p className="text-xs text-muted-foreground">
                              2 hours ago
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border-b">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              New message from John Smith
                            </p>
                            <p className="text-xs text-muted-foreground">
                              "Is the property still available?"
                            </p>
                            <p className="text-xs text-muted-foreground">
                              5 hours ago
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>SN</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              System Notification
                            </p>
                            <p className="text-xs text-muted-foreground">
                              "Welcome to StudentNest! Complete your profile to
                              get started."
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 day ago
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <NotificationsDropdown userId={userId} />

                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {userRole === "LANDLORD" ? "LL" : "ST"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userId}/profile`}>
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userId}/settings`}>
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <ModeToggle />
                <UserButton />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 overflow-auto w-full min-w-0">
            <div className="w-full max-w-full mx-auto">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
