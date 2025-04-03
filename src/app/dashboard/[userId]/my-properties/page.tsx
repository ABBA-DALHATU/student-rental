"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  MapPin,
  MessageSquare,
  Filter,
  SlidersHorizontal,
  Plus,
  Pencil,
  Trash2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  getProperties,
  addProperty,
  deleteProperty,
  upsertProperty,
} from "@/actions";
import {
  AddPropertyForm,
  PropertyFormValues,
} from "@/components/forms/add-property-form";
import { ButtonLoading } from "@/components/global/PleaseWaitButton";

export default function MyPropertiesPage({
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
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<any>(null);

  // Loading states
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  const [isUpdatingProperty, setIsUpdatingProperty] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await getProperties(userId);
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
        amenityFilters.every((amenity) => property.amenities?.includes(amenity))
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

  const handleAddProperty = async (values: PropertyFormValues) => {
    try {
      setIsAddingProperty(true);
      const res = await upsertProperty(values, userId);

      if (res) {
        // Fetch the updated list of properties
        const updatedProperties = await getProperties(userId);
        setProperties(updatedProperties);

        toast({
          title: "Property added",
          description: "Your property has been successfully added.",
        });
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingProperty(false);
      setIsAddPropertyOpen(false);
    }
  };

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
  };

  const handleEditProperty = async (values: PropertyFormValues) => {
    try {
      if (!currentProperty) return;

      setIsUpdatingProperty(true);
      const res = await upsertProperty(values, userId, currentProperty.id);

      if (res) {
        // Fetch the updated list of properties
        const updatedProperties = await getProperties(userId);
        setProperties(updatedProperties);

        toast({
          title: "Property updated",
          description: "Your property has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProperty(false);
      setIsEditDialogOpen(false);
      setCurrentProperty(null);
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setIsDeletingProperty(true);
      await deleteProperty(propertyToDelete);

      // Fetch the updated list of properties
      const updatedProperties = await getProperties(userId);
      setProperties(updatedProperties);

      toast({
        title: "Property deleted",
        description: "Your property has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingProperty(false);
      setPropertyToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 w-full max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient">
              My Properties
            </h1>
            <p className="text-muted-foreground">
              Manage your property listings and view inquiries.
            </p>
          </div>
          <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg border-none">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
                <DialogDescription>
                  Fill out the form below to list your property for students.
                </DialogDescription>
              </DialogHeader>
              <AddPropertyForm
                onSubmit={handleAddProperty}
                onCancel={() => setIsAddPropertyOpen(false)}
                isLoading={isAddingProperty}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by title, description, location..."
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
                    <Label>Bedrooms</Label>
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
                      <Label>Price Range</Label>
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
                    <Label>Amenities</Label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden property-card">
                <div className="aspect-video relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-background/80 hover:bg-background/90 rounded-full"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white font-bold text-xl">
                      ${property.price}/month
                    </p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {property.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {property.bedrooms}{" "}
                          {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-primary-50 text-primary-700 border-primary-200"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary">
                        {property.distanceToCampus}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentProperty(property);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          asChild
                          className="gradient-bg border-none"
                        >
                          <Link
                            href={`/dashboard/${userId}/my-properties/${property.id}`}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {properties.length === 0
                ? "You haven't added any properties yet. Click 'Add Property' to get started."
                : "We couldn't find any properties matching your search criteria. Try adjusting your filters or search term."}
            </p>
            {properties.length === 0 ? (
              <Button
                onClick={() => setIsAddPropertyOpen(true)}
                className="gradient-bg border-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            ) : (
              <Button onClick={clearFilters}>Clear all filters</Button>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!propertyToDelete}
        onOpenChange={(open) => !open && setPropertyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {isDeletingProperty ? (
              <ButtonLoading />
            ) : (
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update your property details below.
            </DialogDescription>
          </DialogHeader>
          {currentProperty && (
            <AddPropertyForm
              onSubmit={handleEditProperty}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentProperty(null);
              }}
              initialValues={{
                title: currentProperty.title,
                description: currentProperty.description,
                price: currentProperty.price,
                bedrooms: currentProperty.bedrooms,
                bathrooms: currentProperty.bathrooms,
                location: currentProperty.location,
                amenities: currentProperty.amenities,
                availableFrom: currentProperty.availableFrom,
                status: currentProperty.status,
                imageUrl: currentProperty.image || "",
              }}
              isEditing={true}
              isLoading={isUpdatingProperty}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
