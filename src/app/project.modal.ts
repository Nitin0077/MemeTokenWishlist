export interface Project {
  id: string;
  project: string;
  handle: string;
  ca: string;
  category: string;
  chain: string;
  useCase: string;
  marketCap: number;
  rating: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  narrativeTag: string;
}
