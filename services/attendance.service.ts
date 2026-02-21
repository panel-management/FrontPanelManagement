import type { AcceptAttendance } from '~/models/attendance/AcceptAttendance'
import type { AttendanceListData } from '~/models/attendance/AttendanceListData'

export const acceptListAttendanceService = (data: AcceptAttendance) => {
  return FetchApi(`/attendance/mark`, {
    method: 'POST',
    body: data,
  })
}

export const getListAttendanceService = (page: number, limit: number) => {
  return FetchApi(`/attendance/list?page=${page}&limit=${limit}`)
}

// export const getAttendanceReportService = (page: number, limit: number, period?: AttendancePeriod) => {
//   let url = `/attendance/report?page=${page}&limit=${limit}`;
//   if (period) {
//     url += `&period=${period}`;
//   }
//   return FetchApi(url);
// };

export const getAttendanceReportService = (page: number, limit: number, period?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (period) {
    params.append('period', period)
  }
  return FetchApi<AttendanceListData>(`/attendance/report?${params.toString()}`)
}
