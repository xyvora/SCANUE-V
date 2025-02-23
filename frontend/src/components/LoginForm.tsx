"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FormEvent, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });
      if (response.ok) {
        router.push("/");
      } else {
        const errorText = await response.text();
        setError(`Login failed: ${errorText}`);
      }
    } catch (_) {
      setError("Error submitting login form");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center gradient-text">
          Welcome Back
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
              type="password"
              placeholder="Password"
              name="password"
              aria-label="Password"
              className="w-full"
              required
            />
          </div>
          {error && <ErrorMessage error={error} />}
          <GradientButton type="submit" className="w-full">
            Log In
          </GradientButton>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            No account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
