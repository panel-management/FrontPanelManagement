// get data user
export const getDataUserService = () => {
  return FetchApi('/users')
}

// get status plan users
export const getStatusPlanService = () => {
  return FetchApi('/users/plan/status')
}
