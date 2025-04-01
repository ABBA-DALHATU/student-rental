"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building,
  Send,
  User,
  MapPin,
  Bed,
  Bath,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getStudentInquiries, sendInquiry } from "@/actions";

// Define types for our data
type Property = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  distanceToCampus: string;
  landlord: {
    id: string;
    fullName: string;
    email: string;
  };
  inquiries: Inquiry[];
};

type Inquiry = {
  id: string;
  message: string;
  status: "PENDING" | "RESPONDED" | "DECLINED";
  response: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AllInquiriesPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params.userId;
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch student inquiries
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setIsLoading(true);
        const data = await getStudentInquiries(userId);
        setProperties(formatProperties(data));
        if (data.length > 0) {
          setSelectedPropertyId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        toast({
          title: "Error",
          description: "Failed to load your inquiries.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [userId, toast]);

  // Format the properties data to match our expected structure
  const formatProperties = (data: any[]): Property[] => {
    return data.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      imageUrl: property.imageUrl || "/placeholder.svg",
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      distanceToCampus: property.distanceToCampus || "N/A",
      landlord: {
        id: property.landlord.id,
        fullName: property.landlord.fullName,
        email: property.landlord.email,
      },
      inquiries: property.inquiries.map((inquiry: any) => ({
        id: inquiry.id,
        message: inquiry.message,
        status: inquiry.status,
        response: inquiry.response,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt || inquiry.createdAt,
      })),
    }));
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPropertyId) {
      return;
    }

    try {
      // Send the inquiry to the server
      await sendInquiry(selectedPropertyId, userId, newMessage);

      // Optimistically update the UI
      const newInquiry: Inquiry = {
        id: `temp-${Date.now()}`, // Temporary ID until we get the real one from the server
        message: newMessage,
        status: "PENDING",
        response: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === selectedPropertyId
            ? { ...property, inquiries: [...property.inquiries, newInquiry] }
            : property
        )
      );

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your inquiry has been sent to the landlord.",
      });

      // Refetch data to get the actual server response
      const updatedData = await getStudentInquiries(userId);
      setProperties(formatProperties(updatedData));
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      // <DashboardLayout userRole="STUDENT" userId={userId}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      // </DashboardLayout>
    );
  }

  return (
    // <DashboardLayout userRole="STUDENT" userId={userId}>
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-3xl font-bold mb-6">My Inquiries</h1>

      <div className="flex flex-1 gap-6 h-full">
        {/* Properties sidebar */}
        <div className="w-full sm:w-64 flex-shrink-0">
          <Card className="h-full">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Properties</h2>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-3 pr-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className={cn(
                        "p-3 rounded-md cursor-pointer transition-colors",
                        selectedPropertyId === property.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedPropertyId(property.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {property.title}
                          </h3>
                          <p className="text-xs truncate">
                            {selectedPropertyId === property.id ? (
                              <span className="text-primary-foreground/80">
                                {property.location}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                {property.location}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge
                              variant={
                                selectedPropertyId === property.id
                                  ? "outline"
                                  : "secondary"
                              }
                              className={cn(
                                "text-xs",
                                selectedPropertyId === property.id &&
                                  "border-primary-foreground/30 text-primary-foreground"
                              )}
                            >
                              {property.inquiries.length}{" "}
                              {property.inquiries.length === 1
                                ? "inquiry"
                                : "inquiries"}
                            </Badge>
                            {property.inquiries.some(
                              (inq) => inq.status === "PENDING"
                            ) && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {selectedProperty ? (
            <>
              {/* Property header */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={selectedProperty.imageUrl}
                          alt={selectedProperty.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold">
                          {selectedProperty.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="h-3.5 w-3.5" />
                            <span>
                              {selectedProperty.bedrooms}{" "}
                              {selectedProperty.bedrooms === 1 ? "Bed" : "Beds"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5" />
                            <span>
                              {selectedProperty.bathrooms}{" "}
                              {selectedProperty.bathrooms === 1
                                ? "Bath"
                                : "Baths"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{selectedProperty.distanceToCampus}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/${userId}/properties/${selectedProperty.id}`}
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <span className="hidden sm:inline">View Property</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {selectedProperty.landlord.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Landlord
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    <div className="text-sm text-muted-foreground">
                      <span className="text-xs">
                        ${selectedProperty.price}/month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat messages */}
              <Card className="flex-1 mb-4">
                <CardContent className="p-4 h-full flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                      {selectedProperty.inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="space-y-3">
                          {/* Student message */}
                          <div className="flex items-start gap-3 justify-end">
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none max-w-[80%]">
                              <p className="text-sm">{inquiry.message}</p>
                              <p className="text-xs mt-1 text-primary-foreground/70 text-right">
                                {formatDate(inquiry.createdAt)}
                              </p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>

                          {/* Landlord response */}
                          {inquiry.status === "RESPONDED" &&
                            inquiry.response && (
                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                  <p className="text-sm">{inquiry.response}</p>
                                  <p className="text-xs mt-1 text-muted-foreground text-left">
                                    {formatDate(inquiry.updatedAt)}
                                  </p>
                                </div>
                              </div>
                            )}

                          {/* Pending status */}
                          {inquiry.status === "PENDING" && (
                            <div className="flex items-center gap-2 justify-center">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Awaiting response from landlord
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Message input */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type a new inquiry..."
                      className="min-h-[80px]"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      className="self-end"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <CardContent className="text-center p-6">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Properties Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't made any inquiries about properties yet.
                </p>
                <Button asChild>
                  <Link href={`/dashboard/${userId}/properties`}>
                    Browse Properties
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    // </DashboardLayout>
  );
}
