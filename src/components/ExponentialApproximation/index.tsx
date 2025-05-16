import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button, Input, Select, Card } from 'antd';
import s from './s.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ExponentialApproximation({ data, lambdas, setLambdas }) {
  const [approximationParams, setApproximationParams] = useState(null);
  const [inputLambda, setInputLambda] = useState('');
  const [history, setHistory] = useState([]);
  const [prevState, setPrevState] = useState(null);

  const [columns, setColumns] = useState([]);
  const [selectedXColumnIndex, setSelectedXColumnIndex] = useState(null);
  const [selectedYColumnIndex, setSelectedYColumnIndex] = useState(null);
  const [selectedXColumnLabel, setSelectedXColumnLabel] = useState('');
  const [selectedYColumnLabel, setSelectedYColumnLabel] = useState('');

  useEffect(() => {
    if (data) {
      setColumns(data[0])
    }
  }, [data]);

  const numericData = useMemo(() => {
    return data?.filter(row => {
      const x = row[selectedXColumnIndex];
      const y = row[selectedYColumnIndex];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });
  }, [data, selectedXColumnIndex, selectedYColumnIndex]);

  const paramsChanged = useMemo(() => {
    if (!prevState) {
 return true;
}

    return (
      prevState.xIndex !== selectedXColumnIndex ||
      prevState.yIndex !== selectedYColumnIndex ||
      prevState.lambdas.length !== lambdas.length ||
      !prevState.lambdas.every((lambda, i) => lambda === lambdas[i])
    );
  }, [lambdas, selectedXColumnIndex, selectedYColumnIndex, prevState]);

  useEffect(() => {
    if (approximationParams && paramsChanged) {
      const xValues = numericData?.map((row) => row[selectedXColumnIndex]) || [];
      const yValues = numericData?.map((row) => row[selectedYColumnIndex]) || [];

      const currentApproximation = {
        params: [...approximationParams],
        lambdas: [...lambdas],
        xIndex: selectedXColumnIndex,
        yIndex: selectedYColumnIndex,
        xLabel: selectedXColumnLabel,
        yLabel: selectedYColumnLabel,
        xValues: [...xValues],
        yValues: [...yValues],
        timestamp: Date.now()
      };

      setHistory(prev => {
        const lastItem = prev[0];
        if (lastItem &&
          lastItem.xIndex === currentApproximation.xIndex &&
          lastItem.yIndex === currentApproximation.yIndex &&
          lastItem.lambdas.length === currentApproximation.lambdas.length &&
          lastItem.lambdas.every((lambda, i) => lambda === currentApproximation.lambdas[i])
        ) {
          return prev;
        }
        return [currentApproximation, ...prev].slice(0, 10);
      });

      setPrevState({
        xIndex: selectedXColumnIndex,
        yIndex: selectedYColumnIndex,
        lambdas: [...lambdas]
      });
    }

    if (paramsChanged) {
      setApproximationParams(null);
    }
  }, [lambdas, selectedXColumnIndex, selectedYColumnIndex, approximationParams, paramsChanged, numericData]);

  const handleLambdaChange = (index, value) => {
    const newLambdas = [...lambdas];
    // Разрешаем любые значения (они будут преобразованы при расчете)
    newLambdas[index] = value;
    setLambdas(newLambdas);
  };

  const handleAddLambda = () => {
    // Добавляем как строку, преобразование будет при расчете
    setLambdas([...lambdas, inputLambda]);
    setInputLambda('');
  };

  const handleDeleteLambda = (index) => {
    const newLambdas = lambdas.filter((_, i) => i !== index);
    setLambdas(newLambdas);
  };

  const handleCalculateApproximation = () => {
    if (selectedXColumnIndex === null || selectedYColumnIndex === null) {
      alert('Пожалуйста, выберите колонки X и Y.');
      return;
    }

    // Преобразуем лямбды в числа (если это возможно)
    const numericLambdas = lambdas.map(lambda => {
      const num = parseFloat(lambda);
      return isNaN(num) ? 0 : num; // или можно выбросить ошибку
    });

    const xValues = numericData.map((row) => row[selectedXColumnIndex]);
    const yValues = numericData.map((row) => row[selectedYColumnIndex]);

    const A = xValues.map((x) =>
      [1, ...numericLambdas.map((lambda) => math.exp(lambda * x))]
    );

    const Y = yValues;

    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, Y);
    const solution = math.lusolve(ATA, ATY);
    const yParams = solution.map((val) => val[0]);

    setApproximationParams(yParams);
  };

  const renderParameters = (params, lambdas, xLabel, yLabel) => (
    <div className={s.parametersContainer}>
      <h4>Параметры расчета:</h4>
      <p>X: {xLabel}, Y: {yLabel}</p>
      <h5>Лямбды (λ):</h5>
      <ul>
        {lambdas.map((lambda, i) => (
          <li key={i}>λ{i+1}: {lambda}</li>
        ))}
      </ul>
      <h5>Коэффициенты (y):</h5>
      <ul>
        {params.map((param, i) => (
          <li key={i}>y{i}: {param?.toFixed(6)}</li>
        ))}
      </ul>
    </div>
  );

  const createHistoryGraph = (historyItem) => {
    const approxYValues = historyItem.xValues.map((x) => {
      const numericLambdas = historyItem.lambdas.map(lambda => parseFloat(lambda) || 0);
      return (
        historyItem.params[0] +
        numericLambdas.reduce((sum, lambda, i) => {
          return sum + historyItem.params[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
      <Card
        title={`Аппроксимация ${new Date(historyItem.timestamp).toLocaleTimeString()}`}
        className={s.historyCard}
      >
        {renderParameters(
          historyItem.params,
          historyItem.lambdas,
          historyItem.xLabel,
          historyItem.yLabel
        )}
        <div className={s.chartContainer}>
          <Line
            key={`history-${historyItem.timestamp}`}
            data={{
              labels: historyItem.xValues.map(x => x.toFixed(4)),
              datasets: [
                {
                  label: 'Исходные данные',
                  data: historyItem.yValues,
                  borderColor: 'blue',
                  fill: false,
                },
                {
                  label: 'Аппроксимация',
                  data: approxYValues,
                  borderColor: 'green',
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      </Card>
    );
  };

  const createCurrentGraph = () => {
    if (!approximationParams || !selectedXColumnLabel || !selectedYColumnLabel) {
      return <div>Нажмите "Вычислить аппроксимацию" для построения графика</div>;
    }

    const numericData = data.filter(row => {
      const x = row[selectedXColumnIndex];
      const y = row[selectedYColumnIndex];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });

    const xValues = numericData.map(row => parseFloat(row[selectedXColumnIndex]));
    const yValues = numericData.map(row => parseFloat(row[selectedYColumnIndex]));

    const numericLambdas = lambdas.map(lambda => parseFloat(lambda) || 0);
    const approxYValues = xValues.map((x) => {
      return (
        approximationParams[0] +
        numericLambdas.reduce((sum, lambda, i) => {
          return sum + approximationParams[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
      <Card title="Текущая аппроксимация">
        {renderParameters(
          approximationParams,
          lambdas,
          selectedXColumnLabel,
          selectedYColumnLabel
        )}
        <div className={s.chartContainer}>
          <Line
            key={`current-${Date.now()}`}
            data={{
              labels: xValues.map(x => x.toFixed(4)),
              datasets: [
                {
                  label: 'Исходные данные',
                  data: yValues,
                  borderColor: 'blue',
                  fill: false,
                },
                {
                  label: 'Аппроксимация',
                  data: approxYValues,
                  borderColor: 'red',
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      </Card>
    );
  };

  const handleSelectedXColumnChange = (_, options) => {
    setSelectedXColumnIndex(options.index)
    setSelectedXColumnLabel(options.label)
  }

  const handleSelectedYColumnChange = (_, options) => {
    setSelectedYColumnIndex(options.index)
    setSelectedYColumnLabel(options.label)
  }

  return (
    <div className={s.exponentialApproximation}>
      <div className={s.calculationInputs}>
        <div className={s.test}>
          <div className={s.selectContainer}>
            <h2>Значения для X и Y</h2>
            <Select
              placeholder="Выберите X"
              value={selectedXColumnLabel}
              onChange={handleSelectedXColumnChange}
              options={columns.map((col, index) => ({
                label: col,
                value: col,
                index
              }))}
            />
            <Select
              placeholder="Выберите Y"
              value={selectedYColumnLabel}
              onChange={handleSelectedYColumnChange}
              options={columns.map((col, index) => ({
                label: col,
                value: col,
                index
              }))}
            />
          </div>
          <h4>Лямбды</h4>
          {lambdas.map((lambda, index) => (
            <div key={index} className={s.lambdaGroup}>
              <label>λ{index + 1}: </label>
              <Input
                value={lambda}
                placeholder="Любое значение"
                onChange={(e) => handleLambdaChange(index, e.target.value)}
                className={s.lambda}
              />
              {index !== 0 && (
                <Button onClick={() => handleDeleteLambda(index)}>
                  Удалить λ
                </Button>
              )}
            </div>
          ))}
          <div className={s.lambdaControl}>
            <Input
              value={inputLambda}
              placeholder="Новая λ (любое значение)"
              onChange={(e) => setInputLambda(e.target.value)}
              className={s.lambda}
            />
            <Button onClick={handleAddLambda}>Добавить λ</Button>
          </div>

          <Button
            type="primary"
            onClick={handleCalculateApproximation}
            style={{ marginTop: '20px' }}
            disabled={
              selectedXColumnIndex === undefined ||
              selectedYColumnIndex === undefined ||
              lambdas.length === 0
            }
          >
            Вычислить аппроксимацию
          </Button>
        </div>

        <div className={s.approximationsHistoryContainer}>
          <h4>История вычислений</h4>
          <div className={s.approximationsHistory}>
            {history?.map((item, index) => (
              <div key={index} className={s.approximationHistoryItem}>
                {createHistoryGraph(item)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.currentApproximation}>
        {createCurrentGraph()}
      </div>
    </div>
  );
}

export default ExponentialApproximation;
