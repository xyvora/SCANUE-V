import { ArrowRight, Bot } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import { WavyBackground } from "@/components/ui/wavy-background";
import isLoggedIn from "@/utils/auth";

export default async function Home() {
  const loggedIn = await isLoggedIn();

  let button = <></>;

  if (loggedIn) {
    button = (
      <Link href="/chat" passHref>
        <GradientButton className="flex items-center justify-center">
          Start Chatting
          <ArrowRight className="ml-2" />
        </GradientButton>
      </Link>
    );
  } else {
    button = (
      <Link href="/login" passHref>
        <GradientButton className="flex items-center justify-center">
          Log In
          <ArrowRight className="ml-2" />
        </GradientButton>
      </Link>
    );
  }

  return (
    <WavyBackground
      className="relative"
      colors={["#38bdf8", "#818cf8", "#c084fc"]}
      waveOpacity={0.3}
      blur={10}
    >
      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl space-y-8 rounded-3xl bg-white/80 p-8 text-center shadow-xl backdrop-blur-xs sm:p-12">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="bg-linear-to-br from-blue-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
            Welcome to SCANUE-V
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Experience the power of AI with SCANUE-V, our advanced chat interface. Choose between
            different agent types and get the assistance you need.
          </p>
          <div className="flex w-full justify-center">
            {button}
          </div>
        </div>
      </main>
    </WavyBackground>
  );
}
