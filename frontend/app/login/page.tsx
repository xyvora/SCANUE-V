"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/ui/gradient-button";
import { User, Lock, ArrowRight } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
          grant_type: 'password',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.detail) {
          case "Incorrect email or password":
            setError("Invalid email or password");
            break;
          case "Inactive user":
            setError("Your account is not active");
            break;
          default:
            setError(data.detail || "Login failed");
        }
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      router.push('/chat');
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-red-500 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="relative">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 rounded-full"
          required
          disabled={isSubmitting}
          autoComplete="username"
          aria-label="Email address"
        />
        <User
          className="absolute text-blue-500 transform -translate-y-1/2 left-3 top-1/2"
          size={18}
        />
      </div>
      <div className="relative">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 rounded-full"
          required
          disabled={isSubmitting}
          autoComplete="current-password"
          aria-label="Password"
        />
        <Lock
          className="absolute text-blue-500 transform -translate-y-1/2 left-3 top-1/2"
          size={18}
        />
      </div>
      <GradientButton 
        type="submit" 
        disabled={isSubmitting}
      >
        <span className="flex items-center justify-center">
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </span>
      </GradientButton>
    </form>
  );
}

export default function LoginPage() {
  return (
    <WavyBackground
      className="relative"
      colors={["#818cf8", "#c084fc", "#38bdf8"]}
      waveOpacity={0.2}
      blur={8}
      speed="slow"
    >
      <main className="flex flex-col items-center justify-center flex-1 p-4 sm:p-8">
        <div className="w-full max-w-md p-8 space-y-8 text-center shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm sm:p-12">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text sm:text-5xl">
            Login
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Sign in to access your SCANUEV account
          </p>
          
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </WavyBackground>
  );
}
