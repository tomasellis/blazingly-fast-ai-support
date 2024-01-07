"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Actions, State } from "./reducers/TicketsReducer";
import Loading from "@/app/tickets/loading";
import ChatInput from "./chatinput";

export default function Chatbox(props: {
  params: { ticket_id: string; page: number };
}) {
  /* const { data, isLoading, isFetching } = useTickets();
  const page = props.params.page;
  const ticket_id = props.params.ticket_id;

  const ticketIndex = React.useMemo(() => {
    return (
      data?.pages[page]?.tickets?.findIndex(
        (ticket) => ticket.id === ticket_id
      ) || 0
    );
  }, [ticket_id]); */

  console.log("RENDER: Chatbox");
  return (
    <div className="w-full h-full flex flex-col no-scrollbar">
      <div className="max-h-[90vh] min-h-[90vh] no-scrollbar overflow-auto p-4 space-y-4">
        {/* {isLoading && <Loading></Loading>}
        {page !== -1 &&
          data?.pages[0] &&
          data?.pages[page]?.tickets[ticketIndex]?.messages.map((message) => {
            if (message.role === "AI") {
              return (
                <div key={message.id} className="flex items-end justify-start">
                  <div className="flex flex-col space-y-1  max-w-xs">
                    <p className="text-sm text-gray-400 text-start">
                      {message.username} • {message.timestamp}
                    </p>
                    <p className="px-4 py-2 rounded-lg bg-indigo-500 text-white">
                      {message.text}
                    </p>
                    {message.embed !== null ? (
                      <div
                        className="flex px-4 py-2 rounded-lg bg-indigo-500 text-white"
                        dangerouslySetInnerHTML={{ __html: message.embed }}
                      ></div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={message.id} className="flex items-end justify-end">
                <div className="flex flex-col space-y-1  max-w-xs">
                  <p className="text-sm text-gray-400 text-end">
                    {message.username} • {message.timestamp}
                  </p>
                  <p className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-left">
                    {message.text}
                  </p>
                </div>
              </div>
            );
          })} */}
      </div>
      {/* <ChatInput ticketId={ticket_id} page={page} /> */}
    </div>
  );
}
