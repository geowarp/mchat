"use client";

import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ChatAi() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "initial-message",
        role: "assistant",
        content: "Hello! I'm Mistral AI assistant. How can I help you today?",
      },
    ],
  });

  // Auto-scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/50">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            Mistral AI Assistant
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-5 h-5" />
                <span className="sr-only">Clear chat history</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your current chat history. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    reload();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <CardContent className="flex-1 p-4">
          <ScrollArea className="h-full pr-4">
            {error && (
              <div className="mb-4 p-4 text-sm text-red-500 bg-red-50 rounded-lg">
                Something went wrong. Please try again.
              </div>
            )}

            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    {message.role === "user" ? (
                      <>
                        <AvatarFallback>U</AvatarFallback>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback>AI</AvatarFallback>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {(status === "streaming" || status === "submitted") && (
              <div className="flex gap-3 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AI</AvatarFallback>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button
              type="submit"
              size="icon"
              disabled={status === "streaming"}
              className="h-[44px] w-[44px] shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
