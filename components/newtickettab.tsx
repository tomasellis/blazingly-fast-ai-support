import React, { useContext } from "react";
import "@/styles/loading.css";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function NewTicketTab(props: { disabled: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        console.log("next pageee");
        return router.refresh();
      }}
    >
      <div
        className={cx(
          `flex-1 flex justify-between items-center rounded-sm my-3 px-4 py-2 w-full  text-white border-b border-gray-700
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
    </button>
  );
}

/* 
${
    currentTicketId === ticket.id
      ? "bg-gray-500 font-medium"
      : "bg-gray-900 text-slate-600"
  } */
