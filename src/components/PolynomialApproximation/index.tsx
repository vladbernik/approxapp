import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import { Button, Input } from 'antd';
import s from './s.module.css'

function PolynomialApproximation({ data, selectedXColumnIndex, selectedYColumnIndex }) {
  const [coefficients, setCoefficients] = useState(null);
  const [degree, setDegree] = useState(2);

  const calculatePolynomial = () => {
    try {
      const xValues = data.slice(1).map((row) => row[selectedXColumnIndex]);
      const yValues = data.slice(1).map((row) => row[selectedYColumnIndex]);

      if (xValues.some(isNaN) || yValues.some(isNaN)) {
        alert('Ошибка: В данных есть некорректные значения!');
        return;
      }

      const A = xValues.map((x) => Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i)));
      const AT = math.transpose(A);
      const ATA = math.multiply(AT, A);
      const ATY = math.multiply(AT, yValues);
      const solution = math.lusolve(ATA, ATY);

      setCoefficients(solution.map((val) => val[0]));
    } catch (error) {
      console.error('Ошибка при вычислении полинома:', error);
      alert('Ошибка при вычислении полинома.');
    }
  };

  const renderPolynomialChart = () => {
    if (!coefficients) {
      return null;
    }

    const approxYValues = data.slice(1).map((row) => {
      const x = row[selectedXColumnIndex];
      return coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
    });

    return (
      <Line
        data={{
          labels: data.slice(1).map((row) => row[selectedXColumnIndex]),
          datasets: [
            {
              label: 'Исходные данные',
              data: data.slice(1).map((row) => row[selectedYColumnIndex]),
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Полиномиальное приближение',
              data: approxYValues,
              borderColor: 'green',
              fill: false,
            },
          ],
        }}
      />
    );
  };

  return (
    <div>
      <h3>Полиномиальное приближение</h3>
      <div className={s.selectDegreeContainer}>
        <label>Степень полинома:</label>
        <Input type="number" value={degree} min="1" max="6" onChange={(e) => setDegree(Number(e.target.value))}/>
      </div>
      <Button type="primary"
              disabled={!degree || selectedXColumnIndex === null || !selectedYColumnIndex === null}
              onClick={calculatePolynomial}>Вычислить полином</Button>
      {coefficients && (
        <div>
          <h4>Коэффициенты полинома</h4>
          <ul>
            {coefficients.map((coeff, index) => (
              <li key={index}>
                Коэффициент {index}: {coeff.toFixed(4)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>{renderPolynomialChart()}</div>
    </div>
  );
}

export default PolynomialApproximation;
