"use client";
import React from "react";
import TicketsBox from "@/components/ticketsbox";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-800 text-white dark md:w-full">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={true} />
        <TicketsBox />
        {children}
      </QueryClientProvider>
    </div>
  );
}
