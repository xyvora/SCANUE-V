/* eslint-disable sort-imports */
"use client";

// biome-ignore lint/style/useImportType: <explanation>
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import { GradientButton } from "@/components/ui/gradient-button";
import { GradientInput } from "@/components/ui/gradient-input";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <div className="glass-morphism-heavy p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <GradientInput
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <GradientInput
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <ErrorMessage error={error} />}
          <GradientButton type="submit" className="w-full">
            Log In
          </GradientButton>
        </form>
      </div>
    </div>
  );
}
