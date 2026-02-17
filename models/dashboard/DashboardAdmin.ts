export interface DashboardAdminResponse {
  statusData: StatusData
}

export interface StatusData {
  pendingRevenue: number
  confirmedRevenue: number
  rejectRevenue: number
  counts: Counts
}

export interface Counts {
  pendingCount: number
  confirmedCount: number
  rejectCount: number
}
