import type {Active} from "~/models/Active";
import type {PaymentStatus} from "~/models/PaymentStatus";

export const GetStatusAccountUsers = (position: Active) => {
    switch (position) {
        case 0:
            return 'فعال'
        case 1:
            return 'غیر فعال'
        default:
            return "";
    }
}

export const GetStatusPaymentUsers = (position: PaymentStatus) => {
    switch (position) {
        case 0:
            return 'در انتظار پرداخت'
        case 1:
            return 'پرداخت شده'
        case 2:
            return 'پرداخت نشده'
        default:
            return "";
    }
}