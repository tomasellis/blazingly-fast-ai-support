import { TicketIdContext } from "@/app/tickets/layout";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { useTickets } from "./hooks/useTickets";

export default function TicketTab(props: {
  ticket: {
    id: string;
    description: string | null;
    status: boolean;
    timestamp: Date;
  };
}) {
  const { id } = useContext(TicketIdContext);

  return (
    <Link href={`/tickets/${props.ticket.id}`} className={``} draggable={false}>
      <div
        className={cx(
          `rounded-sm my-3 px-4 py-2 w-full  text-white
         transition duration-200 
        ease-in-out transform hover:scale-105`,
          id === `${props.ticket.id}`
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-gray-900 hover:bg-gray-500"
        )}
      >
        <span>{props.ticket.description}</span>
      </div>
      {/* <span>{ticket.status ? "🟢" : "🔴"}</span> */}
    </Link>
  );
}
