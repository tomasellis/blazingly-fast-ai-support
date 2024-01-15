"use client";
import React from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import useAddTicket from "@/components/hooks/useAddTicket";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Chatbox() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [ticketId, setTicketId] = React.useState(nanoid());
  console.log("ticket id", ticketId);

  const { messageMut, optimisticMessage } = useMessage(ticketId);
  const { mutateAsync: asyncMutateMessage } = messageMut;

  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    hasNextPage,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteChat(ticketId);

  /*  const handleNewChat = async (input: string) => {
    await asyncMutateTicket({
      description: input,
      first_message: {
        content: input,
        timestamp: new Date(),
        id: nanoid(),
      },
    });
  }; */

  const handleNewMessage = async (input: string) => {
    console.log("sending new message", { ticketId });
    await asyncMutateMessage({
      content: input,
      id: nanoid(),
      ticket_id: ticketId,
      timestamp: new Date(),
    });
  };

  return (
    <div className="h-full w-full flex flex-col no-scrollbar">
      <div
        ref={scrollerRef}
        className="h-full no-scrollbar overflow-auto p-4 space-y-4"
      >
        <button
          onClick={() => fetchPreviousPage()}
          disabled={!hasPreviousPage || isFetchingPreviousPage}
        >
          {isFetchingPreviousPage
            ? "Loading more..."
            : hasPreviousPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
        {data?.pages.map((page, i) => (
          <div key={i} className="border-2 bg-red-500">
            {isFetchingPreviousPage && (
              <div className="flex justify-center">
                <ReloadIcon className="h-8 w-8 animate-spin" />
              </div>
            )}

            {page.length > 0
              ? page
                  .toReversed()
                  .map((message) => (
                    <Message last={false} message={message} key={message.id} />
                  ))
              : null}
          </div>
        ))}
        {optimisticMessage ? (
          <>
            <Message message={optimisticMessage} last={false} />
            <FakeMessage />
          </>
        ) : null}
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>

      <ChatInput ticketId={ticketId} handleNewMessage={handleNewMessage} />
    </div>
  );
}
