"use server";

import { PropertyFormValues } from "@/components/forms/add-property-form";
import { db } from "@/lib/prismaClient";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

// model User {
//   id        String    @id @default(uuid())
//   fullName      String
//   email     String    @unique
//   password  String
//   role      Role
//   properties Property[] @relation("UserProperties")
//   // messages  Message[] @relation("UserMessages", fields: [id], references: [senderId, receiverId])
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt

//   messagesSent        Message[]      @relation("SenderMessages")
//   messagesReceived     Message[]     @relation("ReceiverMessages")

// }
export const onAuthenticateUser = async () => {
  try {
    const authUser = await currentUser();

    if (!authUser) {
      return { status: 404, message: "User not authenticated." };
    }

    const existingUser = await db.user.findUnique({
      where: { clerkId: authUser.id },
    });

    if (existingUser) {
      return { status: 200, data: existingUser }; // Return existing user
    }

    const newUser = await db.user.create({
      data: {
        fullName: authUser.fullName || "",
        email: authUser.emailAddresses[0]?.emailAddress || "",
        role: "NONE",
        clerkId: authUser.id,
      },
    });

    return { status: 201, data: newUser }; // Return newly created user
  } catch (error) {
    console.error("Error during user authentication:", error);
    return { status: 500, message: "Internal server error." }; // Handle errors gracefully
  }
};

export const getUserByClerkId = async () => {
  const authUser = await currentUser();

  if (!authUser) {
    return { status: 404, message: "User not authenticated." };
  }

  const user = await db.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (!user) {
    return { status: 404, message: "User not found." };
  }

  return { status: 200, data: user }; // Return found user
};

export const addUserRole = async (role: Role) => {
  const authUser = await currentUser();
  if (!authUser) {
    return { status: 404, message: "User not authenticated." };
  }

  const res = await getUserByClerkId();
  const id = res.data?.id;

  if (!res || !id) {
    console.error("User not found or invalid response:", res);
    return { status: 404, message: "User not found." };
  }

  try {
    const user = await db.user.update({
      where: { id },
      data: { role },
    });

    const clerkClientInstance = await clerkClient();
    await clerkClientInstance.users.updateUser(id, {
      unsafeMetadata: { role },
    });

    console.log(user, res, id);
    return { status: 200, data: user };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { status: 500, message: "Failed to update user role." };
  }
};

export const getUserRole = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true }, // Only select the role field
    });

    if (!user) {
      console.error("User not found:", userId);
      return "NONE"; // Return a default role if user is not found
    }

    return user.role; // Return the user's role
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "NONE"; // Return a default role in case of an error
  }
};

// model Property {
//   id          String    @id @default(uuid())
//   title       String
//   description String
//   imageUrl       String
//   price       Float
//   bedrooms    Int
//   location    String
//   landlord    User      @relation("UserProperties", fields: [landlordId], references: [id])
//   landlordId  String
//   messages    Message[] @relation("PropertyMessages")
//   createdAt   DateTime  @default(now())
//   updatedAt   DateTime  @updatedAt
// }

