export const calculatePercentile = (rank: number, total: number): number => {
  if (total === rank) return 100;
  if (rank === 1) return 100;
  return parseInt((((total - rank) / total) * 100).toFixed(2));
};
