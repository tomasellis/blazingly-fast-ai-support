"use server";
import { db } from "@/db/db";
import { message, ticket } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { server_env } from "@/env";

import { RemoteRunnable } from "langchain/runnables/remote";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function get_ticket(ticket_id: string) {
  console.log("Getting ticket");
  const ticket = await db.query.ticket.findFirst({
    where: (ticket, { eq }) => eq(ticket.id, ticket_id),
    with: {
      messages: {
        orderBy: (message) => asc(message.timestamp),
        limit: 30,
      },
    },
  });
  console.log({ ticket });
  return ticket;
}

export async function get_infinite_chat({
  pageParam,
  ticket_id,
}: {
  ticket_id: string;
  pageParam: { cursor: Date; type: "prev" | "next" | string };
}) {
  console.log("Getting infinite ticket - ", pageParam);
  const messageLimit = 4;
  const messages = await db.query.message.findMany({
    where: (message, { eq, lt, and, gt }) => {
      if (pageParam.type === "init") {
        return eq(message.ticket_id, ticket_id);
      } else if (pageParam.type === "prev") {
        return and(
          eq(message.ticket_id, ticket_id),
          lt(message.timestamp, pageParam.cursor)
        );
      }
      return and(
        eq(message.ticket_id, ticket_id),
        gt(message.timestamp, pageParam.cursor)
      );
    },
    orderBy: desc(message.timestamp),
    limit: messageLimit,
  });

  if (pageParam.type === "prev") {
    if (messages.length < messageLimit) {
      return { messages: messages, next: false };
    } else {
      return { messages: messages, next: true };
    }
  }

  if (pageParam.type === "next") {
    if (messages.length < messageLimit) {
      return { messages: messages, next: false };
    } else {
      return { messages: messages, next: true };
    }
  }

  return { messages, next: true };
}

export async function get_tickets() {
  console.log("Getting tickets");
  const tickets = await db.query.ticket.findMany({
    orderBy: (ticket) => desc(ticket.timestamp),
  });
  await sleep(2000);

  return tickets;
}

export async function add_message({
  content,
  ticket_id,
  timestamp,
  id,
}: {
  content: string;
  ticket_id: string;
  timestamp: Date;
  id: string;
}) {
  console.log("Adding messages");

  const added_message = await db
    .insert(message)
    .values({
      content,
      ticket_id,
      timestamp,
      id,
    })
    .returning();

  console.log("Getting AI response - messages");

  const { result } = await get_ai_response({ ticket_id });
  console.log("Adding AI response - messages");

  const added_message_ai = await db
    .insert(message)
    .values({
      content: result ?? "",
      ticket_id,
      role: "ai",
    })
    .returning();

  await sleep(2000);
  return { added_message };
}

export async function add_ticket({
  description,
  ticket_id,
  first_message: { content, timestamp, id },
}: {
  description: string;
  ticket_id: string;
  first_message: { content: string; timestamp: Date; id: string };
}) {
  console.log("Creating ticket!", { description, ticket_id });
  const added_ticket = await db
    .insert(ticket)
    .values({
      description,
      id: ticket_id,
    })
    .returning();
  console.log("Creating ticket - Message!");

  console.log("Creating message!", { content, ticket_id, id });
  const added_message = await db.insert(message).values({
    content,
    ticket_id: ticket_id,
    role: "user",
    timestamp,
    id: id,
  });
  console.log("Creating ticket - Ai Response!");

  const ai_response = await get_ai_response({
    ticket_id,
  });

  const added_message_ai = await db
    .insert(message)
    .values({
      content: ai_response.result ?? "",
      ticket_id,
      role: "ai",
    })
    .returning();

  await sleep(2000);
  console.log({ added_message, added_ticket, added_message_ai });
  return { added_ticket };
}

async function get_ai_response({ ticket_id }: { ticket_id: string }) {
  try {
    const ticket = await get_ticket(ticket_id);

    const parsed_messages = ticket?.messages
      .map((message) => {
        return `${message.role === "ai" ? "AI" : "User"}: ${message.content}`;
      })
      .join("\n\n");

    const chain = new RemoteRunnable({
      url: server_env.LANGCHAIN_SERVER_URL + "/chat",
    });

    const INPUT = `You are the best customer support agent of the world. 
You work for a sky island agency, you sell sky islands to customers.
Be concise and formal in your response. You can and should use emojis
to make the customer feel better. For information you don't have, make something up.

Here's a list of the islands we have:

1) Good Island: nice island
2) Very Good Island: nicer island
3) Bad Island: not nice island

Current conversation:
${parsed_messages}

AI: `;

    console.log("INPUT", INPUT);

    let result = (await chain.invoke({
      input: INPUT,
    })) as string;
    console.log("RESULT_>_>_", result);

    console.log({ result });

    return { result };
  } catch (err) {
    console.log("ticket", err);
    return { text: "f" };
  }
}
