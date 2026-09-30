import { getChain } from "../config/chainConfig.js";

const ZERO_EVM = /^0x0{40}$/i;
const ZERO_SOLANA = "11111111111111111111111111111111";
const TBA_SEGMENT = /(?:^|[/=?#&])tba(?:$|[/=?#&])/i;

export function isRealCa(ca) {
  const value = String(ca ?? "").trim();
  if (!value) return false;
  if (/^tba$/i.test(value)) return false;
  if (ZERO_EVM.test(value)) return false;
  if (value === ZERO_SOLANA) return false;
  return true;
}

function usableOverride(url) {
  const value = String(url ?? "").trim();
  if (!value) return "";
  if (TBA_SEGMENT.test(value)) return "";
  return value;
}

export function isHttpUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw || /^tba$/i.test(raw)) return false;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function toEmbedUrl(chartUrl) {
  const value = usableOverride(chartUrl);
  if (!value) return "";
  let url;
  try {
    url = new URL(value);
  } catch {
    return "";
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "dexscreener.com") return "";
  if (url.protocol !== "http:" && url.protocol !== "https:") return "";
  url.searchParams.set("embed", "1");
  url.searchParams.set("theme", "dark");
  url.searchParams.set("info", "0");
  return url.toString();
}

function buildSteps(chain, config, buyUrl) {
  const wallet = chain?.wallet || "a wallet";
  const dex = chain?.dex || "the DEX";
  const nativeSymbol = chain?.nativeSymbol || "";
  const ticker = String(config.ticker ?? "").trim();
  const tokenLabel = ticker ? `$${ticker.replace(/^\$/, "")}` : config.name || "the token";

  return [
    {
      n: "1",
      title: "Wallet",
      body: chain?.wallet ? `Set up ${wallet}.` : "Set up a wallet.",
      href: "",
    },
    {
      n: "2",
      title: "Funds",
      body: nativeSymbol ? `Add ${nativeSymbol} to your wallet.` : "Add funds to your wallet.",
      href: "",
    },
    {
      n: "3",
      title: "DEX",
      body: chain?.dex ? `Open ${dex}.` : "Open the DEX.",
      href: buyUrl,
    },
    {
      n: "4",
      title: "Swap",
      body: nativeSymbol ? `Swap ${nativeSymbol} for ${tokenLabel}.` : `Swap for ${tokenLabel}.`,
      href: "",
    },
  ];
}

function socialLink(id, label, value) {
  const url = String(value ?? "").trim();
  if (!isHttpUrl(url)) return null;
  return { id, label, url };
}

export function resolveToken(config) {
  const chain = getChain(config.chain);
  const rawCa = String(config.ca ?? "").trim();
  const caLive = isRealCa(rawCa);
  const ca = caLive ? rawCa : "TBA";

  const buyUrl =
    usableOverride(config.buyUrl) ||
    (caLive && chain?.buyUrl ? chain.buyUrl(rawCa) : "");
  const chartUrl =
    usableOverride(config.chartUrl) ||
    (caLive && chain?.dexscreenerSlug
      ? `https://dexscreener.com/${chain.dexscreenerSlug}/${rawCa}`
      : "");
  const explorerUrl =
    usableOverride(config.explorerUrl) ||
    (caLive && chain?.explorerUrl ? chain.explorerUrl(rawCa) : "");

  const safeBuy = usableOverride(buyUrl);
  const safeChart = usableOverride(chartUrl);
  const safeExplorer = usableOverride(explorerUrl);

  const socials = [
    socialLink("x", "X", config.x),
    socialLink("telegram", "Telegram", config.telegram),
  ].filter(Boolean);

  return {
    name: String(config.name ?? "").trim(),
    ticker: String(config.ticker ?? "").trim().replace(/^\$/, ""),
    chainLabel: chain?.label || String(config.chain ?? "").trim(),
    wallet: chain?.wallet || "",
    dex: chain?.dex || "",
    nativeSymbol: chain?.nativeSymbol || "",
    logo: String(config.logo ?? "").trim(),
    banner: String(config.banner ?? "").trim(),
    slogan: String(config.slogan ?? "").trim(),
    description: String(config.description ?? "").trim(),
    ca,
    caLive,
    buyUrl: safeBuy,
    chartUrl: safeChart,
    explorerUrl: safeExplorer,
    embedUrl: toEmbedUrl(safeChart),
    socials,
    steps: buildSteps(chain, config, safeBuy),
  };
}
