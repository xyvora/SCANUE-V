"use client";

import { FormEvent, useEffect, useState } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Form from "next/form";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserUpdateMe } from "@/app/interfaces/users";
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
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (editing) {
    return (
      <div
        className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
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
            <GradientButton className="items-center justify-center mt-5 mr-2">
              Update
            </GradientButton>
            <GradientButton
              className="items-center justify-center mt-5 ml-2"
              onClick={cancelEditing}
            >
              Cancel
            </GradientButton>
            <ErrorMessage error={error} />
          </Form>
        </main>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen overflow-hidden text-gray-800 transition-colors duration-300 bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900 dark:to-purple-900 dark:text-gray-100 items-center "
    >
      <main className="flex-1 overflow-y-auto mt-5">
        <h2 className="text-lg font-semibold xs:text-xl gradient-text sm:text-2xl">Profile</h2>
        <p>
          Email: { email }
        </p>
        <p>
          Full Name: { fullName }
        </p>
        <GradientButton
          className="items-center justify-center mt-5 mr-2"
          onClick={() => setEditing(true)}
        >
          Edit
        </GradientButton>
        <GradientButton
          className="items-center justify-center mt-5 ml-2"
          onClick={() => router.push("/account/update-password")}
        >
          Edit Password
        </GradientButton>
      </main>
    </div>
  );
};
