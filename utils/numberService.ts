export const calculatePercentile = (rank: number, total: number): number => {
  return parseInt((((total - rank) / total) * 100).toFixed(2));
};
