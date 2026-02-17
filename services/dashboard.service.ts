import type { DashboardAdminResponse } from '~/models/dashboard/DashboardAdmin'
import type { DashboardMasterResponse } from '~/models/dashboard/DashboardMaster'

export const getDashboardDataMasterService = () => {
  return FetchApi<DashboardMasterResponse>('/financials/dashboard/master')
}

export const getDashboardDataAdminService = () => {
  return FetchApi<DashboardAdminResponse>('/financials/dashboard/admin')
}
