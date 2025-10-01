import type { UpdateMasterData } from "~/models/users/master/UpdateMasterData";

// get All Master just Admin
export const getAllMasterService = () => {
  return FetchApi("/master");
};

// get master by id just admin
export const getMasterByIdForAdminService = (id: number) => {
  return FetchApi(`/master/${id}`);
};

// get data yourself just master
export const getMasterByIdService = () => {
  return FetchApi("/master/details");
};

// update profile just yourself master
export const updateProfileMasterService = (master: UpdateMasterData) => {
  let data = new FormData();
  data.append("fullName", master.fullName);
  data.append("phoneNumber", master.phoneNumber);
  data.append("nationalCode", master.nationalCode);
  data.append("age", master.age);
  data.append("birthDate", master.birthDate);
  data.append("history", master.history);
  data.append("certificates", master.certificates);
  if (master.imageFile) {
    data.append("imageFile", master.imageFile);
  }
  return FetchApi<UpdateMasterData>("/master/update/details", {
    method: "PUT",
    body: data,
  });
};

// update profile master just yourself admin
export const updateProfileMasterJustAdminService = (id: number, master: UpdateMasterData)=>{
  let data = new FormData();
  data.append("fullName", master.fullName);
  data.append("phoneNumber", master.phoneNumber);
  data.append("nationalCode", master.nationalCode);
  data.append("age", master.age);
  data.append("birthDate", master.birthDate);
  data.append("history", master.history);
  data.append("certificates", master.certificates);
  data.append("sportId", master.sportId.toString());
  if (master.imageFile) {
    data.append("imageFile", master.imageFile);
  }
  return FetchApi<UpdateMasterData>(`/master/update/${id}`, {
    method: "PUT",
    body: data
  })
}

// change status account master just admin
export const changeStatusMasterService = (id: number, active: string) => {
  return FetchApi(`/master/changeStatus/${id}`, {
    method: "PUT",
    body: { active },
  });
};

// delete account master just admin
export const deleteMasterService = (id: number) => {
  return FetchApi(`/master/${id}`, {
    method: "DELETE",
  });
};
