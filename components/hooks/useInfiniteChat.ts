"use client";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { get_infinite_chat } from "../queries/queries";

const useInfiniteChat = (ticket_id: string) => {
  return useInfiniteQuery({
    queryKey: ["ticket", ticket_id],
    queryFn: ({ pageParam }) => {
      return get_infinite_chat({ pageParam, ticket_id });
    },
    staleTime: Infinity,
    initialPageParam: { type: "prev", cursor: new Date() },
    getNextPageParam: (last_page, pages) => {
      const newestTimestamp = pages
        .findLast((p) => p?.length)
        ?.at(0)?.timestamp;

      if (newestTimestamp) {
        return { type: "next", cursor: newestTimestamp };
      }
      return { type: "next", cursor: new Date(8.64e15) };
    },
    getPreviousPageParam: (first_page, pages, params) => {
      const oldestTimestamp = pages.at(0)?.at(-1)?.timestamp;

      if (oldestTimestamp) {
        return { type: "prev", cursor: oldestTimestamp };
      }
      return null;
    },
  });
};

export default useInfiniteChat;
