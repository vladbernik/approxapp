import { createContext, useState, useContext, FC, ReactNode, useEffect } from 'react';
import { ApproximationData, ApproximationParams, ColumnSelection } from '../types/approximations';
import {
  ApproximationModel,
  CalculationContextType,
  LinearizationModelType
} from './types';

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

// Ключи для localStorage для каждой модели
const STORAGE_KEYS = {
  POLYNOMIAL_HISTORY: 'polynomial_approximation_history',
  EXPONENTIAL_HISTORY: 'exponential_approximation_history',
  LINEARIZATION_HISTORY: 'linearization_approximation_history',
  CURRENT_MODEL: 'current_approximation_model'
};

// eslint-disable-next-line react/function-component-definition
export const CalculationProvider: FC<{children: ReactNode}> = ({ children }) => {
  // Загрузка начального состояния из localStorage
  const loadFromLocalStorage = (): {
    polynomialHistory: ApproximationData[],
    exponentialHistory: ApproximationData[],
    linearizationHistory: ApproximationData[],
    currentModel: ApproximationModel
  } => {
    try {
      return {
        polynomialHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.POLYNOMIAL_HISTORY)) || [],
          exponentialHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPONENTIAL_HISTORY)) || [],
        linearizationHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.LINEARIZATION_HISTORY)) || [],
        currentModel: (localStorage.getItem(STORAGE_KEYS.CURRENT_MODEL) as ApproximationModel || 'polynomial'
        ) }
    } catch (error) {
      console.error('Failed to parse saved data', error);
      return {
        polynomialHistory: [],
        exponentialHistory: [],
        linearizationHistory: [],
        currentModel: 'polynomial'
      };
    }
  };

  const {
    polynomialHistory: savedPolynomialHistory,
    exponentialHistory: savedExponentialHistory,
    linearizationHistory: savedLinearizationHistory,
    currentModel: savedModel
  } = loadFromLocalStorage();

  // Общее состояние
  const [currentModel, setCurrentModel] = useState<ApproximationModel>(savedModel);
  const [selectedXColumn, setSelectedXColumn] = useState<ColumnSelection>({ index: null, label: '' });
  const [selectedYColumn, setSelectedYColumn] = useState<ColumnSelection>({ index: null, label: '' });

  // Отдельные истории для каждой модели
  const [polynomialHistory, setPolynomialHistory] = useState<ApproximationData[]>(savedPolynomialHistory);
  const [exponentialHistory, setExponentialHistory] = useState<ApproximationData[]>(savedExponentialHistory);
  const [linearizationHistory, setLinearizationHistory] = useState<ApproximationData[]>(savedLinearizationHistory);

  console.log(linearizationHistory)
  const [historyIndex, setHistoryIndex] = useState(0);

  // Результаты вычислений
  const [currentApproximation, setCurrentApproximation] = useState<ApproximationData | null>(null);
  const [currentCoefficients, setCurrentCoefficients] = useState<number[] | null>(null);
  const [currentChartData, setCurrentChartData] = useState<any>(null);
  const [currentResult, setCurrentResult] = useState<any>(null);

  // Полиномиальная аппроксимация
  const [degree, setDegree] = useState(2);

  // Экспоненциальная аппроксимация
  const [inputLambda, setInputLambda] = useState('');
  const [lambdas, setLambdas] = useState<number[]>([-0.5, -0.1]);
  const [useLinearizedModel, setUseLinearizedModel] = useState(false);

  // Линеаризация
  const [linearizationModelType, setLinearizationModelType] = useState<LinearizationModelType>('maxwell');
  const [linearizationParams, setLinearizationParams] = useState<ApproximationParams>({
    E: null,
    epsilon: null
  });

  // Сохранение историй в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POLYNOMIAL_HISTORY, JSON.stringify(polynomialHistory));
  }, [polynomialHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPONENTIAL_HISTORY, JSON.stringify(exponentialHistory));
  }, [exponentialHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINEARIZATION_HISTORY, JSON.stringify(linearizationHistory));
  }, [linearizationHistory]);

  // Сохранение текущей модели в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODEL, currentModel);
  }, [currentModel]);

  // Получение текущей истории в зависимости от модели
  const getCurrentHistory = (): ApproximationData[] => {
    switch (currentModel) {
      case 'polynomial': return polynomialHistory;
      case 'exponential': return exponentialHistory;
      case 'linearization': return linearizationHistory;
      default: return [];
    }
  };

  // Установка истории для текущей модели
  const setCurrentHistory = (newHistory: ApproximationData[]) => {
    switch (currentModel) {
      case 'polynomial':
        setPolynomialHistory(newHistory);
        break;
      case 'exponential':
        setExponentialHistory(newHistory);
        break;
      case 'linearization':
        setLinearizationHistory(newHistory);
        break;
    }
  };

  function resetContext() {
    console.warn('Reset calculation context success');
    setSelectedXColumn({ index: null, label: '' });
    setSelectedYColumn({ index: null, label: '' });
    setHistoryIndex(0);

    setCurrentApproximation(null);
    setCurrentCoefficients(null);
    setCurrentChartData(null);
    setCurrentResult(null);

    setDegree(2);

    setInputLambda('');
    setLambdas([-0.5, -0.1]);
    setUseLinearizedModel(false);

    setLinearizationModelType('maxwell');
    setLinearizationParams({
      E: null,
      epsilon: null
    });
  }

  const handleChangeModel = (model: ApproximationModel) => {
    resetContext();
    setCurrentModel(model);
  };

  const addToHistory = (data: ApproximationData) => {
    const newHistory = [data, ...getCurrentHistory()].slice(0, 10); // Ограничиваем историю 10 последними записями

    switch (currentModel) {
      case 'polynomial':
        setPolynomialHistory(newHistory);
        break;
      case 'exponential':
        setExponentialHistory(newHistory);
        break;
      case 'linearization':
        setLinearizationHistory(newHistory);
        break;
    }
  };

  const value: CalculationContextType = {
    // Общее состояние
    currentModel,
    setCurrentModel,
    handleChangeModel,
    selectedXColumn,
    setSelectedXColumn,
    selectedYColumn,
    setSelectedYColumn,
    history: getCurrentHistory(),
    setHistory: setCurrentHistory,
    addToHistory,
    historyIndex,
    setHistoryIndex,

    // Результаты вычислений
    currentApproximation,
    setCurrentApproximation,
    currentCoefficients,
    setCurrentCoefficients,
    currentChartData,
    setCurrentChartData,
    currentResult,
    setCurrentResult,

    // Полиномиальная аппроксимация
    degree,
    setDegree,

    // Экспоненциальная аппроксимация
    inputLambda,
    setInputLambda,
    lambdas,
    setLambdas,
    useLinearizedModel,
    setUseLinearizedModel,

    // Линеаризация
    linearizationModelType,
    setLinearizationModelType,
    linearizationParams,
    setLinearizationParams,
    resetContext
  };

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
};

export const useCalculationContext = () => {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculationContext must be used within a CalculationProvider');
  }
  return context;
};
