export interface ApiResponse<TData> {
  statusCode: number
  message: string
  data: TData
  pagination?: Pagination
}

export interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}
