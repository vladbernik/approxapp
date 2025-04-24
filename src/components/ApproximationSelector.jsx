
// export default ApproximationChooser;

import React, { useState } from 'react';
import ExponentialApproximation from './ExponentialApproximation';
import PolynomialApproximation from './PolynomialApproximation';
// import "../styles/ApproximationSelector.css";
const ApproximationSelector = ({ data }) => {
  const [approximationType, setApproximationType] = useState('exponential');
  const [selectedXColumnIndex, setSelectedXColumnIndex] = useState(0);
  const [selectedYColumnIndex, setSelectedYColumnIndex] = useState(1);
  const [lambdas, setLambdas] = useState([0.1, 0.5, 1]); // Для экспоненциальной
  const [degree, setDegree] = useState(2); // Для полиномиальной

  return (
    <div>
      <h3>Выбор аппроксимации</h3>

      <label>Тип аппроксимации:</label>
      <select value={approximationType} onChange={(e) => setApproximationType(e.target.value)}>
        <option value="exponential">Экспоненциальная</option>
        <option value="polynomial">Полиномиальная</option>
      </select>

      <h4>Выберите колонку для X</h4>
      <select value={selectedXColumnIndex} onChange={(e) => setSelectedXColumnIndex(parseInt(e.target.value, 10))}>
        {data[0].map((_, index) => (
          <option key={index} value={index}>
            Колонка {index + 1}
          </option>
        ))}
      </select>

      <h4>Выберите колонку для Y</h4>
      <select value={selectedYColumnIndex} onChange={(e) => setSelectedYColumnIndex(parseInt(e.target.value, 10))}>
        {data[0].map((_, index) => (
          <option key={index} value={index}>
            Колонка {index + 1}
          </option>
        ))}
      </select>

      {approximationType === 'exponential' && (
        <ExponentialApproximation
          data={data}
          lambdas={lambdas}
          setLambdas={setLambdas}
          selectedXColumnIndex={selectedXColumnIndex}
          selectedYColumnIndex={selectedYColumnIndex}
        />
      )}

      {approximationType === 'polynomial' && (
        <div>
          <label>Степень полинома:</label>
          <input
            type="number"
            value={degree}
            onChange={(e) => setDegree(parseInt(e.target.value, 10))}
            min="1"
            max="10"
          />
          <PolynomialApproximation
            data={data}
            degree={degree}
            selectedXColumnIndex={selectedXColumnIndex}
            selectedYColumnIndex={selectedYColumnIndex}
          />
        </div>
      )}
    </div>
  );
};

export default ApproximationSelector;



