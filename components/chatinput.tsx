"use client";
import React, { useContext } from "react";
import { Button } from "./ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import TextareaAutosize from "react-textarea-autosize";
import { usePathname } from "next/navigation";
import useInfiniteChat from "./hooks/useInfiniteChat";
import { InfiniteData } from "@tanstack/react-query";
import { TicketIdContext } from "@/app/tickets/layout";
import { Textarea } from "./ui/textarea";

function ChatInput(props: {
  ticketId: string;
  handleNewMessage: (input: string) => Promise<void>;
  initialData: InfiniteData<Message[], MessageParams>;
}) {
  const [input, setInput] = React.useState("");
  const path = usePathname();
  const { id } = useContext(TicketIdContext);
  const formRef = React.useRef<HTMLFormElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { data, isFetching, isFetchingNextPage, isPending } = useInfiniteChat(
    props.ticketId,
    props.initialData
  );

  const sanitizeRepeatingCharacters = (
    str: string,
    maxRepeated: number = 20
  ) => {
    const regex = new RegExp(`(.)\\1{${maxRepeated},}`);
    return str.replace(regex, `${"$1".repeat(20)}`);
  };

  const [blockSendingMessage, setBlockSendingMessage] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (blockSendingMessage) return;
    setBlockSendingMessage(true);
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
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.stopPropagation();
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  React.useEffect(() => {
    setBlockSendingMessage(false);
  }, [data]);

  React.useEffect(() => {
    textareaRef?.current?.focus();
  }, [id]);

  const resizeTextArea = () => {
    const textAreaRef = textareaRef.current as HTMLTextAreaElement;
    textAreaRef.style.height = "auto";
    textAreaRef.style.height = textAreaRef.scrollHeight + "px";
  };

  React.useEffect(resizeTextArea, [input]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          return;
        }
      }}
      className="h-min flex-initial flex w-full justify-center items-center 
      box-border border-solid border-red-500flex px-4 py-4 border-t border-gray-700  bg-gray-800"
    >
      <Textarea
        autoFocus={true}
        name="msg"
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(sanitizeRepeatingCharacters(e.currentTarget.value));
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        maxLength={500}
        style={{
          resize: "none",
        }}
        rows={1}
        required
        autoComplete="off"
        className="no-scrollbar max-h-[140px] min-h-[25px] outline-none p-2 mr-5 flex-1 
       rounded-sm w-full  bg-gray-700 text-gray-300 items-baseline"
        placeholder={
          path === "/tickets"
            ? "Send a message to reach Customer Support..."
            : "Message Customer Support..."
        }
      />
      {/* <TextareaAutosize
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
      /> */}

      <Button
        variant="default"
        size="icon"
        className="flex items-center rounded-full bg-inherit text-gray-500 hover:bg-indigo-600 hover:text-white transition duration-200 ease-in-out transform hover:scale-105"
        disabled={blockSendingMessage}
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
