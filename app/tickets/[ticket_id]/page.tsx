"use client";
import React from "react";
import ChatInput from "@/components/chatinput";
import { useTicket } from "@/components/hooks/useTicket";
import Message from "@/components/message";
import FakeMessage from "@/components/fakemessage";

export default function Chatbox({ params }: { params: { ticket_id: string } }) {
  const { data, isLoading } = useTicket(params.ticket_id);
  const [isPending, setIsPending] = React.useState(false);
  const [bottom, setBottom] = React.useState(true);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const dateFormatter = React.useMemo(() => {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }, []);

  const handleScrollEvent = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = event.target as HTMLElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom) {
      console.log("bottom");
      return setBottom(true);
    }
    return setBottom(false);
  };

  const handleScrollOnClick = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const target = ref.current;
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  console.log("RENDER: ", { isPending });

  return (
    <div className="w-full h-full flex flex-col no-scrollbar">
      <div
        onScroll={handleScrollEvent}
        ref={scrollerRef}
        className="h-full no-scrollbar overflow-auto p-4 space-y-4"
      >
        {data &&
          data.messages.map((message, index) => (
            <Message
              key={message.id}
              dateFormatter={dateFormatter}
              message={message}
              last={
                !isPending
                  ? data.messages.length === index + 1
                    ? true
                    : false
                  : false
              }
            />
          ))}
        {!!!data?.messages.length && (
          <div className="flex-1 flex flex-grow w-full h-full justify-center items-center text-3xl">
            <h1>
              <span className="opacity-50">🌀</span>This chat is empty...
            </h1>
          </div>
        )}
        {/* {!bottom && (
          <Button
            variant="default"
            size="icon"
            className="fixed right-[2%] bottom-[15%] rounded-full "
          >
            <ChevronDownIcon className=" bottom-0 right-0 h-6 w-6" />
          </Button>
        )} */}
        {isPending && <FakeMessage />}
      </div>

      <ChatInput ticketId={params.ticket_id} setIsPending={setIsPending} />
    </div>
  );
}
