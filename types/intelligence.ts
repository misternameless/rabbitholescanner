export type ClusterCoinEvidence = {
  id: string;
  chain: string;
  token_address: string;
  name: string | null;
  symbol: string | null;
};

export type ClusterRepositoryEvidence = {
  id: string;
  repository: string;
  url: string | null;
  stars: number | null;
};

export type EmergingCluster = {
  cluster_name: string;
  evidence_count: number;
  related_coins: ClusterCoinEvidence[];
  related_repositories: ClusterRepositoryEvidence[];
};

export type EmergingClustersResponse = {
  success: true;
  clusters: EmergingCluster[];
};
