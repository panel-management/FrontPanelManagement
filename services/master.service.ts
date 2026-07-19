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
  return FetchApi(`/master/profile/${id}`)
}

// get data yourself just master
export const getMasterByIdService = () => {
  return FetchApi<MasterListData>('/master/profile')
}

// update profile just yourself master
export const updateProfileMasterService = (data: UpdateMaster) => {
  return FetchApi<UpdateMaster>('/master/update/profile', {
    method: 'PATCH',
    body: data,
  })
}

// update profile master just yourself admin
export const updateProfileMasterJustAdminService = (id: number, data: UpdateMaster) => {
  return FetchApi<UpdateMaster>(`/master/update/${id}`, {
    method: 'PATCH',
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
