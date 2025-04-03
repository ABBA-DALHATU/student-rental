"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Bed,
  Bath,
  MapPin,
  Heart,
  Share,
  Calendar,
  Clock,
  User,
  Send,
  MessageSquare,
  Eye,
  LockIcon,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getStudentProperty,
  toggleSavedProperty,
  sendInquiry,
  scheduleViewing,
} from "@/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonLoading } from "@/components/global/PleaseWaitButton";

export default function PropertyDetailPage({
  params,
}: {
  params: { userId: string; propertyId: string };
}) {
  const userId = params.userId;
  const propertyId = params.propertyId;
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isViewingDialogOpen, setIsViewingDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [viewingDate, setViewingDate] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Loading states
  const [isSavingProperty, setIsSavingProperty] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSchedulingViewing, setIsSchedulingViewing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const data = await getStudentProperty(propertyId);
        setProperty(data);
        setIsSaved(data.saved || false);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, toast]);

  const toggleSaveProperty = async () => {
    try {
      setIsSavingProperty(true);
      await toggleSavedProperty(userId, propertyId);
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Property removed from saved" : "Property saved",
        description: isSaved
          ? "The property has been removed from your saved list."
          : "The property has been added to your saved list.",
      });
    } catch (error) {
      console.error("Error toggling saved property:", error);
      toast({
        title: "Error",
        description: "Failed to update saved property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProperty(false);
    }
  };

  const shareProperty = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Property link has been copied to clipboard.",
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || !property) return;

    try {
      setIsSendingMessage(true);
      await sendInquiry(property.id, userId, message);
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${property.landlord.name}.`,
      });
      setMessage("");
      setIsContactDialogOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const scheduleViewingRequest = async () => {
    if (!viewingDate || !property) return;

    try {
      setIsSchedulingViewing(true);
      const scheduledAt = new Date(viewingDate);
      await scheduleViewing(property.id, userId, scheduledAt);
      toast({
        title: "Viewing requested",
        description: `Your viewing request for ${property.title} has been sent to the landlord.`,
      });
      setViewingDate("");
      setIsViewingDialogOpen(false);
    } catch (error) {
      console.error("Error scheduling viewing:", error);
      toast({
        title: "Error",
        description: "Failed to schedule viewing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSchedulingViewing(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Payment Successful",
        description: "Your deposit has been processed successfully.",
      });
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description:
          "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-semibold mb-2">Property not found</h3>
        <Link href={`/dashboard/${userId}/properties`}>
          <Button variant="outline">Back to properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back button */}
        <div>
          <Link href={`/dashboard/${userId}/properties`}>
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to properties
            </Button>
          </Link>
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
            {property.images.slice(1, 4).map((image: string, i: number) => (
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

        {/* Property details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <div className="flex gap-2">
                  {isSavingProperty ? (
                    <ButtonLoading />
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleSaveProperty}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isSaved ? "fill-primary text-primary" : ""
                        }`}
                      />
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={shareProperty}>
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xl font-bold mt-2">${property.price}/month</p>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
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
                  <span>{property.location}</span>
                </div>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {property.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Availability</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Available from {property.availableFrom}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="amenities" className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="location" className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Location</h3>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Map would be displayed here
                  </p>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {property.location} - Located within walking distance to
                  campus, grocery stores, and public transportation.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Distance to campus: {property.distanceToCampus}
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Landlord</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{property.landlord.name}</p>
                      <p className="text-sm text-muted-foreground">Landlord</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Response rate: {property.landlord.responseRate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Response time: {property.landlord.responseTime}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => setIsContactDialogOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Schedule a Viewing
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a date and time to view this property in person.
                </p>
                <Button
                  className="w-full"
                  onClick={() => setIsViewingDialogOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>
            <Card className="mt-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Secure Your Accommodation
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pay a deposit to secure this property before someone else
                  does.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact landlord dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Landlord</DialogTitle>
            <DialogDescription>
              Send a message to {property?.landlord.name} about{" "}
              {property?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Landlord Response Rate</Label>
              <p className="text-sm">{property?.landlord.responseRate}</p>
            </div>
            <div className="space-y-2">
              <Label>Typical Response Time</Label>
              <p className="text-sm">{property?.landlord.responseTime}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Hi, I'm interested in this property. Is it still available?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsContactDialogOpen(false)}
            >
              Cancel
            </Button>
            {isSendingMessage ? (
              <ButtonLoading />
            ) : (
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule viewing dialog */}
      <Dialog open={isViewingDialogOpen} onOpenChange={setIsViewingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Viewing</DialogTitle>
            <DialogDescription>
              Request a viewing for {property?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="viewing-date">Preferred Date and Time</Label>
              <Input
                id="viewing-date"
                type="datetime-local"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewing-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="viewing-notes"
                placeholder="Any specific requirements or questions for the viewing?"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewingDialogOpen(false)}
            >
              Cancel
            </Button>
            {isSchedulingViewing ? (
              <ButtonLoading />
            ) : (
              <Button onClick={scheduleViewingRequest}>
                <Eye className="h-4 w-4 mr-2" />
                Request Viewing
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Gateway Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Gateway</DialogTitle>
            <DialogDescription>
              Secure your accommodation by paying the deposit for{" "}
              {property.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Deposit Amount</span>
                <span className="font-bold text-lg">${property.price}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                This amount will be deducted from your first month's rent
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="font-mono"
                    type="password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-address">Billing Address</Label>
                <Input
                  id="billing-address"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-card" />
              <label
                htmlFor="save-card"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save card for future payments
              </label>
            </div>

            <div className="text-xs text-muted-foreground">
              <LockIcon className="h-3 w-3 inline-block mr-1" />
              Your payment information is secure and encrypted
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            {isProcessingPayment ? (
              <ButtonLoading />
            ) : (
              <Button
                className="bg-gradient-to-r from-primary-600 to-primary-500"
                onClick={handlePayment}
              >
                Pay ${property.price}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Label component
function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}
