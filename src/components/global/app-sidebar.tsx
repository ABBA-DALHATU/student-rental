"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  Home,
  MessageSquare,
  User,
  Settings,
  Search,
  Heart,
  LogOut,
  Bell,
  ChevronDown,
  HelpCircle,
  Compass,
  BookOpen,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  userId: string;
  userRole?: "STUDENT" | "LANDLORD";
}

export function AppSidebar({ userId, userRole = "STUDENT" }: AppSidebarProps) {
  const pathname = usePathname();

  const studentNavItems = [
    { href: `/dashboard/${userId}/feed`, label: "Dashboard", icon: Home },
    {
      href: `/dashboard/${userId}/properties`,
      label: "Browse Properties",
      icon: Compass,
    },
    {
      href: `/dashboard/${userId}/saved`,
      label: "Saved Properties",
      icon: Heart,
    },
    {
      href: `/dashboard/${userId}/messages`,
      label: "Messages",
      icon: MessageSquare,
      badge: 3,
    },
    { href: `/dashboard/${userId}/profile`, label: "Profile", icon: User },
  ];

  const landlordNavItems = [
    { href: `/dashboard/${userId}`, label: "Dashboard", icon: Home },
    {
      href: `/dashboard/${userId}/my-properties`,
      label: "My Properties",
      icon: Building,
    },
    {
      href: `/dashboard/${userId}/messages`,
      label: "Messages",
      icon: MessageSquare,
      badge: 5,
    },
    { href: `/dashboard/${userId}/profile`, label: "Profile", icon: User },
  ];

  const navItems = userRole === "LANDLORD" ? landlordNavItems : studentNavItems;

  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <Building className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">StudentNest</span>
        </div>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput placeholder="Search..." className="pl-8" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="text-sidebar-foreground/70" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-2 bg-primary text-primary-foreground"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        {userRole === "STUDENT" && (
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full justify-between">
                  Student Resources
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Housing Guide">
                        <Link href="#">
                          <BookOpen className="text-sidebar-foreground/70" />
                          <span>Housing Guide</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Viewing Calendar">
                        <Link href="#">
                          <Calendar className="text-sidebar-foreground/70" />
                          <span>Viewing Calendar</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Help Center">
                        <Link href="#">
                          <HelpCircle className="text-sidebar-foreground/70" />
                          <span>Help Center</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}

        {userRole === "LANDLORD" && (
          <SidebarGroup>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full justify-between">
                  Landlord Tools
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Property Analytics">
                        <Link href="#">
                          <BookOpen className="text-sidebar-foreground/70" />
                          <span>Property Analytics</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Viewing Schedule">
                        <Link href="#">
                          <Calendar className="text-sidebar-foreground/70" />
                          <span>Viewing Schedule</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Help Center">
                        <Link href="#">
                          <HelpCircle className="text-sidebar-foreground/70" />
                          <span>Help Center</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {userRole === "LANDLORD" ? "LL" : "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-medium">
                        {userRole === "LANDLORD" ? "Jane Doe" : "Alex Johnson"}
                      </span>
                      <span className="text-sidebar-foreground/70">
                        {userRole}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userId}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${userId}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
