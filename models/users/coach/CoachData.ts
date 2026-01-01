import type { Active } from '~/models/Active'
import type { Sport } from '~/models/sportAndBelt/sport'

export interface CoachData {
  user_id: number
  fullName: string
  nationalCode: string
  phoneNumber: string
  birthDate: Date | string
  age: number
  history: string
  certificates: string
  image: string
  active: Active
  type: number
  sport: Sport
  createdAt: string
  updatedAt: string
}
