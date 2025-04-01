import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  propertyImages: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Add auth logic here if needed
      return { userId: "user123" }; // Replace with actual user ID
    })
    .onUploadComplete(async ({ file }) => {
      console.log("file❌❌❌❌❌", file);
      console.log("File uploaded:", file.ufsUrl);
      return {
        imageUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
