import { nanoid } from "ai";
import { db } from "./db";
import { message, ticket } from "./schema";

(async function seed() {
  await db.transaction(async (tx) => {
    const first_ticket = nanoid();
    const second_ticket = nanoid();

    await tx
      .insert(ticket)
      .values([{ id: first_ticket, status: false, description: "It's dead" }]);
    await tx
      .insert(ticket)
      .values([
        { id: second_ticket, status: false, description: "It's almost dead" },
      ]);

    await tx.insert(message).values([
      {
        content: "Sup' boss, what needs helping?",
        ticket_id: first_ticket,
        role: "ai",
      },
    ]);

    await tx.insert(message).values([
      {
        content: "Sup' boss, what needs helping?",
        ticket_id: second_ticket,
        role: "ai",
      },
    ]);

    await tx.insert(message).values([
      {
        content: "It ain't working bub",
        ticket_id: second_ticket,
        role: "user",
      },
    ]);

    await tx.insert(message).values([
      {
        content: "Aight, we'll get back to you square",
        ticket_id: second_ticket,
        role: "ai",
      },
    ]);
  });
})();
