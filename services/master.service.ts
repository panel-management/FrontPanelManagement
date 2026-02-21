import type { MasterListData } from '~/models/users/master/MasterListData'
import type { UpdateMaster } from '~/models/users/master/UpdateMaster'

// get All Master just Admin
export const getAllMasterService = () => {
  return FetchApi('/master')
}

// get history subscriptions master
export const getHistorySubscriptionsMasterService = () => {
  return FetchApi('/financials/subscriptions/history')
}

// select plan just your self master
export const selectPlanYourSelfMasterService = (planId: number) => {
  return FetchApi('/master/my-plan', {
    method: 'PUT',
    body: { planId },
  })
}

// get master by id just admin
export const getMasterByIdForAdminService = (id: number) => {
  return FetchApi(`/master/${id}`)
}

// get data yourself just master
export const getMasterByIdService = () => {
  return FetchApi<MasterListData>('/master/details')
}

// update profile just yourself master
export const updateProfileMasterService = (master: UpdateMaster) => {
  let data = new FormData()
  data.append('fullName', master.fullName)
  data.append('phoneNumber', master.phoneNumber)
  data.append('nationalCode', master.nationalCode)
  data.append('age', master.age.toString())
  data.append('birthDate', master.birthDate)
  data.append('history', master.history)
  data.append('certificates', master.certificates)
  if (master.imageFile) {
    data.append('imageFile', master.imageFile)
  }
  return FetchApi<UpdateMaster>('/master/update/details', {
    method: 'PUT',
    body: data,
  })
}

// update profile master just yourself admin
export const updateProfileMasterJustAdminService = (id: number, master: UpdateMaster) => {
  let data = new FormData()
  data.append('fullName', master.fullName)
  data.append('phoneNumber', master.phoneNumber)
  data.append('nationalCode', master.nationalCode)
  data.append('age', master.age.toString())
  data.append('birthDate', master.birthDate)
  data.append('history', master.history)
  data.append('certificates', master.certificates)
  data.append('sportId', master.sportId.toString())
  if (master.imageFile) {
    data.append('imageFile', master.imageFile)
  }
  return FetchApi<UpdateMaster>(`/master/update/${id}`, {
    method: 'PUT',
    body: data,
  })
}

// change status account master just admin
export const changeStatusMasterService = (id: number, isActive: boolean) => {
  return FetchApi(`/master/changeStatus/${id}`, {
    method: 'PUT',
    body: { isActive },
  })
}

// delete account master just admin
export const deleteMasterService = (id: number) => {
  return FetchApi(`/master/${id}`, {
    method: 'DELETE',
  })
}
