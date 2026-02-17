import type { PaymentStatus } from '~/models/PaymentStatus'
import { TicketCategory, TicketPriority, TicketStatus } from '~/models/ticket/TicketData'
import { TransactionStatus } from '~/models/transactions/TransactionStatus'

export const categorySelect = [
  { label: 'عمومی', value: TicketCategory.GENERAL },
  { label: 'درخواست ویژگی', value: TicketCategory.FEATURE_REQUEST },
  { label: 'امور مالی', value: TicketCategory.FINANCIAL_AFFAIRS },
  { label: 'مشکل فنی', value: TicketCategory.TECHNICAL_ISSUE },
]

export const prioritySelect = [
  { label: 'کم', value: TicketPriority.LOW },
  { label: 'متوسط', value: TicketPriority.MEDIUM },
  { label: 'زیاد', value: TicketPriority.HIGH },
]

export const statusSelect = [
  { label: 'باز', value: TicketStatus.OPEN },
  { label: 'بسته', value: TicketStatus.CLOSED },
  { label: 'در انتظار', value: TicketStatus.PENDING },
  { label: 'حل شده', value: TicketStatus.RESOLVED },
]

export const paymentStatusText: Record<PaymentStatus, string> = {
  NO_PAYMENT: 'پرداخت وجود ندارد',
  CONFIRMED: 'پرداخت شده',
  PENDING: 'در انتظار پرداخت',
  REJECTED: 'پرداخت نشده',
}

export const paymentIcon: Record<PaymentStatus, string> = {
  CONFIRMED: 'clarity:success-standard-line',
  PENDING: 'solar:shield-warning-bold',
  REJECTED: 'codicon:error',
  NO_PAYMENT: 'bi:emoji-neutral-fill',
}

export const paymentIconColor: Record<PaymentStatus, string> = {
  CONFIRMED: 'text-success',
  PENDING: 'text-warning',
  REJECTED: 'text-error',
  NO_PAYMENT: 'text-gray-500',
}

export const paymentIconBadge: Record<PaymentStatus, string> = {
  CONFIRMED: 'primary',
  PENDING: 'warning',
  REJECTED: 'error',
  NO_PAYMENT: 'neutral',
}

export const activeLabels: Record<string, string> = {
  true: 'فعال',
  false: 'غیر فعال',
}

export const transactionStatusLabel: Record<TransactionStatus, string> = {
  [TransactionStatus.PAID]: 'پرداخت شده',
  [TransactionStatus.PENDING]: 'در انتظار پرداخت',
  [TransactionStatus.UNPAID]: 'پرداخت نشده',
  [TransactionStatus.UPCOMING]: 'آینده',
}

export function getBeltClass(color: string) {
  const colorMap: Record<string, string> = {
    سفید: 'belt-white',
    خاکستری: 'belt-gray',
    زرد: 'belt-yellow',
    نارنجی: 'belt-orange',
    سبز: 'belt-green',
    آبی: 'belt-blue',
    بنفش: 'belt-purple',
    قهوه‌ای: 'belt-brown',
    قرمز: 'belt-red',
    'قرمز/سیاه': 'belt-red-black',
    'قرمز/سفید': 'belt-red-white',
    مشکی: 'belt-black',
    صورتی: 'belt-pink',
    طلایی: 'belt-gold',
    نقره‌ای: 'belt-silver',
  }
  return colorMap[color]
}
