"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add_message, get_ticket } from "../queries/queries";
import { useTicket } from "./useTicket";

const useMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      content,
      ticket_id,
    }: {
      content: string;
      ticket_id: string;
    }) => {
      console.log("MUTATING: Messages");
      return add_message({
        content,
        ticket_id,
      });
    },
    mutationKey: ["message"],
    retry: false,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["ticket", variables.ticket_id],
      });

      // Snapshot the previous value
      const currentTicket = queryClient.getQueryData([
        "ticket",
        variables.ticket_id,
      ]) as Awaited<ReturnType<typeof get_ticket>>;

      if (currentTicket) {
        // Optimistically update to the new value
        queryClient.setQueryData(["ticket", variables.ticket_id], {
          ...currentTicket,
          messages: [
            ...currentTicket.messages,
            {
              id: crypto.randomUUID(),
              content: variables.content,
              role: "user",
              ticket_id: variables.ticket_id,
              timestamp: new Date(),
            },
          ],
        });

        return { currentTicket, variables };
      }
    },
    onError: async (error, variables, context) => {
      // An error happened!
      console.log(
        `rolling back optimistic update with id ${context?.variables.ticket_id}`,
        error,
        variables
      );
      await queryClient.cancelQueries({ queryKey: ["ticket"] });
    },
    onSuccess: async (data, variables, context) => {
      const ai_response = data.result;
      // Stop from querying
      await queryClient.cancelQueries({ queryKey: ["ticket"] });

      // Snapshot the previous value
      const ticketSnapshot = queryClient.getQueryData<
        Awaited<ReturnType<typeof get_ticket>>
      >(["ticket", variables.ticket_id]);

      if (ticketSnapshot) {
        // Optimistically update to the new value
        console.log("UPDATE ---->", ticketSnapshot);
        queryClient.setQueryData<Awaited<ReturnType<typeof get_ticket>>>(
          ["ticket", variables.ticket_id],
          {
            ...ticketSnapshot,
            messages: [
              ...ticketSnapshot.messages,
              {
                id: crypto.randomUUID(),
                content: ai_response ?? "",
                role: "ai",
                ticket_id: variables.ticket_id,
                timestamp: new Date(),
              },
            ],
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ["ticket"] });

      return { ticketSnapshot };
    },
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
    },
  });
};

export default useMessage;
