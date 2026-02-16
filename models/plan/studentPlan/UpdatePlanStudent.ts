import type { CreatePlanStudent } from './CreatePlanStudent'

export interface UpdatePlanStudent extends Omit<CreatePlanStudent, 'isDefault'> {}
