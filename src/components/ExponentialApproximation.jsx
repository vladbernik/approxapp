
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';
import '../styles/ExponentialApproximation.css';

// const ExponentialApproximation = ({ data, lambdas, setLambdas, selectedXColumnIndex, selectedYColumnIndex }) => {
//   const [approximationParams, setApproximationParams] = useState(null);
//   const [inputLambda, setInputLambda] = useState('');

//   const handleLambdaChange = (index, value) => {
//     const newLambdas = [...lambdas];
//     newLambdas[index] = parseFloat(value);
//     setLambdas(newLambdas);
//   };

//   const handleAddLambda = () => {
//     setLambdas([...lambdas, parseFloat(inputLambda)]);
//     setInputLambda('');
//   };

//   const handleDeleteLambda = (index) => {
//     const newLambdas = lambdas.filter((_, i) => i !== index);
//     setLambdas(newLambdas);
//   };

//   const handleCalculateApproximation = () => {
//     const xValues = data.slice(1).map((row) => row[selectedXColumnIndex]);
//     const yValues = data.slice(1).map((row) => row[selectedYColumnIndex]);

//     const A = xValues.map((x) =>
//       [1, ...lambdas.map((lambda) => math.exp(lambda * x))]
//     );
//     const Y = yValues;

//     const AT = math.transpose(A);
//     const ATA = math.multiply(AT, A);
//     const ATY = math.multiply(AT, Y);
//     const solution = math.lusolve(ATA, ATY);
//     const yParams = solution.map((val) => val[0]);

//     setApproximationParams(yParams);
//   };

//   const renderApproximation = () => {
//     if (!approximationParams) return null;

//     const approxYValues = data.slice(1).map((row) => {
//       const x = row[selectedXColumnIndex];
//       return (
//         approximationParams[0] +
//         lambdas.reduce((sum, lambda, i) => {
//           return sum + approximationParams[i + 1] * math.exp(lambda * x);
//         }, 0)
//       );
//     });

//     return (
//       <Line
//         data={{
//           labels: data.slice(1).map((row) => row[selectedXColumnIndex]),
//           datasets: [
//             {
//               label: 'Исходные данные',
//               data: data.slice(1).map((row) => row[selectedYColumnIndex]),
//               borderColor: 'blue',
//               fill: false,
//             },
//             {
//               label: 'Экспоненциальная аппроксимация',
//               data: approxYValues,
//               borderColor: 'red',
//               fill: false,
//             },
//           ],
//         }}
//       />
//     );
//   };

//   return (
//     <div className="exponential-approximation">
//       <h4>Лямбды</h4>
//       {lambdas.map((lambda, index) => (
//         <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//           <label>λ{index + 1}: </label>
//           <input
//             type="number"
//             value={lambda}
//             onChange={(e) => handleLambdaChange(index, e.target.value)}
//             style={{ width: '100px' }}
//           />
//           <button onClick={() => handleDeleteLambda(index)}>Удалить λ</button>
//         </div>
//       ))}
//       <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//         <input
//           type="number"
//           value={inputLambda}
//           onChange={(e) => setInputLambda(e.target.value)}
//           placeholder="Добавить новую λ"
//           style={{ width: '100px' }}
//         />
//         <button onClick={handleAddLambda}>Добавить λ</button>
//       </div>

//       <button onClick={handleCalculateApproximation} style={{ marginTop: '20px' }}>
//         Вычислить аппроксимацию
//       </button>

//       {approximationParams && (
//         <div>
//           <h4>Параметры аппроксимации (y_j)</h4>
//           <ul>
//             {approximationParams.map((param, index) => (
//               <li key={index}>y{index}: {param.toFixed(4)}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div>{renderApproximation()}</div>
//     </div>
//   );
// };

// export default ExponentialApproximation;

