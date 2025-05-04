import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';

function LinearizationApproximation({ data, selectedXColumnIndex, selectedYColumnIndex }) {
  const [approxParams, setApproxParams] = useState(null);

  const handleLinearize = () => {
    if (selectedXColumnIndex === null || selectedYColumnIndex === null) {
      alert('Выберите колонки X и Y');
      return;
    }

    const xValues = data.slice(1).map((row) => parseFloat(row[selectedXColumnIndex]) || 0);
    const yValues = data.slice(1).map((row) => parseFloat(row[selectedYColumnIndex]) || 0);

    // Линеаризация
    const lnY = yValues.map((y) => (y > 0 ? Math.log(y) : 0));
    //
    const A = xValues.map((x) => [1, x]); // Модель ln(Y) = a + bX
    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, lnY);

    const solution = math.lusolve(ATA, ATY);
    const [a, b] = solution.map((val) => val[0]);

    const C0 = Math.exp(a);
    const lambda = b;

    setApproxParams({ C0, lambda });
  };

  const renderApproximation = () => {
    if (!approxParams) {
      return null;
    }

    const { C0, lambda } = approxParams;
    const approxYValues = data.slice(1).map((row) => {
      const x = parseFloat(row[selectedXColumnIndex]) || 0;
      return C0 * Math.exp(lambda * x);
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
              label: 'Линеаризованное приближение',
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
    <div>
      <h4>Линеаризация методом МНК</h4>
      <button onClick={handleLinearize}>Вычислить аппроксимацию</button>
      {approxParams && (
        <div>
          <p>Параметры: C0 = {approxParams.C0.toFixed(4)}, λ = {approxParams.lambda.toFixed(4)}</p>
        </div>
      )}
      {renderApproximation()}
    </div>
  );
}

export default LinearizationApproximation;
