"use client";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { add_message, get_infinite_chat } from "../queries/queries";
import useInfiniteChat from "./useInfiniteChat";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const useMessage = (ticket_id: string, initial_data: InfiniteData<Message[], MessageParams>) => {
  const queryClient = useQueryClient();
  const { fetchNextPage, fetchPreviousPage } = useInfiniteChat(ticket_id, initial_data);

  const router = useRouter();
  const path = usePathname();

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
    mutationKey: ["message", ticket_id],
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
      console.log(data.added_message, data.added_message_ai);
      console.log("FETCHING NEXT PAGE");
      await queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticket_id],
      });

      /* history.replaceState(
        null,
        "",
        `/tickets/${data.added_message[0].ticket_id}`
      );
       */
      await fetchNextPage();
      if (path === "/tickets") {
        router.push(`/tickets/${data.added_message[0].ticket_id}`);
      }
      setOptimisticMessage(null);
    },
    onSettled: async (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
      await queryClient.refetchQueries({
        queryKey: ["tickets"],
      });
    },
  });

  return { messageMut, optimisticMessage };
};

export default useMessage;

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

type InfiniteChatMessages = Awaited<ReturnType<typeof get_infinite_chat>>;
type InfiniteChat = {
  pages: InfiniteChatMessages[];
  pageParams: Date[];
};
