"use client";
import { dateFormatter } from "@/lib/utils";
import React from "react";
export default function Message({
  message,
  last,
}: {
  message: {
    id: string;
    timestamp: Date;
    content: string;
    ticket_id: string;
    role: "ai" | "user" | null;
  };
  last: boolean;
}) {
  const messageRef = React.useRef<HTMLDivElement>(null);

  if (message.role === "ai") {
    return (
      <div
        ref={messageRef}
        key={message.id}
        className="flex items-end justify-start"
        id={last ? "last" : ""}
      >
        <div className="flex flex-col space-y-1  max-w-md">
          <p className="text-sm text-gray-400 text-start">
            Customer Service •{" "}
            {dateFormatter.format(new Date(message.timestamp))}
          </p>
          <div className="px-4 py-2 rounded-lg bg-gray-700 text-white whitespace-normal break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messageRef}
      key={message.id}
      className="flex items-end justify-end"
    >
      <div className="flex flex-col space-y-1  max-w-md">
        <p className="text-sm text-gray-400 text-end">
          You • {dateFormatter.format(new Date(message.timestamp))}
        </p>
        <div className="px-4 py-2 rounded-lg bg-indigo-500 text-gray-300 text-left whitespace-normal break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}
