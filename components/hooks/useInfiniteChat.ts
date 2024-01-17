"use client";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { get_infinite_chat } from "../queries/queries";

const useInfiniteChat = (
  ticket_id: string,
  initial_data: InfiniteData<Message[], MessageParams>
) => {
  return useSuspenseInfiniteQuery({
    initialData: initial_data,
    staleTime: 1000 * 60 * 10,
    queryKey: ["ticket", ticket_id],
    queryFn: ({ pageParam }) => {
      return get_infinite_chat({ pageParam, ticket_id });
    },
    initialPageParam: { type: "prev", cursor: new Date(8.64e15) },
    getNextPageParam: (last_page, pages) => {
      console.table(pages);
      const newestTimestamp = pages.findLast((p) => p.length)?.at(0)?.timestamp;

      if (newestTimestamp) {
        return { type: "next", cursor: newestTimestamp };
      }
      return { type: "next", cursor: new Date(8.64e15) };
    },
    getPreviousPageParam: (first_page, pages, params) => {
      console.log("getprev", { pages });
      const oldestTimestamp = pages.at(0)?.at(-1)?.timestamp;

      if (oldestTimestamp) {
        return { type: "prev", cursor: oldestTimestamp };
      }
      return null;
    },
  });
};

export default useInfiniteChat;

type Message = {
  id: string;
  role: "ai" | "user" | null;
  content: string;
  ticket_id: string;
  timestamp: Date;
};

type MessageParams = {
  cursor: Date;
  type: string;
};
