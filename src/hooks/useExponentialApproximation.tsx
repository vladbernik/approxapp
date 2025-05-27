import { Button, Card, Collapse, CollapseProps } from 'antd';
import * as math from 'mathjs';
import { DownloadOutlined, FileImageOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import React, { FC, useRef } from 'react';
import { ChartData } from 'chart.js';
import Alert from 'antd/es/alert/Alert';
import s from '../components/ExponentialApproximation/s.module.css';
import { ApproximationData, ApproximationParams, HistoryItemProps } from '../types/approximations';
import StartText from '../components/StartText';

const renderParametersBlock = (
  title: string,
  items: { label: string; value: string | number }[],
) => (
  <div className={s.paramsBlock}>
    <h5 className={s.lambdasParamsLabel}>{title}</h5>
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          {item.label}: {item.value}
        </li>
      ))}
    </ul>
  </div>
);

const renderParameters = (
  params: ApproximationParams | number[] | null,
  lambdas: number[],
  xLabel: string,
  yLabel: string,
  isHistory: boolean
) => {
  if (!params) {
    return null;
  }

  const isStandard = !Array.isArray(params) && params.type === 'standard';
  const isLinearized = !Array.isArray(params) && params.type === 'linearized';

  const standardParams = isStandard && (
    <>
      {renderParametersBlock(
        'Лямбды',
        lambdas.map((lambda, i) => ({
          label: `λ${i + 1}`,
          value: lambda,
        })),
        isHistory
      )}
      {renderParametersBlock(
        'Коэффициенты',
        [
          { label: 'a₀', value: params.a0?.toFixed(6) || '0' },
          ...params.a_i.slice(1).map((a, i) => ({
            label: `a_${i + 1}`,
            value: a?.toFixed(8) || '0',
          })),
        ],
        isHistory
      )}
    </>
  );

  // const nonStandardParams = (isLinearized || Array.isArray(params)) && (
  //   <>
  //     {renderParametersBlock(
  //       'Коэффициенты',
  //       [
  //         { label: 'a₀', value: Array.isArray(params) ? params[0]?.toFixed(6) : params.a0?.toFixed(6) || '0' },
  //         ...(Array.isArray(params)
  //           ? params.slice(1).map((a, i) => ({
  //             label: `a_${i + 1}`,
  //             value: a?.toFixed(8) || '0',
  //           }))
  //           : params.a_i?.map((a, i) => ({
  //           label: `a_${i + 1}`,
  //           value: a?.toFixed(8) || '0',
  //         })) || []),
  //         ...(isLinearized
  //           ? params.b_i?.map((b, i) => ({
  //           label: `b_${i + 1}`,
  //           value: b?.toFixed(8) || '0',
  //         })) || []
  //           : []),
  //       ],
  //       isHistory
  //     )}
  //   </>
  // );
 const nonStandardParams = (isLinearized || Array.isArray(params)) && (
  <>
    {renderParametersBlock(
      'Коэффициенты',
      [
        { label: 'a₀', value: Array.isArray(params) ? params[0]?.toFixed(6) : params.a0?.toFixed(6) || '0' },
        ...(Array.isArray(params)
          ? params.slice(1).map((a, i) => ({
            label: `a_${i + 1}`,
            value: a?.toFixed(8) || '0',
          }))
          : params.a_i?.map((a, i) => ({
            label: `a_${i + 1}`,
            value: a?.toFixed(8) || '0',
          })) || []),
        ...(isLinearized
          ? [
            ...params.b_i?.map((b, i) => ({
              label: `b_${i + 1}`,
              value: b?.toFixed(8) || '0',
            })) || [],
            // Добавляем новые λ, рассчитанные из b_i / a_i
            ...params.a_i?.map((a, i) => {
              if (a && params.b_i?.[i]) {
                const sigma_i = params.b_i[i] / a;
                const newLambda = (parseFloat(lambdas[i]) || 0) + sigma_i;
                return {
                  label: `λ_${i + 1} (уточнённая)`,
                  value: newLambda.toFixed(8),
                };
              }
              return null;
            }).filter(Boolean) || []
          ]
          : []),
      ],
      isHistory
    )}
  </>
);

  const xyParams = renderParametersBlock(
    'Параметры',
    [
      { label: 'X', value: xLabel },
      { label: 'Y', value: yLabel },
    ],
    isHistory
  );

  const items: CollapseProps['items'] = [
    {
      key: 'params',
      label: 'Параметры расчета',
      children: (
        <div
          className={s.paramsContainer}
          style={{ flexDirection: isHistory ? 'column' : 'row' }}
        >
          {standardParams || nonStandardParams}
          {xyParams}
        </div>
      ),
    },
  ];

  return <Collapse className={s.paramsCollapse} items={items} defaultActiveKey={['params']}/>;
};

