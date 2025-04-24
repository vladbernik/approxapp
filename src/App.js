


import React, { useState } from "react";
import * as XLSX from "xlsx";
import ExcelReader from './components/ExcelReader';
import ExponentialApproximation from "./components/ExponentialApproximation";
import PolynomialApproximation from "./components/PolynomialApproximation";
import "./styles/App.css";
import LinearizationApproximation from "./components/LinearizationApproximation";


const App = () => {
  const [data, setData] = useState([]); 
  const [columns, setColumns] = useState([]);
  const [selectedXColumnIndex, setSelectedXColumnIndex] = useState(null);
  const [selectedYColumnIndex, setSelectedYColumnIndex] = useState(null);
  const [approxType, setApproxType] = useState(""); 
  const [degree, setDegree] = useState(2); 
  const [lambdas, setLambdas] = useState([-0.5, -0.1]); 

  const handleExcelData = (newData) => {
    setData(newData);
    setColumns(newData[0] || []);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-top">
          <div className="triangle"></div>
          <div className="triangle-text">Выбор аппроксимации</div>
        </div>

        {/* ExcelReader - загрузка и отображение данных */}
        <ExcelReader onDataLoad={handleExcelData} />

        {/* Выбор типа аппроксимации */}
        {data.length > 0 && (
          <div className="select-container">
            <label>Выберите тип аппроксимации:</label>
            <select value={approxType} onChange={(e) => setApproxType(e.target.value)}>
              <option value="">Выберите...</option>
              <option value="polynomial">Полиномиальная</option>
              <option value="exponential">Экспоненциальная</option>
              <option value="linearization">Линеаризация</option>
            </select>
          </div>
        )}

        {/* Выбор колонок X и Y */}
        {approxType && (
          <div className="select-container">
            <label>X:</label>
            <select value={selectedXColumnIndex || ""} onChange={(e) => setSelectedXColumnIndex(Number(e.target.value))}>
              <option value="">Выберите X</option>
              {columns.map((col, index) => (
                <option key={index} value={index}>
                  {col}
                </option>
              ))}
            </select>

            <label>Y:</label>
            <select value={selectedYColumnIndex || ""} onChange={(e) => setSelectedYColumnIndex(Number(e.target.value))}>
              <option value="">Выберите Y</option>
              {columns.map((col, index) => (
                <option key={index} value={index}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Настройки аппроксимации */}
        {approxType === "polynomial" && (
          <div className="select-container">
            <label>Степень полинома:</label>
            <input type="number" value={degree} min="1" max="10" onChange={(e) => setDegree(Number(e.target.value))} />
          </div>
        )}


        {/* Рендеринг выбранного метода аппроксимации */}
        {approxType === "polynomial" && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
          <PolynomialApproximation
            data={data}
            degree={degree}
            selectedXColumnIndex={selectedXColumnIndex}
            selectedYColumnIndex={selectedYColumnIndex}
          />
        )}

        {approxType === "exponential" && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
          <ExponentialApproximation
            data={data}
            lambdas={lambdas}
            setLambdas={setLambdas}
            selectedXColumnIndex={selectedXColumnIndex}
            selectedYColumnIndex={selectedYColumnIndex}
          />
        )}

        {approxType === "linearization" && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
          <LinearizationApproximation
            data={data}
            selectedXColumnIndex={selectedXColumnIndex}
            selectedYColumnIndex={selectedYColumnIndex}
          />
        )}
      </header>
    </div>
  );
};

export default App;


