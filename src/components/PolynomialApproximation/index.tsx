import { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import { Button, Card, Collapse, message } from 'antd';
import { DownloadOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { saveCardAsImage } from '../../utils';
import DataAndParametersSelector from '../DataAndParametersSelector';
import { useCalculationContext } from '../../contexts/CalculationContext';
import StartText from '../StartText';
import s from './s.module.css';

const { Panel } = Collapse;

// eslint-disable-next-line max-lines-per-function
function PolynomialApproximation({ data }) {
  const {
    selectedXColumn,
    selectedYColumn,
    setSelectedXColumn,
    setSelectedYColumn,
    setHistory,
    degree,
    setDegree,
    history,
    currentCoefficients,
    setCurrentCoefficients
  } = useCalculationContext();

  const cardRef = useRef<HTMLDivElement>(null);

  const calculatePolynomial = () => {
    try {
      const xValues = data.slice(1).map((row) => row[selectedXColumn.index]);
      const yValues = data.slice(1).map((row) => row[selectedYColumn.index]);

      if (xValues.some(isNaN) || yValues.some(isNaN)) {
        alert('Ошибка: В данных есть некорректные значения!');
        return;
      }

      const A = xValues.map((x) => Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i)));
      const AT = math.transpose(A);
      const ATA = math.multiply(AT, A);
      const ATY = math.multiply(AT, yValues);
      const solution = math.lusolve(ATA, ATY);

      const coefficients = solution.map((val) => val[0]);
      setCurrentCoefficients(coefficients);

      setHistory(prev => [{
        degree,
        coefficients,
        timestamp: new Date().toLocaleTimeString(),
        xValues: [...xValues],
        yValues: [...yValues],
        xLabel: selectedXColumn.label,
        yLabel: selectedYColumn.label
      }, ...prev]);
    } catch (error) {
      console.error('Ошибка при вычислении полинома:', error);
      message.error('Ошибка при вычислении полинома.');
    }
  };

  const renderPolynomialChart = (xValues, yValues, coefficients, isCurrent = false) => {
    if (!coefficients) {
      return null;
    }

    const approxYValues = xValues.map((x) => {
      return coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
    });

    return (
      <Line
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
              label: 'Полиномиальное приближение',
              data: approxYValues,
              borderColor: isCurrent ? 'green' : 'orange',
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          maintainAspectRatio: false,
        }}
      />
    );
  };

  const renderCoefficients = (coefficients, xLabel = '', yLabel = '') => (
    <div className={s.coefficientsContainer}>
      <h4>Коэффициенты полинома:</h4>
      <ul className={s.coefficientsList}>
        {coefficients?.map((coeff, index) => (
          <li key={index}>
            <span className={s.coefficientLabel}>Коэффициент {index}:</span>
            <span className={s.coefficientValue}>{coeff.toFixed(4)}</span>
          </li>
        ))}
      </ul>
      <div className={s.additionalInfo}>
        <p>X: {xLabel}</p>
        <p>Y: {yLabel}</p>
      </div>
    </div>
  );

  console.log(currentCoefficients)
  return (
    <div className={s.container}>
      <div className={s.controls}>
        <DataAndParametersSelector
          type="polynomial"
          data={data}
          selectedXColumn={selectedXColumn}
          selectedYColumn={selectedYColumn}
          onXColumnChange={setSelectedXColumn}
          onYColumnChange={setSelectedYColumn}
          degree={degree}
          onDegreeChange={setDegree}
          onCalculatePolynomial={calculatePolynomial}
        />

        <div className={s.charts}>
          {currentCoefficients ? (
            <div className={s.currentChartContainer}>
              <Card
                title={`Текущее приближение (степень ${degree})`}
                className={s.currentCard}
                extra={
                  <Button
                    size="small"
                    onClick={() => saveCardAsImage(cardRef, `approximation_${degree}`)}
                    icon={<DownloadOutlined/>}
                  />
                }
              >
                <Collapse defaultActiveKey="params">
                  <Panel header="Параметры расчета" key="params">
                    {renderCoefficients(currentCoefficients, selectedXColumn.label, selectedYColumn.label)}
                  </Panel>
                </Collapse>
                <div className={s.chartWrapper} ref={cardRef}>
                  {renderPolynomialChart(
                    data.slice(1).map((row) => row[selectedXColumn.index]),
                    data.slice(1).map((row) => row[selectedYColumn.index]),
                    currentCoefficients,
                    true
                  )}
                </div>
              </Card>
            </div>
          ): <StartText calculationGoal="polinomial" />}

          {history.length > 0 && (
            <div className={s.history}>
              {history.length > 0 && <div className='historyTitleContainer'>
                  <span className='historyTitle'>История вычислений</span>
                {history.length > 1 &&<div className='swipeContainer'>
                    cвайп для просмотра
                    <LeftOutlined/>
                    <RightOutlined/>
                </div>}
              </div>
              }
              <div className={s.historyItems}>
                {history.map((item, index) => (
                  <div key={index} className={s.historyItemContainer}>
                    <Card
                      className={s.historyCard}
                      title={`Приближение степени ${item.degree} (${item.timestamp})`}
                      extra={
                        <Button
                          size="small"
                          onClick={() => saveCardAsImage(cardRef, `history_${item.timestamp}`)}
                          icon={<DownloadOutlined/>}
                        />
                      }
                    >
                      <Collapse defaultActiveKey="params">
                        <Panel header="Параметры расчета" key="params">
                          {renderCoefficients(item.coefficients, item.xLabel, item.yLabel)}
                        </Panel>
                      </Collapse>
                      <div className={s.chartWrapper}>
                        {renderPolynomialChart(item.xValues, item.yValues, item.coefficients)}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolynomialApproximation;
