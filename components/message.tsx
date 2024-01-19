"use client";
import { dateFormatter } from "@/lib/utils";
import React from "react";

const Message = React.forwardRef<
  HTMLDivElement,
  {
    message: {
      id: string;
      timestamp: Date;
      content: string;
      ticket_id: string;
      role: "ai" | "user" | null;
    };
    last: boolean;
  }
>((props, ref) => {
  if (props.message.role === "ai") {
    return (
      <div
        ref={ref}
        key={props.message.id}
        className="flex items-end justify-start"
        id={props.message.id}
      >
        <div className="flex flex-col space-y-1  max-w-md">
          <p className="text-sm text-gray-400 text-start">
            Customer Service •{" "}
            {dateFormatter.format(new Date(props.message.timestamp))}
          </p>
          <div className="px-4 py-2 rounded-lg bg-gray-700 text-white whitespace-normal break-words">
            {props.message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      key={props.message.id}
      className="flex items-end justify-end"
    >
      <div className="flex flex-col space-y-1  max-w-md">
        <p className="text-sm text-gray-400 text-end">
          You • {dateFormatter.format(new Date(props.message.timestamp))}
        </p>
        <div className="px-4 py-2 rounded-lg bg-indigo-500 text-gray-300 text-left whitespace-normal break-words">
          {props.message.content}
        </div>
      </div>
    </div>
  );
});

export default Message;