export const getProperties = async (userId: string) => {
  try {
    const properties = await db.property.findMany({
      where: { landlordId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        landlord: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      image: property.imageUrl,
      price: property.price,
      bedrooms: property.bedrooms,
      location: property.location,
      landlord: property.landlord.fullName,
      amenities: [], // Add to your schema if needed
      distanceToCampus: "", // Add to your schema if needed
      available: true, // Add to your schema if needed
      createdAt: property.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
};

export const upsertProperty = async (
  values: PropertyFormValues,
  userId: string,
  propertyId?: string // Optional propertyId for updating
) => {
  try {
    const upsertedProperty = await db.property.upsert({
      where: { id: propertyId || "" }, // Use the provided propertyId or an empty string
      create: {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl || "",
        price: values.price,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        location: values.location,
        landlordId: userId,
        amenities: values.amenities,
        status: values.status,
        // distanceToCampus: values.distanceToCampus,
      },
      update: {
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl || "",
        price: values.price,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        location: values.location,
        amenities: values.amenities,
        status: values.status,

        // distanceToCampus: values.distanceToCampus,
      },
    });

    return upsertedProperty;
  } catch (error) {
    console.error("Error upserting property:", error);
    throw new Error("Failed to upsert property");
  }
};

// export const deleteProperty = async (id: string) => {
//   try {
//     await db.property.delete({
//       where: { id },
//     });
//     return true;
//   } catch (error) {
//     console.error("Error deleting property:", error);
//     throw new Error("Failed to delete property");
//   }
// };

// actions.ts (add these to your existing actions)

export const getProperty = async (id: string) => {
  try {
    const property = await db.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: {
            fullName: true,
          },
        },
        // Add these relations if you implement inquiries and viewings
        // inquiries: true,
        // viewings: true,
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Format the data to match your UI structure
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      image: property.imageUrl, // Single image URL
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: 1, // Add to your schema if needed
      location: property.location,
      landlord: property.landlord.fullName,
      distanceToCampus: "", // Add to your schema if needed
      amenities: [], // Add to your schema if needed
      availableFrom: "", // Add to your schema if needed
      createdAt: property.createdAt.toISOString(),
      status: "Active", // Add to your schema if needed
      inquiries: [], // Will need to implement these
      viewings: [], // Will need to implement these
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property");
  }
};

export const getStudentProperties = async () => {
  try {
    const properties = await db.property.findMany({
      // where: { status: "ACTIVE" }, // Only show active properties
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            // Add these if you want to track response metrics
            // responseRate: true,
            // averageResponseTime: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format the data to match your UI structure
    return properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      image: property.imageUrl,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      distanceToCampus: property.distanceToCampus || "",
      amenities: property.amenities,
      availableFrom: property.availableFrom?.toISOString() || "",
      createdAt: property.createdAt.toISOString(),
      landlord: {
        id: property.landlord.id,
        name: property.landlord.fullName,
        responseRate: "95%", // Hardcoded for now - add to User model if needed
        responseTime: "Within 2 hours", // Hardcoded for now
      },
      // These would come from the student's saved properties
      saved: false,
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
};

export const getStudentProperty = async (propertyId: string) => {
  try {
    const property = await db.property.findUnique({
      where: {
        id: propertyId,
        // status: "ACTIVE", // Only show active properties
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            // Add these if you want to track response metrics
            // responseRate: true,
            // averageResponseTime: true,
          },
        },
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Format the data to match your UI structure
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      images: [property.imageUrl], // Single image for now
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      distanceToCampus: property.distanceToCampus || "",
      amenities: property.amenities,
      availableFrom: property.availableFrom?.toLocaleDateString() || "",
      landlord: {
        id: property.landlord.id,
        name: property.landlord.fullName,
        email: property.landlord.email,
        phone: property.landlord.phone || "",
        responseRate: "95%", // Hardcoded for now
        responseTime: "Within 2 hours", // Hardcoded for now
      },
      // This would come from the student's saved properties
      saved: false,
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property");
  }
};

// export const toggleSavedProperty = async (
//   userId: string,
//   propertyId: string
// ) => {
//   // You'll need to implement this if you want to track saved properties
//   // This would involve creating a SavedProperty model
//   return true;
// };

export const sendInquiry = async (
  propertyId: string,
  studentId: string,
  message: string
) => {
  try {
    await db.inquiry.create({
      data: {
        propertyId,
        studentId,
        message,
        status: "PENDING",
      },
    });
    return true;
  } catch (error) {
    console.error("Error sending inquiry:", error);
    throw new Error("Failed to send inquiry");
  }
};

export const scheduleViewing = async (
  propertyId: string,
  studentId: string,
  scheduledAt: Date,
  notes?: string
) => {
  try {
    await db.viewing.create({
      data: {
        propertyId,
        studentId,
        scheduledAt,
        notes,
        status: "REQUESTED",
      },
    });
    return true;
  } catch (error) {
    console.error("Error scheduling viewing:", error);
    throw new Error("Failed to schedule viewing");
  }
};

export const getLandlordProperty = async (
  propertyId: string,
  landlordId: string
) => {
  try {
    const property = await db.property.findUnique({
      where: {
        id: propertyId,
        landlordId: landlordId, // Ensure landlord owns this property
      },
      include: {
        inquiries: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        viewings: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: { scheduledAt: "asc" },
        },
      },
    });

    if (!property) {
      throw new Error("Property not found or you don't have permission");
    }

    // Format the data to match your UI structure
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      images: [property.imageUrl], // Single image for now
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      distanceToCampus: property.distanceToCampus || "",
      amenities: property.amenities,
      availableFrom: property.availableFrom?.toLocaleDateString() || "",
      createdAt: property.createdAt.toISOString(),
      status: property.status,
      inquiries: property.inquiries.map((inquiry) => ({
        id: inquiry.id,
        student: {
          id: inquiry.student.id,
          name: inquiry.student.fullName,
          email: inquiry.student.email,
        },
        response: inquiry.response,
        message: inquiry.message,
        date: inquiry.createdAt.toISOString(),
        status: inquiry.status,
      })),
      viewings: property.viewings.map((viewing) => ({
        id: viewing.id,
        student: {
          id: viewing.student.id,
          name: viewing.student.fullName,
          email: viewing.student.email,
        },
        date: viewing.scheduledAt.toISOString(),
        status: viewing.status,
      })),
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    throw new Error("Failed to fetch property");
  }
};

export const deleteProperty = async (
  propertyId: string,
  landlordId?: string
) => {
  try {
    await db.property.delete({
      where: {
        id: propertyId,
        landlordId: landlordId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw new Error("Failed to delete property");
  }
};

export const updateInquiryStatus = async (
  inquiryId: string,
  status: "PENDING" | "RESPONDED" | "DECLINED"
) => {
  try {
    await db.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });
    return true;
  } catch (error) {
    console.error("Error updating inquiry:", error);
    throw new Error("Failed to update inquiry");
  }
};

export const updateViewingStatus = async (
  viewingId: string,
  status: "REQUESTED" | "CONFIRMED" | "DECLINED" | "COMPLETED"
) => {
  try {
    await db.viewing.update({
      where: { id: viewingId },
      data: { status },
    });
    return true;
  } catch (error) {
    console.error("Error updating viewing:", error);
    throw new Error("Failed to update viewing");
  }
};

// actions.ts
export const respondToInquiry = async (inquiryId: string, response: string) => {
  try {
    await db.inquiry.update({
      where: { id: inquiryId },
      data: {
        status: "RESPONDED",
        response,
        updatedAt: new Date(),
      },
    });
    return true;
  } catch (error) {
    console.error("Error responding to inquiry:", error);
    throw new Error("Failed to respond to inquiry");
  }
};

export const getStudentInquiries = async (studentId: string) => {
  try {
    const properties = await db.property.findMany({
      where: {
        inquiries: {
          some: {
            studentId,
          },
        },
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        inquiries: {
          where: {
            studentId,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return properties;
  } catch (error) {
    console.error("Error fetching student inquiries:", error);
    throw new Error("Failed to fetch student inquiries");
  }
};

export const getActiveProperties = async () => {
  try {
    const properties = await db.property.findMany({
      where: {
        // status: "ACTIVE",
      },
      include: {
        landlord: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return properties.map((property) => ({
      ...property,
      availableFrom: property.availableFrom?.toISOString(),
      createdAt: property.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
};

export const toggleSavedProperty = async (
  userId: string,
  propertyId: string
) => {
  try {
    // Check if the property is already saved
    const existingSavedProperty = await db.savedProperty.findFirst({
      where: {
        studentId: userId,
        propertyId,
      },
    });

    if (existingSavedProperty) {
      // Remove from saved
      await db.savedProperty.delete({
        where: {
          id: existingSavedProperty.id,
        },
      });
      return false;
    } else {
      // Add to saved
      await db.savedProperty.create({
        data: {
          studentId: userId,
          propertyId,
        },
      });
      return true;
    }
  } catch (error) {
    console.error("Error toggling saved property:", error);
    throw new Error("Failed to toggle saved property");
  }
};

// actions/dashboard.ts

export const getLandlordDashboardData = async (userId: string) => {
  try {
    // Get properties count by status
    const properties = await db.property.findMany({
      where: { landlordId: userId },
      select: {
        id: true,
        title: true,
        location: true,
        imageUrl: true,
        status: true,
      },
    });

    const propertyDistribution = [
      {
        status: "ACTIVE",
        count: properties.filter((p) => p.status === "ACTIVE").length,
      },
      {
        status: "RENTED",
        count: properties.filter((p) => p.status === "RENTED").length,
      },
      {
        status: "DRAFT",
        count: properties.filter((p) => p.status === "DRAFT").length,
      },
      {
        status: "ARCHIVED",
        count: properties.filter((p) => p.status === "ARCHIVED").length,
      },
    ];

    // Get inquiries count
    const inquiries = await db.inquiry.count({
      where: {
        property: { landlordId: userId },
      },
    });

    const pendingInquiries = await db.inquiry.count({
      where: {
        property: { landlordId: userId },
        status: "PENDING",
      },
    });

    // Get viewings count
    const viewings = await db.viewing.count({
      where: {
        property: { landlordId: userId },
      },
    });

    const upcomingViewings = await db.viewing.count({
      where: {
        property: { landlordId: userId },
        scheduledAt: { gte: new Date() },
        status: { in: ["REQUESTED", "CONFIRMED"] },
      },
    });

    // Get upcoming viewings details
    const upcomingViewingsDetails = await db.viewing.findMany({
      where: {
        property: { landlordId: userId },
        scheduledAt: { gte: new Date() },
        status: { in: ["REQUESTED", "CONFIRMED"] },
      },
      include: {
        property: { select: { id: true, title: true, imageUrl: true } },
        student: { select: { id: true, fullName: true } },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });

    // Get notifications
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        property: { select: { id: true, title: true } },
      },
    });

    // Calculate stats
    const totalProperties = properties.length;
    const activeProperties =
      propertyDistribution.find((p) => p.status === "ACTIVE")?.count || 0;
    const rentedProperties =
      propertyDistribution.find((p) => p.status === "RENTED")?.count || 0;
    const draftProperties =
      propertyDistribution.find((p) => p.status === "DRAFT")?.count || 0;
    const occupancyRate =
      Math.round((rentedProperties / totalProperties) * 100) || 0;

    // Get recent activity (this would need to be implemented based on your activity logging)
    const recentActivity: any = []; // Implement based on your activity logging system

    // Get inquiry trend (this would need to be implemented based on your analytics)
    const inquiryTrend: any = []; // Implement based on your analytics

    // Calculate monthly income (simplified example)
    const monthlyIncome = rentedProperties * 1000; // Adjust based on your actual rent data

    const propertiesWithCounts = await Promise.all(
      properties.map(async (property) => {
        const inquiriesCount = await db.inquiry.count({
          where: {
            propertyId: property.id,
            status: "PENDING",
          },
        });

        const viewingsCount = await db.viewing.count({
          where: {
            propertyId: property.id,
          },
        });

        return {
          id: property.id,
          title: property.title,
          location: property.location,
          status: property.status,
          imageUrl: property.imageUrl,
          inquiries: inquiriesCount,
          viewings: viewingsCount,
        };
      })
    );

    return {
      stats: {
        totalProperties,
        activeProperties,
        rentedProperties,
        draftProperties,
        totalInquiries: inquiries,
        pendingInquiries,
        totalViewings: viewings,
        upcomingViewings,
        occupancyRate,
        averageResponseTime: "2.5 hours", // You would calculate this based on actual response times
        monthlyIncome,
      },
      properties: propertiesWithCounts,
      notifications: notifications.map((n) => ({
        id: n.id,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        propertyId: n.propertyId,
        propertyTitle: n.property?.title,
        type: "inquiry", // You would determine this based on your notification types
      })),
      upcomingViewings: upcomingViewingsDetails.map((v) => ({
        id: v.id,
        propertyId: v.property.id,
        propertyTitle: v.property.title,
        propertyImage: v.property.imageUrl || "/placeholder.svg",
        studentId: v.student.id,
        studentName: v.student.fullName,
        scheduledAt: v.scheduledAt.toISOString(),
        status: v.status,
      })),
      recentActivity,
      inquiryTrend,
      propertyDistribution,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};

export const getSavedProperties = async (userId: string) => {
  return await db.savedProperty
    .findMany({
      where: { studentId: userId },
      include: {
        property: {
          include: {
            landlord: true,
            inquiries: true,
            viewings: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .then((savedProperties) =>
      savedProperties.map((sp) => ({
        ...sp.property,
        saved: true,
        savedAt: sp.createdAt,
      }))
    );
};
