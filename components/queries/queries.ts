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
  const ticket = await db.query.ticket.findFirst({
    where: (ticket, { eq }) => eq(ticket.id, ticket_id),
    with: {
      messages: {
        orderBy: (message) => asc(message.timestamp),
        limit: 30,
      },
    },
  });

  return ticket;
}

export async function get_tickets() {
  await sleep(2000);
  const tickets = await db.query.ticket.findMany({
    orderBy: (ticket) => desc(ticket.timestamp),
  });
  return tickets;
}

export async function add_message({
  content,
  ticket_id,
}: {
  content: string;
  ticket_id: string;
}) {
  const added_message = await db.insert(message).values({
    content,
    ticket_id,
    role: "user",
  });
  const { result } = await get_ai_response({ ticket_id });

  const added_message_ai = await db.insert(message).values({
    content: result ?? "",
    ticket_id,
    role: "ai",
  });

  return { result };
}

export async function add_ticket({ description }: { description: string }) {
  await sleep(5000);
  const added_ticket = await db
    .insert(ticket)
    .values({
      description,
    })
    .returning();

  const added_message_ai = await db.insert(message).values({
    content: "Hello, how can I help you?",
    ticket_id: added_ticket[0].id,
    role: "ai",
  });

  return { added_ticket, added_message_ai };
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
to make the customer feel better. 

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
