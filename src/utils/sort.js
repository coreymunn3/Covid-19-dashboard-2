export const sortCountriesByCases = (data) => {
  const sortedData = data.sort((a, b) => {
    if (a.cases < b.cases) return 1;
    else return -1;
  });
  return sortedData;
};

export const sortDates = (datesArr) => {
  const sortedDates = datesArr.sort((a, b) => {
    if (new Date(a) < new Date(b)) return 1;
    else return -1;
  });
  return sortedDates;
};
