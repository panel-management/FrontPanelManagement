export interface DashboardMasterResponse {
  statusData: StatusData
  chartData: ChartData[]
  cards: CardsData
}

export interface StatusData {
  paid: number
  unpaid: number
  pending: number
  upcoming: number
  counts: Counts
}

export interface Counts {
  unpaid: number
  pending: number
  upcoming: number
}

export interface ChartData {
  name: string
  value: number
}

export interface CardsData {
  totalStudents: number
  totalCoaches: number
  currentMonthRevenue: number
  openTickets: number
}
