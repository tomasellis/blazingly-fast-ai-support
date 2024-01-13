"use client";
import React, { useContext } from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import { ChatContext } from "../layout";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import useAddTicket from "@/components/hooks/useAddTicket";

export default function Chatbox({ params }: { params: { ticket_id: string } }) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [ticketId, setTicketId] = React.useState(params.ticket_id);
  const { newChatMut, newChatOptimisticMessage } = useAddTicket(ticketId);

  const { mutateAsync: asyncMutateTicket } = newChatMut;

  const { messageMut, optimisticMessage } = useMessage(ticketId);

  const { mutateAsync: asyncMutateMessage, isPending: pendingMessage } =
    messageMut;

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
        {data?.pages.map((messages, i) => (
          <div key={i} className="border-2 bg-red-500">
            {messages.messages.length > 0
              ? messages.messages
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
        {newChatOptimisticMessage ? (
          <>
            <Message message={newChatOptimisticMessage} last={false} />
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

      {/* <div
        ref={scrollerRef}
        className="h-full no-scrollbar overflow-auto p-4 space-y-4"
      >
        {data &&
          data?.pages[0].messages.map((message, index) => (
            <Message key={message.id} message={message} last={false} />
          ))}
        {(pendingMessage || pendingTicket) && <FakeMessage />}
      </div>*/}
      <ChatInput ticketId={ticketId} handleNewMessage={handleNewMessage} />
    </div>
  );
}

/* {isLoading && (
          <div className="flex-1 flex flex-grow w-full h-full justify-center items-center text-3xl">
            <h1>
              <span className="opacity-50">🌀</span>Loading chat...
            </h1>
          </div>
        )}{!bottom && (
          <Button
            variant="default"
            size="icon"
            className="fixed right-[2%] bottom-[15%] rounded-full "
          >
            <ChevronDownIcon className=" bottom-0 right-0 h-6 w-6" />
          </Button>
        )} */
