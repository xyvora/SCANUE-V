import { WavyBackground } from "@/components/ui/wavy-background";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <WavyBackground
      className="relative"
      colors={["#38bdf8", "#818cf8", "#c084fc"]}
      waveOpacity={0.3}
      blur={10}
    >
      <div className="flex h-screen items-center justify-center">
        <LoginForm className="w-full max-w-md" />
      </div>
    </WavyBackground>
  );
}
