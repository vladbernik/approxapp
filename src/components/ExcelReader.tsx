import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTable, useRowSelect } from 'react-table';
import * as XLSX from 'xlsx';
import { isEqual } from 'lodash';
import { Bar } from 'react-chartjs-2';
import ExcelTable from './ExcelTable';
import '../styles/ExcelReader.css'
import StressStrainChart from './StressStrainChart';
import ExponentialChart from './ExponentialChart';
import '../styles/App.css'
import ExponentialApproximation from './ExponentialApproximation';

// const ExcelReader = () => {
//   const [excelData, setExcelData] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [displayedRows, setDisplayedRows] = useState(25);
//   const [chartParams, setChartParams] = useState({ a: null, b: null });
//   const [machineParams, setMachineParams] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showTable, setShowTable] = useState(true);
//   const [showChart, setShowChart] = useState(false);
//   const [lambdas, setLambdas] = useState([-0.5, -0.1]); // Состояние для лямбд

//   const handleFileUpload = (e) => {
//     setLoading(true);
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const binaryString = event.target.result;
//       const workbook = XLSX.read(binaryString, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//       setExcelData(data);
//       setLoading(false);
//     };

//     reader.readAsBinaryString(file);
//   };

//   const handleCellChange = (e, rowIndex, cellIndex) => {
//     const newData = [...excelData];
//     newData[rowIndex][cellIndex] = e.target.value;
//     setExcelData(newData);
//   };

//   const handleDeleteRow = (rowIndex) => {
//     const newData = excelData.filter((row, index) => index !== rowIndex);
//     setExcelData(newData);
//   };

//   const handleDeleteColumn = (columnIndex) => {
//     const newData = excelData.map(row => row.filter((cell, index) => index !== columnIndex));
//     setExcelData(newData);
//   };

//   const handleSave = () => {
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.aoa_to_sheet(excelData);
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     XLSX.writeFile(wb, 'edited_file.xlsx');
//   };

//   const handleExpandRows = () => {
//     setDisplayedRows(prevRows => prevRows + 25);
//   };

//   const handleParamSelection = (a, b) => {
//     setChartParams({ a, b });
//     setShowChart(true); // Показать график при выборе параметров
//   };

//   const handleMachineParamsSubmit = (params) => {
//     setMachineParams(params);
//   };

//   return (
//     <div className="table-container">
//       <label htmlFor="file-upload" className="custom-file-upload">
//         Загрузить файл
//       </label>
//       <input id="file-upload" type="file" onChange={handleFileUpload} className="file-upload-input" />

//       {excelData && (
//         <>
//           <button onClick={() => setShowTable(!showTable)}>
//             {showTable ? 'Скрыть данные' : 'Показать данные'}
//           </button>

//           {showTable && (
//             <>
//               <ExcelTable
//                 excelData={excelData.slice(0, displayedRows)}
//                 editMode={editMode}
//                 setEditMode={setEditMode}
//                 handleDeleteColumn={handleDeleteColumn}
//                 handleCellChange={handleCellChange}
//                 handleDeleteRow={handleDeleteRow}
//                 handleSave={handleSave}
//                 onParamSelection={handleParamSelection}
//                 onMachineParamsSubmit={handleMachineParamsSubmit}
//               />

//               {excelData.length > displayedRows && (
//                 <button onClick={handleExpandRows}>Показать больше строк</button>
//               )}
//             </>
//           )}

//           {/* Кнопки для управления графиками */}
//           {/* <button onClick={() => setShowChart(!showChart)}>
//             {showChart ? 'Скрыть график' : 'Показать график'}
//           </button> */}

//           {showChart && chartParams.a !== null && chartParams.b !== null && (
//             <ExponentialChart data={excelData} a={chartParams.a} b={chartParams.b} />
//           )}

//           {/* Компонент для аппроксимации */}
//           <ExponentialApproximation
//             data={excelData}
//             lambdas={lambdas}
//             setLambdas={setLambdas}
//           />

//           {machineParams && (
//             <StressStrainChart
//               data={excelData}
//               machineParams={machineParams}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ExcelReader;

function ExcelReader({ onDataLoad }) {
  const [excelData, setExcelData] = useState(null);
  const [displayedRows, setDisplayedRows] = useState(25);
  const [showTable, setShowTable] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      setExcelData(data);
      onDataLoad(data); // Передача данных в App.js
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="table-container">
      <label className="custom-file-upload">
        Загрузить Excel
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </label>

      {excelData && (
        <>
          <button onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Скрыть данные' : 'Показать данные'}
          </button>

          {showTable && (
            <table>
              <thead>
                <tr>
                  {excelData[0].map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(1, displayedRows).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {excelData.length > displayedRows && (
            <button onClick={() => setDisplayedRows(displayedRows + 25)}>Показать больше строк</button>
          )}
        </>
      )}
    </div>
  );
}

export default ExcelReader;
