import { cx } from "class-variance-authority";
import Link from "next/link";
import React from "react";

export default function TicketTab({
  ticket,
  currentTicketId,
  handleClick,
}: {
  ticket: {
    id: string;
    description: string | null;
    status: boolean;
    timestamp: Date;
  };
  currentTicketId: string;
  handleClick: (id: string) => void;
}) {
  return (
    <Link
      href={`/tickets/${ticket.id}#last`}
      onClick={() => handleClick(ticket.id)}
      className={``}
    >
      <div
        className={cx(
          `rounded-sm my-3 px-4 py-2 w-full  text-white
         transition duration-200 
        ease-in-out transform hover:scale-105`,
          currentTicketId === ticket.id
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-gray-900 hover:bg-gray-500"
        )}
      >
        <span>{ticket.description}</span>
      </div>
      {/* <span>{ticket.status ? "🟢" : "🔴"}</span> */}
    </Link>
  );
}
