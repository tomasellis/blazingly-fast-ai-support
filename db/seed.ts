import { nanoid } from "ai";
import { db } from "./db";
import { message, ticket } from "./schema";

(async function seed() {
  await db.transaction(async (tx) => {
    const first_ticket = "aca";
    const second_ticket = nanoid();

    await tx
      .insert(ticket)
      .values([
        { id: first_ticket, status: false, description: "Assistance Needed." },
      ]);

    const msgs = Array.from({ length: 200 }, (_, i) => {
      return {
        content: i.toString(),
        ticket_id: first_ticket,
        role: i % 2 === 0 ? ("user" as const) : ("ai" as const),
        timestamp: new Date(2024, 0, 1, 0, i),
      };
    });

    for (const msg of msgs) {
      await tx.insert(message).values(msg);
    }

    await tx
      .insert(ticket)
      .values([{ id: second_ticket, status: false, description: "How do I?" }]);

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
