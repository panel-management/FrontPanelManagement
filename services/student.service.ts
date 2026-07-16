import type { CreateStudent } from '~/models/users/student/CreateStudent'
import type { GetStudentData } from '~/models/users/student/StudentData'
import type { StudentListData } from '~/models/users/student/StudentListData'
import type { UpdateStudent } from '~/models/users/student/UpdateStudent'

export const getAllStudentService = (page: number, limit: number) => {
  return FetchApi<GetStudentData>(`/student?page=${page}&limit=${limit}`)
}

export const getStudentForEquipmentService = () => {
  return FetchApi('/student')
}

export const getProfileStudentService = () => {
  return FetchApi<StudentListData>('/student/profile')
}

export const getStudentByIdService = (id: number) => {
  return FetchApi(`/student/profile/${id}`)
}

export const createStudentService = (data: CreateStudent) => {
  return FetchApi('/student', {
    method: 'POST',
    body: data,
  })
}

export const updateStudentService = (data: UpdateStudent) => {
  return FetchApi(`/student/update/profile`, {
    method: 'PATCH',
    body: data,
  })
}

export const updateStudentByMasterService = (id: number, data: UpdateStudent) => {
  return FetchApi(`/student/update/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

export const changeStatusStudentService = (id: number, isActive: boolean) => {
  return FetchApi(`/student/changeStatus/${id}`, {
    method: 'PUT',
    body: { isActive },
  })
}

export const deleteStudentService = (id: number) => {
  return FetchApi(`/student/${id}`, {
    method: 'DELETE',
  })
}
