import type { Role } from '../Role'
import type { Sport } from '../sportAndBelt/sport'

export interface DataUsers {
  user_id: number
  fullName: string
  type: Role
  sport: Sport
}
