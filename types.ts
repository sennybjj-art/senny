
export interface Denomination {
  value: number;
  label: string;
  type: 'note' | 'coin';
  imageUrl?: string;
}

export interface ChangeResult {
  totalChange: number;
  breakdown: {
    denomination: Denomination;
    count: number;
  }[];
}

export interface HistoryItem {
  id: string;
  total: number;
  paid: number;
  change: number;
  timestamp: number;
}
