import type { Role } from '../Role'
import type { Sport } from '../sportAndBelt/sport'

export interface DataUsers {
  user_id: number
  type: Role
  fullName: string
  sport: Sport
}
