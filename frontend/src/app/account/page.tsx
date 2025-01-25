"use client";

import Form from "next/form";
import { FormEvent, useEffect, useState } from "react";

import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/utils/ui";
import { UserUpdateMe } from "@/app/interfaces/users";

const UpdateMe = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/account", { method: "GET", credentials: "include" });
        if (response.ok) {
          const data: UserUpdateMe = await response.json();
          setEmail(data.email || "");
          setFullName(data.fullName || "");
        } else {
          console.error("Failed to fetch user data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user: UserUpdateMe = {
      email,
      fullName,
    };

    // TODO: Replace console logs with error messages once those are setup.
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed:", errorText);
      }
    } catch (error) {
      console.error("Error submitting user update form:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
    >
      <main className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">Update</h2>
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
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
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
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "text-base sm:text-lg",
              "h-10 sm:h-12",
              "mt-5",
            )}
          />
          <GradientButton className="flex items-center justify-center mt-5">
            Update
          </GradientButton>
        </Form>
      </main>
    </div>
  );
};

export default UpdateMe;
