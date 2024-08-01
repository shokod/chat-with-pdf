"use client";
import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendIcon } from "lucide-react";
// import { askQuestion, Message } from "@actions/askQuestion";
import { Loader2Icon } from "lucide-react";
// import ChatMessage from "./ChatMessage";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";

export type Message = {
  id?: string;
  role: "human" | "ai" | "placeholder";
  message: string;
  createdAt: Date;
};

function Chat({ id }: { id: string }) {
  const { user } = useUser();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();

  const [snapshot, loading, error] = useCollection(
    user &&
      query(
        collection(db, "users", user?.id, "files", id, "chat"),
        orderBy("createdAt", "asc")
      )
  );

  useEffect(() => {
    if(!snapshot) return;

    console.log("Updated snapshot", snapshot.docs);

  }, [snapshot])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const q = input;
    setInput("");

    // Optimistic UI Updates
    

    setMessages((prev) => [
      ...prev,
      { role: "human", 
        message: q, 
        createdAt: new Date(), 
    },
      { role: "ai", 
        message: "Thinking...", 
        createdAt: new Date(),
       },
    ]);

    startTransition(async () => {
      const { success, message } =await askQuestion(id,q);

      if (!success) {
        // toast ...

        setMessages((prev) => 
          prev.slice(0, prev.length -1).concat([
            {
              role: "ai",
              message:`Whoops... ${message}`,
              createdAt: new Date(),
            }
          ])
        );
      }
    })
  };

  return (
    <div className="flex flex-col h-full overflow-scroll">
      {/* Chat contents */}
      <div className="flex-1 w-full">
      {/* Chat messages */}</div>

      <form
        onSubmit={handleSubmit}
        className="flex sticky bottom-0 space-x-2 p-5 bg-fuchsia-600/75"
      >
        <Input
          placeholder="Ask a question"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="submit" disabled={!input || isPending}>
          {isPending ? (
            <Loader2Icon className="animate-spin text-fuchsia-600" />
          ) : (
            "Ask"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Chat;
