import PUSD_JSON from "./PUSD.json";
import type { Abi, Address } from "viem";

export const PUSD_ADDRESS: Address =
  "0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5";

const baseAbi = PUSD_JSON.abi as Abi;

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

export const PUSD_ABI = (() => {
  const hasRedeem = baseAbi.some(
    (item) => item.type === "function" && item.name === redeemFragment.name
  );
  return hasRedeem ? baseAbi : ([...baseAbi, redeemFragment] as Abi);
})();
