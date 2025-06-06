
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalysisResults {
  summary: string;
  keyMetrics: Array<{
    label: string;
    value: string;
    change: string;
  }>;
  recommendations: string[];
  chartData: {
    revenue: Array<{ month: string; revenue: number }>;
    sales: Array<{ period: string; sales: number }>;
    distribution: Array<{ name: string; value: number }>;
    customers: Array<{ segment: string; count: number; value: number }>;
    products: Array<{ name: string; sales: number }>;
  };
  datasetInfo?: {
    fileName: string;
    totalRows: number;
    validRows: number;
  };
}

interface AnalysisStore {
  analysisResults: AnalysisResults | null;
  setAnalysisResults: (results: AnalysisResults) => void;
  clearAnalysisResults: () => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      analysisResults: null,
      setAnalysisResults: (results) => set({ analysisResults: results }),
      clearAnalysisResults: () => set({ analysisResults: null }),
    }),
    {
      name: 'analysis-storage',
    }
  )
);
