"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import ImageUpload from "../global/UploadZone_Uploadthing";

// Form schema for adding a new property
const propertyFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  bedrooms: z.coerce.number().int().positive({
    message: "Number of bedrooms must be a positive integer.",
  }),
  bathrooms: z.coerce.number().int().positive({
    message: "Number of bathrooms must be a positive integer.",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters.",
  }),
  // distanceToCampus: z.string().min(1, {
  //   message: "Distance to campus is required.",
  // }),
  amenities: z.array(z.string()).min(1, {
    message: "Select at least one amenity.",
  }),
  availableFrom: z.string().min(1, {
    message: "Available from date is required.",
  }),
  status: z.enum(["DRAFT", "ACTIVE", "RENTED", "ARCHIVED"], {
    message: "Please select a valid status.",
  }),
  imageUrl: z.string().optional(),
});

// Available amenities
const availableAmenities = [
  "WiFi",
  "Furnished",
  "Parking",
  "Gym",
  "Laundry",
  "Ensuite",
  "Garden",
  "Study Rooms",
  "Shared Kitchen",
  "Bike Storage",
  "Security System",
];

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface AddPropertyFormProps {
  onSubmit: (values: PropertyFormValues) => void;
  onCancel: () => void;
  initialValues?: PropertyFormValues; // Add initialValues prop
  isEditing?: boolean; // Add isEditing prop
}

export function AddPropertyForm({
  onSubmit,
  onCancel,
  initialValues,
  isEditing = false,
}: AddPropertyFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Form for adding a new property
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: initialValues || {
      title: "",
      description: "",
      price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      location: "",
      // distanceToCampus: "",
      amenities: [],
      availableFrom: "",
      status: "DRAFT",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (initialValues?.imageUrl) {
      setPreviewImage(initialValues.imageUrl);
    }
  }, [initialValues]);

  const handleSubmit = (values: PropertyFormValues) => {
    // Add the preview image to the form values
    const formData = {
      ...values,
      imagePreview: previewImage,
    };

    onSubmit(formData);

    // Reset the form
    form.reset();
    setPreviewImage(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 py-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Modern Studio Apartment" {...field} />
              </FormControl>
              <FormDescription>
                A catchy title will attract more students.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rent ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 650" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 123 University St, Apt 1"
                  {...field}
                />
              </FormControl>
              <FormDescription>Full address of the property.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="distanceToCampus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance to Campus</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance to campus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="On campus">On campus</SelectItem>
                  <SelectItem value="5 min walk">5 min walk</SelectItem>
                  <SelectItem value="10 min walk">10 min walk</SelectItem>
                  <SelectItem value="15 min walk">15 min walk</SelectItem>
                  <SelectItem value="20 min walk">20 min walk</SelectItem>
                  <SelectItem value="5 min drive">5 min drive</SelectItem>
                  <SelectItem value="10 min drive">10 min drive</SelectItem>
                  <SelectItem value="15 min drive">15 min drive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your property in detail..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include details about amenities, nearby facilities, and any
                special features.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Amenities</FormLabel>
                <FormDescription>
                  Select all amenities that your property offers.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableAmenities.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={amenity}
                          className="flex flex-row items-start space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {amenity}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="RENTED">Rented</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set the current status of this property.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Image</FormLabel>
              <FormControl>
                <ImageUpload onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update" : "Add"} Property</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
