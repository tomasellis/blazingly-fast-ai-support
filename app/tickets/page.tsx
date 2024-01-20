"use client";
import React, { useContext, useRef } from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import { usePathname, useRouter } from "next/navigation";
import { TicketIdContext } from "./layout";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import useIsOnscreen from "@/components/hooks/useIsOnScreen";
import { useInView } from "react-intersection-observer";

export default function Chatbox() {
  const initial_data = { pages: [], pageParams: [] };
  const router = useRouter();
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const { id, setId } = useContext(TicketIdContext);
  const [ticketId, setTicketId] = React.useState(id);
  const [sentFirstMessage, setSentFirstMessage] = React.useState(false);
  const { messageMut, optimisticMessage } = useMessage(ticketId, initial_data);
  const { mutateAsync: asyncMutateMessage } = messageMut;
  const { data, isError, error } = useInfiniteChat(ticketId, initial_data);

  const [messageRef, messageInView, entry] = useInView();

  const handleNewMessage = async (input: string) => {
    setSentFirstMessage(true);
    await asyncMutateMessage({
      content: input,
      id: nanoid(),
      ticket_id: ticketId,
      timestamp: new Date(),
    });
  };

  React.useEffect(() => {
    setTicketId(id);
    setSentFirstMessage(false);
  }, [id]);

  React.useEffect(() => {
    if (error) {
      throw new Error(error?.message);
    }
  }, [error]);

  return (
    <div className="h-full w-full flex flex-col no-scrollbar">
      <div
        ref={scrollerRef}
        className="h-full no-scrollbar overflow-auto p-4 space-y-4"
      >
        {!sentFirstMessage && (
          <div className="h-full w-full flex flex-col no-scrollbar">
            <div className="h-full no-scrollbar overflow-auto p-4 space-y-4 flex">
              <div className="flex-1 flex flex-col h-1/3 justify-center items-center">
                <span className="text-9xl">{/*  <QuestionMarkSVG /> */}</span>
                <h1 className="text-5xl font-bold py-4 text-indigo-500">
                  Welcome to the Support Center
                </h1>
                <p className="text-3xl mb-6">How can we help you?</p>
              </div>
            </div>
          </div>
        )}
        {data.pages.some((p) =>
          p.some((messages) => messages.ticket_id === ticketId)
        ) &&
          data.pages.map((messages, i) => {
            if (messages.length >= 1) {
              return (
                <div key={i} className="">
                  {messages.toReversed().map((message, msgi) => (
                    <Message
                      ref={
                        data.pages.length > 0 &&
                        i === data.pages.length - 1 &&
                        msgi === 0
                          ? messageRef
                          : null
                      }
                      last={false}
                      message={message}
                      key={message.id}
                    />
                  ))}
                </div>
              );
            }
          })}
        {optimisticMessage ? (
          <>
            <Message message={optimisticMessage} last={false} />
            <FakeMessage />
          </>
        ) : null}
      </div>
      {sentFirstMessage && !messageInView && (
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
        initialData={initial_data}
      />
    </div>
  );
}
