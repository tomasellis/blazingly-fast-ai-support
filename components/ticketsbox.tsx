"use client";
import React from "react";
import { useTickets } from "./hooks/useTickets";
import TicketTab from "./tickettab";
import NewTicketTab from "./newtickettab";
import { usePathname } from "next/navigation";

export default function TicketsBox() {
  const { data, isFetching } = useTickets();
  /*   if (isError) return <div>Failed getting Tickets</div>; */
  const path = usePathname();

  return (
    <div className="flex flex-col w-[20%] max-w-[20%] min-w-[20%] h-full no-scrollbar border-r-2 ">
      <h2 className="text-2xl font-bold text-indigo-500 py-4 px-4 border-b border-gray-700">
        Customer Tickets
      </h2>
      <div className="flex-1 flex flex-col w-full bg-gray-900 overflow-auto">
        {path !== "/tickets" && <NewTicketTab disabled={isFetching} />}
        <div className="mt-2 px-2 pb-2 text-sm text-gray-500">
          <span>Previous tickets</span>
        </div>
        <div className="flex-auto h-[200px] overflow-y-auto no-scrollbar p-4 space-y-4">
          {!isFetching && !data && (
            <p className="text-lg">
              No tickets available. Please start a new chat.
            </p>
          )}
          <ul>
            {data &&
              data.map((ticket, pageIndex) => (
                <li key={ticket.id}>
                  <TicketTab key={ticket.id} ticket={ticket} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
