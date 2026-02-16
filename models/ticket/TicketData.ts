import type { DataUsers } from '../users/dataUsers'

export interface TicketData {
  id: string
  title: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  user: DataUsers
}

export interface TicketStats {
  total: number
  open: number
  pending: number
  highPriority: number
}

export enum TicketCategory {
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
  FINANCIAL_AFFAIRS = 'FINANCIAL_AFFAIRS',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  GENERAL = 'GENERAL',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
