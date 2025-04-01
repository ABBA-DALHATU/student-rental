"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Home,
  Calendar,
  TrendingUp,
  MessageSquare,
  Eye,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  PieChart,
  Activity,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getLandlordDashboardData } from "@/actions";
import { formatDistanceToNow } from "date-fns";

type DashboardData = {
  stats: {
    totalProperties: number;
    activeProperties: number;
    rentedProperties: number;
    draftProperties: number;
    totalInquiries: number;
    pendingInquiries: number;
    totalViewings: number;
    upcomingViewings: number;
    occupancyRate: number;
    averageResponseTime: string;
    monthlyIncome: number;
  };
  properties: {
    id: string;
    title: string;
    location: string;
    status: string;
    imageUrl: string;
    inquiries: number;
    viewings: number;
  }[];
  notifications: {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    propertyId?: string;
    propertyTitle?: string;
    type: string;
  }[];
  upcomingViewings: {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    studentId: string;
    studentName: string;
    scheduledAt: Date;
    status: string;
  }[];
  recentActivity: {
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }[];
  inquiryTrend: {
    month: string;
    count: number;
  }[];
  propertyDistribution: {
    status: string;
    count: number;
  }[];
};

export default function LandlordDashboardPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params.userId;
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getLandlordDashboardData(userId);
        // Format dates from strings to Date objects
        const formattedData = {
          ...data,
          notifications: data.notifications.map((n) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            propertyId: n.propertyId ?? undefined,
          })),
          upcomingViewings: data.upcomingViewings.map((v) => ({
            ...v,
            scheduledAt: new Date(v.scheduledAt),
          })),
          recentActivity: data.recentActivity.map((a) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        };
        setDashboardData(formattedData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Optimistic update
      setDashboardData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
        };
      });

      // TODO: Call API to mark as read
      // await markNotificationAsRead(notificationId)
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "viewing":
        return <Eye className="h-4 w-4 text-purple-500" />;
      case "viewing_confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "inquiry_response":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "property_rented":
        return <Home className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "inquiry":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "viewing":
        return <Eye className="h-4 w-4 text-purple-500" />;
      case "property":
        return <Home className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "RENTED":
        return "bg-blue-500";
      case "DRAFT":
        return "bg-yellow-500";
      case "ARCHIVED":
        return "bg-gray-500";
      case "CONFIRMED":
        return "bg-green-500";
      case "REQUESTED":
        return "bg-yellow-500";
      case "DECLINED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Landlord Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your properties and recent
            activity.
          </p>
        </div>
      </div>
      {/* Key Stats */}

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Properties Card */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Building className="h-4 w-4 text-primary-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.stats.totalProperties}
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 mr-2">
                <Badge
                  variant="outline"
                  className={cn("h-2 w-2 p-0 rounded-full bg-green-500")}
                />
                <span>Active: {dashboardData.stats.activeProperties}</span>
              </div>
              <div className="flex gap-1 mr-2">
                <Badge
                  variant="outline"
                  className={cn("h-2 w-2 p-0 rounded-full bg-blue-500")}
                />
                <span>Rented: {dashboardData.stats.rentedProperties}</span>
              </div>
              <div className="flex gap-1">
                <Badge
                  variant="outline"
                  className={cn("h-2 w-2 p-0 rounded-full bg-yellow-500")}
                />
                <span>Draft: {dashboardData.stats.draftProperties}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Inquiries Card */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inquiries
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.stats.totalInquiries}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">
                +
                {dashboardData.inquiryTrend.length > 0
                  ? dashboardData.inquiryTrend[
                      dashboardData.inquiryTrend.length - 1
                    ].count -
                    (dashboardData.inquiryTrend.length > 1
                      ? dashboardData.inquiryTrend[
                          dashboardData.inquiryTrend.length - 2
                        ].count
                      : 0)
                  : 0}
              </span>
              <span className="ml-1">from last month</span>
            </div>
            {dashboardData.stats.pendingInquiries > 0 && (
              <div className="mt-1 text-xs">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                >
                  {dashboardData.stats.pendingInquiries} pending
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Viewings Card */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Viewings
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.stats.upcomingViewings}
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 mr-2">
                <Badge
                  variant="outline"
                  className={cn("h-2 w-2 p-0 rounded-full bg-green-500")}
                />
                <span>
                  Confirmed:{" "}
                  {
                    dashboardData.upcomingViewings.filter(
                      (v) => v.status === "CONFIRMED"
                    ).length
                  }
                </span>
              </div>
              <div className="flex gap-1">
                <Badge
                  variant="outline"
                  className={cn("h-2 w-2 p-0 rounded-full bg-yellow-500")}
                />
                <span>
                  Requested:{" "}
                  {
                    dashboardData.upcomingViewings.filter(
                      (v) => v.status === "REQUESTED"
                    ).length
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Income Card */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Income
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData.stats.monthlyIncome.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <div className="flex gap-1 items-center">
                <Home className="h-3 w-3 text-blue-500" />
                <span>
                  From {dashboardData.stats.rentedProperties} rented{" "}
                  {dashboardData.stats.rentedProperties === 1
                    ? "property"
                    : "properties"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Properties Overview */}
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Properties Overview</CardTitle>
              <CardDescription>
                Status distribution of your properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-48 flex items-center justify-center bg-muted/30 rounded-md">
                  <div className="relative h-32 w-32">
                    <PieChart className="h-full w-full text-muted-foreground/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {dashboardData.stats.totalProperties}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Properties
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {dashboardData.propertyDistribution.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            getStatusColor(item.status)
                          )}
                        ></div>
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/${userId}/my-properties`}>
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* ... other left column cards ... */}
        </div>

        {/* Middle Column - Upcoming Viewings */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Upcoming Viewings</CardTitle>
            <CardDescription>Scheduled property viewings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {dashboardData.upcomingViewings.length > 0 ? (
                  dashboardData.upcomingViewings.map((viewing) => (
                    <div key={viewing.id} className="flex flex-col space-y-3">
                      {/* Viewing card content */}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">No upcoming viewings</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      When students request to view your properties, they'll
                      appear here
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/dashboard/${userId}/viewings`}>
                View All Viewings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Right Column - Notifications and Activity */}
        <div className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                {dashboardData.notifications.filter((n) => !n.isRead).length}{" "}
                unread notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-4">
                  {dashboardData.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 rounded-lg border transition-colors",
                        !notification.isRead
                          ? "bg-primary-50 border-primary-100"
                          : "bg-background border-border"
                      )}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      {/* Notification content */}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/dashboard/${userId}/notifications`}>
                  View All Notifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* ... other right column cards ... */}
        </div>
      </div>
    </div>
  );
}
