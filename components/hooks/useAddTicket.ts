"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add_ticket, get_ticket } from "../queries/queries";
import { useRouter } from "next/navigation";

const useAddTicket = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ description }: { description: string }) => {
      console.log("MUTATING: Add Ticket");
      return add_ticket({
        description,
      });
    },
    mutationKey: ["add_ticket"],
    retry: false,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      return { variables };
    },
    onSuccess: async (data, variables, context) => {
      const id = data.added_ticket[0].id;
      router.push(`/tickets/${id}`);
    },
    onError: async (error, variables, context) => {
      // An error happened!
      console.log(
        `error mutating ${context?.variables.description}`,
        error,
        variables
      );
    },

    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
      //console.log("got it!", { response: data?.data.aiResponse.data });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export default useAddTicket;
