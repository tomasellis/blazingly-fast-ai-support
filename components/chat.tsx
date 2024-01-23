"use client";
import React from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import useIsOnScreen from "@/components/hooks/useIsOnScreen";
import { ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

export default function Chat(props: {
  initialData: InfiniteData<Message[], MessageParams>;
  ticketId: string;
}) {
  const [ticketId, setTicketId] = React.useState(props.ticketId);

  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const fetchRef = React.useRef<HTMLDivElement>(null);
  const isFetcherOnScreen = useIsOnScreen(fetchRef);

  const [messageRef, messageInView, entry] = useInView();

  const [isFetchingTimeout, setIsFetchingTimeout] = React.useState(false);
  const [lastScrollerHeight, setLastScrollerHeight] = React.useState(0);
  const [canDisplayArrow, setCanDisplayArrow] = React.useState(false);

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const newMessagesRef = React.useRef<HTMLDivElement>(null);
  const { messageMut, optimisticMessage } = useMessage(
    ticketId,
    props.initialData
  );
  const { mutateAsync: asyncMutateMessage, isPending: pendingMessage } =
    messageMut;
  const {
    data,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    error,
  } = useInfiniteChat(ticketId, props.initialData);

  const handleNewMessage = async (input: string) => {
    console.log("sending new message", { ticketId });
    await asyncMutateMessage({
      content: input,
      id: nanoid(),
      ticket_id: ticketId,
      timestamp: new Date(),
    });
  };

  React.useEffect(() => {
    let id: number | null = null;
    const fetchNext = async () => {
      if (
        isFetcherOnScreen &&
        hasPreviousPage &&
        !isFetchingPreviousPage &&
        !isFetchingTimeout
      ) {
        await fetchPreviousPage();

        // Get current scroll position
        const scroller = scrollerRef.current as HTMLDivElement;
        setLastScrollerHeight(scroller?.scrollHeight ?? 0);

        setIsFetchingTimeout(true);
        id = window.setTimeout(() => {
          setIsFetchingTimeout(false);
        }, 1000);
      }
    };

    fetchNext().catch((err) => console.error(err));

    return () => {
      if (id !== null) {
        window.clearTimeout(id);
      }
    };
  }, [
    isFetcherOnScreen,
    isFetchingPreviousPage,
    fetchPreviousPage,
    isFetchingTimeout,
  ]);

  // When fetching data try an keep scroll position
  React.useEffect(() => {
    const scroller = scrollerRef.current as HTMLDivElement;
    const currScrollerHeight = scroller.scrollHeight;
    const heightDIff = currScrollerHeight - lastScrollerHeight;
    scroller.scrollTop += heightDIff;

    // Wait before displaying chevron down
    const id = window.setTimeout(() => {
      setCanDisplayArrow(true);
    }, 500);

    return () => {
      window.clearTimeout(id);
    };
  }, [data]);

  React.useEffect(() => {
    const scroller = scrollerRef.current as HTMLDivElement;
    scroller.scrollTop = scroller.scrollHeight;
  }, []);

  React.useEffect(() => {
    if (error) {
      throw new Error(error?.message);
    }
  }, [error]);

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-auto">
      {/* <div className="border-b border-gray-700 flex justify-center items-center p-4">
        {}
      </div> */}

      <div
        ref={scrollerRef}
        className="flex-1 flex flex-col w-full p-4 h-full overflow-auto"
      >
        <div ref={fetchRef} className="w-full"></div>
        <div className="relative w-full flex justify-center">
          {isFetchingPreviousPage && data?.pages.length >= 2 && (
            <div className="flex justify-center">
              <ReloadIcon className="h-8 w-8 animate-spin" />
            </div>
          )}
          {data?.pages[0].length === 0 && data.pages.length === 1
            ? "This chat is empty. Send a message to start."
            : null}
        </div>

        {data?.pages.map((messages, i) => {
          return (
            <div key={i} ref={i === 0 ? newMessagesRef : null}>
              {messages.length > 0
                ? messages
                    .toReversed()
                    .map((message, msgi) => (
                      <Message
                        message={message}
                        key={message.id}
                        ref={
                          i === data.pages.length - 1 &&
                          msgi === messages.length - 1
                            ? messageRef
                            : null
                        }
                      />
                    ))
                : null}
            </div>
          );
        })}
        {optimisticMessage ? (
          <>
            <Message message={optimisticMessage} />
            <FakeMessage />
          </>
        ) : null}
      </div>
      {canDisplayArrow && !messageInView && (
        <button
          onClick={() => {
            const scroller = scrollerRef.current as HTMLDivElement;
            scroller.scrollTop = scroller.scrollHeight;
          }}
          className="absolute right-[25px] bottom-[10%] w-min rounded-full bg-gray-700  text-gray-800 hover:bg-indigo-600 hover:text-white"
        >
          <ChevronDownIcon className="h-10 w-10" />
        </button>
      )}
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
