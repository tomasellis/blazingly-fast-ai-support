export type Tickets = Ticket[];

export type Ticket = {
  id: string;
  name: string;
  status: "read" | "closed" | "pending";
  messages: Messages;
};

export type Messages = Message[];

export type Message = {
  text: string;
  timestamp: string;
  role: "user" | "AI";
  id: string;
  username: string;
  embed: string | null;
};
/**
 * name: "",
 * id: "",
 * status: "",
 * chat [
 *      messages
 * ]
 */
