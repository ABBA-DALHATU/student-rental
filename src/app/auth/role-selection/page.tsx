"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addUserRole, onAuthenticateUser } from "@/actions";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<
    "STUDENT" | "LANDLORD" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast({
        title: "No role selected",
        description: "Please select a role to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real implementation, this would be a server action to update the user's role
      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      //   const data = await onAuthenticateUser();
      //   const userId = data.data?.id;

      //   if (!userId) return;

      const res = await addUserRole(selectedRole);
      console.log(res);
      if (res) {
        // const userId = res.data?.id;
        // console.log(userId);

        toast({
          title: "Role selected",
          description: `You've selected the ${selectedRole.toLowerCase()} role.`,
        });

        // Redirect to dashboard
        router.push(`/auth/callback`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-8">
        <Building className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">StudentNest</span>
      </div>

      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select how you want to use StudentNest. You can change this later in
            your settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "STUDENT" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedRole("STUDENT")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                {selectedRole === "STUDENT" && (
                  <CheckCircle2 className="h-6 w-6 text-primary absolute -top-1 -right-1 bg-background rounded-full" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">I'm a Student</h2>
              <p className="text-muted-foreground mb-4">
                Browse and find your perfect student accommodation. Connect with
                landlords and secure your new home.
              </p>
              <ul className="text-sm text-left space-y-2 w-full">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Browse available properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Save favorite listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Message landlords directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Schedule property viewings</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedRole === "LANDLORD" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedRole("LANDLORD")}
          >
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                {selectedRole === "LANDLORD" && (
                  <CheckCircle2 className="h-6 w-6 text-primary absolute -top-1 -right-1 bg-background rounded-full" />
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2">I'm a Landlord</h2>
              <p className="text-muted-foreground mb-4">
                List your properties and connect with student tenants. Manage
                your listings and communications efficiently.
              </p>
              <ul className="text-sm text-left space-y-2 w-full">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>List multiple properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Receive inquiries from students</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Manage property details and availability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Schedule and track viewings</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            className="w-full max-w-md"
          >
            {isLoading ? "Processing..." : "Continue"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
