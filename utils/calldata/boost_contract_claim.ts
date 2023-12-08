import { CallDetails, cairo, shortString } from "starknet";
import { decimalToHex } from "../feltService";

function boostContractClaimData(
  contractAddress: string,
  boostId: number,
  amount: number,
  token: string,
  signatures: string[]
): CallDetails {
  return {
    contractAddress,
    entrypoint: "claim",
    calldata: [
      cairo.uint256(amount).low,
      cairo.uint256(amount).high,
      token,
      boostId,
      [decimalToHex(signatures[0]), decimalToHex(signatures[1])],
    ],
  };
}

const boostContractCalls = {
  boostContractClaimData,
};

export default boostContractCalls;
