"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bed,
  Bath,
  MapPin,
  Edit,
  Trash2,
  Calendar,
  MessageSquare,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getLandlordProperty,
  deleteProperty,
  updateInquiryStatus,
  updateViewingStatus,
} from "@/actions";

export default function PropertyDetailPage({
  params,
}: {
  params: { userId: string; propertyId: string };
}) {
  const userId = params.userId;
  const propertyId = params.propertyId;
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const data = await getLandlordProperty(propertyId, userId);
        setProperty(data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive",
        });
        router.push(`/dashboard/${userId}/my-properties`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, userId, toast, router]);

  const handleDeleteProperty = async () => {
    try {
      await deleteProperty(propertyId, userId);
      toast({
        title: "Property deleted",
        description: "Your property has been successfully deleted.",
      });
      router.push(`/dashboard/${userId}/my-properties`);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleInquiryResponse = async (inquiryId: string) => {
    try {
      await updateInquiryStatus(inquiryId, "RESPONDED");
      toast({
        title: "Inquiry marked as responded",
        description: "The student has been notified.",
      });
      // Refresh the property data
      const updatedProperty = await getLandlordProperty(propertyId, userId);
      setProperty(updatedProperty);
    } catch (error) {
      console.error("Error responding to inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to update inquiry status.",
        variant: "destructive",
      });
    }
  };

  const handleViewingConfirmation = async (
    viewingId: string,
    confirm: boolean
  ) => {
    try {
      await updateViewingStatus(viewingId, confirm ? "CONFIRMED" : "DECLINED");
      toast({
        title: confirm ? "Viewing confirmed" : "Viewing declined",
        description: confirm
          ? "The viewing has been confirmed. The student has been notified."
          : "The viewing has been declined. The student has been notified.",
      });
      // Refresh the property data
      const updatedProperty = await getLandlordProperty(propertyId, userId);
      setProperty(updatedProperty);
    } catch (error) {
      console.error("Error updating viewing:", error);
      toast({
        title: "Error",
        description: "Failed to update viewing status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      // <DashboardLayout userRole="LANDLORD" userId={userId}>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      // </DashboardLayout>
    );
  }

  if (!property) {
    return (
      // <DashboardLayout userRole="LANDLORD" userId={userId}>
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-semibold mb-2">Property not found</h3>
        <Link href={`/dashboard/${userId}/my-properties`}>
          <Button variant="outline">Back to properties</Button>
        </Link>
      </div>
      // </DashboardLayout>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back button */}
        <div>
          <Link href={`/dashboard/${userId}/my-properties`}>
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to my properties
            </Button>
          </Link>
        </div>

        {/* Property header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {property.title}
            </h1>
            <p className="text-muted-foreground">{property.location}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Property
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Property status and price */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <Badge
            className="w-fit"
            variant={property.status === "Active" ? "default" : "secondary"}
          >
            {property.status}
          </Badge>
          <p className="text-2xl font-bold">${property.price}/month</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>
                {property.bedrooms}{" "}
                {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{property.distanceToCampus}</span>
            </div>
          </div>
        </div>

        {/* Property images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 aspect-video rounded-lg overflow-hidden">
            <img
              src={property.images[0] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.slice(1, 4).map((image, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property details tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="viewings">Viewings</TabsTrigger>
          </TabsList>

          {/* Details tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {property.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {property.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Property Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          ${property.price}/month
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-medium">
                          {property.bathrooms}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Available From
                        </span>
                        <span className="font-medium">
                          {property.availableFrom}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Distance to Campus
                        </span>
                        <span className="font-medium">
                          {property.distanceToCampus}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listed On</span>
                        <span className="font-medium">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Property Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          variant={
                            property.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Inquiries</span>
                        <span className="font-medium">
                          {property.inquiries.length}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Viewings</span>
                        <span className="font-medium">
                          {property.viewings.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Inquiries tab */}
          <TabsContent value="inquiries" className="space-y-6 mt-6">
            <h3 className="text-lg font-semibold">Student Inquiries</h3>
            {property.inquiries.length > 0 ? (
              <div className="space-y-4">
                {property.inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {inquiry.student.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {inquiry.student.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              inquiry.status === "Responded"
                                ? "outline"
                                : "default"
                            }
                          >
                            {inquiry.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(inquiry.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm bg-muted p-3 rounded-md">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant={
                            inquiry.status === "Responded"
                              ? "outline"
                              : "default"
                          }
                          className="gap-2"
                          onClick={() => handleInquiryResponse(inquiry.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          {inquiry.status === "Responded"
                            ? "View Response"
                            : "Respond"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No inquiries yet</h4>
                <p className="text-muted-foreground">
                  When students inquire about your property, they'll appear
                  here.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Viewings tab */}
          <TabsContent value="viewings" className="space-y-6 mt-6">
            <h3 className="text-lg font-semibold">Scheduled Viewings</h3>
            {property.viewings.length > 0 ? (
              <div className="space-y-4">
                {property.viewings.map((viewing) => (
                  <Card key={viewing.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {viewing.student.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {viewing.student.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              viewing.status === "Confirmed"
                                ? "outline"
                                : "default"
                            }
                          >
                            {viewing.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(viewing.date).toLocaleDateString()} at{" "}
                          {new Date(viewing.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {viewing.status === "Requested" && (
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                              handleViewingConfirmation(viewing.id, false)
                            }
                          >
                            <XCircle className="h-4 w-4" />
                            Decline
                          </Button>
                          <Button
                            className="gap-2"
                            onClick={() =>
                              handleViewingConfirmation(viewing.id, true)
                            }
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Confirm
                          </Button>
                        </div>
                      )}
                      {viewing.status === "Confirmed" && (
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Add to Calendar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">
                  No viewings scheduled
                </h4>
                <p className="text-muted-foreground">
                  When students request to view your property, they'll appear
                  here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone. All inquiries and viewings associated with this
              property will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
