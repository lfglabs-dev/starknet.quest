export const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
export const bigAlphabet = "这来";
export const totalAlphabet = basicAlphabet + bigAlphabet;
export const PAGE_SIZE = [10, 15, 20];

// used to map the time frame to the api call for leaderaboard
export const timeFrameMap = (input: string): "week" | "month" | "all" => {
  let output: "week" | "month" | "all" = "week";
  switch (input) {
    case "Last 7 Days":
      output = "week";
      break;
    case "Last 30 Days":
      output = "month";
      break;
    case "All time":
      output = "all";
      break;
    default:
      output = "week";
  }
  return output;
};

export const rankOrder = [2, 1, 3];
export const rankOrderMobile = [1, 2, 3];
