import { Button, Input, Select, Checkbox, Form, Row, Col, InputNumber } from 'antd';
import { FC } from 'react';
import ApproximationSelector from '../ApproximationSelector';
import { DataAndParametersSelectorProps } from './types';
import s from './s.module.css';

const MODEL_TYPES = [
  { value: 'maxwell', label: 'Модель Максвелла (σ(t) = σ₀·exp(-t/τ))' },
  { value: 'power', label: 'Степенная модель (y = a·x^b)' },
  { value: 'relaxation', label: 'Полная модель релаксации (σ(t) = E·ε + (σ₀ - E·ε)·exp(-t/θ))' },
];

// eslint-disable-next-line complexity,max-lines-per-function,react/function-component-definition
const DataAndParametersSelector: FC<DataAndParametersSelectorProps> = ({
                                                                         type,
                                                                         data,
                                                                         selectedXColumn,
                                                                         selectedYColumn,
                                                                         onXColumnChange,
                                                                         onYColumnChange,

                                                                         // Полиномиальная аппроксимация
                                                                         degree,
                                                                         onDegreeChange,
                                                                         onCalculatePolynomial,

                                                                         // Экспоненциальная аппроксимация
                                                                         lambdas = [],
                                                                         inputLambda = '',
                                                                         useLinearizedModel = false,
                                                                         onLambdaChange,
                                                                         onAddLambda,
                                                                         onDeleteLambda,
                                                                         onInputLambdaChange,
                                                                         onLinearizedModelChange,
                                                                         onCalculateApproximation,

                                                                         // Линеаризация
                                                                         modelType = 'maxwell',
                                                                         onModelTypeChange,
                                                                         params = { E: null, epsilon: null },
                                                                         onParamsChange,
                                                                         onCalculateLinearization
                                                                       }) => {
  const columns = data[0] || [];

  const handleSelectedXColumnChange = (_, option: any) => {
    onXColumnChange({
      index: option.index,
      label: option.label
    });
  };

  const handleSelectedYColumnChange = (_, option: any) => {
    onYColumnChange({
      index: option.index,
      label: option.label
    });
  };

  const handleParamsChange = (key: 'E' | 'epsilon', value: number | null) => {
    if (onParamsChange) {
      onParamsChange({
        ...params,
        [key]: value
      });
    }
  };

  return (
    <div className={s.container}>
      <ApproximationSelector />
      <h2 className={s.title}>Значения для X и Y</h2>

      <div className={s.selectContainer}>
        <Select
          placeholder="Выберите X"
          value={selectedXColumn.label || undefined}
          onChange={handleSelectedXColumnChange}
          options={columns.map((col, index) => ({
            label: col,
            value: col,
            index
          }))}
          className={s.columnSelect}
        />

        <Select
          placeholder="Выберите Y"
          value={selectedYColumn.label || undefined}
          onChange={handleSelectedYColumnChange}
          options={columns.map((col, index) => ({
            label: col,
            value: col,
            index
          }))}
          className={s.columnSelect}
        />
      </div>

      {type === 'polynomial' && (
        <div className={s.polynomialSettings}>
          <h3>Полиномиальное приближение</h3>
          <div className={s.selectDegreeContainer}>
            <label>Степень полинома:</label>
            <Input
              type="number"
              value={degree}
              min="1"
              max="6"
              onChange={(e) => onDegreeChange?.(Number(e.target.value))}
              className={s.degreeInput}
            />
          </div>
          <Button
            type="primary"
            disabled={!degree || selectedXColumn.index === null || selectedYColumn.index === null}
            onClick={onCalculatePolynomial}
            className={s.calculateButton}
          >
            Вычислить полином
          </Button>
        </div>
      )}

      {type === 'approximation' && (
        <div className={s.lambdas}>
          <span className={s.lambdaLabel}>Лямбды</span>
          {lambdas.map((lambda, index) => (
            <div key={index} className={s.lambdaItem}>
              <label>λ{index + 1}: </label>
              <Input
                value={lambda}
                onChange={(e) => onLambdaChange?.(index, e.target.value)}
                className={s.lambdaInput}
              />
              {index !== 0 && (
                <Button onClick={() => onDeleteLambda?.(index)}>
                  Удалить λ
                </Button>
              )}
            </div>
          ))}
          <div className={s.lambdaControl}>
            <Input
              value={inputLambda}
              placeholder="Новая λ"
              onChange={(e) => onInputLambdaChange?.(e.target.value)}
              className={s.lambdaInput}
            />
            <Button onClick={onAddLambda}>Добавить λ</Button>
          </div>

          <div className={s.modelSwitch}>
            <Checkbox
              checked={useLinearizedModel}
              onChange={(e) => onLinearizedModelChange?.(e.target.checked)}
            >
              Использовать линеаризованную модель
            </Checkbox>
          </div>

          <Button
            type="primary"
            onClick={onCalculateApproximation}
            className={s.calculateButton}
            disabled={
              selectedXColumn.index === null ||
              selectedYColumn.index === null
            }
          >
            Вычислить аппроксимацию
          </Button>
        </div>
      )}

      {type === 'linearization' && (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Выберите модель" className={s.formRow}>
                <Select
                  value={modelType}
                  onChange={onModelTypeChange}
                  options={MODEL_TYPES}
                  className={s.columnSelect}
                />
              </Form.Item>

              {modelType === 'relaxation' && (
                <>
                  <Form.Item label="Параметр E" className={s.formRow}>
                    <InputNumber
                      value={params.E}
                      onChange={(value) => handleParamsChange('E', value)}
                      className={s.paramInput}
                    />
                  </Form.Item>
                  <Form.Item label="Параметр epsilon" className={s.formRow}>
                    <InputNumber
                      value={params.epsilon}
                      onChange={(value) => handleParamsChange('epsilon', value)}
                      className={s.paramInput}
                    />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>

          <Button
            type="primary"
            onClick={onCalculateLinearization}
            className={s.calculateButton}
            disabled={
              selectedXColumn.index === null ||
              selectedYColumn.index === null ||
              (modelType === 'relaxation' && (params.E === null || params.epsilon === null))
            }
          >
            Выполнить линеаризацию
          </Button>
        </Form>
      )}
    </div>
  );
};

export default DataAndParametersSelector;
