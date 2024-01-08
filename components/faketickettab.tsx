import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

export default function FakeTicketTab() {
  return (
    <Button
      disabled={false}
      className={`flex hover:cursor-default hover:bg-gray-900 w-full justify-between px-4 py-2 my-2 rounded bg-gray-900 text-slate-600 `}
    >
      <span className="loading">. . .</span>
    </Button>
  );
}

/* 
${
    currentTicketId === ticket.id
      ? "bg-gray-500 font-medium"
      : "bg-gray-900 text-slate-600"
  } */
