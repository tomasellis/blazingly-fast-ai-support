import { nanoid } from "ai";
import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";
import { customType } from "drizzle-orm/sqlite-core";

const properDate = customType<{
  data: Date;
  driverData: number;
}>({
  dataType() {
    return `integer`;
  },
  fromDriver(value: number): Date {
    return new Date(value);
  },
  toDriver(date: Date): number {
    return date.valueOf();
  },
});

export const ticket = sqliteTable("ticket", {
  id: text("id").primaryKey(),
  status: integer("status", { mode: "boolean" }).notNull().default(false),
  description: text("description").notNull(),
  timestamp: properDate("timestamp", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const ticket_relations = relations(ticket, ({ many }) => ({
  messages: many(message),
}));

export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey().$defaultFn(nanoid),
    ticket_id: text("ticket_id")
      .notNull()
      .references(() => ticket.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    role: text("role", { enum: ["ai", "user"] }),

    timestamp: properDate("timestamp", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => {
    return {
      timestamp_idx: index("timestamp_idx").on(table.timestamp),
      ticket_id_idx: index("ticket_id_idx").on(table.ticket_id),
    };
  }
);

export const message_relations = relations(message, ({ one }) => ({
  ticket: one(ticket, {
    fields: [message.ticket_id],
    references: [ticket.id],
  }),
}));
