"use client";
import React from "react";
import TicketsBox from "@/components/ticketsbox";
import Link from "next/link";
import { nanoid } from "nanoid";

export const TicketIdContext = React.createContext({
  id: "",
  setId: (id: string) => {},
});

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = React.useState(nanoid());

  return (
    <div className="h-full flex-1 flex bg-gray-900 text-white dark ">
      <TicketIdContext.Provider value={{ id, setId }}>
        <TicketsBox />
        <div className=" flex flex-col w-full h-full ">{children}</div>
      </TicketIdContext.Provider>
    </div>
  );
}
