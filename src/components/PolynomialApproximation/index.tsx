import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import { Button } from 'antd';

function PolynomialApproximation({ data, degree, selectedXColumnIndex, selectedYColumnIndex }) {
  const [coefficients, setCoefficients] = useState(null);

  const calculatePolynomial = () => {
    try {
      const xValues = data.slice(1).map((row, index) => typeof row[index] !== 'string' && parseFloat(row[0]));
      const yValues = data.slice(1).map((row, index) => typeof row[index] !== 'string' && parseFloat(row[1]));

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
      const x = parseFloat(row[0]);
      return coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
    });

    return (
      <Line
        data={{
          labels: data.slice(1).map((row, index) => typeof row[index] !== 'string' && row[0]),
          datasets: [
            {
              label: 'Исходные данные',
              data: data.slice(1).map((row, index) => typeof row[index] !== 'string' && row[1]),
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
      <Button type="primary" disabled={!degree} onClick={calculatePolynomial}>Вычислить полином</Button>

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
