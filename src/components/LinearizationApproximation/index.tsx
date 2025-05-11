import { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Button, Select, InputNumber, Form, Row, Col } from 'antd';

const MODEL_TYPES = [
  { value: 'maxwell', label: 'Модель Максвелла (σ(t) = σ₀·exp(-t/τ))' },
  { value: 'power', label: 'Степенная модель (y = a·x^b)' },
  { value: 'relaxation', label: 'Полная модель релаксации (σ(t) = E·ε + (σ₀ - E·ε)·exp(-t/θ))' },
];

function PolymerLinearization({ data, selectedXColumnIndex, selectedYColumnIndex }) {
  const [result, setResult] = useState(null);
  const [modelType, setModelType] = useState('maxwell');
  const [params, setParams] = useState({ E: null, epsilon: null });
  const [chartData, setChartData] = useState(null);

  console.log(result)
  const prepareChartData = (xValues, yValues, coeffs) => {
    let approxYValues;

    switch (modelType) {
      case 'maxwell':
        approxYValues = xValues.map(x => coeffs.sigma0 * Math.exp(-x / coeffs.tau));
        break;

      case 'power':
        approxYValues = xValues.map(x => coeffs.a * Math.pow(x, coeffs.b));
        break;

      case 'relaxation':
        const { E, epsilon } = params;
        const E_epsilon = E * epsilon;
        approxYValues = xValues.map(x => E_epsilon + (coeffs.sigma0 - E_epsilon) * Math.exp(-x / coeffs.theta));
        break;
    }

    setChartData({
      labels: xValues,
      datasets: [
        {
          label: 'Экспериментальные данные',
          data: yValues,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          pointRadius: 4
        },
        {
          label: 'Аппроксимация',
          data: approxYValues,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        }
      ]
    });
  };

  const calculateLinearization = useCallback(() => {
    try {
      const xValues = data.slice(1).map(row => parseFloat(row[selectedXColumnIndex]));
      const yValues = data.slice(1).map(row => parseFloat(row[selectedYColumnIndex]));

      console.log(xValues)
      console.log(yValues)
      if (xValues.some(isNaN) || yValues.some(isNaN)) {
        alert('Ошибка: В данных есть некорректные значения!');
        return;
      }

      let transformedX, transformedY, a, b;

      switch (modelType) {
        case 'maxwell':
          // Линеаризация: ln(σ(t)) = ln(σ₀) - (1/τ)·t
          transformedX = xValues.slice(1);
          console.log(transformedX)
          transformedY = yValues.slice(1).map(y => Math.log(y));
          console.log(transformedY)
          break;

        case 'power':
          // Линеаризация: ln(y) = ln(a) + b·ln(x)
          transformedX = xValues.slice(1).map(x => Math.log(x));
          transformedY = yValues.slice(1).map(y => Math.log(y));
          break;

        case 'relaxation':
          // Линеаризация: ln|σ(t) - E·ε| = ln|σ₀ - E·ε| - (1/θ)·t
          const { E, epsilon } = params;
          const E_epsilon = E * epsilon;
          transformedX = xValues.slice(1);
          transformedY = yValues.slice(1).map(y => Math.log(Math.abs(y - E_epsilon)));
          console.log(transformedY)
          break;
      }

      // Метод наименьших квадратов
      const n = transformedX.length;
      const sumX = transformedX.reduce((a, b) => a + b, 0);
      const sumY = transformedY.reduce((a, b) => a + b, 0);
      const sumXY = transformedX.reduce((a, x, i) => a + x * transformedY[i], 0);
      const sumX2 = transformedX.reduce((a, x) => a + x * x, 0);

      b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      a = (sumY - b * sumX) / n;

      console.log(n)
      console.log(sumXY)
      console.log(sumX)
      console.log(sumY)
      console.log(sumX2)

      // Вычисление физических параметров
      let result = {};
      switch (modelType) {
        case 'maxwell':
          console.log(a)
          console.log(b)
          result = {
            sigma0: Math.exp(a),
            tau: -1 / b,
            equation: `σ(t) = ${Math.exp(a).toFixed(4)}·exp(-t/${(-1 / b).toFixed(4)})`
          };
          break;

        case 'power':
          result = {
            a: Math.exp(a),
            b,
            equation: `y = ${Math.exp(a).toFixed(4)}·x^${b.toFixed(4)}`
          };
          break;

        case 'relaxation':
          const sigma0 = Math.exp(a) + params.E * params.epsilon;
          result = {
            sigma0,
            theta: -1 / b,
            E: params.E,
            epsilon: params.epsilon,
            equation: `σ(t) = ${(params.E * params.epsilon).toFixed(4)} + (${sigma0.toFixed(4)} - ${(params.E * params.epsilon).toFixed(4)})·exp(-t/${(-1 / b).toFixed(4)})`
          };
          break;
      }

      setResult(result);
      prepareChartData(xValues, yValues, result);
    } catch (error) {
      console.error('Ошибка при линеаризации:', error);
      alert('Ошибка при вычислении линеаризации.');
    }
  }, [data, selectedXColumnIndex, selectedYColumnIndex, modelType, params.E, params.epsilon]);

  const handleParamsChange = (changedValues) => {
    setParams(prev => ({ ...prev, ...changedValues }));
  };

  console.log(selectedXColumnIndex)
  console.log(selectedYColumnIndex)

  console.log(result)
  return (
    <div>
      <h2>Линеаризация моделей для фотополимеров</h2>

      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Выберите модель">
              <Select
                value={modelType}
                onChange={setModelType}
                options={MODEL_TYPES}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="Параметр E">
              <InputNumber
                value={params.E}
                onChange={(value) => setParams({ epsilon: params.epsilon, E: value })}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="Параметр epsilon">
              <InputNumber
                value={params.epsilon}
                onChange={(value) => setParams({ epsilon: value, E: params.E })}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          {/*{modelType === 'relaxation' && (*/}
          {/*  <>*/}
          {/*    <Col span={8}>*/}
          {/*      <Form.Item label="Модуль упругости (E)">*/}
          {/*        <InputNumber*/}
          {/*          value={params.E}*/}
          {/*          onChange={(value) => handleParamsChange({ E: value })}*/}
          {/*          style={{ width: '100%' }}*/}
          {/*        />*/}
          {/*      </Form.Item>*/}
          {/*    </Col>*/}
          {/*  </>*/}
          {/*)}*/}
        </Row>

        <Button
          disabled={selectedXColumnIndex === null || selectedYColumnIndex === null || params.E === null || params.epsilon === null}
          type="primary"
          onClick={calculateLinearization}
          style={{ marginBottom: '20px' }}
        >
          Выполнить линеаризацию
        </Button>
      </Form>

      {result && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Результаты:</h3>
          <p><strong>Уравнение:</strong> {result?.equation}</p>

          {modelType === 'maxwell' && (
            <div>
              <p>Начальное напряжение σ₀ = {result.sigma0?.toFixed(4)}</p>
              <p>Время релаксации τ = {result.tau?.toFixed(4)}</p>
            </div>
          )}

          {modelType === 'power' && (
            <div>
              <p>Коэффициент a = {result?.a?.toFixed(4)}</p>
              <p>Показатель степени b = {result?.b?.toFixed(4)}</p>
            </div>
          )}

          {modelType === 'relaxation' && (
            <div>
              <p>Начальное напряжение σ₀ = {result?.sigma0?.toFixed(4)}</p>
              <p>Характеристическое время θ = {result?.theta?.toFixed(4)}</p>
              <p>Модуль упругости E = {result?.E?.toFixed(4)}</p>
              <p>Деформация ε = {result?.epsilon?.toFixed(4)}</p>
            </div>
          )}
        </div>
      )}

      {chartData && (
        <div style={{ height: '500px' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Сравнение экспериментальных данных и аппроксимации',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: data[0][selectedXColumnIndex],
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: data[0][selectedYColumnIndex],
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PolymerLinearization;
