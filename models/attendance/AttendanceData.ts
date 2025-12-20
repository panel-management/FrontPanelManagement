export interface AttendanceData {
  userId: number;
  fullName: string;
  role: string;
  status: AttendanceStatus;
  belt?: string;
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  EXCUSED = "EXCUSED",
}
