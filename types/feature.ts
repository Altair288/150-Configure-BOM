export type FeatureType = "SingleSelect" | "MultiSelect";

export interface Option {
  id: string;
  code: string;
  name: string;
  featureId: string;
  compatible: boolean;
  description: string;
  materialNumber: string;
}

export interface Feature {
  id: string;
  code: string;
  name: string;
  type: FeatureType;
  required: boolean;
  description: string;
  options: Option[];
}