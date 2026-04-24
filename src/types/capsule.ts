// Type definitions for CapsuleForm and related components

export interface Recipient {
  name: string;
  email: string;
  relationship: string;
}

export interface Witness {
  address: string;
  name: string;
}

export interface OracleData {
  source: string;
  eventDescription: string;
  parameters: Record<string, unknown>;
}

export interface CryptoAsset {
  type: 'ETH' | 'ERC20' | 'NFT';
  amount: string;
  token?: string;
  transferType: 'immediate' | 'conditional';
  isApproved?: boolean;
  condition?: string;
}

export interface CapsuleFormData {
  recipients: unknown[];
  isSecret: boolean;
  message: string;
  conditionType: string;
  openDate: unknown;
  witnesses: unknown[];
  oracleData: OracleData;
  compoundConditions: unknown[];
  textContent: string;
  files: unknown[];
  urls: unknown[];
  cryptoAssets: unknown[];
}

export interface RecipientStepProps {
  formData: CapsuleFormData;
  handleChange: (field: string, value: unknown) => void;
  addRecipient: (recipient: unknown) => void;
  removeRecipient: (index: number) => void;
  errors: Record<string, string>;
}

export interface ConditionsStepProps {
  formData: CapsuleFormData;
  handleChange: (field: string, value: unknown) => void;
  setConditionType: (type: string) => void;
  addWitness: (witness: unknown) => void;
  removeWitness: (index: number) => void;
  errors: Record<string, string>;
}

export interface ContentStepProps {
  formData: CapsuleFormData;
  handleChange: (field: string, value: unknown) => void;
  addFile: (file: unknown) => void;
  removeFile: (index: number) => void;
  addUrl: (url: unknown) => void;
  removeUrl: (index: number) => void;
  addCryptoAsset: (asset: unknown) => void;
  removeCryptoAsset: (index: number) => void;
  active?: boolean;
  account?: string;
  errors: Record<string, string>;
}

export interface ReviewStepProps {
  formData: CapsuleFormData;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export interface SuccessStepProps {
  formData: CapsuleFormData;
}
