/* "use client";
import React from "react";
import TicketsBox from "./ticketsbox";
import Chatbox from "./chatbox";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTickets } from "./hooks/useTicket";
import Loading from "@/app/tickets/loading";
import ChatInput from "./chatinput";

export default function Chat() {
  const [selectedTicket, setSelectedTicket] = React.useState({
    page: -1,
    ticketId: "",
  });

  return (
    <div className="flex min-h-screen bg-gray-800 text-white dark md:w-full">
      <TicketsBox setSelectedTicket={setSelectedTicket} />
      <Chatbox page={selectedTicket.page} ticketId={selectedTicket.ticketId} />
    </div>
  );
} */
