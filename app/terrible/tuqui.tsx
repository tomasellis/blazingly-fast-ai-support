"use client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get_infinite_chat } from "@/components/queries/queries";

export default function Chatbox() {
  const [ticketId, setTicketId] = React.useState("aca");

  const q = useInfiniteQuery({
    queryKey: ["ticket", ticketId],
    queryFn: ({ pageParam }) => {
      console.table(pageParam);
      return get_infinite_chat({ pageParam, ticket_id: ticketId });
    },
    initialPageParam: { type: "init", cursor: new Date() },
    getNextPageParam: (last_page, pages) => {
      console.log("GET NEXT PAGE PARAM ->");

      const newestTimestamp = pages.at(-1)?.messages.at(0)?.timestamp;

      if (newestTimestamp) {
        return { type: "next", cursor: newestTimestamp };
      }
      return { type: "init", cursor: new Date() };
    },
    getPreviousPageParam: (first_page, pages, params) => {
      console.log("GET PREV PAGE PARAM ->");
      const oldestTimestamp = pages.at(0)?.messages.at(-1)?.timestamp;

      if (oldestTimestamp) {
        return { type: "prev", cursor: oldestTimestamp };
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    console.log("Render effect");
  }, []);
  console.log("Render afuera");
  return (
    <div className="h-full w-full flex flex-col no-scrollbar">
      <button onClick={() => q.fetchPreviousPage()}>prev</button>
      <button onClick={() => q.refetch()}>refetch</button>
      <button onClick={() => q.fetchNextPage()}>next</button>
    </div>
  );
}
