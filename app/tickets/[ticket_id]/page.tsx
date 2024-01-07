"use client";
import React from "react";
import Loading from "@/app/tickets/loading";
import { useTickets } from "@/components/hooks/useTickets";
import ChatInput from "@/components/chatinput";
import { useSearchParams } from "next/navigation";
import { useTicket } from "@/components/hooks/useTicket";

export default function Chatbox({ params }: { params: { ticket_id: string } }) {
  const { data, isLoading, isFetching } = useTicket(params.ticket_id);

  console.log("RENDER: Chatbox");
  return (
    <div className="w-full h-full flex flex-col no-scrollbar">
      <div className="max-h-[90vh] min-h-[90vh] no-scrollbar overflow-auto p-4 space-y-4">
        {isLoading && <Loading></Loading>}
        {data &&
          data.messages.map((message) => {
            if (message.role === "ai") {
              return (
                <div key={message.id} className="flex items-end justify-start">
                  <div className="flex flex-col space-y-1  max-w-xs">
                    <p className="text-sm text-gray-400 text-start">
                      {message.role} •{" "}
                      {new Date(message.timestamp).toLocaleString("es", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="px-4 py-2 rounded-lg bg-gray-700 text-white">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            }
            return (
              <div key={message.id} className="flex items-end justify-end">
                <div className="flex flex-col space-y-1  max-w-xs">
                  <p className="text-sm text-gray-400 text-end">
                    {message.role} •{" "}
                    {new Date(message.timestamp).toLocaleString("es", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="px-4 py-2 rounded-lg bg-indigo-500 text-gray-300 text-left">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
      <ChatInput ticketId={params.ticket_id} />
    </div>
  );
}
