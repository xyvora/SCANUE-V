"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorMessage from "@/components/ErrorMessage";
import type { FormEvent } from "react"; 
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import type { UserCreate } from "@/app/interfaces/users";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;

    if (email === null) {
      setError("Email is required");
      return;
    }

    const fullName = formData.get("fullName") as string | null;

    if (fullName === null) {
      setError("Full name is required");
      return;
    }

    const password = formData.get("password") as string | null;

    if (password === null) {
      setError("Password is required");
      return;
    }

    const confirmPassword = formData.get("confirmPassword") as string | null;

    if (confirmPassword === null) {
      setError("Confirm password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const user: UserCreate = {
      email,
      fullName,
      password,
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        router.push("/");
      } else {
        const errorText = await response.text();
        setError(`Signup failed: ${errorText}`);
      }
    } catch (_error) {
      setError("Error submitting signup form");
    }
  };

  return (
    <WavyBackground
      containerClassName="min-h-screen"
      className="flex items-center justify-center p-4"
      colors={["#38bdf8", "#818cf8", "#c084fc"]}
      waveOpacity={0.3}
    >
      <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                name="email"
                aria-label="Email"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                name="fullName"
                aria-label="Full Name"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                name="password"
                aria-label="Password"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                aria-label="Confirm Password"
                className="w-full"
                required
              />
            </div>
            <GradientButton className="w-full" type="submit">
              Sign Up
            </GradientButton>
            <ErrorMessage error={error} />
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </WavyBackground>
  );
};

export default Signup;
