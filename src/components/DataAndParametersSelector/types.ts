export type ColumnSelection = {
  index: number | null;
  label: string;
};

export type ModelType = 'polynomial' | 'approximation' | 'linearization';

export type LinearizationModel = 'maxwell' | 'power' | 'relaxation';

export type DataAndParametersSelectorProps = {
  type: ModelType;
  data: any[][];
  selectedXColumn: ColumnSelection;
  selectedYColumn: ColumnSelection;
  onXColumnChange: (selection: ColumnSelection) => void;
  onYColumnChange: (selection: ColumnSelection) => void;

  // Для полиномиальной аппроксимации
  degree?: number;
  onDegreeChange?: (value: number) => void;
  onCalculatePolynomial?: () => void;

  // Для экспоненциальной аппроксимации
  lambdas?: number[];
  inputLambda?: string;
  useLinearizedModel?: boolean;
  onLambdaChange?: (index: number, value: string) => void;
  onAddLambda?: () => void;
  onDeleteLambda?: (index: number) => void;
  onInputLambdaChange?: (value: string) => void;
  onLinearizedModelChange?: (checked: boolean) => void;
  onCalculateApproximation?: () => void;

  // Для линеаризации
  modelType?: LinearizationModel;
  onModelTypeChange?: (value: LinearizationModel) => void;
  params?: {
    E: number | null;
    epsilon: number | null;
  };
  onParamsChange?: (params: { E: number | null, epsilon: number | null }) => void;
  onCalculateLinearization?: () => void;
};
