import type { MasterPlanData } from '~/models/plan/masterPlan/MasterPlanData'
import type { SubscriptionListData } from '~/models/Payments/Subscriptions/SubscriptionListData'
import type { Count } from '~/models/Count'
import type { MasterData } from './MasterData'

export interface MasterListData extends Omit<MasterData, 'paymentStatus' | 'studentCount'> {
  age: number
  birthDate: string
  certificates: string
  masterPlan: MasterPlanData
  _count: Count
  subscriptionPayments: SubscriptionListData[]
}
