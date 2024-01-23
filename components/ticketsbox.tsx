"use client";
import React from "react";
import { useTickets } from "./hooks/useTickets";
import TicketTab from "./tickettab";
import NewTicketTab from "./newtickettab";
import { HamburgerMenuIcon, ReloadIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import Hamburguer from "@/public/hamburger.svg";

export default function TicketsBox() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data, isFetching } = useTickets();
  /*   if (isError) return <div>Failed getting Tickets</div>; */
  const path = usePathname();

  return (
    <div className="flex flex-col w-[20%] max-w-[20%] min-w-[20%] h-full no-scrollbar border-r-2 overflow-x-hidden">
      <h2 className="text-2xl font-bold text-indigo-500 py-4 px-4 border-b border-gray-700">
        Customer Tickets
      </h2>
      <div className="flex-1 flex flex-col w-full bg-gray-900 overflow-auto">
        <NewTicketTab disabled={isFetching} />
        <div className="mt-2 px-2 pb-2 text-sm text-gray-500">
          <span>Previous tickets</span>
        </div>
        <div className="flex-auto h-[200px] overflow-y-auto no-scrollbar p-4 space-y-4">
          {!data && isFetching && (
            <div className="w-full flex justify-center items-center">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            </div>
          )}
          {!isFetching && (data?.length === 0 || data === undefined) && (
            <p className="text-lg">
              No tickets available. Please start a new chat.
            </p>
          )}
          {
            <ul>
              {data &&
                data.map((ticket, pageIndex) => (
                  <li key={ticket.id}>
                    <TicketTab key={ticket.id} ticket={ticket} />
                  </li>
                ))}
            </ul>
          }
        </div>
      </div>
    </div>
  );
}

{
  /* <>
      {!isOpen && (
        <button className="absolute p-4" onClick={() => setIsOpen(true)}>
          <span>
            <HamburgerMenuIcon width={30} height={30} />
          </span>
        </button>
      )}
      {isOpen && (
        <div
          className="absolute flex flex-1 
        flex-col h-full w-[300px] 
        max-w-[300px] bg-red-600 transition ease transform duration-300
        "
        >
          <button className="" onClick={() => setIsOpen(false)}>
            <span>
              <HamburgerMenuIcon width={30} height={30} />
            </span>
          </button>
          <span>supup</span>
          <span>aaa</span>
          <span>yooo</span>
        </div>
      )}
    </> */
}
