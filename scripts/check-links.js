import { tokenConfig } from "../config/tokenConfig.js";
import { resolveToken } from "../utils/tokenLinks.js";

const EVM = "0x1111111111111111111111111111111111111111";
const SOL = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";
const ZERO = "0x0000000000000000000000000000000000000000";
const ZERO_SOL = "11111111111111111111111111111111";

const expected = {
  ethereum: {
    buy: `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/ethereum/${EVM}`,
    explorer: `https://etherscan.io/token/${EVM}`,
  },
  eth: {
    buy: `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/ethereum/${EVM}`,
    explorer: `https://etherscan.io/token/${EVM}`,
  },
  robinhood: {
    buy: `https://app.uniswap.org/swap?chain=robinhood&outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/robinhood/${EVM}`,
    explorer: `https://robinhoodchain.blockscout.com/token/${EVM}`,
  },
  bnb: {
    buy: `https://pancakeswap.finance/swap?outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/bsc/${EVM}`,
    explorer: `https://bscscan.com/token/${EVM}`,
  },
  bsc: {
    buy: `https://pancakeswap.finance/swap?outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/bsc/${EVM}`,
    explorer: `https://bscscan.com/token/${EVM}`,
  },
  solana: {
    buy: `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${SOL}`,
    chart: `https://dexscreener.com/solana/${SOL}`,
    explorer: `https://solscan.io/token/${SOL}`,
  },
  sol: {
    buy: `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${SOL}`,
    chart: `https://dexscreener.com/solana/${SOL}`,
    explorer: `https://solscan.io/token/${SOL}`,
  },
  hyper: {
    buy: `https://app.hyperswap.exchange/#/swap?outputCurrency=${EVM}`,
    chart: `https://dexscreener.com/hyperliquid/${EVM}`,
    explorer: `https://hyperevmscan.io/address/${EVM}`,
  },
  arc: {
    buy: `https://argus.world/token/${EVM}`,
    chart: "",
    explorer: "",
  },
};

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function urlsOf(view) {
  return [view.buyUrl, view.chartUrl, view.explorerUrl, view.embedUrl, view.steps[2].href];
}

function assertNoTba(view, label) {
  for (const url of urlsOf(view)) {
    assert(!/tba/i.test(url), `${label} url contains TBA: ${url}`);
  }
  for (const social of view.socials) {
    assert(social.url !== "TBA" && !/^tba$/i.test(social.label), `${label} social shows TBA`);
  }
}

const empty = resolveToken({ ...tokenConfig, ca: "", x: "", telegram: "" });
assert(empty.ca === "TBA", "empty ca display");
assert(empty.caLive === false, "empty caLive");
assert(empty.buyUrl === "" && empty.chartUrl === "" && empty.explorerUrl === "", "empty urls");
assert(empty.embedUrl === "", "empty embed");
assert(empty.steps[2].href === "", "empty dex step link");
assert(empty.socials.length === 0, "empty socials");
assert(empty.wallet === "Phantom" && empty.dex === "Pump.fun", "solana wallet and dex");
assert(empty.steps[0].body === "Set up Phantom.", "wallet step");
assert(empty.steps[1].body === "Add SOL to your wallet.", "funds step");
assert(empty.steps[2].body === "Open Pump.fun.", "dex step");
assert(empty.steps[3].body === "Swap SOL for $BANDIT.", "swap step");
assertNoTba(empty, "empty");

for (const ca of ["", "   ", "TBA", "tba", ZERO, ZERO_SOL]) {
  const view = resolveToken({ ...tokenConfig, ca });
  assert(view.ca === "TBA" && view.caLive === false, `placeholder ca ${ca || "(blank)"}`);
  assert(!view.buyUrl && !view.chartUrl && !view.explorerUrl && !view.embedUrl, `no urls for ${ca || "(blank)"}`);
  assertNoTba(view, `placeholder ${ca || "(blank)"}`);
}

