"use client";
import { useQuery } from "@tanstack/react-query";
import { get_tickets } from "../queries/queries";

const useTickets = () => {
  /* let offset = 0
  return useInfiniteQuery({
    queryKey: ["tickets", offset],
    queryFn: get_tickets,
    initialPageParam: offset,
    getNextPageParam: (lastPage, pages) => lastPage.offset + 1,
  }); */

  return useQuery({
    queryKey: ["tickets"],
    queryFn: () => get_tickets(),
  });
};

export { useTickets };
