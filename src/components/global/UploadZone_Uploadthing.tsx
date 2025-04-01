"use client";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";

type Props = {
  //   apiEndpoint: "projectImages";
  onChange: (url?: string) => void;
  value?: string;
};

const ImageUpload = ({ onChange, value }: Props) => {
  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="relative">
          <Image
            src={value}
            alt="Uploaded preview"
            width={160}
            height={160}
            className="object-cover rounded-md"
          />
          <Button
            onClick={() => onChange("")}
            variant="destructive"
            type="button"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30 rounded-lg p-4">
      <UploadDropzone
        endpoint="propertyImages"
        onClientUploadComplete={(res) => {
          onChange(res?.[0].ufsUrl);
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          alert("Upload failed. Please try again.");
        }}
        config={{
          allowedFileTypes: ["jpg", "jpeg", "png", "gif"],
          maxFileSize: "5MB",
        }}
      />
    </div>
  );
};

export default ImageUpload;
