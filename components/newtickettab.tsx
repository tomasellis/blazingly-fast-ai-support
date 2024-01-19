import React, { useContext } from "react";
import "@/styles/loading.css";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { FileTextIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { TicketIdContext } from "@/app/tickets/layout";
import { nanoid } from "nanoid";

export default function NewTicketTab(props: { disabled: boolean }) {
  const router = useRouter();
  const { setId } = useContext(TicketIdContext);

  return (
    <Link href={"/tickets"} onClick={() => setId(nanoid())}>
      <div
        className={cx(
          `flex-1 flex justify-between items-center rounded-sm px-4 py-3 w-full  text-white border-b border-gray-700
          transition duration-200 
          ease-in-out transform hover:scale-105 hover:font-medium`,
          false
            ? "bg-indigo-500 hover:bg-indigo-600"
            : "bg-gray-900 hover:bg-gray-500"
        )}
      >
        <span>New chat</span>
        <FileTextIcon />
      </div>
    </Link>
  );
}

/* 
${
    currentTicketId === ticket.id
      ? "bg-gray-500 font-medium"
      : "bg-gray-900 text-slate-600"
  } */
