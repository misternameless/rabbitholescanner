export type DexscreenerSupportedChain = "solana" | "base";

export type DexscreenerLink = {
  label?: string;
  type?: string;
  url?: string;
};

export type DexscreenerTokenProfile = {
  chainId: string;
  tokenAddress: string;
  url?: string;
  description?: string;
  links?: DexscreenerLink[];
};

export type DexscreenerToken = {
  address?: string;
  name?: string;
  symbol?: string;
};

export type DexscreenerPair = {
  chainId: string;
  dexId?: string;
  pairAddress?: string;
  url?: string;
  baseToken?: DexscreenerToken;
  quoteToken?: DexscreenerToken;
  volume?: {
    h24?: number;
  };
  liquidity?: {
    usd?: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: {
    websites?: DexscreenerLink[];
    socials?: DexscreenerLink[];
  };
};
