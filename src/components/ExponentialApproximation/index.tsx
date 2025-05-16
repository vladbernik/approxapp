import { useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import * as htmlToImage from 'html-to-image';
import cn from 'classnames';
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
import { FileImageOutlined, DownloadOutlined } from '@ant-design/icons';
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

export default function ExponentialApproximation({ data, lambdas, setLambdas }) {
  const [approximationParams, setApproximationParams] = useState(null);
  const [inputLambda, setInputLambda] = useState('');
  const [history, setHistory] = useState([]);
  const [columns, setColumns] = useState(data?.[0] || []);
  const [selectedXColumn, setSelectedXColumn] = useState({ index: null, label: '' });
  const [selectedYColumn, setSelectedYColumn] = useState({ index: null, label: '' });
  const [currentApproximationData, setCurrentApproximationData] = useState(null);

  const cardRef = useRef(null);

  const numericData = useMemo(() => {
    if (!data || selectedXColumn.index === null || selectedYColumn.index === null) {
 return [];
}

    return data.filter(row => {
      const x = row[selectedXColumn.index];
      const y = row[selectedYColumn.index];
      return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y));
    });
  }, [data, selectedXColumn.index, selectedYColumn.index]);

  const saveCardAsImage = async () => {
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `аппроксимация-${new Date().toLocaleString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Ошибка при сохранении карточки:', error);
    }
  };

  const handleLambdaChange = (index, value) => {
    const newLambdas = [...lambdas];
    newLambdas[index] = value;
    setLambdas(newLambdas);
  };

  const handleAddLambda = () => {
    setLambdas([...lambdas, inputLambda]);
    setInputLambda('');
  };

  const handleDeleteLambda = (index) => {
    const newLambdas = lambdas.filter((_, i) => i !== index);
    setLambdas(newLambdas);
  };

  const handleCalculateApproximation = () => {
    if (selectedXColumn.index === null || selectedYColumn.index === null) {
      alert('Пожалуйста, выберите колонки X и Y.');
      return;
    }

    const numericLambdas = lambdas.map(lambda => {
      const num = parseFloat(lambda);
      return isNaN(num) ? 0 : num;
    });

    const xValues = numericData.map(row => parseFloat(row[selectedXColumn.index]));
    const yValues = numericData.map(row => parseFloat(row[selectedYColumn.index]));

    const A = xValues.map(x =>
      [1, ...numericLambdas.map(lambda => math.exp(lambda * x))]
    );

    const Y = yValues;
    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, Y);
    const solution = math.lusolve(ATA, ATY);
    const yParams = solution.map(val => val[0]);

    setApproximationParams(yParams);

    // Сохраняем данные для текущей аппроксимации
    const newApproximation = {
      params: [...yParams],
      lambdas: [...lambdas],
      xIndex: selectedXColumn.index,
      yIndex: selectedYColumn.index,
      xLabel: selectedXColumn.label,
      yLabel: selectedYColumn.label,
      xValues: [...xValues],
      yValues: [...yValues],
      timestamp: Date.now()
    };

    setCurrentApproximationData(newApproximation);

    // Добавляем в историю
    setHistory(prev => {
      const lastItem = prev[0];
      if (lastItem &&
        lastItem.xIndex === newApproximation.xIndex &&
        lastItem.yIndex === newApproximation.yIndex &&
        lastItem.lambdas.length === newApproximation.lambdas.length &&
        lastItem.lambdas.every((lambda, i) => lambda === newApproximation.lambdas[i])
      ) {
        return prev;
      }
      return [newApproximation, ...prev].slice(0, 10);
    });
  };

  const renderParameters = (params, lambdas, xLabel, yLabel, isCurrent: boolean) => (
    <div className={cn(s.parameters, isCurrent && s.currentParameters)}>
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

  const createChartData = (xValues, yValues, approxYValues) => ({
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
        borderColor: 'green',
        fill: false,
      },
    ],
  });

  const renderHistoryItem = (item) => {
    const approxYValues = item.xValues.map(x => {
      const numericLambdas = item.lambdas.map(lambda => parseFloat(lambda) || 0);
      return item.params[0] + numericLambdas.reduce((sum, lambda, i) => {
        return sum + item.params[i + 1] * math.exp(lambda * x);
      }, 0);
    });

    return (
      <div ref={cardRef} key={item.timestamp}>
        <Card
          title={`Аппроксимация ${new Date(item.timestamp).toLocaleTimeString()}`}
          className={s.historyItem}
          extra={
            <Button size="small" onClick={saveCardAsImage}>
              <DownloadOutlined />
              <FileImageOutlined />
            </Button>
          }
        >
          {renderParameters(item.params, item.lambdas, item.xLabel, item.yLabel, false)}
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

  const renderCurrentApproximation = () => {
    if (!currentApproximationData) {
      return <div>Нажмите "Вычислить аппроксимацию" для построения графика</div>;
    }

    const { xValues, yValues, params, lambdas, xLabel, yLabel } = currentApproximationData;

    const numericLambdas = lambdas.map(lambda => parseFloat(lambda) || 0);
    const approxYValues = xValues.map(x =>
        params[0] + numericLambdas.reduce((sum, lambda, i) => {
          return sum + params[i + 1] * math.exp(lambda * x);
        }, 0)
    );

    return (
      <Card title="Текущая аппроксимация" className={s.currentCard}>
        {renderParameters(params, lambdas, xLabel, yLabel, true)}
        <div className={s.currentChart}>
          <Line
            data={createChartData(xValues, yValues, approxYValues)}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className={s.container}>
      <div className={s.controls}>
        <div className={s.selection}>
          <h2>Значения для X и Y</h2>
          <Select
            placeholder="Выберите X"
            value={selectedXColumn.label}
            onChange={(_, option) => setSelectedXColumn({ index: option.index, label: option.label })}
            options={columns.map((col, index) => ({
              label: col,
              value: col,
              index
            }))}
          />
          <Select
            placeholder="Выберите Y"
            value={selectedYColumn.label}
            onChange={(_, option) => setSelectedYColumn({ index: option.index, label: option.label })}
            options={columns.map((col, index) => ({
              label: col,
              value: col,
              index
            }))}
          />
          <div className={s.lambdas}>
            <h4>Лямбды</h4>
            {lambdas.map((lambda, index) => (
              <div key={index} className={s.lambdaItem}>
                <label>λ{index + 1}: </label>
                <Input
                  value={lambda}
                  onChange={(e) => handleLambdaChange(index, e.target.value)}
                  className={s.lambdaInput}
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
                placeholder="Новая λ"
                onChange={(e) => setInputLambda(e.target.value)}
                className={s.lambdaInput}
              />
              <Button onClick={handleAddLambda}>Добавить λ</Button>
            </div>

            <Button
              type="primary"
              onClick={handleCalculateApproximation}
              disabled={
                selectedXColumn.index === null ||
                selectedYColumn.index === null ||
                lambdas.length === 0
              }
            >
              Вычислить аппроксимацию
            </Button>
          </div>
        </div>
        <div className={s.charts}>
          <div className={s.current}>
            {renderCurrentApproximation()}
          </div>
          <div className={s.history}>
            <h2 className={s.historyLabel}>История вычислений</h2>
            <div className={s.historyItems}>
              {history.map(item => renderHistoryItem(item))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