const ExponentialApproximation = ({ data, lambdas, setLambdas, selectedXColumnIndex, selectedYColumnIndex }) => {
  const [approximationParams, setApproximationParams] = useState(null);
  const [inputLambda, setInputLambda] = useState('');

  const handleLambdaChange = (index, value) => {
    const newLambdas = [...lambdas];
    newLambdas[index] = parseFloat(value);
    setLambdas(newLambdas);
  };

  const handleAddLambda = () => {
    setLambdas([...lambdas, parseFloat(inputLambda)]);
    setInputLambda('');
  };

  const handleDeleteLambda = (index) => {
    const newLambdas = lambdas.filter((_, i) => i !== index);
    setLambdas(newLambdas);
  };

  const handleCalculateApproximation = () => {
    // Проверка на выбранные индексы
    if (selectedXColumnIndex === null || selectedYColumnIndex === null) {
      alert("Пожалуйста, выберите колонки X и Y.");
      return;
    }

    const xValues = data.map((row) => row[selectedXColumnIndex]);
    const yValues = data.map((row) => row[selectedYColumnIndex]);

    const A = xValues.map((x) =>
      [1, ...lambdas.map((lambda) => math.exp(lambda * x))]
    );
    const Y = yValues;

    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, Y);
    const solution = math.lusolve(ATA, ATY);
    const yParams = solution.map((val) => val[0]);

    setApproximationParams(yParams);
  };

  const renderApproximation = () => {
    if (!approximationParams) return null;

    const approxYValues = data.map((row) => {
      const x = row[selectedXColumnIndex];
      return (
        approximationParams[0] +
        lambdas.reduce((sum, lambda, i) => {
          return sum + approximationParams[i + 1] * math.exp(lambda * x);
        }, 0)
      );
    });

    return (
      <Line
        data={{
          labels: data.map((row) => row[selectedXColumnIndex]),
          datasets: [
            {
              label: 'Исходные данные',
              data: data.map((row) => row[selectedYColumnIndex]),
              borderColor: 'blue',
              fill: false,
            },
            {
              label: 'Экспоненциальная аппроксимация',
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
    <div className="exponential-approximation">
      <h4>Лямбды</h4>
      {lambdas.map((lambda, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <label>λ{index + 1}: </label>
          <input
            type="number"
            value={lambda}
            onChange={(e) => handleLambdaChange(index, e.target.value)}
            style={{ width: '100px' }}
          />
          <button onClick={() => handleDeleteLambda(index)}>Удалить λ</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="number"
          value={inputLambda}
          onChange={(e) => setInputLambda(e.target.value)}
          placeholder="Добавить новую λ"
          style={{ width: '100px' }}
        />
        <button onClick={handleAddLambda}>Добавить λ</button>
      </div>

      <button onClick={handleCalculateApproximation} style={{ marginTop: '20px' }}>
        Вычислить аппроксимацию
      </button>

      {approximationParams && (
        <div>
          <h4>Параметры аппроксимации (y_j)</h4>
          <ul>
            {approximationParams.map((param, index) => (
              <li key={index}>y{index}: {param.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}

      <div>{renderApproximation()}</div>
    </div>
  );
};
export default ExponentialApproximation;

// import React, { useState, useEffect } from 'react';
// import { Line } from 'react-chartjs-2';
// import * as math from 'mathjs';
// import '../styles/ExponentialApproximation.css';

// const ExponentialApproximation = ({
//   data,
//   lambdas,
//   setLambdas,
//   selectedXColumnIndex,
//   selectedYColumnIndex,
//   columns,  // Добавляем columns для рендеринга селекторов
//   setSelectedXColumnIndex,
//   setSelectedYColumnIndex
// }) => {
//   const [approximationParams, setApproximationParams] = useState(null);
//   const [inputLambda, setInputLambda] = useState('');

//   // Проверка на существование columns, чтобы избежать ошибок при попытке использовать map

//   const handleLambdaChange = (index, value) => {
//     const newLambdas = [...lambdas];
//     newLambdas[index] = parseFloat(value);
//     setLambdas(newLambdas);
//   };

//   const handleAddLambda = () => {
//     setLambdas([...lambdas, parseFloat(inputLambda)]);
//     setInputLambda('');
//   };

//   const handleDeleteLambda = (index) => {
//     const newLambdas = lambdas.filter((_, i) => i !== index);
//     setLambdas(newLambdas);
//   };

//   const handleCalculateApproximation = () => {
//     if (selectedXColumnIndex === null || selectedYColumnIndex === null) {
//       alert('Выберите колонки X и Y');
//       return;
//     }
//     if (!data || data.length === 0) {
//       alert("Данные не загружены!");
//       return;
//     }
    
//     const xValues = data.slice(1).map((row) => parseFloat(row[selectedXColumnIndex]) || 0);
//     const yValues = data.slice(1).map((row) => parseFloat(row[selectedYColumnIndex]) || 0);

//     const A = xValues.map((x) =>
//       [1, ...lambdas.map((lambda) => math.exp(lambda * x))]
//     );
//     const Y = yValues;

//     const AT = math.transpose(A);
//     const ATA = math.multiply(AT, A);
//     const ATY = math.multiply(AT, Y);
//     const solution = math.lusolve(ATA, ATY);
//     const yParams = solution.map((val) => val[0]);

//     setApproximationParams(yParams);
//   };

//   const renderApproximation = () => {
//     if (!approximationParams) return null;

//     const approxYValues = data.slice(1).map((row) => {
//       const x = row[selectedXColumnIndex];
//       return (
//         approximationParams[0] +
//         lambdas.reduce((sum, lambda, i) => {
//           return sum + approximationParams[i + 1] * math.exp(lambda * x);
//         }, 0)
//       );
//     });

//     return (
//       <Line
//         data={{
//           labels: data.slice(1).map((row) => row[selectedXColumnIndex]),
//           datasets: [
//             {
//               label: 'Исходные данные',
//               data: data.slice(1).map((row) => row[selectedYColumnIndex]),
//               borderColor: 'blue',
//               fill: false,
//             },
//             {
//               label: 'Экспоненциальная аппроксимация',
//               data: approxYValues,
//               borderColor: 'red',
//               fill: false,
//             },
//           ],
//         }}
//       />
//     );
//   };

//   return (
//     <div className="exponential-approximation">
//       <h4>Лямбды</h4>
//       {lambdas.map((lambda, index) => (
//         <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//           <label>λ{index + 1}: </label>
//           <input
//             type="number"
//             value={lambda}
//             onChange={(e) => handleLambdaChange(index, e.target.value)}
//             style={{ width: '100px' }}
//           />
//           <button onClick={() => handleDeleteLambda(index)}>Удалить λ</button>
//         </div>
//       ))}
//       <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
//         <input
//           type="number"
//           value={inputLambda}
//           onChange={(e) => setInputLambda(e.target.value)}
//           placeholder="Добавить новую λ"
//           style={{ width: '100px' }}
//         />
//         <button onClick={handleAddLambda}>Добавить λ</button>
//       </div>

//       <button onClick={handleCalculateApproximation} style={{ marginTop: '20px' }}>
//         Вычислить аппроксимацию
//       </button>

//       {approximationParams && (
//         <div>
//           <h4>Параметры аппроксимации (y_j)</h4>
//           <ul>
//             {approximationParams.map((param, index) => (
//               <li key={index}>y{index}: {param.toFixed(4)}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div>
//         {/* Выбор колонок X и Y */}
//         <h4>Выберите колонки X и Y для аппроксимации:</h4>
//         <div className="select-container">
//           <label>X:</label>
//           <select
//             value={selectedXColumnIndex || ''}
//             onChange={(e) => setSelectedXColumnIndex(Number(e.target.value))}
//           >
//             <option value="">Выберите X</option>
//             {columns.map((col, index) => (
//               <option key={index} value={index}>
//                 {col}
//               </option>
//             ))}
//           </select>

//           <label>Y:</label>
//           <select
//             value={selectedYColumnIndex || ''}
//             onChange={(e) => setSelectedYColumnIndex(Number(e.target.value))}
//           >
//             <option value="">Выберите Y</option>
//             {columns.map((col, index) => (
//               <option key={index} value={index}>
//                 {col}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div>{renderApproximation()}</div>
//     </div>
//   );
// };

// export default ExponentialApproximation;
