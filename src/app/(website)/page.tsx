"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building,
  Home,
  MessageSquare,
  User,
  CheckCircle,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isAosInitialized, setIsAosInitialized] = useState(false);

  useEffect(() => {
    // Dynamically import AOS only on the client side
    const initAOS = async () => {
      try {
        const AOS = (await import("aos")).default;
        // Import the CSS
        await import("aos/dist/aos.css");

        AOS.init({
          duration: 800,
          once: true,
          easing: "ease-out",
        });

        setIsAosInitialized(true);
      } catch (error) {
        console.error("Failed to initialize AOS:", error);
      }
    };

    initAOS();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Building className="h-6 w-6 text-white" />
            </motion.div>
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl font-bold text-white"
            >
              StudentNest
            </motion.span>
          </div>

          {/* Rounded Navigation Bar */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20"
          >
            <ul className="flex space-x-1">
              <li>
                <Link
                  href="#features"
                  className="px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors duration-300 inline-block"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors duration-300 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors duration-300 inline-block"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="#benefits"
                  className="px-4 py-2 rounded-full text-white hover:bg-white/20 transition-colors duration-300 inline-block"
                >
                  Benefits
                </Link>
              </li>
            </ul>
          </motion.nav>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/auth/sign-in">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/20 rounded-full"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/auth/sign-up">
                <Button className="bg-white text-primary hover:bg-white/90 rounded-full">
                  Sign Up
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/1929345158/photo/modern-apartment-with-large-windows.jpg?s=2048x2048&w=is&k=20&c=BVoaNU0lklmbqhVmwt7Ospi8ecdVkap-NmrvCNuRUyY=')",
              filter: "brightness(0.7) saturate(1.2)",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-3xl text-white space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find Your Perfect Student Home
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Connect with trusted landlords, browse quality properties, and
              secure your ideal student accommodation all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register?role=student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-full group"
                >
                  I'm a Student
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/register?role=landlord">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white/20 rounded-full group"
                >
                  I'm a Landlord
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="flex flex-col items-center"
          >
            <span className="text-white/80 text-sm mb-2">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
                className="w-1.5 h-1.5 bg-white rounded-full mt-2"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div
            className="text-center mb-16"
            data-aos={isAosInitialized ? "fade-up" : ""}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simplifying Student Housing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              StudentNest makes finding and managing student accommodations
              easier than ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div
              className="flex flex-col items-center text-center"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="100"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transform transition-transform duration-500 hover:scale-110">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Properties</h3>
              <p className="text-muted-foreground">
                Browse verified student properties with detailed information,
                high-quality photos, and transparent pricing.
              </p>
            </div>

            <div
              className="flex flex-col items-center text-center"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="200"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transform transition-transform duration-500 hover:scale-110">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Direct Communication
              </h3>
              <p className="text-muted-foreground">
                Message landlords directly, schedule viewings, and get answers
                to your questions without intermediaries.
              </p>
            </div>

            <div
              className="flex flex-col items-center text-center"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="300"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transform transition-transform duration-500 hover:scale-110">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Platform</h3>
              <p className="text-muted-foreground">
                Our secure platform protects your personal information and helps
                you make confident housing decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div
            className="text-center mb-16"
            data-aos={isAosInitialized ? "fade-up" : ""}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How StudentNest Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple process designed for both students and landlords
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Students */}
            <div
              className="space-y-8"
              data-aos={isAosInitialized ? "fade-right" : ""}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">
                  Create a Student Account
                </h3>
              </div>
              <div className="relative pl-14">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                <p className="text-muted-foreground">
                  Sign up as a student and complete your profile with your
                  preferences and requirements.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">
                  Browse Available Properties
                </h3>
              </div>
              <div className="relative pl-14">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                <p className="text-muted-foreground">
                  Search and filter properties based on your budget, location
                  preferences, and required amenities.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Connect & Secure</h3>
              </div>
              <div className="pl-14">
                <p className="text-muted-foreground">
                  Contact landlords, schedule viewings, and secure your ideal
                  student accommodation.
                </p>
              </div>
            </div>

            {/* For Landlords */}
            <div
              className="space-y-8"
              data-aos={isAosInitialized ? "fade-left" : ""}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">
                  Register as a Landlord
                </h3>
              </div>
              <div className="relative pl-14">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                <p className="text-muted-foreground">
                  Create your landlord account and verify your identity to build
                  trust with potential tenants.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">List Your Properties</h3>
              </div>
              <div className="relative pl-14">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary/20"></div>
                <p className="text-muted-foreground">
                  Add detailed property listings with high-quality photos,
                  accurate descriptions, and transparent pricing.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Manage & Communicate</h3>
              </div>
              <div className="pl-14">
                <p className="text-muted-foreground">
                  Respond to inquiries, schedule viewings, and manage your
                  properties all in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div
            className="text-center mb-16"
            data-aos={isAosInitialized ? "fade-up" : ""}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from students and landlords who have found success with
              StudentNest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-muted/20 p-8 rounded-xl border border-muted transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="100"
            >
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="italic mb-6">
                "StudentNest made finding my apartment so easy! I was able to
                filter by exactly what I needed and found the perfect place
                within a week."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">
                    Computer Science Student
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-muted/20 p-8 rounded-xl border border-muted transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="200"
            >
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="italic mb-6">
                "As a landlord, I've been able to find reliable student tenants
                quickly. The platform makes it easy to manage inquiries and
                viewings."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Property Owner
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-muted/20 p-8 rounded-xl border border-muted transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="300"
            >
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="italic mb-6">
                "The direct messaging feature saved me so much time. I could ask
                questions and schedule viewings without endless phone calls or
                emails."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Emma Wilson</p>
                  <p className="text-sm text-muted-foreground">Law Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-6xl">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8"
            data-aos={isAosInitialized ? "fade-up" : ""}
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Perfect Student Home?
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of students and landlords who have simplified
                their housing journey with StudentNest.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register?role=student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-full group"
                >
                  Sign Up as Student
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/register?role=landlord">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white/20 rounded-full group"
                >
                  Sign Up as Landlord
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div
            className="text-center mb-16"
            data-aos={isAosInitialized ? "fade-up" : ""}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose StudentNest
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to making student housing simple, transparent, and
              stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="flex gap-4"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="100"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Verified Listings
                </h3>
                <p className="text-muted-foreground">
                  All properties are verified to ensure accurate information and
                  prevent scams.
                </p>
              </div>
            </div>

            <div
              className="flex gap-4"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="200"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Student-Focused</h3>
                <p className="text-muted-foreground">
                  Built specifically for student housing needs with features
                  tailored to academic schedules.
                </p>
              </div>
            </div>

            <div
              className="flex gap-4"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="300"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                <p className="text-muted-foreground">
                  Transparent pricing with no surprise fees or commissions for
                  students.
                </p>
              </div>
            </div>

            <div
              className="flex gap-4"
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="400"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Dedicated Support
                </h3>
                <p className="text-muted-foreground">
                  Our team is available to help with any questions or issues
                  throughout your housing journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="100"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">StudentNest</span>
              </div>
              <p className="text-gray-400">
                The smarter way to find and manage student housing.
              </p>
            </div>

            <div
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="200"
            >
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Find Housing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Roommate Finder
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Housing Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Student Resources
                  </a>
                </li>
              </ul>
            </div>

            <div
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="300"
            >
              <h3 className="text-lg font-semibold mb-4">For Landlords</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    List Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Landlord Tools
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div
              data-aos={isAosInitialized ? "fade-up" : ""}
              data-aos-delay="400"
            >
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StudentNest. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
