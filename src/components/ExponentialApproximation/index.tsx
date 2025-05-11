import { useState } from 'react';
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
    // Проверка на выбранные индексы
    if (selectedXColumnIndex === null || selectedYColumnIndex === null) {
      alert('Пожалуйста, выберите колонки X и Y.');
      return;
    }

    const xValues = data.map((row, index: number) => typeof row[index] !== 'string' && row[selectedXColumnIndex]);
    const yValues = data.map((row, index: number) => typeof row[index] !== 'string' && row[selectedYColumnIndex]);

    const A = xValues.map((x) =>
      [1, ...lambdas.map((lambda) => math.exp(lambda * x))]
    );

    const Y = yValues;

    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, Y);
    const solution = math.lusolve(ATA, ATY);
    const yParams = solution.map((val) => val[0]);

    setApproximationParams(yParams);
  };

  const renderApproximation = () => {
    if (!approximationParams) {
      return null;
    }

    const approxYValues = data.map((row) => {
      const x = row[0];
      return (
        approximationParams[0] +
        lambdas.reduce((sum, lambda, i) => {
          return sum + approximationParams[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
      <Line key={math.random()}
            data={{
              labels: data.map((row, index) => (typeof row[index] !== 'string' && row[0])),
              datasets: [
                {
                  label: 'Исходные данные',
                  data: data.map((row, index) => typeof row[index] !== 'string' && row[1]),
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
        <Button onClick={handleAddLambda}>Добавить λ</Button>
      </div>

      <Button type="primary"
              onClick={handleCalculateApproximation}
              style={{ marginTop: '20px' }}
              disabled={(selectedXColumnIndex === undefined || selectedYColumnIndex === undefined) || lambdas.every((lambda) => isNaN(lambda))}>
        Вычислить аппроксимацию
      </Button>

      {approximationParams && (
        <div>
          <h4>Параметры аппроксимации (y_j)</h4>
          <ul>
            {approximationParams.map((param, index) => (
              <li key={index}>y{index}: {param.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}

      <div>{renderApproximation()}</div>
    </div>
  );
}

export default ExponentialApproximation;
