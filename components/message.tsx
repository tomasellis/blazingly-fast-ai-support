"use client";
import React from "react";

export default function Message({
  message,
  dateFormatter,
  last,
}: {
  message: {
    id: string;
    timestamp: Date;
    content: string;
    ticket_id: string;
    role: "ai" | "user" | null;
  };
  dateFormatter: Intl.DateTimeFormat;
  last: boolean;
}) {
  const messageRef = React.useRef<HTMLDivElement>(null);

  /* React.useEffect(() => {
    if (last && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []); */

  if (message.role === "ai") {
    return (
      <div
        ref={messageRef}
        key={message.id}
        className="flex items-end justify-start"
        id={last ? "last" : ""}
      >
        <div className="flex flex-col space-y-1  max-w-xs">
          <p className="text-sm text-gray-400 text-start">
            Customer Service • {dateFormatter.format(message.timestamp)}
          </p>
          <span className="px-4 py-2 rounded-lg bg-gray-700 text-white">
            <span className="">{message.content}</span>
          </span>
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
      <div className="flex flex-col space-y-1  max-w-xs">
        <p className="text-sm text-gray-400 text-end">
          You • {dateFormatter.format(message.timestamp)}
        </p>
        <p className="px-4 py-2 rounded-lg bg-indigo-500 text-gray-300 text-left">
          {message.content}
        </p>
      </div>
    </div>
  );
}
