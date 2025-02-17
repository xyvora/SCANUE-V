import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SCANUE-V - Chat",
};

export default function ChatPage() {
  return (
    <div>
      <main className="h-screen overflow-hidden">
        <ChatInterfaceClient />
      </main>
    </div>
  );
};
