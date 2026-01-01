import type { StudentData } from '../users/student/StudentData'
import type { AttendanceStatus } from './AttendanceData'

export interface AttendanceListData {
  report: AttendanceReport[]
  summary: AttendanceSummary
  sessions: AttendanceSessions
}

export interface AttendanceReport {
  id: number
  status: AttendanceStatus
  date: string
  createdAt: string
  student: StudentData
}

export interface AttendanceSummary {
  PRESENT: number
  ABSENT: number
  LATE: number
  EXCUSED: number
}

export interface AttendanceSessions {
  totalSessions: number
  sessions: string[]
}

export enum AttendancePeriod {
  today = 'today',
  week = 'week',
  month = 'month',
}
