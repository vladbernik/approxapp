import {useMemo} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as math from 'mathjs';
import {message} from 'antd';
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import useExponentialApproximation from '../../hooks/useExponentialApproximation';
import {
  ApproximationData,
  ApproximationParams,
  ExponentialApproximationProps
} from '../../types/approximations';
import {saveCardAsImage} from '../../utils';
import DataAndParametersSelector from '../DataAndParametersSelector';
import {useCalculationContext} from '../../contexts/CalculationContext';
import s from './s.module.css';
import ResetStorageButton from "../ResetStorageButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// eslint-disable-next-line max-lines-per-function
export default function ExponentialApproximation({data}: ExponentialApproximationProps) {
  const {
    selectedXColumn,
    setSelectedXColumn,
    selectedYColumn,
    setSelectedYColumn,
    inputLambda,
    lambdas,
    setLambdas,
    setInputLambda,
    useLinearizedModel,
    setUseLinearizedModel,
    history,
    setHistory,
    setHistoryIndex,
    setCurrentApproximation,
    currentApproximation
  } = useCalculationContext()
  const {MemoizedHistoryItem, createChartData, renderCurrentApproximation} = useExponentialApproximation();

  const numericData = useMemo(() => {
    if (!data || selectedXColumn?.index === null || selectedYColumn?.index === null) {
      return [];
    }

    return data.filter((row: any) => {
      const x = row[selectedXColumn.index as number];
      const y = row[selectedYColumn.index as number];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });
  }, [data, selectedXColumn?.index, selectedYColumn?.index]);

  console.log('f')
  const handleLambdaChange = (index: number, value: string) => {
    const newLambdas = [...lambdas];
    newLambdas[index] = value;
    setLambdas(newLambdas);
  };

  const handleAddLambda = () => {
    if (inputLambda.trim()) {
      setLambdas([...lambdas, inputLambda]);
      setInputLambda('');
    }
  };

  const handleDeleteLambda = (index: number) => {
    const newLambdas = lambdas.filter((_, i) => i !== index);
    setLambdas(newLambdas);
  };

  const handleCalculateApproximation = () => {
    if (selectedXColumn.index === null || selectedYColumn.index === null) {
      message.warning('Пожалуйста, выберите колонки X и Y');
      return;
    }

    if (lambdas.length === 0) {
      message.warning('Пожалуйста, добавьте хотя бы одну лямбду');
      return;
    }

    const numericLambdas = lambdas.map(lambda => parseFloat(lambda) || 0);
    const xValues = numericData.map((row: any) => parseFloat(row[selectedXColumn.index as number]));
    const yValues = numericData.map((row: any) => parseFloat(row[selectedYColumn.index as number]));

    let params: ApproximationParams;

    if (useLinearizedModel) {
      const A = xValues.map((x) => [
        1,
        ...numericLambdas.map((lambda) => math.exp(lambda * x)),
        ...numericLambdas.map((lambda) => x * math.exp(lambda * x)),
      ]);

      const Y = yValues;
      const AT = math.transpose(A);
      const ATA = math.multiply(AT, A);
      const ATY = math.multiply(AT, Y);
      const solution = math.lusolve(ATA, ATY);
      const coefficients = solution.map((val) => val[0]);

      params = {
        a0: coefficients[0],
        a_i: coefficients.slice(1, 1 + numericLambdas.length),
        b_i: coefficients.slice(1 + numericLambdas.length),
        type: 'linearized',
      };
    } else {
      const A = xValues.map((x) => [1, ...numericLambdas.map((lambda) => math.exp(lambda * x))]);
      const Y = yValues;
      const AT = math.transpose(A);
      const ATA = math.multiply(AT, A);
      const ATY = math.multiply(AT, Y);
      const solution = math.lusolve(ATA, ATY);
      const coefficients = solution.map((val) => val[0]);

      params = {
        a0: coefficients[0],
        a_i: coefficients.slice(1),
        type: 'standard',
      };
    }

    const newApproximation: ApproximationData = {
      params,
      lambdas: [...lambdas],
      xIndex: selectedXColumn.index,
      yIndex: selectedYColumn.index,
      xLabel: selectedXColumn.label,
      yLabel: selectedYColumn.label,
      xValues: [...xValues],
      yValues: [...yValues],
      useLinearizedModel,
      timestamp: Date.now()
    };

    setCurrentApproximation(newApproximation);
    setHistory(prev => [newApproximation, ...prev]);
    setHistoryIndex(0);
  };

  const historyItems = useMemo(() => {
    return history.map((item, index) => (
      <div key={`exp-chart-${index}`} className={s.historyItemContainer}>
        <MemoizedHistoryItem
          key={item.timestamp}
          item={item}
          createChartData={createChartData}
          onSave={saveCardAsImage}
        />
      </div>
    ));
  }, [history, createChartData]);

  return (
    <div className={s.container}>
      <div className={s.controls}>
        <DataAndParametersSelector
          type="approximation"
          data={data}
          selectedXColumn={selectedXColumn}
          selectedYColumn={selectedYColumn}
          onXColumnChange={setSelectedXColumn}
          onYColumnChange={setSelectedYColumn}
          lambdas={lambdas}
          inputLambda={inputLambda}
          useLinearizedModel={useLinearizedModel}
          onLambdaChange={handleLambdaChange}
          onAddLambda={handleAddLambda}
          onDeleteLambda={handleDeleteLambda}
          onInputLambdaChange={setInputLambda}
          onLinearizedModelChange={setUseLinearizedModel}
          onCalculateApproximation={handleCalculateApproximation}
        />
        <div className={s.charts}>
          {renderCurrentApproximation(currentApproximation)}
          {history.length > 0 && <div className={s.historyTitleContainer}>
              <span className={s.historyTitle}>История вычислений</span>
              <div className={s.rightPull}>
                  <ResetStorageButton/>
                {history.length > 1 && <div className={s.swipeContainer}>
                    cвайп для просмотра
                    <LeftOutlined/>
                    <RightOutlined/>
                </div>}
              </div>
          </div>
          }

          <div className={s.history}>
            {historyItems}
          </div>
        </div>
      </div>
    </div>
  );
}
