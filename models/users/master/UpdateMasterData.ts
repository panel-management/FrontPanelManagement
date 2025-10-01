import type { Sport } from "~/models/sportAndBelt/sport";

export interface UpdateMasterData {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  age: string;
  birthDate: string;
  history: string;
  certificates: string;
  sport: Sport;
  sportId: number;
  imageFile?: File;
  imageUrl?: string;
}
