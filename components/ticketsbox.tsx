"use client";
import React from "react";
import Link from "next/link";
import { Tickets } from "@/lib/types";
import Loading from "@/app/tickets/loading";
import { Button } from "./ui/button";
import { useTickets } from "./hooks/useTickets";

export default function TicketsBox() {
  const { data, isLoading, isFetching, isError } = useTickets();

  if (isError) return <div>F</div>;

  return (
    <div className="min-w-[10%] max-w-[10%] border-r border-gray-700 ">
      <div className="p-4 space-y-4">
        <h2 className="min-w-fit text-lg font-semibold">Your Tickets</h2>
        {isLoading && <Loading></Loading>}
        <ul>
          {data &&
            data.map((ticket, pageIndex) => (
              <li key={ticket.id}>
                <Link
                  href={`/tickets/${ticket.id}?page=${0}`}
                  className="block px-4 py-2 rounded hover:bg-gray-700"
                >
                  {ticket.description} | {ticket.status ? "🟢" : "🔴"}
                </Link>
              </li>
            ))}
        </ul>
        <div className="space-y-2"></div>
      </div>
    </div>
  );
}

/*  */
