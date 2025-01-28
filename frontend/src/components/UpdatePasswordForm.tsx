"use client";

import { FormEvent, useEffect, useState } from "react";
import Form from "next/form";
import { GradientButton } from "@/components/ui/gradient-button";
import type { UpdatePassword as IUpdatePassword } from "@/app/interfaces/users";
import { cn } from "@/utils/ui";

export default function UpdatePasswordForm() {
  const [result, setResult] = useState<string>("");

  useEffect(() => setResult(""), []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword") as string | null;
    if (currentPassword === null) {
      setResult("Current password is required");
      return;
    }

    const newPassword = formData.get("newPassword") as string | null;
    if (newPassword === null) {
      setResult("New password is required");
      return;
    }

    const confirmPassword = formData.get("confirmPassword") as string | null;
    if (confirmPassword === null) {
      setResult("confirm password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResult("Passwords don't match");
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
        setResult(`Update failed: ${ errorText }`);
        return;
      }

      const responseJson = await response.json();
      setResult(responseJson.message);
    } catch {
      setResult("Error updating password");
      return;
    }
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
    >
      <main className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">Update Password</h2>
        <Form onSubmit={handleSubmit} action="/api/account/update-password" className="space-y-4">
          <input
            type="password"
            placeholder={"Current Password"}
            name="currentPassword"
            aria-label={"current password"}
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
            type="password"
            placeholder={"New Password"}
            name="newPassword"
            aria-label={"New Password"}
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
            type="password"
            placeholder={"Confirm Password"}
            name="confirmPassword"
            aria-label={"Confirm Password"}
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
          <GradientButton className="flex items-center justify-center mt-5">
            Update
          </GradientButton>
        </Form>

        { result && <div className="text-center mt-5">{result}</div> }
      </main>
    </div>
  );
};
