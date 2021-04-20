export const sortCountriesByMeasure = (data, measure) => {
  const sortedData = data.sort((a, b) => {
    if (a[measure] < b[measure]) return 1;
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
