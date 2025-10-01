import type {Sport} from "~/models/sportAndBelt/sport";
import type {Active} from "~/models/Active";
import type {PaymentStatus} from "~/models/PaymentStatus";

export interface MasterData {
    user_id: number
    type: number
    fullName: string
    nationalCode: string
    phoneNumber: string
    history: string
    image: any
    active: Active
    certificates: string
    masterPlanId: string
    sport: Sport
    students: any[]
    subscriptionPayments: any[]
    paymentStatus: PaymentStatus
    createdAt: string
    updatedAt: string
}