const calculateRelativeError = (yValues: number[], approxYValues: number[]): number[] => {
  return yValues.map((y, i) => {
    if (y === 0) {
      return 0;
    } // avoid division by zero
    return Math.abs((y - approxYValues[i]) / y) * 100; // in percentage
  });
};

const createChartData = (xValues: number[], yValues: number[], approxYValues: number[]): ChartData => ({
  labels: xValues.map(x => x.toFixed(4)),
  datasets: [
    {
      label: 'Исходные данные',
      data: yValues,
      borderColor: 'blue',
      borderWidth: 0.3,
      fill: false,
    },
    {
      label: 'Аппроксимация',
      data: approxYValues,
      borderColor: 'red',
      borderWidth: 4,
      fill: false,
    },
  ],
});

const calculateApproximation = (
  xValues: number[],
  params: ApproximationParams | number[],
  lambdas: number[]
): number[] => {
  return xValues.map(x => {
    if (!Array.isArray(params) && params?.type === 'linearized') {
      return (
        (params.a0 || 0) +
        (params.a_i?.reduce((sum, a, i) => sum + a * math.exp(lambdas[i] * x), 0) || 0) +
        (params.b_i?.reduce((sum, b, i) => sum + b * x * math.exp(lambdas[i] * x), 0) || 0
        ))
    }

    if (Array.isArray(params)) {
      return (
        params[0] +
        lambdas.reduce((sum, lambda, i) => sum + params[i + 1] * math.exp(lambda * x), 0)
      );
    }

    return (
      (params?.a0 || 0) +
      (params?.a_i?.reduce((sum, a, i) => sum + a * math.exp(lambdas[i] * x), 0) || 0)
    );
  });
};

// eslint-disable-next-line react/function-component-definition
const HistoryItem: FC<HistoryItemProps> = ({ item, onSave }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const createDate = new Date(item.timestamp).toLocaleTimeString();

  console.log(item)
  const approxYValues = calculateApproximation(
    item.xValues,
    item.params,
    item.lambdas.map(Number)
  );

  const relativeErrors = calculateRelativeError(item.yValues, approxYValues);
  const avgRelativeError = relativeErrors.reduce((sum, err) => sum + err, 0) / relativeErrors.length;

  return (
    <div className={s.historyItemContainer} ref={cardRef} key={item.timestamp}>
      <Card
        title={createDate}
        className={s.historyItem}
        extra={
          <Button size="small" onClick={() => onSave(cardRef, createDate)}>
            <DownloadOutlined/>
            <FileImageOutlined/>
          </Button>
        }
      >
        {renderParameters(item.params, item.lambdas, item.xLabel, item.yLabel, true)}
        <Alert className={s.errorInfo} message={`Средняя относительная погрешность: ${avgRelativeError.toFixed(2)}%`} type="info"/>
        <div className={s.historyChart}>
          <Line
            data={createChartData(item.xValues, item.yValues, approxYValues)}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </Card>
    </div>
  );
};

const renderCurrentApproximation = (currentApproximationData: ApproximationData | null) => {
  if (!currentApproximationData) {
    return <StartText calculationGoal="approximation" />;
  }

  const { xValues, yValues, params, lambdas, xLabel, yLabel } = currentApproximationData;
  const numericLambdas = lambdas.map(Number);

  const approxYValues = calculateApproximation(xValues, params, numericLambdas);
  const relativeErrors = calculateRelativeError(yValues, approxYValues);
  const avgRelativeError = relativeErrors.reduce((sum, err) => sum + err, 0) / relativeErrors.length;

  return (
    <Card title="Текущая аппроксимация" className={s.currentCard}>
      {renderParameters(params, lambdas, xLabel, yLabel, false)}
      <Alert className={s.errorInfo} message={`Средняя относительная погрешность: ${avgRelativeError.toFixed(2)}%`} type="info"/>
      <div className={s.currentChart}>
        <Line
          width="100%"
          key={`current-${Date.now()}`}
          data={createChartData(xValues, yValues, approxYValues)}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            elements: { point: { radius: 3 } },
          }}
        />
      </div>
    </Card>
  );
};

export default function useExponentialApproximation() {
  const MemoizedHistoryItem = React.memo(HistoryItem)
  return {
    renderParameters,
    MemoizedHistoryItem,
    createChartData,
    renderCurrentApproximation,
  };
}
