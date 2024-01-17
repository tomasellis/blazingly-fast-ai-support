"use client";
import React, { useContext, useRef } from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import useIsOnscreen from "@/components/hooks/useIsOnScreen";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TicketIdContext } from "@/app/tickets/layout";
import { InfiniteData, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { get_infinite_chat } from "./queries/queries";

export default function Chat(props: {
  initialData: InfiniteData<Message[], MessageParams>;
  ticketId: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [ticketId, setTicketId] = React.useState(props.ticketId);
  const { setId } = useContext(TicketIdContext);
  const fetchRef = useRef(null);
  const newMessagesRef = useRef(null);
  const isFetcherOnScreen = useIsOnscreen(fetchRef);
  const { messageMut, optimisticMessage } = useMessage(
    ticketId,
    props.initialData
  );
  const { mutateAsync: asyncMutateMessage, isPending: pendingMessage } =
    messageMut;
  /*  useInfiniteChat(ticketId, props.initialData); */

  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetching,
    isFetchingPreviousPage,
  } = useSuspenseInfiniteQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: props.initialData,
    queryKey: ["ticket", props.ticketId],
    queryFn: ({ pageParam }) => {
      return get_infinite_chat({ pageParam, ticket_id: ticketId });
    },
    initialPageParam: { type: "prev", cursor: new Date(8.64e15) },
    getNextPageParam: (last_page, pages) => {
      const newestTimestamp = pages.findLast((p) => p.length)?.at(0)?.timestamp;

      if (newestTimestamp) {
        return { type: "next", cursor: newestTimestamp };
      }
      return { type: "next", cursor: new Date(8.64e15) };
    },
    getPreviousPageParam: (first_page, pages, params) => {
      const oldestTimestamp = pages.at(0)?.at(-1)?.timestamp;

      if (oldestTimestamp) {
        return { type: "prev", cursor: oldestTimestamp };
      }
      return null;
    },
  });

  const handleNewMessage = async (input: string) => {
    console.log("sending new message", { ticketId });
    await asyncMutateMessage({
      content: input,
      id: nanoid(),
      ticket_id: ticketId,
      timestamp: new Date(),
    });
  };

  /*  React.useEffect(() => {
    (async () => {
      if (isFetcherOnScreen && !isFetchingPreviousPage) {
        await fetchPreviousPage();
        const newMessages = newMessagesRef.current
          ? (newMessagesRef.current as HTMLDivElement)
          : null;
        if (newMessages) newMessages.scrollIntoView({ behavior: "instant" });
      }
    })();
  }, [isFetcherOnScreen, isFetchingPreviousPage, fetchPreviousPage]); */

  React.useEffect(() => {
    setId(ticketId);
  }, [ticketId, setId]);

  return (
    <div className="h-full w-full flex flex-col no-scrollbar">
      <div
        ref={scrollerRef}
        className="h-full no-scrollbar overflow-auto p-4 space-y-4"
      >
        <div className="relative w-full flex justify-center">
          {isFetchingPreviousPage && !data?.pages[0] && (
            <div className="flex justify-center">
              <ReloadIcon className="h-8 w-8 animate-spin" />
            </div>
          )}

          {isFetching && !data && "Loading..."}

          {!isFetching && hasPreviousPage && (
            <button onClick={async () => await fetchPreviousPage()}>
              Load More
            </button>
          )}

          {data?.pages[0].length === 0 && data.pages.length === 1
            ? "This chat is empty. Send a message to start."
            : null}
        </div>
        <div ref={fetchRef} className="w-full"></div>

        {data?.pages.map((messages, i) => {
          return (
            <div
              ref={i === 1 && hasPreviousPage ? newMessagesRef : null}
              key={i}
              className=""
            >
              {messages.length > 0
                ? messages
                    .toReversed()
                    .map((message) => (
                      <Message
                        last={false}
                        message={message}
                        key={message.id}
                      />
                    ))
                : null}
            </div>
          );
        })}
        {optimisticMessage ? (
          <>
            <Message message={optimisticMessage} last={false} />
            <FakeMessage />
          </>
        ) : null}
      </div>
      <ChatInput
        ticketId={ticketId}
        handleNewMessage={handleNewMessage}
        initialData={props.initialData}
      />
    </div>
  );
}

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
