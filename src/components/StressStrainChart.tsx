// import React from 'react';
// import { Line } from 'react-chartjs-2';

// const StressStrainChart = ({ data, machineParams }) => {
//   const { crossSectionArea, sampleLength, forceData, timeData, displacementData } = machineParams;

//   const stress = data.slice(1).map(row => row[forceData] / crossSectionArea);
//   const strain = data.slice(1).map(row => row[displacementData] / sampleLength);

//   const chartData = {
//     labels: strain,
//     datasets: [
//       {
//         label: 'Stress-Strain Curve',
//         data: stress,
//         borderColor: 'rgba(75,192,192,1)',
//         fill: false,
//       },
//     ],
//   };

//   const options = {
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Strain',
//         },
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'Stress',
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Кривая Напряжение/Деформация</h2>
//       <Line data={chartData} options={options} />
//     </div>
//   );
// };

// export default StressStrainChart;
