import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";
import { WavyBackground } from "@/components/ui/wavy-background";

export const metadata: Metadata = {
  title: "SCANUE-V - Log In",
};

const Login = () => {
  return (
    <WavyBackground
      containerClassName="min-h-screen"
      className="flex items-center justify-center p-4"
      colors={["#38bdf8", "#818cf8", "#c084fc"]}
      waveOpacity={0.3}
    >
      <LoginForm />
    </WavyBackground>
  );
};

export default Login;
