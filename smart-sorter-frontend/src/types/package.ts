
export interface Package {
  id: string;
  label: string;
  barcode: string;
  description: string;
  image: string;
  weight: string;
  isUpload?: boolean; // ✅ Add this field
}


export interface BinData {
  id: number;
  name: string;
  count: number;
  color: string;
}

export interface SortingResult {
  label: string;
  confidence: number;
  bin_id: number;
  annotated_image?: string; // Can be URL or base64
}
