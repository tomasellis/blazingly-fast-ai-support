"use client";
import { useQuery } from "@tanstack/react-query";
import { get_ticket } from "../queries/queries";
import React from "react";

const useTicket = (ticket_id: string) => {
  const [active, setActive] = React.useState(false);

  const query = useQuery({
    queryKey: ["ticket", ticket_id],
    queryFn: () => get_ticket(ticket_id),
  });
  return { query, setActive };
};

export default useTicket;
