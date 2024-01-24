"use client";
import React from "react";
import TicketsBox from "@/components/ticketsbox";
import Link from "next/link";
import { nanoid } from "nanoid";
import useWindowDimensions from "@/components/hooks/useWindowDimensions";

export const TicketIdContext = React.createContext({
  id: "",
  setId: (id: string) => {},
});

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tailwind_md = 768;
  const [id, setId] = React.useState(nanoid());

  return (
    <div className="h-full flex-1 flex bg-gray-900 text-white dark ">
      <TicketIdContext.Provider value={{ id, setId }}>
        <TicketsBox />
        <div className=" flex flex-col w-full h-full ">
          <div className="h-[65px] min-h-[66px] border-b border-gray-700"></div>
          {children}
        </div>
      </TicketIdContext.Provider>
    </div>
  );
}
