"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/utils/ui";
import { UserCreate } from "@/app/interfaces/users";

const Signup = () => {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;

    // TODO: Replace the console logs with propper error message displays in line with the project
    // standard once that is decided. Also need to handle error responses from the backend and
    // display those in appropriate messages to the user.
    if (email === null) {
      console.log("email is required");
      return;
    }

    const fullName = formData.get("fullName") as string | null;

    if (fullName === null) {
      console.log("Full name is required");
      return;
    }

    const password = formData.get("password") as string | null;

    if (password === null) {
      console.log("Password is required");
      return;
    }

    const confirmPassword = formData.get("confirmPassword") as string | null;

    if (confirmPassword === null) {
      console.log("Confirm password is required");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
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
        console.error("Signup failed:", errorText);
      }
    } catch (error) {
      console.error("Error submitting signup form:", error);
    }
  };

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
    >
      <main className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">Sign Up</h2>
        <Form onSubmit={handleSubmit} action="/api/signup" className="space-y-4">
          <input
            type="email"
            placeholder={"Email"}
            name="email"
            aria-label={"Email"}
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
            placeholder={"Full Name"}
            name="fullName"
            aria-label={"full name"}
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
            placeholder={"Password"}
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
            Sign Up
          </GradientButton>
        </Form>
      </main>
    </div>
  );
};

export default Signup;
