import type { Belt } from '~/models/sportAndBelt/belt'
import type { Sport } from '~/models/sportAndBelt/sport'
import type { TransactionStatus } from '~/models/transactions/TransactionStatus'

export interface GetStudentData {
  user: StudentData
}

export interface StudentData {
  user_id: number
  fullName: string
  phoneNumber: string
  isActive: boolean
  studentTransactions: TransactionStatus
  currentBelt: Belt
  achievedBelts: Belt
  sport: Sport
  createdAt: string
  updatedAt: string
}
