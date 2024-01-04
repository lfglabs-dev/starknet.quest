const getBoostClaimStatus = (boostId: number) => {
  try {
    const res = localStorage.getItem("boostClaimStatus");
    if (!res) {
      return false;
    }
    const parsed = JSON.parse(res);
    return parsed[boostId] ?? false;
  } catch (err) {
    return false;
  }
};

const updateBoostClaimStatus = (boostId: number, value: boolean) => {
  try {
    const res = localStorage.getItem("boostClaimStatus");
    const parsed = res ? JSON.parse(res) : {};
    parsed[boostId] = value;
    localStorage.setItem("boostClaimStatus", JSON.stringify(parsed));
  } catch (err) {
    return false;
  }
};

const BoostClaimStatusManager = {
  getBoostClaimStatus,
  updateBoostClaimStatus,
};

export default BoostClaimStatusManager;
