"use client";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/tickets/layout";
import { add_message, get_ticket } from "../queries/queries";

const useMessage = () => {
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
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["ticket"] });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData(["ticket"]) as Awaited<
        ReturnType<typeof get_ticket>
      >;

      previousTicket?.messages.push({
        id: crypto.randomUUID(),
        content: variables.content,
        role: "user",
        ticket_id: variables.ticket_id,
        timestamp: new Date(),
      });

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["ticket"],
        (old: Awaited<ReturnType<typeof get_ticket>>) => {
          return previousTicket;
        }
      );

      return variables;
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(
        `rolling back optimistic update with id ${context?.ticket_id}`,
        error,
        variables
      );
    },
    onSuccess: (data, variables, context) => {
      const ai_response = data.response;

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData(["ticket"]) as Awaited<
        ReturnType<typeof get_ticket>
      >;

      previousTicket?.messages.push({
        id: crypto.randomUUID(),
        content: ai_response,
        role: "ai",
        ticket_id: variables.ticket_id,
        timestamp: new Date(),
      });

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["ticket"],
        (old: Awaited<ReturnType<typeof get_ticket>>) => {
          return previousTicket;
        }
      );

      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
    },
  });
};

export default useMessage;
