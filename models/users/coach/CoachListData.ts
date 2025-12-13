import type { Sport } from "~/models/sportAndBelt/sport";

export interface CoachListData {
  user_id: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  birthDate: string;
  age: number;
  history: string;
  certificates: string;
  image: string;
  active: string;
  type: number;
  sport: Sport;
  createdAt: string;
  updatedAt: string;
}
