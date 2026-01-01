export interface StudentPlanData {
  id: number
  name: string
  description: string
  durationInDays: number
  price: string
  isDefault: boolean
  transactions: any[]
  assignedUsers: any[]
  createdAt: string
}
