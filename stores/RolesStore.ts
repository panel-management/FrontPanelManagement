import { defineStore } from 'pinia'
import type { DataUsers } from '~/models/users/dataUsers'
import { getDataUserService } from '~/services/users.service'

export const useRolesStore = defineStore('role', () => {
  const detailUser = ref<DataUsers | null>(null)

  async function getDetailUser() {
    try {
      const result = await getDataUserService()
      if (result.statusCode === 200) {
        detailUser.value = result.data as DataUsers
      }
    } catch (error: any) {
      console.log(error.message || error)
    }
  }

  return { detailUser, getDetailUser }
})
