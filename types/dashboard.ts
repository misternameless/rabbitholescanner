export type CoinOpportunity = {
  id: string;
  name: string | null;
  symbol: string | null;
  marketCap: number | null;
  liquidity: number | null;
  volume: number | null;
};

export type ScanStatistics = {
  coinsScanned: number;
  totalCoins: number;
  lastScanTime: string | null;
};

export type DashboardData = {
  scanStatistics: ScanStatistics;
  solanaOpportunities: CoinOpportunity[];
  baseOpportunities: CoinOpportunity[];
};
