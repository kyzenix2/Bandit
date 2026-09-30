export const chainConfig = [
  {
    id: "ethereum",
    label: "Ethereum",
    aliases: ["ethereum", "eth"],
    nativeSymbol: "ETH",
    wallet: "MetaMask",
    dex: "Uniswap",
    dexscreenerSlug: "ethereum",
    buyUrl(ca) {
      return `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${ca}`;
    },
    explorerUrl(ca) {
      return `https://etherscan.io/token/${ca}`;
    },
  },
  {
    id: "robinhood",
    label: "Robinhood",
    aliases: ["robinhood"],
    nativeSymbol: "ETH",
    wallet: "Robinhood Wallet",
    dex: "Uniswap",
    dexscreenerSlug: "robinhood",
    buyUrl(ca) {
      return `https://app.uniswap.org/swap?chain=robinhood&outputCurrency=${ca}`;
    },
    explorerUrl(ca) {
      return `https://robinhoodchain.blockscout.com/token/${ca}`;
    },
  },
  {
    id: "bsc",
    label: "BNB Chain",
    aliases: ["bnb", "bsc"],
    nativeSymbol: "BNB",
    wallet: "MetaMask",
    dex: "PancakeSwap",
    dexscreenerSlug: "bsc",
    buyUrl(ca) {
      return `https://pancakeswap.finance/swap?outputCurrency=${ca}`;
    },
    explorerUrl(ca) {
      return `https://bscscan.com/token/${ca}`;
    },
  },
  {
    id: "solana",
    label: "Solana",
    aliases: ["solana", "sol"],
    nativeSymbol: "SOL",
    wallet: "Phantom",
    dex: "Pump.fun",
    dexscreenerSlug: "solana",
    buyUrl(ca) {
      return `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${ca}`;
    },
    explorerUrl(ca) {
      return `https://solscan.io/token/${ca}`;
    },
  },
  {
    id: "hyper",
    label: "HyperEVM",
    aliases: ["hyper"],
    nativeSymbol: "HYPE",
    wallet: "MetaMask",
    dex: "HyperSwap",
    dexscreenerSlug: "hyperliquid",
    buyUrl(ca) {
      return `https://app.hyperswap.exchange/#/swap?outputCurrency=${ca}`;
    },
    explorerUrl(ca) {
      return `https://hyperevmscan.io/address/${ca}`;
    },
  },
  {
    id: "arc",
    label: "Arc",
    aliases: ["arc"],
    nativeSymbol: "",
    wallet: "MetaMask",
    dex: "Argus",
    dexscreenerSlug: "",
    buyUrl(ca) {
      return `https://argus.world/token/${ca}`;
    },
    explorerUrl: null,
  },
];

export function getChain(name) {
  const key = String(name ?? "").trim().toLowerCase();
  if (!key) return null;
  return chainConfig.find((chain) => chain.aliases.includes(key)) ?? null;
}
