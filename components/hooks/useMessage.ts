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
      //await fetchPreviousPage();
    },
    onSuccess: async (data, variables) => {
      console.log("FETCHING NEXT PAGE");
      await queryClient.cancelQueries({
        queryKey: ["ticket", variables.ticket_id],
      });
      history.replaceState(
        null,
        "",
        `/tickets/${data.added_message[0].ticket_id}`
      );
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
