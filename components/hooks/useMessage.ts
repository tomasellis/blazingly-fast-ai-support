"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add_message, get_infinite_chat, get_ticket } from "../queries/queries";
import useInfiniteChat from "./useInfiniteChat";
import React from "react";

type InfiniteChatMessages = Awaited<ReturnType<typeof get_infinite_chat>>;
type InfiniteChat = {
  pages: InfiniteChatMessages[];
  pageParams: Date[];
};
type Message = {
  id: string;
  timestamp: Date;
  ticket_id: string;
  content: string;
  role: "ai" | "user" | null;
};

const useMessage = (ticket_id: string) => {
  const queryClient = useQueryClient();
  const { fetchNextPage, fetchPreviousPage } = useInfiniteChat(ticket_id);

  const [optimisticMessage, setOptimisticMessage] =
    React.useState<Message | null>(null);

  const messageMut = useMutation({
    mutationFn: ({
      content,
      ticket_id,
      timestamp,
      id,
    }: {
      content: string;
      ticket_id: string;
      timestamp: Date;
      id: string;
    }) => {
      return add_message({
        content,
        ticket_id,
        timestamp,
        id,
      });
    },
    mutationKey: ["message", ticket_id, "chat"],
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["ticket", variables.ticket_id],
      });

      setOptimisticMessage({
        content: variables.content,
        id: variables.id,
        role: "user",
        ticket_id: ticket_id,
        timestamp: variables.timestamp,
      });
      /* 
      queryClient.setQueryData(
        ["ticket", ticket_id],
        (infinite_chat: InfiniteChat) => {
          if (infinite_chat) {
            return {
              pages: [
                ...infinite_chat.pages,
                [
                  {
                    id: variables.id,
                    content: variables.content,
                    role: "user",
                    ticket_id: ticket_id,
                    timestamp: variables.timestamp,
                  },
                ],
              ],
              pageParams: [
                ...infinite_chat.pageParams,
                { type: "next", cursor: variables.timestamp },
              ],
            };
          }
        }
      );
 */
      return { variables };
    },
    onError: async (error, variables, context) => {
      // An error happened!
      console.log(
        `rolling back optimistic update with id ${context?.variables.ticket_id}`,
        error,
        variables
      );
    },
    onSuccess: async (data, variables, context) => {
      /* queryClient.setQueryData(
        ["ticket", variables.ticket_id],
        (infinite_chat: InfiniteChat) => {
          let nextInfinitePages = [...infinite_chat.pages];

          let lastPage = nextInfinitePages.pop();

          if (lastPage) {
            lastPage.push({
              id: data.added_message_ai[0].id,
              content: data.added_message_ai[0].content,
              role: "ai",
              ticket_id: data.added_message_ai[0].ticket_id,
              timestamp: data.added_message_ai[0].timestamp,
              ticket: { id: variables.ticket_id },
            });
          }

          return {
            pages: [...nextInfinitePages],
            pageParams: [...infinite_chat.pageParams],
          };
        }
      );
      return {}; */
      //await fetchPreviousPage();
      console.log("FETCHING NEXT PAGE");
      await fetchNextPage();
      setOptimisticMessage(null);
    },
    onSettled: async (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
      await queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
    },
  });

  return { messageMut, optimisticMessage };
};

export default useMessage;
