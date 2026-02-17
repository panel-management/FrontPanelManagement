import { defineStore } from 'pinia'
import type { DataUsers } from '~/models/users/dataUsers'
import { getDataUserService } from '~/services/users.service'

export const useRolesStore = defineStore('role', () => {
  const detailUser = ref<DataUsers | null>(null)
  const isBanned: Ref<boolean> = ref(false)

  async function getDetailUser() {
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
    }
  }

  return { detailUser, getDetailUser, isBanned }
})
