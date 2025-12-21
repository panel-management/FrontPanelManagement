export interface UpdateStudent {
  fullName: string;
  nationalCode: string;
  age: number;
  birthDate: string;
  phoneNumber: string;
  phoneNumberEmergency: string;
  address: string;
  underSupervisionDoctor: boolean;
  diseaseRecords: boolean;
  beltIds: number[];
  planId: number;
}
