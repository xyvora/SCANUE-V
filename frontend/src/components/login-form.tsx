import { cn } from "@/lib/utils";
import { GradientButton } from "@/components/ui/gradient-button";
import { GradientInput } from "@/components/ui/gradient-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-3xl bg-white/80 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            Welcome to SCANUE-V
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <GradientInput
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <GradientInput id="password" type="password" required />
              </div>
              <div className="space-y-4">
                <GradientButton type="submit" className="w-full">
                  Login
                </GradientButton>
                <GradientButton
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Login with Google
                </GradientButton>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
