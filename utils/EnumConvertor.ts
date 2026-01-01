import { TypePlan } from '~/models/plan/masterPlan/MasterPlanData'

export const GetTypePlanMaster = (position: TypePlan) => {
  switch (position) {
    case TypePlan.PAID:
      return 'پولی'
    case TypePlan.TRIAL:
      return 'رایگان'
    default:
      return ''
  }
}
