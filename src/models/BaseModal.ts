export interface InputField {
  name: string;
  label: string;
  type: 'number';
}

export interface ComputationResult {
  data: Array<{ x: number; y: number }>;
  metadata?: Record<string, any>;
}

export interface ApproximationModel {
  name: string;
  getInputs: () => InputField[];
  compute: (inputs: Record<string, number>) => ComputationResult;
}
