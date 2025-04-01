"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Bed,
  MapPin,
  Heart,
  MessageSquare,
  Filter,
  SlidersHorizontal,
  Calendar,
  Eye,
  Grid,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  getStudentProperties,
  toggleSavedProperty,
  sendInquiry,
  scheduleViewing as schedulePropertyViewing,
} from "@/actions";
import { createNotification } from "@/actions/notifications";

type ViewMode = "grid" | "list" | "large";

export default function PropertiesPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params.userId;
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isViewingDialogOpen, setIsViewingDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [viewingDate, setViewingDate] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await getStudentProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [userId, toast]);

  // Apply filters when any filter changes
  useEffect(() => {
    if (!properties.length) return;

    let result = [...properties];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(term) ||
          property.description.toLowerCase().includes(term) ||
          property.location.toLowerCase().includes(term)
      );
    }

    // Bedroom filter
    if (bedroomFilter !== "all") {
      const bedroomCount = Number.parseInt(bedroomFilter);
      if (bedroomFilter === "3+") {
        result = result.filter((property) => property.bedrooms >= 3);
      } else {
        result = result.filter(
          (property) => property.bedrooms === bedroomCount
        );
      }
    }

    // Price range filter
    result = result.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Amenity filters
    if (amenityFilters.length > 0) {
      result = result.filter((property) =>
        amenityFilters.every((amenity) => property.amenities.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredProperties(result);
  }, [
    searchTerm,
    bedroomFilter,
    sortBy,
    priceRange,
    amenityFilters,
    properties,
  ]);

  const handleAmenityChange = (amenity: string) => {
    setAmenityFilters((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBedroomFilter("all");
    setSortBy("newest");
    setPriceRange([0, 2000]);
    setAmenityFilters([]);
  };

  const toggleSaveProperty = async (id: string) => {
    try {
      await toggleSavedProperty(userId, id);
      setProperties((prev) =>
        prev.map((property) =>
          property.id === id
            ? { ...property, saved: !property.saved }
            : property
        )
      );

      const property = properties.find((p) => p.id === id);
      if (property) {
        toast({
          title: property.saved
            ? "Property removed from saved"
            : "Property saved",
          description: property.saved
            ? "The property has been removed from your saved list."
            : "The property has been added to your saved list.",
        });
      }
    } catch (error) {
      console.error("Error toggling saved property:", error);
      toast({
        title: "Error",
        description: "Failed to update saved property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactLandlord = (property: any) => {
    setSelectedProperty(property);
    setIsContactDialogOpen(true);
  };

  const handleScheduleViewing = (property: any) => {
    setSelectedProperty(property);
    setIsViewingDialogOpen(true);
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedProperty) return;

    try {
      await sendInquiry(selectedProperty.id, userId, message);
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedProperty.landlord.name}.`,
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
    }
  };

  const scheduleViewing = async () => {
    if (!viewingDate || !selectedProperty) return;

    try {
      const scheduledAt = new Date(viewingDate);
      await schedulePropertyViewing(selectedProperty.id, userId, scheduledAt);
      await createNotification(
        userId,
        `property/apartment viewing scheduled at ${scheduledAt}`
      );

      await createNotification(
        selectedProperty.landlord.id,
        `A student scheduled a viewing for your property (${selectedProperty.title}) at ${scheduledAt}`
      );
      toast({
        title: "Viewing scheduled",
        description: `Your viewing for ${selectedProperty.title} has been scheduled.`,
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
    }
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
    <>
      <div className="space-y-6 w-full max-w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">
            Browse Properties
          </h1>
          <p className="text-muted-foreground">
            Find your perfect student accommodation near campus.
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by location, property name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View mode toggle */}
            <div className="flex items-center border rounded-md p-1 bg-background">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm",
                  viewMode === "grid" && "bg-muted"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm",
                  viewMode === "list" && "bg-muted"
                )}
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-sm",
                  viewMode === "large" && "bg-muted"
                )}
                onClick={() => setViewMode("large")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {(bedroomFilter !== "all" ||
                    amenityFilters.length > 0 ||
                    priceRange[0] > 0 ||
                    priceRange[1] < 2000) && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                    >
                      !
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                  <SheetDescription>
                    Refine your search with these filters
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <UILable>Bedrooms</UILable>
                    <Select
                      value={bedroomFilter}
                      onValueChange={setBedroomFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bedrooms</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3+">3+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <UILable>Price Range</UILable>
                      <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 2000]}
                      max={2000}
                      step={50}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>

                  <div className="space-y-2">
                    <UILable>Amenities</UILable>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "WiFi",
                        "Furnished",
                        "Parking",
                        "Gym",
                        "Laundry",
                        "Ensuite",
                      ].map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`amenity-${amenity}`}
                            checked={amenityFilters.includes(amenity)}
                            onCheckedChange={() => handleAmenityChange(amenity)}
                          />
                          <label
                            htmlFor={`amenity-${amenity}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button onClick={() => setIsFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active filters */}
        {(bedroomFilter !== "all" ||
          amenityFilters.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 2000) && (
          <div className="flex flex-wrap gap-2">
            {bedroomFilter !== "all" && (
              <Badge variant="secondary" className="px-3 py-1">
                {bedroomFilter === "3+"
                  ? "3+ Bedrooms"
                  : `${bedroomFilter} Bedroom${
                      bedroomFilter !== "1" ? "s" : ""
                    }`}
                <button
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setBedroomFilter("all")}
                >
                  ×
                </button>
              </Badge>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 2000) && (
              <Badge variant="secondary" className="px-3 py-1">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setPriceRange([0, 2000])}
                >
                  ×
                </button>
              </Badge>
            )}

            {amenityFilters.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="px-3 py-1">
                {amenity}
                <button
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleAmenityChange(amenity)}
                >
                  ×
                </button>
              </Badge>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Property listings */}
        {filteredProperties.length > 0 ? (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid" &&
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
              viewMode === "list" && "grid-cols-1",
              viewMode === "large" && "grid-cols-1"
            )}
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                userId={userId}
                viewMode={viewMode}
                onSave={() => toggleSaveProperty(property.id)}
                onContact={() => handleContactLandlord(property)}
                onSchedule={() => handleScheduleViewing(property)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn't find any properties matching your search criteria. Try
              adjusting your filters or search term.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>

      {/* Contact landlord dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Landlord</DialogTitle>
            <DialogDescription>
              Send a message to {selectedProperty?.landlord.name} about{" "}
              {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <UILable>Landlord Response Rate</UILable>
              <p className="text-sm">
                {selectedProperty?.landlord.responseRate}
              </p>
            </div>
            <div className="space-y-2">
              <UILable>Typical Response Time</UILable>
              <p className="text-sm">
                {selectedProperty?.landlord.responseTime}
              </p>
            </div>
            <div className="space-y-2">
              <UILable htmlFor="message">Your Message</UILable>
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
            <Button onClick={sendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule viewing dialog */}
      <Dialog open={isViewingDialogOpen} onOpenChange={setIsViewingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule a Viewing</DialogTitle>
            <DialogDescription>
              Request a viewing for {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <UILable htmlFor="viewing-date">Preferred Date and Time</UILable>
              <Input
                id="viewing-date"
                type="datetime-local"
                value={viewingDate}
                onChange={(e) => setViewingDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <UILable htmlFor="viewing-notes">
                Additional Notes (Optional)
              </UILable>
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
            <Button onClick={scheduleViewing}>
              <Eye className="h-4 w-4 mr-2" />
              Request Viewing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Property Card Component
interface PropertyCardProps {
  property: any;
  userId: string;
  viewMode: ViewMode;
  onSave: () => void;
  onContact: () => void;
  onSchedule: () => void;
}

function PropertyCard({
  property,
  userId,
  viewMode,
  onSave,
  onContact,
  onSchedule,
}: PropertyCardProps) {
  return (
    <Link href={`/dashboard/${userId}/properties/${property.id}`}>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300 hover:shadow-xl",
          viewMode === "grid" && "h-[320px]",
          viewMode === "list" && "h-[220px]",
          viewMode === "large" && "h-[400px]"
        )}
      >
        <div className="relative w-full h-full">
          {/* Property Image */}
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Save Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave();
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                property.saved
                  ? "fill-primary text-primary"
                  : "fill-transparent"
              }`}
            />
          </Button>

          {/* Content Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white",
              viewMode === "list" &&
                "md:flex-row md:items-end md:justify-between md:gap-4"
            )}
          >
            {/* Property Details */}
            <div
              className={cn("space-y-1", viewMode === "list" && "md:flex-1")}
            >
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/80 hover:bg-primary/90 text-white border-none">
                  ${property.price}/month
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-black/30 text-white border-white/20"
                >
                  {property.distanceToCampus}
                </Badge>
              </div>

              <h3
                className={cn(
                  "font-bold text-white group-hover:text-primary-200 transition-colors",
                  viewMode === "grid" && "text-lg",
                  viewMode === "list" && "text-xl",
                  viewMode === "large" && "text-2xl"
                )}
              >
                {property.title}
              </h3>

              <div className="flex items-center gap-3 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" />
                  <span>
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>

              {viewMode !== "grid" && (
                <p className="text-sm text-white/70 line-clamp-2 mt-2">
                  {property.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 pt-1">
                {property.amenities
                  .slice(0, viewMode === "grid" ? 2 : 3)
                  .map((amenity: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/10 text-white/90 border-white/10 backdrop-blur-sm"
                    >
                      {amenity}
                    </Badge>
                  ))}
                {property.amenities.length > (viewMode === "grid" ? 2 : 3) && (
                  <Badge
                    variant="outline"
                    className="bg-white/10 text-white/90 border-white/10 backdrop-blur-sm"
                  >
                    +{property.amenities.length - (viewMode === "grid" ? 2 : 3)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={cn(
                "flex gap-2 mt-3 transition-opacity duration-300",
                viewMode === "list"
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100",
                viewMode === "list" && "md:flex-shrink-0"
              )}
            >
              <Button
                variant="outline"
                size="sm"
                className="bg-black/30 text-white border-white/20 hover:bg-black/50 hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSchedule();
                }}
              >
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Schedule
              </Button>
              <Button
                size="sm"
                className="bg-primary/80 hover:bg-primary text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onContact();
                }}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Label component
function UILable({
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
