"use client";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  add_message,
  get_infinite_chat,
  get_tickets,
} from "../queries/queries";
import useInfiniteChat from "./useInfiniteChat";
import React, { useContext, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TicketIdContext } from "@/app/tickets/layout";
import { useToast } from "@/components/ui/use-toast";

const useMessage = (
  ticket_id: string,
  initial_data: InfiniteData<Message[], MessageParams>
) => {
  const queryClient = useQueryClient();
  const { fetchNextPage } = useInfiniteChat(ticket_id, initial_data);
  const path = usePathname();
  const { setId } = useContext(TicketIdContext);
  const { toast } = useToast();
  const router = useRouter();
  const [optimisticMessage, setOptimisticMessage] =
    React.useState<Message | null>(null);

  const messageMut = useMutation({
    throwOnError: true,
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
      await fetchNextPage();

      if (path === "/tickets") {
        setId(data.added_message[0].ticket_id);
        history.replaceState(
          null,
          "",
          `/tickets/${data.added_message[0].ticket_id}`
        );
      }
      setOptimisticMessage(null);
      return data;
    },
    onError: async (error, variables) => {
      setOptimisticMessage(null);
      toast({
        title: "Something went wrong",
        description: `Internal server error. ${
          error.message === "Rollback" ? "Avoid repeating characters." : ""
        }`,
        variant: "destructive",
      });
      console.error("erooooooooor_>_>__>_", error.message, { error });
    },
    onSettled: async (data, error, variables, context) => {
      // Error or success... doesn't matter!
      /* queryClient.setQueryData<Awaited<ReturnType<typeof get_tickets>>>(
        ["tickets"],
        (oldTickets) => {
          if (oldTickets && data?.newTicket) {
            let nextTickets = [
              {
                id: data?.newTicket[0].id,
                status: data?.newTicket[0].status,
                timestamp: data?.newTicket[0].timestamp,
                description: data?.newTicket[0].description,
              },
              ...oldTickets,
            ];
            return nextTickets;
          }
        }
      ); */
      await queryClient.invalidateQueries({
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
