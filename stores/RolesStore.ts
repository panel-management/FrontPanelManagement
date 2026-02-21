import { defineStore } from 'pinia'
import type { DataUsers } from '~/models/users/dataUsers'
import { getDataUserService } from '~/services/users.service'

export const useRolesStore = defineStore('role', () => {
  const detailUser = ref<DataUsers | null>(null)
  const isLoading: Ref<boolean> = ref(false)
  const isBanned: Ref<boolean> = ref(false)

  async function getDetailUser() {
    if (detailUser.value) return
    isLoading.value = true
    try {
      const result = await getDataUserService()
      if (result.statusCode === 200) {
        detailUser.value = result.data as DataUsers
        isBanned.value = false
      } else if (result.statusCode === 403) {
        isBanned.value = true
      }
    } catch (error: any) {
      console.log(error.message || error)
    } finally {
      isLoading.value = false
    }
  }

  return { detailUser, getDetailUser, isBanned, isLoading }
})
