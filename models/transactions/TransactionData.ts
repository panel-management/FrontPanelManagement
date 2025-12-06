import type { StudentPlanData } from "../plan/studentPlan/StudentPlanData";
import type { StudentData } from "../users/student/StudentData";
import type { PaymentMethodStatus } from "./PaymentMethodStatus";
import type { TransactionStatus } from "./TransactionStatus";
import type { TransactionType } from "./TransactionType";

export interface TransactionData {
  id: number;
  amount: string;
  description: string;
  dueDate: string;
  paymentDate: string;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: PaymentMethodStatus;
  student: StudentData;
  plan: StudentPlanData;
  createdAt: string;
  updatedAt: string;
}

export interface GeneralSum {
  totalAmount: number;
  paidFees: number;
  unpaidFees: number;
  equipmentIncome: number;
}
