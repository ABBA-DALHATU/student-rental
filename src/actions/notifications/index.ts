// actions/notifications.ts
"use server";
import { db } from "@/lib/prismaClient";

export const getUnreadNotificationsCount = async (userId: string) => {
  return await db.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};

export const getNotifications = async (userId: string) => {
  return await db.notification.findMany({
    where: {
      userId,
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await db.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  return await db.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

export const createNotification = async (
  userId: string,
  message: string,
  propertyId?: string
) => {
  return await db.notification.create({
    data: {
      userId,
      message,
      propertyId,
    },
  });
};
