import PUSDv3_JSON from "./PUSDv3.json";
import type { Abi, Address } from "viem";

export const PUSD_ADDRESS: Address =
  "0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5";

const baseAbi = PUSDv3_JSON.abi as Abi;

const redeemFragment = {
  inputs: [
    {
      internalType: "uint256",
      name: "amount",
      type: "uint256",
    },
    {
      internalType: "string",
      name: "currency",
      type: "string",
    },
  ],
  name: "redeem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
} as const;

export const PUSDv3_ABI = (() => {
  const hasRedeem = baseAbi.some(
    (item) => item.type === "function" && item.name === redeemFragment.name
  );
  return hasRedeem ? baseAbi : ([...baseAbi, redeemFragment] as Abi);
})();

// Keep PUSD_ABI as an alias for backward compatibility
export const PUSD_ABI = PUSDv3_ABI;
