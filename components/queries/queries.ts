"use server";
import { db } from "@/db/db";
import { message } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { server_env } from "@/env";

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
  const tickets = await db.query.ticket.findMany({
    orderBy: (ticket) => desc(ticket.id),
  });
  console.log(tickets);
  return tickets;
}

export async function add_message({
  content,
  ticket_id,
}: {
  content: string;
  ticket_id: string;
}) {
  const aires = await get_ai_response({ content: content });

  const added_message = await db.insert(message).values({
    content,
    ticket_id,
    role: "user",
  });

  const added_message_ai = await db.insert(message).values({
    content: aires.data,
    ticket_id,
    role: "ai",
  });

  return { response: aires.data };
}

export async function get_ai_response({ content }: { content: string }) {
  const data = await GetAIResponse(content);
  return data;
}

async function GetAIResponse(text: string) {
  const { body } = await fetch(server_env.LANGCHAIN_SERVER_URL, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
    }),
  });
  const aiResponse = body ? await ReadStream(body) : null;

  return { data: aiResponse };
}

async function ReadStream(stream: ReadableStream) {
  const reader = stream.getReader();
  let hold: string = "";
  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Stream is done
        return JSON.parse(hold).output.content;
      }

      // Do something with each chunk, maybe convert it to text
      const chunkText = new TextDecoder().decode(value);
      hold = chunkText;
    }
  } catch (error) {
    console.error("Error reading stream:", error);
  } finally {
    reader.releaseLock(); // Release the lock when you're done
  }
}
