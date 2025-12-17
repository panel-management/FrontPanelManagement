import type { DataUsers } from "../users/dataUsers";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "./TicketData";

export interface TicketListData {
  id: number;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  messages: Message[];
  user: DataUsers;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  text: string;
  sender: Sender;
  ticketId: number;
  senderId: number;
  createdAt: string;
}

export interface Sender {
  user_id: number;
  fullName: string;
  type: number;
}
