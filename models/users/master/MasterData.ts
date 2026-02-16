import type { Sport } from '~/models/sportAndBelt/sport'
import type { PaymentStatus } from '~/models/PaymentStatus'

export interface MasterData {
  user_id: number
  type: number
  studentCount: number
  fullName: string
  nationalCode: string
  phoneNumber: string
  history: string
  isActive: boolean
  sport: Sport
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}
