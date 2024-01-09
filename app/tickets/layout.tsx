"use client";
import React from "react";
import TicketsBox from "@/components/ticketsbox";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:w-full h-full flex flex-col bg-gray-900 overflow-y-auto text-white dark ">
      <div className="h-[100px]] p-4 bg-gray-900 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-500">Support Center</h1>
      </div>
      <div className="flex-1 flex h-full w-full overflow-auto">
        <TicketsBox />
        {children}
      </div>
    </div>
  );
}
