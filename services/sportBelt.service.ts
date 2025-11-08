export const getAllSportService = () => {
  return FetchApi("/sport-belt/sport");
};

export const getAllBeltService = () => {
  return FetchApi("/sport-belt/belt");
};
