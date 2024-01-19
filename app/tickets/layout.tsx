"use client";
import React from "react";
import TicketsBox from "@/components/ticketsbox";
import Link from "next/link";

export const TicketIdContext = React.createContext({
  id: "",
  setId: (id: string) => {},
});

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = React.useState("");

  return (
    <div className=" h-full flex flex-col bg-gray-900 overflow-y-auto text-white dark ">
      <div className="h-[100px]] p-4 bg-gray-900 border-b border-gray-700">
        <Link href={"/tickets"}>
          <h1 className="text-3xl font-bold text-indigo-500">Support Center</h1>
        </Link>
      </div>
      <div className="flex-1 flex h-full w-full overflow-auto">
        <TicketIdContext.Provider value={{ id, setId }}>
          <TicketsBox />
          <div className="flex-1 flex flex-col">{children}</div>
        </TicketIdContext.Provider>
      </div>
    </div>
  );
}
