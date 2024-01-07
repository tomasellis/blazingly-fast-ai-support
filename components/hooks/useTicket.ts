"use client";
import { useQuery } from "@tanstack/react-query";
import { get_ticket } from "../queries/queries";

const useTicket = (ticket_id: string) => {
  return useQuery({
    queryKey: ["ticket", ticket_id],
    queryFn: ({ queryKey: [, ticket_id] }) => get_ticket(ticket_id),
  });
};

export { useTicket };
