"use client";
import { useQuery } from "@tanstack/react-query";
import { get_ticket, get_tickets } from "../queries/queries";

const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: () => get_tickets(),
  });
};

export { useTickets };
