"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMessage from "./hooks/useMessage";

export default function ChatInput({ ticketId }: { ticketId: string }) {
  const [input, setInput] = React.useState("");
  const { mutate } = useMessage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);

    mutate({
      content: input,
      ticket_id: ticketId,
    });

    setInput("");
  };

  return (
    <div className="w-full h-full flex justify-center items-center box-border border-solid border-red-500">
      <form
        onSubmit={handleSubmit}
        className="flex no-scrollbar border-t border-gray-700  bg-gray-800 px-4 py-4"
      >
        <Input
          disabled={!!!ticketId}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-[95%] box-border bg-gray-700 text-gray-300 p-4"
          placeholder={
            ticketId ? "Type your message here..." : "Please select a ticket"
          }
        />
        <Button
          disabled={!!!ticketId}
          className="box-border bg-indigo-500 text-white"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
