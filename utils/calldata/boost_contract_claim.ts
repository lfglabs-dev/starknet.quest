import { Call, CallDetails, shortString } from "starknet";

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

  return {
    contractAddress,
    entrypoint: "claim",
    calldata: [amount, token, "0x2", final, boostId],
  };
}

const boostContractCalls = {
  boostContractClaimData,
};

export default boostContractCalls;
