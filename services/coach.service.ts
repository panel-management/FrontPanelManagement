import type { CreateCoach } from "~/models/users/coach/CreateCoach";
import type { UpdateCoach } from "~/models/users/coach/UpdateCoach";

export const getAllCoachService = () => {
  return FetchApi("/coach");
};

export const getCoachByIdService = (id: number) => {
  return FetchApi(`/coach/${id}`);
};

export const createCoachService = (coach: CreateCoach) => {
  let data = new FormData();
  data.append("fullName", coach.fullName);
  data.append("phoneNumber", coach.phoneNumber);
  data.append("nationalCode", coach.nationalCode);
  data.append("birthDate", coach.birthDate.toString());
  data.append("age", coach.age.toString());
  data.append("history", coach.history);
  data.append("certificates", coach.certificates);
  if (coach.imageFile) {
    data.append("imageFile", coach.imageFile);
  }
  return FetchApi("/coach", {
    method: "POST",
    body: data,
  });
};

export const updateCoachService = (id: number, coach: UpdateCoach) => {
  let data = new FormData();
  data.append("fullName", coach.fullName);
  data.append("phoneNumber", coach.phoneNumber);
  data.append("nationalCode", coach.nationalCode);
  data.append("birthDate", coach.birthDate.toString());
  data.append("age", coach.age.toString());
  data.append("history", coach.history);
  data.append("certificates", coach.certificates);
  if (coach.imageFile) {
    data.append("imageFile", coach.imageFile);
  }
  return FetchApi(`/coach/${id}`, {
    method: "PUT",
    body: data,
  });
};

export const changeStatusCoachService = (id: number, active: string) => {
  return FetchApi(`/coach/changeStatus/${id}`, {
    method: "PUT",
    body: { active },
  });
};
export const deleteCoachService = (id: number) => {
  return FetchApi(`/coach/${id}`, {
    method: "DELETE",
  });
};
