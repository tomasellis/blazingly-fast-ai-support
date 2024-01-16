"use client";
import React, { useContext } from "react";
import ChatInput from "@/components/chatinput";
import { nanoid } from "nanoid";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";
import useMessage from "@/components/hooks/useMessage";
import useInfiniteChat from "@/components/hooks/useInfiniteChat";
import useAddTicket from "@/components/hooks/useAddTicket";
import { ReloadIcon } from "@radix-ui/react-icons";
import { TicketIdContext } from "./layout";
import { useRouter, useSearchParams } from "next/navigation";

export default function Chatbox() {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [ticketId, setTicketId] = React.useState(nanoid());
  const [sentFirstMessage, setSentFirstMessage] = React.useState(false);
  const { messageMut, optimisticMessage } = useMessage(ticketId);
  const { mutateAsync: asyncMutateMessage } = messageMut;
  const { setId, id } = useContext(TicketIdContext);
  const { data } = useInfiniteChat(ticketId);

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
    setId(ticketId);
  }, [ticketId, setId]);

  React.useEffect(() => {
    console.log({ data });
  }, [data]);

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
        {data?.pages.map((page, i) => {
          if (page.length >= 1) {
            return (
              <div key={i} className="">
                {page.toReversed().map((message) => (
                  <Message last={false} message={message} key={message.id} />
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
      <ChatInput ticketId={ticketId} handleNewMessage={handleNewMessage} />
    </div>
  );
}
