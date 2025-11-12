import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  useAccount,
  useReadContracts,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PUSD_ADDRESS, PUSD_ABI } from "./config";
import {
  DollarSign,
  Zap,
  Pause,
  Play,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUpRight,
  Flame,
  Wallet,
  Shield,
  Copy,
} from "lucide-react";

const DECIMALS = 6;

export default function App() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: contractData, refetch } = useReadContracts({
    contracts: [
      {
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "balanceOf",
        args: [address || "0x0000000000000000000000000000000000000000"],
      },
      {
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "totalSupply",
      },
      {
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "paused",
      },
    ],
  });

  const [balance, supply, paused] = contractData || [];
  const balanceValue = balance?.result as bigint | undefined;
  const supplyValue = supply?.result as bigint | undefined;
  const pausedValue = paused?.result as boolean | undefined;

  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [blacklistAddress, setBlacklistAddress] = useState("");
  const [unblacklistAddress, setUnblacklistAddress] = useState("");
  const [mintToSelf, setMintToSelf] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    token: boolean;
    mint: boolean;
    transfer: boolean;
    burn: boolean;
  }>({
    token: false,
    mint: false,
    transfer: false,
    burn: false,
  });
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error" | "info";
  } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const pushToast = (
    message: string,
    variant: "success" | "error" | "info"
  ) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, variant });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mintToSelf) {
      setMintAddress(address ?? "");
    }
  }, [mintToSelf, address]);

  const showSuccess = (message: string) => pushToast(message, "success");
  const showInfo = (message: string) => pushToast(message, "info");
  const toastStyleMap: Record<"success" | "error" | "info", string> = {
    success:
      "border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-emerald-500/20",
    error: "border-red-500/70 bg-red-500/15 text-red-100 shadow-red-500/20",
    info: "border-amber-400/60 bg-amber-500/15 text-amber-100 shadow-amber-500/20",
  };

  const formatAddress = (value?: string) =>
    value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "";

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(PUSD_ADDRESS);
      showInfo("Contract address copied to clipboard.");
    } catch (error) {
      showError(error);
    }
  };

  const showError = (error: unknown) => {
    const fallback = "Transaction failed. Check the console for details.";
    const message =
      error instanceof Error ? error.message || fallback : fallback;
    pushToast(message, "error");
    console.error(error);
  };

  const formatPUSD = (value: bigint | undefined) =>
    value !== undefined
      ? Number(formatUnits(value, DECIMALS)).toLocaleString()
      : "0";

  const handleTogglePause = async () => {
    try {
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: pausedValue ? "unpause" : "pause",
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showSuccess(
        pausedValue
          ? "Unpause transaction submitted."
          : "Pause transaction submitted."
      );
    } catch (error) {
      showError(error);
    }
  };

  const handleMint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const destination = mintToSelf ? address : mintAddress;
    if (!destination || !mintAmount) {
      pushToast("Enter a recipient address and amount to mint.", "error");
      return;
    }
    if (mintToSelf && !address) {
      pushToast("Connect your wallet to mint to yourself.", "error");
      return;
    }

    try {
      const amount = parseUnits(mintAmount, DECIMALS);
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "mint",
        args: [destination, amount],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showSuccess(`Minting transaction submitted for ${mintAmount} PUSD.`);
      if (!mintToSelf) {
        setMintAddress("");
      }
      setMintAmount("");
    } catch (error) {
      showError(error);
    }
  };

  const handleTransfer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transferAddress || !transferAmount) {
      pushToast("Enter a recipient address and amount to transfer.", "error");
      return;
    }

    try {
      const amount = parseUnits(transferAmount, DECIMALS);
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "transfer",
        args: [transferAddress, amount],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showSuccess(
        `Transfer transaction submitted to ${transferAddress} for ${transferAmount} PUSD.`
      );
      setTransferAddress("");
      setTransferAmount("");
    } catch (error) {
      showError(error);
    }
  };

  const handleBurn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!burnAmount) {
      pushToast("Enter an amount to burn.", "error");
      return;
    }

    try {
      const amount = parseUnits(burnAmount, DECIMALS);
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "redeem",
        args: [amount, "USD"],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showInfo(
        "Burn request submitted. The USD amount will be settled by wire transfer to the bank account in 2-3 business days."
      );
      setBurnAmount("");
    } catch (error) {
      showError(error);
    }
  };

  const handleBlacklist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!blacklistAddress) {
      pushToast("Enter a wallet address to blacklist.", "error");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "blacklist",
        args: [blacklistAddress],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showSuccess(`Blacklist transaction submitted for ${blacklistAddress}.`);
      setBlacklistAddress("");
    } catch (error) {
      showError(error);
    }
  };

  const handleUnblacklist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!unblacklistAddress) {
      pushToast("Enter a wallet address to unblacklist.", "error");
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: PUSD_ADDRESS,
        abi: PUSD_ABI,
        functionName: "unblacklist",
        args: [unblacklistAddress],
      });
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      await refetch();
      showSuccess(
        `Unblacklist transaction submitted for ${unblacklistAddress}.`
      );
      setUnblacklistAddress("");
    } catch (error) {
      showError(error);
    }
  };

  return (
    <>
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 flex items-start gap-3 rounded-2xl border px-5 py-4 text-sm font-medium shadow-lg backdrop-blur ${
            toastStyleMap[toast.variant]
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => {
              if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
              }
              setToast(null);
            }}
            className="text-white/60 transition hover:text-white/90"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="w-full max-w-2xl">
          <div className="mb-10">
            <div className="text-center">
              <h1 className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                PUSD Stablecoin
              </h1>
              <p className="text-gray-300 mt-3 text-lg flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                HKMA/SFC-Compliant • Live on Sepolia
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <ConnectButton />
            </div>
          </div>

          {pausedValue && (
            <div className="mb-6 rounded-xl border border-red-500 bg-red-600/20 p-4 text-center text-red-300 backdrop-blur-sm">
              TOKEN PAUSED — All transfers blocked
            </div>
          )}

          <div className="mb-8 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3 text-gray-300">
                <DollarSign size={20} />
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Your Balance
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatPUSD(balanceValue)} PUSD
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/10 md:h-12 md:w-px" />
              <div className="text-gray-300">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Total Supply
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatPUSD(supplyValue)} PUSD
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-800/50 p-3 rounded-xl hover:bg-purple-700/50 transition group">
              <span className="text-xs text-purple-300">PUSDv3 CONTRACT</span>
              <span className="text-sm text-purple-200">Ξ</span>
              <a
                href="https://sepolia.etherscan.io/address/0xf7FdD5C9Af785Bfa07aDb69573e47289E23810C5"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-purple-200 underline decoration-transparent transition group-hover:decoration-current"
              >
                0xf7Fd...10C5
              </a>
              <button
                onClick={(event) => {
                  event.preventDefault();
                  copyContractAddress();
                }}
                className="ml-auto flex items-center rounded text-purple-300 transition hover:text-white"
                aria-label="Copy contract address"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-300">Ξ</span>
              Sepolia Testnet
              <button
                onClick={async () => {
                  await refetch();
                }}
                className="ml-1 flex items-center justify-center rounded p-1 text-green-400 transition hover:bg-green-400/20 hover:text-green-300"
                aria-label="Refresh data"
                title="Refresh to get latest total supply and your balance"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {isConnected && (
            <div className="space-y-4">
              {/* Owner Mint - Collapsible */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => toggleSection("mint")}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Zap className="text-green-400" size={20} /> Owner Mint
                  </h3>
                  {expandedSections.mint ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {expandedSections.mint && (
                  <div className="px-6 pb-6">
                    <form onSubmit={handleMint} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-xs font-medium text-purple-100">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-white/30 bg-black/40"
                            checked={mintToSelf}
                            onChange={(event) =>
                              setMintToSelf(event.target.checked)
                            }
                          />
                          Mint to connected wallet
                        </label>
                        {mintToSelf && address && (
                          <span className="flex items-center gap-1 text-xs text-purple-200">
                            <Wallet size={14} />
                            {formatAddress(address)}
                          </span>
                        )}
                      </div>
                      <input
                        value={mintToSelf ? address ?? "" : mintAddress}
                        onChange={(event) =>
                          !mintToSelf && setMintAddress(event.target.value)
                        }
                        placeholder="Recipient wallet address"
                        disabled={mintToSelf}
                        className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        value={mintAmount}
                        onChange={(event) => setMintAmount(event.target.value)}
                        placeholder="Amount to mint"
                        type="number"
                        min="0"
                        step="0.000001"
                        className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:from-green-600 hover:to-emerald-700"
                      >
                        <Zap size={18} /> Mint Tokens
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Owner Transfer - Collapsible */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => toggleSection("transfer")}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-3">
                    <ArrowUpRight className="text-blue-400" size={20} /> Owner
                    Transfer
                  </h3>
                  {expandedSections.transfer ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {expandedSections.transfer && (
                  <div className="px-6 pb-6">
                    <form onSubmit={handleTransfer} className="space-y-3">
                      <input
                        value={transferAddress}
                        onChange={(event) =>
                          setTransferAddress(event.target.value)
                        }
                        placeholder="Recipient wallet address"
                        className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <input
                        value={transferAmount}
                        onChange={(event) =>
                          setTransferAmount(event.target.value)
                        }
                        placeholder="Amount to transfer"
                        type="number"
                        min="0"
                        step="0.000001"
                        className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-indigo-700"
                      >
                        Transfer Tokens
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Redeem / Burn - Collapsible */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => toggleSection("burn")}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Flame className="text-orange-400" size={20} /> Redeem /
                    Burn
                  </h3>
                  {expandedSections.burn ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {expandedSections.burn && (
                  <div className="px-6 pb-6">
                    <form onSubmit={handleBurn} className="space-y-3">
                      <input
                        value={burnAmount}
                        onChange={(event) => setBurnAmount(event.target.value)}
                        placeholder="Amount to burn"
                        type="number"
                        min="0"
                        step="0.000001"
                        className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:from-orange-600 hover:to-amber-700"
                      >
                        Burn Tokens
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Token Management - Collapsible */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => toggleSection("token")}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-3">
                    <Shield className="text-purple-400" size={20} /> Token
                    Management
                  </h3>
                  {expandedSections.token ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {expandedSections.token && (
                  <div className="space-y-4 px-6 pb-6">
                    <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-base font-semibold text-yellow-100">
                            Contract Pause Control
                          </h4>
                          <p className="text-xs text-yellow-100/80">
                            Toggle the contract&apos;s paused state. Transfers
                            are blocked while paused.
                          </p>
                        </div>
                        <button
                          onClick={handleTogglePause}
                          className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-yellow-400"
                        >
                          {pausedValue ? (
                            <Play size={16} />
                          ) : (
                            <Pause size={16} />
                          )}
                          {pausedValue ? "Unpause Contract" : "Pause Contract"}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <form
                        onSubmit={handleBlacklist}
                        className="space-y-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-red-100"
                      >
                        <h4 className="text-base font-semibold text-red-100">
                          Owner Blacklist
                        </h4>
                        <input
                          value={blacklistAddress}
                          onChange={(event) =>
                            setBlacklistAddress(event.target.value)
                          }
                          placeholder="Wallet to blacklist"
                          className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-400/80"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-gradient-to-r from-red-500 to-rose-600 py-2.5 text-sm font-semibold text-white transition hover:from-red-600 hover:to-rose-700"
                        >
                          Blacklist Wallet
                        </button>
                      </form>
                      <form
                        onSubmit={handleUnblacklist}
                        className="space-y-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-100"
                      >
                        <h4 className="text-base font-semibold text-emerald-100">
                          Owner Unblacklist
                        </h4>
                        <input
                          value={unblacklistAddress}
                          onChange={(event) =>
                            setUnblacklistAddress(event.target.value)
                          }
                          placeholder="Wallet to unblacklist"
                          className="w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/80"
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] hover:from-emerald-600 hover:to-green-700"
                        >
                          Unblacklist Wallet
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <footer className="mt-12 text-center text-sm text-gray-400">
            Built by Purush •{" "}
            <a
              href="https://github.com/Purush1701/PUSD-stablecoin"
              className="underline hover:text-white transition"
            >
              GitHub
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
