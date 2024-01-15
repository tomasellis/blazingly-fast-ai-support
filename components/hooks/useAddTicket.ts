"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  add_ticket,
  get_infinite_chat,
  get_ticket,
  get_tickets,
} from "../queries/queries";
import useInfiniteChat from "./useInfiniteChat";
import React from "react";

type InfiniteChatData = Awaited<ReturnType<typeof get_infinite_chat>>;
type InfiniteChat = {
  pages: InfiniteChat[];
  pageParams: Date[];
};
type Message = {
  id: string;
  timestamp: Date;
  ticket_id: string;
  content: string;
  role: "ai" | "user" | null;
};
const useAddTicket = (ticket_id: string) => {
  const [newChatOptimisticMessage, setNewChatOptimisticMessage] =
    React.useState<Message | null>(null);
  const queryClient = useQueryClient();
  const { fetchPreviousPage, fetchNextPage } = useInfiniteChat(ticket_id);
  const newChatMut = useMutation({
    mutationFn: ({
      description,
      first_message,
    }: {
      description: string;
      first_message: { content: string; timestamp: Date; id: string };
    }) => {
      console.log("MUTATING: Add Ticket");
      return add_ticket({
        description,
        ticket_id,
        first_message,
      });
    },
    mutationKey: ["add_ticket", ticket_id],
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)

      await queryClient.cancelQueries({
        queryKey: ["tickets"],
      });

      // Snapshot the previous value
      const currentChat = queryClient.getQueryData([
        "ticket",
        ticket_id,
      ]) as Awaited<ReturnType<typeof get_infinite_chat>>;
      setNewChatOptimisticMessage({
        content: variables.first_message.content,
        id: variables.first_message.id,
        timestamp: variables.first_message.timestamp,
        role: "user",
        ticket_id: ticket_id,
      });
      // Optimistically update user message
      /* queryClient.setQueryData(
        ["ticket", ticket_id],
        (infinite_chat: InfiniteChat) => {
          if (infinite_chat) {
            return {
              pages: [
                ...infinite_chat.pages,
                [
                  {
                    id: variables.first_message.id,
                    content: variables.first_message.content,
                    role: "user",
                    ticket_id: ticket_id,
                    timestamp: variables.first_message.timestamp,
                  },
                ],
              ],
              pageParams: [
                ...infinite_chat.pageParams,
                { type: "next", cursor: variables.first_message.timestamp },
              ],
            };
          }
          return {
            pages: [
              [
                {
                  id: variables.first_message.id,
                  content: variables.first_message.content,
                  role: "user",
                  ticket_id: ticket_id,
                  timestamp: variables.first_message.timestamp,
                },
              ],
            ],
            pageParams: [
              { type: "next", cursor: variables.first_message.timestamp },
            ],
          };
        }
      ); */

      return { variables };
    },
    onSuccess: async (data, variables, context) => {
      /* queryClient.fetchQuery({ queryKey: ["ticket", variables.id] }); */
      console.log("Fetching on success ticket");
      

      await queryClient.refetchQueries({
        queryKey: ["ticket", data.added_ticket[0].id],
      });

      await fetchPreviousPage();
      setNewChatOptimisticMessage(null);
      /* queryClient.setQueryData(
        ["ticket", ticket_id],
        (infinite_chat: InfiniteChat) => {
          if (infinite_chat) {
            return {
              pages: [
                ...infinite_chat.pages,
                [
                  {
                    id: data.added_message_ai[0].id,
                    content: data.added_message_ai[0].content,
                    role: "ai",
                    ticket_id: ticket_id,
                    timestamp: data.added_message_ai[0].timestamp,
                  },
                ],
              ],
              pageParams: [
                ...infinite_chat.pageParams,
                data.added_message_ai[0].timestamp,
              ],
            };
          }
          return {
            pages: [
              [
                {
                  id: data.added_message_ai[0].id,
                  content: data.added_message_ai[0].content,
                  role: "ai",
                  ticket_id: ticket_id,
                  timestamp: data.added_message_ai[0].timestamp,
                },
              ],
            ],
            pageParams: [data.added_message_ai[0].timestamp],
          };
        }
      ); */

      console.log("Fetching on success ticket - Done");
    },
    onError: async (error, variables, context) => {
      // An error happened!
      console.log(
        `error mutating ${context?.variables.description}`,
        error,
        variables
      );
    },

    onSettled: async (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
      console.log("Refetching Add Ticket - TICKET");
    },
  });

  return { newChatOptimisticMessage, newChatMut };
};

export default useAddTicket;
