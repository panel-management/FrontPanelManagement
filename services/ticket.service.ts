import type { CreateTicket } from '~/models/ticket/CreateTicket'
import type { SendMassage } from '~/models/ticket/SendMassage'
import { TicketStatus } from '~/models/ticket/TicketData'

export const getTicketMasterService = (page: number, limit: number) => {
  return FetchApi(`/tickets?page=${page}&limit=${limit}`)
}

export const getTicketAdminService = (page: number, limit: number) => {
  return FetchApi(`/tickets/admin/all?page=${page}&limit=${limit}`)
}

export const getTicketByIdService = (id: string) => {
  return FetchApi(`/tickets/${id}`)
}

export const changeStatusTicketService = (id: string) => {
  return FetchApi(`/tickets/${id}/status`, {
    method: 'PUT',
    body: { status: TicketStatus.CLOSED },
  })
}

export const createTicketService = (data: CreateTicket) => {
  return FetchApi('/tickets', {
    method: 'POST',
    body: data,
  })
}

export const sendMessageService = (id: string, data: SendMassage) => {
  return FetchApi(`/tickets/${id}/message`, {
    method: 'POST',
    body: data,
  })
}
