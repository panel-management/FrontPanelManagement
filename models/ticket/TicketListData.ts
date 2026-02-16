import type { DataUsers } from '../users/dataUsers'
import type { TicketCategory, TicketPriority, TicketStatus } from './TicketData'

export interface TicketListData {
  id: string
  title: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  messages: Message[]
  user: DataUsers
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: number
  text: string
  sender: Sender
  ticketId: string
  senderId: number
  createdAt: string
}

export interface Sender extends DataUsers {}
