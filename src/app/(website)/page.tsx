import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Home, MessageSquare, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StudentNest</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Find Your Perfect Student Housing
                </h1>
                <p className="text-lg text-muted-foreground">
                  Connect with landlords, browse properties, and secure your
                  ideal student accommodation all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/sign-in">
                    <Button size="lg" className="w-full sm:w-auto">
                      I'm a Student
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      I'm a Landlord
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Student housing"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Create an Account
                </h3>
                <p className="text-muted-foreground">
                  Sign up as a student or landlord to access the platform's
                  features.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Browse Properties
                </h3>
                <p className="text-muted-foreground">
                  Search, filter, and find the perfect accommodation for your
                  needs.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Secure</h3>
                <p className="text-muted-foreground">
                  Message landlords directly and secure your new home with ease.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <span className="font-semibold">StudentNest</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudentNest. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
