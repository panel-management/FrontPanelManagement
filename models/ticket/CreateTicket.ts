import type { TicketCategory, TicketPriority } from "./TicketData";

export interface CreateTicket {
  title: string;
  text: string;
  category: TicketCategory;
  priority: TicketPriority;
}
