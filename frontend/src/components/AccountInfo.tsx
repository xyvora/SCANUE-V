"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type FormEvent, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Form from "next/form";
import { GradientButton } from "@/components/ui/gradient-button";
import type { UserUpdateMe } from "@/app/interfaces/users";
import { cn } from "@/utils/ui";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [originalData, setOriginalData] = useState<UserUpdateMe | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/account", { method: "GET" });
        if (response.ok) {
          const data: UserUpdateMe = await response.json();
          setEmail(data.email || "");
          setFullName(data.fullName || "");
          setOriginalData(data);
        } else {
          const responseText = await response.text();
          setError(`Failed to fetch user data:, ${ responseText }`);
        }
      } catch (_) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

    if (!email && !fullName) {
      setError("Email and Full Name are both empty, nothing to update");
      return;
    }

    const user: UserUpdateMe = {
      email,
      fullName,
    };

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setOriginalData(user);
        setEditing(false);
      } else {
        const errorText = await response.statusText;
        setError(`Update failed: ${ errorText }`);
      }
    } catch (_) {
      setError("Error submitting user update form");
    }
  };

  function cancelEditing() {
    if (originalData) {
      setEmail(originalData.email || "");
      setFullName(originalData.fullName || "");
    }

    setEditing(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900">
        <div className="text-center p-5">Loading...</div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900">
        <Card className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-xl border border-white/20 shadow-xl dark:bg-gray-900/30 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center gradient-text">
              Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit} action="/api/account/update" className="space-y-4">
              <input
                type="email"
                value={email}
                placeholder={"Email"}
                name="email"
                aria-label={"Email"}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full rounded-lg p-2 pr-10",
                  "border bg-muted/50 focus:border-primary",
                  "placeholder:text-muted-foreground/70",
                  "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                  "text-base sm:text-lg",
                  "h-10 sm:h-12",
                  "mt-5",
                )}
              />
              <input
                type="text"
                value={fullName}
                placeholder={"Full Name"}
                name="fullName"
                aria-label={"full name"}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  "w-full rounded-lg p-2 pr-10",
                  "border bg-muted/50 focus:border-primary",
                  "placeholder:text-muted-foreground/70",
                  "focus:outline-hidden focus:ring-2 focus:ring-primary/20",
                  "text-base sm:text-lg",
                  "h-10 sm:h-12",
                  "mt-5",
                )}
              />
              <div className="flex gap-3 pt-2">
                <GradientButton className="flex-1">
                  Update
                </GradientButton>
                <GradientButton
                  className="flex-1"
                  variant="outline"
                  onClick={cancelEditing}
                  type="button"
                >
                  Cancel
                </GradientButton>
              </div>
              <ErrorMessage error={error} />
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900">
      <Card className="w-full max-w-md mx-auto bg-white/30 backdrop-blur-xl border border-white/20 shadow-xl dark:bg-gray-900/30 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center gradient-text">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col p-3 bg-gray-50/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <span className="font-medium">{ email }</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col p-3 bg-gray-50/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
              <span className="font-medium">{ fullName }</span>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <GradientButton
              className="flex-1"
              onClick={() => setEditing(true)}
            >
              Edit
            </GradientButton>
            <GradientButton
              className="flex-1"
              onClick={() => router.push("/account/update-password")}
            >
              Edit Password
            </GradientButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
