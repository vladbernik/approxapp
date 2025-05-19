import { useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Collapse } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import DataAndParametersSelector from '../DataAndParametersSelector';
import { useCalculationContext } from '../../contexts/CalculationContext';
import StartText from '../StartText';
import s from './s.module.css'

// eslint-disable-next-line max-lines-per-function
function PolymerLinearization({ data }) {
  const {
    linearizationModelType,
    setLinearizationModelType,
    linearizationParams: params,
    setSelectedYColumn,
    setSelectedXColumn,
    selectedXColumn,
    selectedYColumn,
    setCurrentResult,
    currentResult,
    currentChartData,
    setCurrentChartData,
    history,
    setHistory,
    setLinearizationParams,
  } = useCalculationContext()

  const prepareChartData = (xValues, yValues, coeffs, modelType, isCurrent = false) => {
    let approxYValues;

    switch (modelType) {
      case 'maxwell':
        approxYValues = xValues.map(x => coeffs.sigma0 * Math.exp(-x / coeffs.tau));
        break;

      case 'power':
        approxYValues = xValues.map(x => coeffs.a * Math.pow(x, coeffs.b));
        break;

      case 'relaxation':
        const { E, epsilon } = coeffs;
        const E_epsilon = E * epsilon;
        approxYValues = xValues.map(x => E_epsilon + (coeffs.sigma0 - E_epsilon) * Math.exp(-x / coeffs.theta));
        break;
    }

    return {
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
          borderColor: isCurrent ? 'rgb(255, 99, 132)' : 'rgb(255, 159, 64)',
          backgroundColor: isCurrent ? 'rgba(255, 99, 132, 0.2)' : 'rgba(255, 159, 64, 0.2)',
          tension: 0.1
        }
      ]
    };
  };

  // eslint-disable-next-line complexity
  const calculateLinearization = useCallback(() => {
    try {
      const xValues = data.slice(1).map(row => parseFloat(row[selectedXColumn.index]));
      const yValues = data.slice(1).map(row => parseFloat(row[selectedYColumn.index]));

      if (xValues.some(isNaN) || yValues.some(isNaN)) {
        alert('Ошибка: В данных есть некорректные значения!');
        return;
      }

      let transformedX, transformedY, a, b;

      switch (linearizationModelType) {
        case 'maxwell':
          transformedX = xValues.slice(1);
          transformedY = yValues.slice(1).map(y => Math.log(y));
          break;

        case 'power':
          transformedX = xValues.slice(1).map(x => Math.log(x));
          transformedY = yValues.slice(1).map(y => Math.log(y));
          break;

        case 'relaxation':
          const { E, epsilon } = params;
          const E_epsilon = E * epsilon;
          transformedX = xValues.slice(1);
          transformedY = yValues.slice(1).map(y => Math.log(Math.abs(y - E_epsilon)));
          break;
      }

      const n = transformedX.length;
      const sumX = transformedX.reduce((a, b) => a + b, 0);
      const sumY = transformedY.reduce((a, b) => a + b, 0);
      const sumXY = transformedX.reduce((a, x, i) => a + x * transformedY[i], 0);
      const sumX2 = transformedX.reduce((a, x) => a + x * x, 0);

      b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      a = (sumY - b * sumX) / n;

      let result = {};
      switch (linearizationModelType) {
        case 'maxwell':
          result = {
            sigma0: Math.exp(a),
            tau: -1 / b,
            equation: `σ(t) = ${Math.exp(a).toFixed(4)}·exp(-t/${(-1 / b).toFixed(4)})`,
            modelType: 'maxwell'
          };
          break;

        case 'power':
          result = {
            a: Math.exp(a),
            b,
            equation: `y = ${Math.exp(a).toFixed(4)}·x^${b.toFixed(4)}`,
            modelType: 'power'
          };
          break;

        case 'relaxation':
          const sigma0 = Math.exp(a) + params.E * params.epsilon;
          result = {
            sigma0,
            theta: -1 / b,
            E: params.E,
            epsilon: params.epsilon,
            equation: `σ(t) = ${(params.E * params.epsilon).toFixed(4)} + (${sigma0.toFixed(4)} - ${(params.E * params.epsilon).toFixed(4)})·exp(-t/${(-1 / b).toFixed(4)})`,
            modelType: 'relaxation'
          };
          break;
      }

      const chartData = prepareChartData(xValues, yValues, result, linearizationModelType, true);

      setCurrentResult(result);
      setCurrentChartData(chartData);

      setHistory(prev => [{
        ...result,
        timestamp: new Date().toLocaleTimeString(),
        chartData: prepareChartData(xValues, yValues, result, linearizationModelType, false),
        xLabel: data[0][selectedXColumn.index],
        yLabel: data[0][selectedYColumn.index],
        linearizationModelType
      }, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Ошибка при линеаризации:', error);
      alert('Ошибка при вычислении линеаризации.');
    }
  }, [data, selectedXColumn.index, selectedYColumn.index, linearizationModelType, params.E, params.epsilon]);

  const renderResultDetails = (result, modelType, xLabel = '', yLabel = '') => {
    const items = [
      {
        key: 'params',
        label: 'Параметры расчета',
        children: (
          <div>
            <div className={s.columnInfo}>
              <p><strong>X:</strong> {xLabel}</p>
              <p><strong>Y:</strong> {yLabel}</p>
            </div>
            <p><strong>Уравнение:</strong> {result?.equation ?? '--'}</p>
            {modelType === 'maxwell' && (
              <div>
                <p><strong>Начальное напряжение σ₀</strong> = {result.sigma0?.toFixed(4) ?? 0}</p>
                <p><strong>Время релаксации τ</strong> = {result.tau?.toFixed(4) ?? 0}</p>
              </div>
            )}
            {modelType === 'power' && (
              <div>
                <p><strong>Коэффициент a</strong> = {result?.a?.toFixed(4) ?? 0}</p>
                <p><strong>Показатель степени b</strong> = {result?.b?.toFixed(4) ?? 0}</p>
              </div>
            )}
            {modelType === 'relaxation' && (
              <div>
                <p><strong>Начальное напряжение σ₀</strong> = {result?.sigma0?.toFixed(4) ?? 0}</p>
                <p><strong>Характеристическое время θ</strong> = {result?.theta?.toFixed(4) ?? 0}</p>
                <p><strong>Модуль упругости E</strong> = {result?.E?.toFixed(4) ?? 0}</p>
                <p><strong>Деформация ε</strong> = {result?.epsilon?.toFixed(4) ?? 0}</p>
              </div>
            )}
          </div>
        )
      }
    ];

    return <Collapse items={items} defaultActiveKey={['params']} className={s.paramsCollapse}/>;
  };

  console.log(currentResult)
  console.log(history.length > 0)
  return (
    <div className={s.container}>
      <span className={s.title}>Линеаризация моделей для фотополимеров</span>
      <div className={s.controls}>
        <DataAndParametersSelector
          type="linearization"
          data={data}
          selectedXColumn={selectedXColumn}
          selectedYColumn={selectedYColumn}
          onXColumnChange={setSelectedXColumn}
          onYColumnChange={setSelectedYColumn}
          modelType={linearizationModelType}
          onModelTypeChange={setLinearizationModelType}
          params={params}
          onParamsChange={setLinearizationParams}
          onCalculateLinearization={calculateLinearization}
        />

          <div className={s.charts}>
            {currentResult ? <Card>
              {renderResultDetails(currentResult, linearizationModelType, data[0][selectedXColumn.index],
                data[0][selectedYColumn.index])}
              <div style={{ height: '500px', marginTop: '20px' }}>
                <Line
                  data={currentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                          text: data[0][selectedXColumn.index],
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: data[0][selectedYColumn.index],
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card> : <StartText calculationGoal="linearization"/>}

            <>
              {history.length > 0 && <div className='historyTitleContainer'>
                  <span className='historyTitle'>История вычислений</span>
                {history.length > 1 && <div className='swipeContainer'>
                    cвайп для просмотра
                    <LeftOutlined/>
                    <RightOutlined/>
                </div>}
              </div>
              }
              <div className={s.history}>
                {history.map((item, index) => (
                  <div className={s.historyItemContainer}>
                    <Card key={index} className={s.historyCard}>
                      {renderResultDetails(item, item.modelType, data[0][selectedXColumn.index],
                        data[0][selectedYColumn.index])}
                      <div key={index} className={s.historyItem}>
                        <Line
                          data={item.chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                title: {
                                  display: true,
                                  text: item.xLabel,
                                },
                              },
                              y: {
                                title: {
                                  display: true,
                                  text: item.yLabel,
                                },
                              },
                            },
                          }}
                          height={500}
                        />
                      </div>
                    </Card>
                  </div>

                ))}
              </div>
            </>
          </div>
      </div>
    </div>
  );
}

export default PolymerLinearization;
