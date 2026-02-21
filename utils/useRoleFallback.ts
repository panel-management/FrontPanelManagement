import { Role } from '~/models/Role'

export const fallbackByRole: Record<Role, string> = {
  [Role.Admin]: '/dashboard/admin',
  [Role.Master]: '/dashboard',
  [Role.Coach]: '/profile/coach',
  [Role.Student]: '/profile/student',
}
