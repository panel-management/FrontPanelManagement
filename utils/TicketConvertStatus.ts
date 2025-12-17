import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "~/models/ticket/TicketData";

export const categorySelect = [
  { label: "عمومی", value: TicketCategory.GENERAL },
  { label: "درخواست ویژگی", value: TicketCategory.FEATURE_REQUEST },
  { label: "امور مالی", value: TicketCategory.FINANCIAL_AFFAIRS },
  { label: "مشکل فنی", value: TicketCategory.TECHNICAL_ISSUE },
];

export const prioritySelect = [
  { label: "کم", value: TicketPriority.LOW },
  { label: "متوسط", value: TicketPriority.MEDIUM },
  { label: "زیاد", value: TicketPriority.HIGH },
];

export const statusSelect = [
  { label: "باز", value: TicketStatus.OPEN },
  { label: "بسته", value: TicketStatus.CLOSED },
  { label: "در انتظار", value: TicketStatus.PENDING },
  { label: "حل شده", value: TicketStatus.RESOLVED },
];
