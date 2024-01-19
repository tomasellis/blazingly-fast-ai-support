import Chat from "@/components/chat";
import { get_infinite_chat } from "@/components/queries/queries";
import { InfiniteData } from "@tanstack/react-query";
import { nanoid } from "nanoid";

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

export default async function ChatPage({
  params,
}: {
  params: { ticket_id: string };
}) {
  /*  const ticket_id = nanoid(); */

  const dateNow = new Date();

  const initial_data: InfiniteData<Message[], MessageParams> = {
    pages: [
      await get_infinite_chat({
        //pageParam: { type: "prev", cursor: new Date() },
        pageParam: { type: "prev", cursor: dateNow },
        ticket_id: params.ticket_id,
      }),
    ],
    //pageParams: [{ type: "prev", cursor: new Date() }],
    pageParams: [{ type: "prev", cursor: dateNow }],
  };

  

  return <Chat initialData={initial_data} ticketId={params.ticket_id} />;
}
