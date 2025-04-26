// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import * as math from 'mathjs';

// const PolynomialApproximation = ({ data, degree }) => {
//   const [coefficients, setCoefficients] = useState(null);
//   const [selectedXColumnIndex, setSelectedXColumnIndex] = useState(0);
//   const [selectedYColumnIndex, setSelectedYColumnIndex] = useState(1);

//   const calculatePolynomial = () => {
//     const xValues = data.slice(1).map((row) => row[selectedXColumnIndex]);
//     const yValues = data.slice(1).map((row) => row[selectedYColumnIndex]);
//     if (!xValues.length || !yValues.length) {
//       alert("Ошибка: выберите корректные колонки для X и Y!");
//       return;
//     }

//     const A = xValues.map((x) =>
//       Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i))
//     );

//     const AT = math.transpose(A);
//     const ATA = math.multiply(AT, A);
//     const ATY = math.multiply(AT, yValues);
//     const solution = math.lusolve(ATA, ATY);

//     setCoefficients(solution.map((val) => val[0]));
//   };

  
//   const renderPolynomialChart = () => {
//     if (!coefficients) return null;

//     const approxYValues = data.slice(1).map((row) => {
//       const x = row[selectedXColumnIndex];
//       return coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
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
//               label: 'Полиномиальная аппроксимация',
//               data: approxYValues,
//               borderColor: 'green',
//               fill: false,
//             },
//           ],
//         }}
//       />
//     );
//   };

//   return (
//     <div>
//       <h3>Полиномиальная аппроксимация</h3>

//       <h4>Выберите колонку для X</h4>
//       <select value={selectedXColumnIndex} onChange={(e) => setSelectedXColumnIndex(parseInt(e.target.value, 10))}>
//         {data[0].map((_, index) => (
//           <option key={index} value={index}>
//             Колонка {index + 1}
//           </option>
//         ))}
//       </select>

//       <h4>Выберите колонку для Y</h4>
//       <select value={selectedYColumnIndex} onChange={(e) => setSelectedYColumnIndex(parseInt(e.target.value, 10))}>
//         {data[0].map((_, index) => (
//           <option key={index} value={index}>
//             Колонка {index + 1}
//           </option>
//         ))}
//       </select>

//       <button onClick={calculatePolynomial}>Вычислить полином</button>

//       {coefficients && (
//         <div>
//           <h4>Коэффициенты полинома</h4>
//           <ul>
//             {coefficients.map((coeff, index) => (
//               <li key={index}>
//                 Коэффициент {index}: {coeff.toFixed(4)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <div>{renderPolynomialChart()}</div>
//     </div>
//   );
// };

// export default PolynomialApproximation;
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as math from 'mathjs';

const PolynomialApproximation = ({ data, degree, selectedXColumnIndex, selectedYColumnIndex }) => {
  const [coefficients, setCoefficients] = useState(null);

  const calculatePolynomial = () => {
    try {
      const xValues = data.slice(1).map((row) => parseFloat(row[selectedXColumnIndex]));
      const yValues = data.slice(1).map((row) => parseFloat(row[selectedYColumnIndex]));

      if (xValues.some(isNaN) || yValues.some(isNaN)) {
        alert("Ошибка: В данных есть некорректные значения!");
        return;
      }

      const A = xValues.map((x) => Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i)));
      const AT = math.transpose(A);
      const ATA = math.multiply(AT, A);
      const ATY = math.multiply(AT, yValues);
      const solution = math.lusolve(ATA, ATY);

      setCoefficients(solution.map((val) => val[0]));
    } catch (error) {
      console.error("Ошибка при вычислении полинома:", error);
      alert("Ошибка при вычислении полинома.");
    }
  };

  const renderPolynomialChart = () => {
    if (!coefficients) return null;

    const approxYValues = data.slice(1).map((row) => {
      const x = parseFloat(row[selectedXColumnIndex]);
      return coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
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
      <button onClick={calculatePolynomial}>Вычислить полином</button>

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
};

export default PolynomialApproximation;
