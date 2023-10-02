export const splitByNftContract = (
  rewards: EligibleReward[]
): Record<string, EligibleReward[]> => {
  return rewards.reduce(
    (acc: Record<string, EligibleReward[]>, reward: EligibleReward) => {
      if (!acc[reward.nft_contract]) {
        acc[reward.nft_contract] = [];
      }

      acc[reward.nft_contract].push(reward);
      return acc;
    },
    {}
  );
};
