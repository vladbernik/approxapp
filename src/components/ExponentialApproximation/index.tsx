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
import { Button, Input } from 'antd';
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

function ExponentialApproximation({ data, lambdas, setLambdas, selectedXColumnIndex, selectedYColumnIndex }) {
  const [approximationParams, setApproximationParams] = useState(null);
  const [inputLambda, setInputLambda] = useState('');
  const [history, setHistory] = useState([]);
  const [prevApproximation, setPrevApproximation] = useState(null);

  useEffect(() => {
    setApproximationParams(null);
  }, [lambdas, selectedXColumnIndex, selectedYColumnIndex]);

  const numericData = useMemo(() => {
    return data?.filter(row => {
      const x = row[selectedXColumnIndex];
      const y = row[selectedYColumnIndex];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });
  }, [data, selectedXColumnIndex, selectedYColumnIndex]);

  const handleLambdaChange = (index, value) => {
    const newLambdas = [...lambdas];
    newLambdas[index] = parseFloat(value);
    setLambdas(newLambdas);
  };

  const handleAddLambda = () => {
    setLambdas([...lambdas, parseFloat(inputLambda)]);
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

    const xValues = numericData.map((row) => row[selectedXColumnIndex]);
    const yValues = numericData.map((row) => row[selectedYColumnIndex]);

    const A = xValues.map((x) =>
      [1, ...lambdas.map((lambda) => math.exp(lambda * x))]
    );

    const Y = yValues;

    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, Y);
    const solution = math.lusolve(ATA, ATY);
    const yParams = solution.map((val) => val[0]);

    // Если есть предыдущие параметры, добавляем их в историю
    if (prevApproximation) {
      setHistory(prev => [prevApproximation, ...prev].slice(0, 2));
    }

    // Сохраняем текущие параметры как предыдущие для следующего расчета
    const currentApproximation = {
      params: yParams,
      lambdas: [...lambdas],
      xIndex: selectedXColumnIndex,
      yIndex: selectedYColumnIndex,
      xValues: [...xValues],
      yValues: [...yValues]
    };

    setPrevApproximation(currentApproximation);
    setApproximationParams(yParams);
  };

  console.log(approximationParams)
  console.log(selectedXColumnIndex)
  console.log(selectedYColumnIndex)
  console.log(numericData)

  console.log(history)

  const createHistoryGraph = (historyItem) => {
    const approxYValues = historyItem.xValues.map((x) => {
      return (
        historyItem.params[0] +
        historyItem.lambdas.reduce((sum, lambda, i) => {
          return sum + historyItem.params[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
      <Line
        key={`history-${historyItem.xIndex}-${historyItem.yIndex}-${Date.now()}`}
        width={400}
        height={400}
        data={{
          labels: historyItem.xValues.map(x => x.toFixed(4)),
          datasets: [
            {
              label: 'Исходные данные (история)',
              data: historyItem.yValues,
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Аппроксимация (история)',
              data: approxYValues,
              borderColor: 'green',
              fill: false,
            },
          ],
        }}
      />
    );
  };

  const createCurrentGraph = () => {
    if (!approximationParams) {
      return <div>Нажмите "Вычислить аппроксимацию" для построения графика</div>;
    }

    const numericData = data.filter(row => {
      const x = row[selectedXColumnIndex];
      const y = row[selectedYColumnIndex];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });

    const xValues = numericData.map(row => parseFloat(row[selectedXColumnIndex]));
    const yValues = numericData.map(row => parseFloat(row[selectedYColumnIndex]));

    const approxYValues = xValues.map((x) => {
      return (
        approximationParams[0] +
        lambdas.reduce((sum, lambda, i) => {
          return sum + approximationParams[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
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
              label: 'Экспоненциальная аппроксимация',
              data: approxYValues,
              borderColor: 'red',
              fill: false,
            },
          ],
        }}
      />
    );
  };

  return (
    <div className={s.exponentialApproximation}>
      <div className={s.calculationInputs}>
        <div className={s.test}>
          <h4>Лямбды</h4>
          {lambdas.map((lambda, index) => (
            <div key={index} className={s.lambdaGroup}>
              <label>λ{index + 1}: </label>
              <Input
                type="number"
                value={lambda}
                placeholder="λ"
                onChange={(e) => handleLambdaChange(index, e.target.value)}
                className={s.lambda}
              />
              {index !== 0 && <Button onClick={() => handleDeleteLambda(index)}>Удалить λ</Button>}
            </div>
          ))}
          <div className={s.lambdaControl}>
            <Input
              type="number"
              value={inputLambda}
              placeholder="Новая λ"
              onChange={(e) => setInputLambda(e.target.value)}
              className={s.lambda}
            />
            <Button onClick={handleAddLambda}>Добавить λ</Button>
          </div>

          <Button
            type="primary"
            onClick={handleCalculateApproximation}
            style={{ marginTop: '20px' }}
            disabled={(selectedXColumnIndex === undefined || selectedYColumnIndex === undefined) || lambdas.every((lambda) => isNaN(lambda))}
          >
            Вычислить аппроксимацию
          </Button>

          {approximationParams && (
            <div>
              <h4>Параметры аппроксимации (y_j)</h4>
              <ul>
                {approximationParams.map((param, index) => (
                  <li key={index}>y{index}: {param?.toFixed(4)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className={s.approximationsHistoryContainer}>
          <h4>История (последние 2 вычисления)</h4>
          <div className={s.approximationsHistory}>
            {history?.map((item, index) => (
              <div key={index} className={s.approximationHistoryChart}>
                {createHistoryGraph(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <h4>Текущая аппроксимация</h4>
        {approximationParams && createCurrentGraph()}
      </div>
    </div>
  );
}

export default ExponentialApproximation;
