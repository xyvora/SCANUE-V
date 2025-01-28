"use client";

import Form from "next/form";
import { FormEvent } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/utils/ui";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    body.append("username", formData.get("email") as string);
    body.append("password", formData.get("password") as string);

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
        console.error("Login failed:", errorText);
      }
    } catch (error) {
      console.error("Error submitting login form:", error);
    }
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
    >
      <main className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">login</h2>
        <Form onSubmit={handleSubmit} action="/api/login" className="space-y-4">
          <input
            type="email"
            placeholder={"email"}
            name="email"
            aria-label={"email"}
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
            placeholder={"password"}
            name="password"
            aria-label={"password"}
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
            Log In
          </GradientButton>
        </Form>
      </main>
    </div>
  );
};
