"use client";

import { useState, useEffect, useRef } from "react";
// import { DashboardLayout } from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bed,
  Bath,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  Eye,
  SlidersHorizontal,
  X,
  ChevronDown,
  Share2,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Snowflake,
} from "lucide-react";
import { getActiveProperties, toggleSavedProperty } from "@/actions";

// Amenity icon mapping
const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3.5 w-3.5" />,
  Parking: <Car className="h-3.5 w-3.5" />,
  Gym: <Dumbbell className="h-3.5 w-3.5" />,
  Furnished: <Utensils className="h-3.5 w-3.5" />,
  AC: <Snowflake className="h-3.5 w-3.5" />,
};

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
  amenities: string[];
  availableFrom: Date;
  status: string;
  landlord: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
};

export default function FeedPage({ params }: { params: { userId: string } }) {
  const userId = params.userId;
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const feedRef = useRef<HTMLDivElement>(null);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await getActiveProperties();
        const formattedProperties = data.map((property: any) => ({
          ...property,
          availableFrom: new Date(property.availableFrom),
          createdAt: new Date(property.createdAt),
        }));
        setProperties(formattedProperties);
        setFilteredProperties(formattedProperties);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = properties;

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

    // Price range filter
    result = result.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Bedroom filter
    if (bedroomFilter !== null) {
      result = result.filter((property) => property.bedrooms === bedroomFilter);
    }

    setFilteredProperties(result);
    setVisibleCount(4); // Reset visible count when filters change
  }, [searchTerm, priceRange, bedroomFilter, properties]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (feedRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          document.documentElement;
        if (
          scrollTop + clientHeight >= scrollHeight - 300 &&
          visibleCount < filteredProperties.length
        ) {
          setVisibleCount((prev) =>
            Math.min(prev + 2, filteredProperties.length)
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredProperties.length]);

  const toggleSaveProperty = async (id: string) => {
    try {
      await toggleSavedProperty(userId, id);
      setSavedProperties((prev) => {
        if (prev.includes(id)) {
          toast({
            title: "Property removed",
            description: "Property removed from your saved list",
          });
          return prev.filter((propId) => propId !== id);
        } else {
          toast({
            title: "Property saved",
            description: "Property added to your saved list",
          });
          return [...prev, id];
        }
      });
    } catch (error) {
      console.error("Error toggling saved property:", error);
      toast({
        title: "Error",
        description: "Failed to update saved properties",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 2000]);
    setBedroomFilter(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" ref={feedRef}>
      {/* Header with search and filters */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Discover Your Perfect Home
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {isFilterOpen ? (
                <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform" />
              )}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, property name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Expandable filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Price Range</h3>
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
                    <h3 className="text-sm font-medium">Bedrooms</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={bedroomFilter === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setBedroomFilter(null)}
                      >
                        Any
                      </Badge>
                      {[1, 2, 3, 4].map((num) => (
                        <Badge
                          key={num}
                          variant={
                            bedroomFilter === num ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => setBedroomFilter(num)}
                        >
                          {num} {num === 1 ? "Bedroom" : "Bedrooms"}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Property feed */}
      <div className="mt-6 space-y-8">
        {filteredProperties.length > 0 ? (
          <>
            {filteredProperties
              .slice(0, visibleCount)
              .map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-8"
                >
                  <PropertyCard
                    property={property}
                    userId={userId}
                    isSaved={savedProperties.includes(property.id)}
                    onSave={() => toggleSaveProperty(property.id)}
                  />
                </motion.div>
              ))}

            {visibleCount < filteredProperties.length && (
              <div className="flex justify-center py-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + 4, filteredProperties.length)
                    )
                  }
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn't find any properties matching your search criteria. Try
              adjusting your filters or search term.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  userId: string;
  isSaved: boolean;
  onSave: () => void;
}

function PropertyCard({
  property,
  userId,
  isSaved,
  onSave,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg bg-background border transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Property image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={property.imageUrl || "/placeholder.svg"}
            alt={property.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">{property.title}</h2>
              <div className="flex items-center gap-4 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{property.distanceToCampus}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-primary/90 hover:bg-primary border-none text-white text-lg font-bold">
              ${property.price}/mo
            </Badge>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave();
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                isSaved ? "fill-primary text-primary" : "fill-transparent"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard.writeText(
                window.location.origin +
                  `/dashboard/${userId}/properties/${property.id}`
              );
              toast({
                title: "Link copied",
                description: "Property link copied to clipboard",
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Property details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-muted-foreground mb-1">{property.location}</p>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Available from {formatDate(property.availableFrom)}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {property.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 5).map((amenity: string) => (
            <Badge
              key={amenity}
              variant="outline"
              className="bg-primary-50 text-primary-700 border-primary-200 flex items-center gap-1"
            >
              {amenityIcons[amenity] || null}
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 5 && (
            <Badge variant="outline">
              +{property.amenities.length - 5} more
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 gap-2" asChild>
            <Link href={`/dashboard/${userId}/properties/${property.id}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button
            className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            asChild
          >
            <Link href={`/dashboard/${userId}/properties/${property.id}`}>
              <MessageSquare className="h-4 w-4" />
              Contact Landlord
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
