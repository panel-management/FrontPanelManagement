export interface CreateCoach {
  fullName: string
  nationalCode: string
  phoneNumber: string
  birthDate: Date | string
  age: number
  history: string
  certificates: string
  imageFile?: File
}
