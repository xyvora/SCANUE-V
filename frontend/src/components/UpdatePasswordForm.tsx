"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Form from "next/form";
import type { FormEvent } from "react";
import { GradientButton } from "@/components/ui/gradient-button";

import type { UpdatePassword as IUpdatePassword } from "@/app/interfaces/users";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { cn } from "@/utils/ui";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => setResult(""), []);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  
  useEffect(() => {
    if (result) {
      // Redirect to account page after successful update
      const timer = setTimeout(() => {
        router.push("/account");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [result, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword") as string | null;
    if (currentPassword === null) {
      setError("Current password is required");
      setIsLoading(false);
      return;
    }

    const newPassword = formData.get("newPassword") as string | null;
    if (newPassword === null) {
      setError("New password is required");
      setIsLoading(false);
      return;
    }

    const confirmPassword = formData.get("confirmPassword") as string | null;
    if (confirmPassword === null) {
      setError("Confirm password is required");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const passwordUpdate: IUpdatePassword = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await fetch("/api/account/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordUpdate),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Update failed: ${ errorText }`);
        setIsLoading(false);
        return;
      }

      const responseJson = await response.json();
      setResult(responseJson.message);
      setIsLoading(false);
    } catch (_) {
      setError("Error updating password");
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900">
      <Card className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-xl border border-white/20 shadow-xl dark:bg-gray-900/30 dark:border-white/10 transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center gradient-text">
            Update Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
              <div className="text-green-600 dark:text-green-400 font-medium text-lg animate-fade-in">
                {result}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                Redirecting to account page...
              </div>
            </div>
          ) : (
            <Form onSubmit={handleSubmit} action="/api/account/update-password" className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                aria-label="current password"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg p-2 pr-10",
                  "border bg-muted/50 focus:border-primary",
                  "placeholder:text-muted-foreground/70",
                  "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                  "text-base sm:text-lg",
                  "h-10 sm:h-12",
                  "mt-5",
                  "transition-all duration-200",
                  isLoading && "opacity-70",
                )}
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                aria-label="New Password"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg p-2 pr-10",
                  "border bg-muted/50 focus:border-primary",
                  "placeholder:text-muted-foreground/70",
                  "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                  "text-base sm:text-lg",
                  "h-10 sm:h-12",
                  "mt-5",
                  "transition-all duration-200",
                  isLoading && "opacity-70",
                )}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                aria-label="Confirm Password"
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg p-2 pr-10",
                  "border bg-muted/50 focus:border-primary",
                  "placeholder:text-muted-foreground/70",
                  "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                  "text-base sm:text-lg",
                  "h-10 sm:h-12",
                  "mt-5",
                  "transition-all duration-200",
                  isLoading && "opacity-70",
                )}
              />
              <div className="flex gap-3 pt-2">
                <GradientButton 
                  className="flex-1 relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner />
                      <span className="ml-2">Updating...</span>
                    </span>
                  ) : (
                    "Update"
                  )}
                </GradientButton>
                <GradientButton
                  className="flex-1"
                  variant="outline" 
                  onClick={() => router.back()}
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </GradientButton>
              </div>
              {error && (
                <div className="animate-fade-in">
                  <ErrorMessage error={error} />
                </div>
              )}
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
