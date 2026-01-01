import { defineStore } from 'pinia'
import { getStatusPlanService } from '~/services/users.service'

export type PlanStatus = {
  isActive: boolean
  isAdmin: boolean
  isPending: boolean
  isExpired: boolean
  noPlan: boolean
  needsPayment: boolean
  userType: string
  message: string
  statusCode: number
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    planStatus: null as PlanStatus | null,
    planStatusLoaded: false,
  }),
  getters: {
    hasFullAccess: (state) => state.planStatus?.isActive === true,
  },
  actions: {
    async getStatusPlanUsers() {
      try {
        const result = await getStatusPlanService()
        this.planStatus = result
        this.planStatusLoaded = true
        return result
      } catch (error: any) {
        console.log(error.message || error)
        this.planStatusLoaded = true
        return null
      }
    },
  },
})
