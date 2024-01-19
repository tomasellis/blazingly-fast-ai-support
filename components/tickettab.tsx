import { TicketIdContext } from "@/app/tickets/layout";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useRef } from "react";
import { useTickets } from "./hooks/useTickets";
import useIsOnscreen from "./hooks/useIsOnScreen";

export default function TicketTab(props: {
  ticket: {
    id: string;
    description: string | null;
    status: boolean;
    timestamp: Date;
  };
}) {
  const path = usePathname().split("/");
  const [currId, setCurrId] = React.useState("");
  const { id } = useContext(TicketIdContext);
  const ticketRef = useRef(null);
  const isOnScreen = useIsOnscreen(ticketRef);

  React.useEffect(() => {
    if (path[2] === undefined) {
      return setCurrId(id);
    }
    return setCurrId(path[2]);
  }, [path, id]);

  React.useEffect(() => {
    if (currId === props.ticket.id && ticketRef.current) {
      if (!isOnScreen) {
        const el = ticketRef.current as HTMLElement;
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currId]);

  return (
    <Link
      href={`/tickets/${props.ticket.id}`}
      className={``}
      draggable={false}
      ref={ticketRef}
    >
      <div
        className={cx(
          `rounded-sm my-3 px-4 py-2 w-full  text-white
         transition duration-200 
        ease-in-out transform hover:scale-105`,
          currId === `${props.ticket.id}`
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
