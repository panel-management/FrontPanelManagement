import type { CreateStudent } from "~/models/users/student/CreateStudent";
import type { UpdateStudent } from "~/models/users/student/UpdateStudent";

export const getAllStudentService = () => {
  return FetchApi("/student");
};

export const getStudentByIdService = (id: number) => {
  return FetchApi(`/student/${id}`);
};

export const createStudentService = (data: CreateStudent) => {
  return FetchApi("/student", {
    method: "POST",
    body: data,
  });
};

export const updateStudentService = (id: number, data: UpdateStudent) => {
  return FetchApi(`/student/${id}`, {
    method: "PUT",
    body: data,
  });
};

export const deleteStudentService = (id: number) => {
  return FetchApi(`/student/${id}`, {
    method: "DELETE",
  });
};
