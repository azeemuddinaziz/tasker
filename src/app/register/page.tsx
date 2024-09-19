"use client";

import Header from "@/components/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import React, { FormEvent, useState } from "react";

type FormData = {
  username: string;
  email: string;
  password: string;
};

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null); // Error state type
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      setIsLoading(true);
      const { username, email, password } = formData;

      if (!username) throw new Error("Username is required.");
      if (!email) throw new Error("Email is required.");
      if (!password) throw new Error("Password is required.");

      const response = await fetch("api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        throw new Error("Registeration failed. Please try again.");
      }

      setIsLoading(false);
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "An unexpected error occurred."); // Handle errors
    }
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center pt-20 lg:pt-32">
        <Card>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>Fill your details correctly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-2 gap-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="username">Username:</Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  className="focus-visible:ring-transparent w-full"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Mail id:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your mail id"
                  className="focus-visible:ring-transparent w-full"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="focus-visible:ring-transparent w-full "
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              {!isLoading ? (
                <Button type="submit" className="col-span-2">
                  <Send className="mr-2 w-4 h-4" />
                  <span>Submit</span>
                </Button>
              ) : (
                <Button disabled className="col-span-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <span className="text-muted-foreground">
              Already have an account?
              <Link
                href="/about"
                className="text-foreground hover:underline ml-1"
              >
                Login here
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
