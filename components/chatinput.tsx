"use client";
import React from "react";
import { Button } from "./ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePathname } from "next/navigation";
import useInfiniteChat from "./hooks/useInfiniteChat";
import { InfiniteData } from "@tanstack/react-query";

function ChatInput(props: {
  ticketId: string;
  handleNewMessage: (input: string) => Promise<void>;
  initialData: InfiniteData<Message[], MessageParams>;
}) {
  const [input, setInput] = React.useState("");
  const path = usePathname();
  const formRef = React.useRef<HTMLFormElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { data, isFetching, isFetchingNextPage } = useInfiniteChat(
    props.ticketId,
    props.initialData
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput = input.slice(0);
    setInput("");
    console.log("SENDING MESSAGE FROM CHATINPUT");
    await props.handleNewMessage(userInput);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      props.ticketId !== "" &&
      !isFetching &&
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="h-min flex-initial flex w-full justify-center items-center 
      box-border border-solid border-red-500flex px-4 py-4 border-t border-gray-700  bg-gray-800"
    >
      <TextareaAutosize
        disabled={isFetchingNextPage}
        autoFocus={true}
        name="msg"
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        className="max-h-[140px] h-min min-h-[25px] outline-none p-2 mr-5 flex-1 
       rounded-sm w-full box-border bg-gray-700 text-gray-300 items-baseline"
        placeholder={
          path === "/tickets"
            ? "Send a message to reach Customer Support..."
            : "Message Customer Support..."
        }
        maxRows={5}
        minRows={1}
        maxLength={500}
        style={{
          resize: "none",
        }}
        required
        autoComplete="off"
      />

      <Button
        variant="default"
        size="icon"
        className="flex items-center rounded-full bg-inherit text-gray-500 hover:bg-indigo-600 hover:text-white transition duration-200 ease-in-out transform hover:scale-105"
        disabled={isFetchingNextPage}
        type="submit"
      >
        <PaperPlaneIcon className=" bottom-0 right-0 h-6 w-6 " />
      </Button>
    </form>
  );
}

export default React.memo(ChatInput);

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
