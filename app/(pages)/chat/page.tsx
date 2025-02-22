import { Suspense } from "react";
import ChatAi from "@/components/client/chat-ai";

export const dynamic = "force-dynamic";

async function ChatPageContent() {
  // const { userId } = await getUserId();
  // console.log("ChatPageContent - userId:", userId);
  return <ChatAi />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div></div>}>
      <ChatPageContent />
    </Suspense>
  );
}
