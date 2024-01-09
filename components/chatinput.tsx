"use client";
import React from "react";
import { Button } from "./ui/button";
import useMessage from "./hooks/useMessage";
import { useQueryClient } from "@tanstack/react-query";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import TextareaAutosize from "react-textarea-autosize";

export default function ChatInput({
  ticketId,
  setIsPending,
}: {
  ticketId: string;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [input, setInput] = React.useState("");

  const queryClient = useQueryClient();

  const { mutate, isError, reset, isPending } = useMessage();

  const formRef = React.useRef<HTMLFormElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    console.log("ACTUAL ON SUBMIT INPUT--->", { input });

    mutate({
      content: input,
      ticket_id: ticketId,
    });

    setInput("");
  };

  const handleRefresh = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    reset();
    // Refetch ticket data
    (async () => await queryClient.resetQueries({ queryKey: ["ticket"] }))();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  React.useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  if (isError) {
    return (
      <div className="w-full h-full flex justify-center items-center box-border border-solid border-red-500">
        <form
          onSubmit={handleRefresh}
          className="flex no-scrollbar border-t border-gray-700  bg-gray-800 px-4 py-4"
        >
          <Button className="box-border bg-indigo-500 text-white">
            Network Error: Refresh chat
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="h-min flex-initial flex w-full justify-center items-center 
      box-border border-solid border-red-500flex px-4 py-4 border-t border-gray-700  bg-gray-800"
    >
      <TextareaAutosize
        name="msg"
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        className="max-h-[140px] min-h-[25px] outline-none p-2 mr-5 flex-1 h-full rounded-sm w-full box-border bg-gray-700 text-gray-300"
        placeholder={
          ticketId ? "Type your message here..." : "Please select a ticket"
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
        className=" rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
        disabled={!!!ticketId}
        type="submit"
      >
        <PaperPlaneIcon className=" bottom-0 right-0 h-6 w-6 -rotate-90" />
      </Button>
    </form>
  );
}
