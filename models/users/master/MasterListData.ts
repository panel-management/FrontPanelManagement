import type { Sport } from '~/models/sportAndBelt/sport'
import type { MasterPlanData } from '~/models/plan/masterPlan/MasterPlanData'
import type { StudentData } from '../student/StudentData'
import type { SubscriptionListData } from '~/models/Payments/Subscriptions/SubscriptionListData'

export interface MasterListData {
  user_id: number
  type: number
  fullName: string
  phoneNumber: string
  nationalCode: string
  isActive: boolean
  age: number
  birthDate: string
  history: string
  certificates: string
  masterPlan: MasterPlanData
  sport: Sport
  students: StudentData
  subscriptionPayments: SubscriptionListData[]
  createdAt: string
  updatedAt: string
}
