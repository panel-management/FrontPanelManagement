import type { CoachListData } from '~/models/users/coach/CoachListData'
import type { CreateCoach } from '~/models/users/coach/CreateCoach'
import type { UpdateCoach } from '~/models/users/coach/UpdateCoach'

export const getAllCoachService = () => {
  return FetchApi('/coach')
}

export const getCoachProfileService = () => {
  return FetchApi<CoachListData>('/coach/profile')
}

export const getCoachByIdService = (id: number) => {
  return FetchApi(`/coach/profile/${id}`)
}

export const createCoachService = (data: CreateCoach) => {
  return FetchApi('/coach', {
    method: 'POST',
    body: data,
  })
}

export const updateCoachProfileService = (data: UpdateCoach) => {
  return FetchApi('/coach/update/profile', {
    method: 'PATCH',
    body: data,
  })
}

export const updateCoachService = (id: number, data: UpdateCoach) => {
  return FetchApi(`/coach/update/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

export const changeStatusCoachService = (id: number, isActive: boolean) => {
  return FetchApi(`/coach/changeStatus/${id}`, {
    method: 'PUT',
    body: { isActive },
  })
}
export const deleteCoachService = (id: number) => {
  return FetchApi(`/coach/${id}`, {
    method: 'DELETE',
  })
}
