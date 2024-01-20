"use server";
import { db } from "@/db/db";
import { message, ticket } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { server_env } from "@/env";
import ky from "ky";
import { RemoteRunnable } from "langchain/runnables/remote";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function get_ticket(ticket_id: string, limit?: number) {
  console.log("Getting ticket");
  if (!limit) {
    const ticket = await db.query.ticket.findFirst({
      where: (ticket, { eq }) => eq(ticket.id, ticket_id),
      with: {
        messages: {
          orderBy: (message) => asc(message.timestamp),
          limit: 50,
        },
      },
    });
    return ticket;
  }

  const ticket = await db.query.ticket.findFirst({
    where: (ticket, { eq }) => eq(ticket.id, ticket_id),
    with: {
      messages: {
        orderBy: (message) => asc(message.timestamp),
        limit,
      },
    },
  });
  return ticket;
}

export async function get_infinite_chat({
  pageParam,
  ticket_id,
}: {
  ticket_id: string;
  pageParam: { cursor: Date | string; type: "prev" | "next" | string };
}) {
  console.log("Getting infinite ticket - ", pageParam);
  const date =
    typeof pageParam.cursor === "string"
      ? new Date(Date.parse(pageParam.cursor))
      : pageParam.cursor;
  const messageLimit = 20;
  const messages = await db.query.message.findMany({
    where: (message, { eq, lt, and, gt }) => {
      if (pageParam.type === "prev") {
        return and(
          eq(message.ticket_id, ticket_id),
          lt(message.timestamp, date)
        );
      } else {
        return and(
          eq(message.ticket_id, ticket_id),
          gt(message.timestamp, date)
        );
      }
    },
    orderBy: desc(message.timestamp),
    limit: messageLimit,
  });

  console.log("RESULT OF INFINITE CHAT", pageParam.cursor, { messages });

  return messages;
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
  try {
    const start = Date.now();

    console.log(
      `Execution time: CHECK IF TICKET EXISTS | START - ${
        Date.now() - start
      } ms`
    );
    const exists = await db.query.ticket.findFirst({
      where: (ticket, { eq }) => eq(ticket.id, ticket_id),
    });
    console.log(
      `Execution time: CHECK IF TICKET EXISTS | END - ${Date.now() - start} ms`
    );

    // TODO: generate title
    let newTicket = null;
    if (exists === undefined) {
      console.log("TICKET DOESN'T EXIST, LET'S CREATE A NEW ONE");
      console.log(
        `Execution time: ADD NEW TICKET | START - ${Date.now() - start} ms`
      );
      newTicket = await db
        .insert(ticket)
        .values({
          description: content,
          id: ticket_id,
        })
        .returning();
      console.log(
        `Execution time: ADD NEW TICKET | END - ${Date.now() - start} ms`
      );
    }

    const { added_message, messageTx } = await db.transaction(async (tx) => {
      console.log(
        `Execution time: ADD NEW MESSAGE | START - ${Date.now() - start} ms`
      );
      const added_message = await tx
        .insert(message)
        .values({
          content,
          ticket_id,
          timestamp,
          id,
          role: "user",
        })
        .returning();

      console.log(
        `Execution time: ADD NEW MESSAGE | END - ${Date.now() - start} ms`
      );
      return { added_message, messageTx: tx };
    });

    let added_message_ai = null;

    try {
      console.log(
        `Execution time: GET AI RESPONSE | START - ${Date.now() - start} ms`
      );
      const ai_response = await get_ai_response({ ticket_id });

      console.log(
        `Execution time: GET AI RESPONSE | END - ${Date.now() - start} ms`
      );

      console.log("AI RESPONSE_>_>_>_>__>", ai_response);

      added_message_ai = await db
        .insert(message)
        .values({
          content: ai_response.result ?? "",
          ticket_id,
          role: "ai",
        })
        .returning();

      console.log(
        `Execution time: ADD AI MESSAGE TO DB - ${Date.now() - start} ms`
      );
    } catch (err) {
      await messageTx.rollback();
    }

    if (newTicket !== null)
      return { added_message, added_message_ai, newTicket };
    return { added_message, added_message_ai, newTicket: undefined };
  } catch (err) {
    throw err;
  }
}

async function get_ai_response({ ticket_id }: { ticket_id: string }) {
  try {
    const ticket = await get_ticket(ticket_id);

    console.log("TICKETM ESKMSAKMDASLKMD ZXCSEA>_>_>_>__>", {
      ticket,
      messages: ticket?.messages,
    });

    const parsed_messages = ticket?.messages
      .map((message) => {
        return `${message.role === "ai" ? "AI" : "User"}: ${message.content}`;
      })
      .join("\n");

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

    /* const res: { output: string } = await ky(
      `${server_env.LANGCHAIN_SERVER_URL}/chat/invoke`,
      {
        method: "post",
        json: { input: { input: INPUT } },
      }
    ).json(); */
    console.log({ INPUT });
    const chain = new RemoteRunnable({
      url: server_env.LANGCHAIN_SERVER_URL + "/chat",
    });

    let result = (await chain.invoke({
      input: INPUT,
    })) as string;

    console.log("RESULT_>_>_", result);

    console.log({ result });

    return { result };

    /*  console.log({ res });

    return { result: res.output }; */
  } catch (err: any) {
    console.log("ERROR IN GET AI RESPONSE", { err });
    throw err.message;
  }
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
  try {
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
    const added_message = await db
      .insert(message)
      .values({
        content,
        ticket_id: ticket_id,
        role: "user",
        timestamp,
        id: id,
      })
      .returning();
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

    console.log({ added_message, added_ticket, added_message_ai });
    return { added_ticket };
  } catch (err) {
    console.log(err);
  }
}
