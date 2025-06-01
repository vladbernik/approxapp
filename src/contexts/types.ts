import { ApproximationData, ApproximationParams, ColumnSelection } from '../types/approximations';

export type ApproximationModel = 'polynomial' | 'exponential' | 'linearization';
export type LinearizationModelType = 'maxwell' | 'power' | 'relaxation';

export type CalculationContextType = {
  // Общее состояние
  currentModel: ApproximationModel;
  setCurrentModel: (model: ApproximationModel) => void;
  handleChangeModel: (model: ApproximationModel) => void;
  selectedXColumn: ColumnSelection;
  setSelectedXColumn: (selection: ColumnSelection) => void;
  selectedYColumn: ColumnSelection;
  setSelectedYColumn: (selection: ColumnSelection) => void;
  history: ApproximationData[];
  setHistory: (history: ApproximationData[]) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;

  setPolynomialHistory: (history: ApproximationData[]) => void;
  setExponentialHistory: (history: ApproximationData[]) => void;
  setLinearizationHistory: (history: ApproximationData[]) => void;

  polynomialHistory: ApproximationData[];
  exponentialHistory: ApproximationData[];
  linearizationHistory: ApproximationData[];

  // Результаты вычислений
  currentApproximation: ApproximationData | null;
  setCurrentApproximation: (data: ApproximationData | null) => void;
  currentCoefficients: number[] | null;
  setCurrentCoefficients: (coefficients: number[] | null) => void;
  currentChartData: any;
  setCurrentChartData: (data: any) => void;
  currentResult: any;
  setCurrentResult: (result: any) => void;

  // Полиномиальная аппроксимация
  degree: number;
  setDegree: (degree: number) => void;

  // Экспоненциальная аппроксимация
  inputLambda: string;
  setInputLambda: (lambda: string) => void;
  lambdas: number[];
  setLambdas: (lambdas: number[]) => void;
  useLinearizedModel: boolean;
  setUseLinearizedModel: (value: boolean) => void;

  // Линеаризация
  linearizationModelType: LinearizationModelType;
  setLinearizationModelType: (type: LinearizationModelType) => void;
  linearizationParams: ApproximationParams;
  setLinearizationParams: (params: ApproximationParams) => void;

  resetContext: () => void;
};
