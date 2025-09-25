import type {Sport} from "~/models/sportAndBelt/sport";
import type {Active} from "~/models/Active";
import type {PaymentStatus} from "~/models/PaymentStatus";

export interface MasterData {
    user_id: number
    fullName: string
    nationalCode: string
    phoneNumber: string
    history: string
    image: any
    active: Active
    sport: Sport
    students: any[]
    subscriptionPayments: any[]
    paymentStatus: PaymentStatus
    createdAt: string
    updatedAt: string
}