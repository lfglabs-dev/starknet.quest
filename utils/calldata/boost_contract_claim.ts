import { CallDetails, shortString } from "starknet";

function boostContractClaimData(
  contractAddress: string | undefined,
  boostId: number,
  amount: number,
  token: string,
  signatures: string[]
): CallDetails {
  if (!contractAddress) return {} as CallDetails;
  const r = shortString
    .splitLongString(signatures[0])
    .map((x) => shortString.encodeShortString(x));
  const s = shortString
    .splitLongString(signatures[1])
    .map((x) => shortString.encodeShortString(x));
  const final = [...r, ...s];
  console.log({
    contractAddress,
    entrypoint: "claim",
    calldata: [amount, token, final, boostId],
  });
  return {
    contractAddress,
    entrypoint: "claim",
    calldata: [amount, token, final, boostId],
  };
}

const boostContractCalls = {
  boostContractClaimData,
};

export default boostContractCalls;
