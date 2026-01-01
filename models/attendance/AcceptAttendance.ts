import type { AttendanceStatus } from './AttendanceData'

export interface AcceptAttendance {
  attendances: Attendance[]
}

export interface Attendance {
  studentId: number
  status?: AttendanceStatus
}
