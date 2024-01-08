"use client";
import React from "react";
import "@/styles/loading.css";

export default function FakeMessage() {
  const messageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div
      ref={messageRef}
      key={crypto.randomUUID()}
      className="flex items-end justify-start"
    >
      <div className="flex flex-col space-y-1  max-w-xs">
        <span className="px-4 py-2 rounded-lg bg-gray-700 text-white ">
          <span className="loading">. . .</span>
        </span>
      </div>
    </div>
  );
}
