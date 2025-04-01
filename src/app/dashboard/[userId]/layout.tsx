import { getUserRole } from "@/actions";
import { DashboardLayout } from "@/components/global/dashboard-layout";
import { currentUser } from "@clerk/nextjs/server"; // Import currentUser to get the authenticated user
import { Role } from "@prisma/client";
import { redirect } from "next/navigation"; // Import redirect for navigation
import { ReactNode } from "react";

type Props = {
  params: { userId: string };
  children: ReactNode;
};

export default async function DashboardPage({
  children,
  params: { userId },
}: Props) {
  //   const authUser = await currentUser(); // Get the authenticated user

  //   if (!authUser) {
  //     redirect("/auth/sign-in"); // Redirect to login if user is not authenticated
  //   }

  //   // Determine user role based on the authenticated user
  //   const userRole = authUser.unsafeMetadata.role || "NONE"; // Default to "NONE" if role is not set

  const userRole = await getUserRole(userId);

  // if (userRole === Role.STUDENT) {
  //   redirect(`/dashboard/${userId}/feed`);
  // }

  return (
    <DashboardLayout userRole={userRole as Role} userId={userId as string}>
      {children}
    </DashboardLayout>
  );
}
