import type { Active } from "~/models/Active";
import type { StudentPlanData } from "~/models/plan/studentPlan/StudentPlanData";
import type { Belt } from "~/models/sportAndBelt/belt";
import type { Sport } from "~/models/sportAndBelt/sport";
import type { TransactionData } from "~/models/transactions/TransactionData";

export interface StudentListData {
  fullName: string;
  phoneNumber: string;
  phoneNumberEmergency: string;
  nationalCode: string;
  address: string;
  age: number;
  birthDate: string;
  diseaseRecords: boolean;
  underSupervisionDoctor: boolean;
  active: Active;
  assignedPlan: StudentPlanData;
  achievedBelts: Belt;
  currentBelt: Belt;
  sport: Sport;
  studentTransactions: TransactionData[];
  type: number;
  masterId: number;
  createdAt: string;
  updatedAt: string;
}
