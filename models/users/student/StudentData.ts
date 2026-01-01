import type { Active } from '~/models/Active'
import type { Belt } from '~/models/sportAndBelt/belt'
import type { Sport } from '~/models/sportAndBelt/sport'
import type { TransactionStatus } from '~/models/transactions/TransactionStatus'

export interface StudentData {
  user_id: number
  fullName: string
  phoneNumber: string
  active: Active
  studentTransactions: TransactionStatus
  currentBelt: Belt
  achievedBelts: Belt
  sport: Sport
  createdAt: string
  updatedAt: string
}