for (const [chain, links] of Object.entries(expected)) {
  const ca = chain === "solana" || chain === "sol" ? SOL : EVM;
  const view = resolveToken({ ...tokenConfig, chain, ca, buyUrl: "", chartUrl: "", explorerUrl: "" });
  assert(view.ca === ca && view.caLive, `${chain} live`);
  assert(view.buyUrl === links.buy, `${chain} buy\n  ${view.buyUrl}\n  ${links.buy}`);
  assert(view.chartUrl === links.chart, `${chain} chart\n  ${view.chartUrl}\n  ${links.chart}`);
  assert(view.explorerUrl === links.explorer, `${chain} explorer\n  ${view.explorerUrl}\n  ${links.explorer}`);
  if (links.chart) {
    assert(view.embedUrl.startsWith(links.chart), `${chain} embed host ${view.embedUrl}`);
    assert(view.embedUrl.includes("dexscreener.com"), `${chain} embed is dexscreener`);
  } else {
    assert(view.embedUrl === "", `${chain} has no embed`);
  }
  assertNoTba(view, chain);
}

const override = resolveToken({
  ...tokenConfig,
  ca: SOL,
  buyUrl: "https://example.com/buy",
  chartUrl: "https://example.com/chart",
  explorerUrl: "https://example.com/explorer",
});
assert(override.buyUrl === "https://example.com/buy", "buy override");
assert(override.chartUrl === "https://example.com/chart", "chart override");
assert(override.explorerUrl === "https://example.com/explorer", "explorer override");
assert(override.embedUrl === "", "non dexscreener chart is not embedded");

const tbaOverride = resolveToken({
  ...tokenConfig,
  ca: SOL,
  buyUrl: "https://swap.pump.fun/?output=TBA",
  chartUrl: "https://dexscreener.com/solana/TBA",
  explorerUrl: "https://solscan.io/token/TBA",
});
assert(tbaOverride.buyUrl === expected.solana.buy, "TBA buy override falls through");
assert(tbaOverride.chartUrl === expected.solana.chart, "TBA chart override falls through");
assert(tbaOverride.explorerUrl === expected.solana.explorer, "TBA explorer override falls through");
assertNoTba(tbaOverride, "tba override");

const emptyOverride = resolveToken({
  ...tokenConfig,
  ca: "",
  buyUrl: "https://example.com/only-buy",
});
assert(emptyOverride.buyUrl === "https://example.com/only-buy", "manual buy without ca");
assert(emptyOverride.chartUrl === "" && emptyOverride.explorerUrl === "", "no auto urls without ca");
assertNoTba(emptyOverride, "manual without ca");

const socials = resolveToken({
  ...tokenConfig,
  x: "TBA",
  telegram: "not a url",
});
assert(socials.socials.length === 0, "reject non-url socials");

const liveSocials = resolveToken({
  ...tokenConfig,
  x: "https://x.com/example",
  telegram: "http://t.me/example",
});
assert(liveSocials.socials.length === 2, "http socials render");
assert(liveSocials.socials[0].url === "https://x.com/example", "x url");
assert(liveSocials.socials[1].url === "http://t.me/example", "telegram url");

const unknown = resolveToken({ ...tokenConfig, chain: "unknown", ca: EVM });
assert(unknown.buyUrl === "" && unknown.chartUrl === "" && unknown.explorerUrl === "", "unknown chain has no guessed urls");

const CA = "67pyUBgbBKjMumTz4ZnQp9GaX3ag1JNVAMoLeyMipump";
const live = resolveToken(tokenConfig);
assert(live.ca === CA && live.caLive, "configured ca is live");
assert(live.buyUrl === `https://swap.pump.fun/?input=So11111111111111111111111111111111111111112&output=${CA}`, "configured buy");
assert(live.chartUrl === `https://dexscreener.com/solana/${CA}`, "configured chart");
assert(live.explorerUrl === `https://solscan.io/token/${CA}`, "configured explorer");
assert(live.embedUrl.startsWith(`https://dexscreener.com/solana/${CA}`), "configured embed");
assert(live.socials.length === 1 && live.socials[0].url === "https://x.com/BANDIT_inSOL", "configured x");
assertNoTba(live, "configured");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("tokenLinks ok");
console.log("empty", { ca: empty.ca, buyUrl: empty.buyUrl, chartUrl: empty.chartUrl, explorerUrl: empty.explorerUrl });
console.log("solana", expected.solana);
