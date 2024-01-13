"use client";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { get_infinite_chat } from "../queries/queries";

const useInfiniteChat = (ticket_id: string) => {
  return useInfiniteQuery({
    queryKey: ["ticket", ticket_id],
    queryFn: ({ pageParam }) => get_infinite_chat({ pageParam, ticket_id }),
    initialPageParam: { type: "init", cursor: new Date() },
    getNextPageParam: (last_page, pages) => {
      const newestTimestamp = pages.at(-1)?.messages.at(0)?.timestamp;
      if (!last_page.next) {
        return null;
      } else if (newestTimestamp) {
        return { type: "next", cursor: newestTimestamp };
      }
      return { type: "init", cursor: new Date() };
    },
    getPreviousPageParam: (first_page, pages, params) => {
      const oldestTimestamp = pages.at(0)?.messages.at(-1)?.timestamp;

      if (!first_page.next) {
        return null;
      } else if (oldestTimestamp) {
        return { type: "prev", cursor: oldestTimestamp };
      }
      return { type: "init", cursor: new Date() };
    },
  });
};

export default useInfiniteChat;
