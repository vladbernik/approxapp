import { useState } from 'react';
import { Input, Select } from 'antd';
import ExcelReaderWithTable from './components/ExcelReaderWithTable';
import ExponentialApproximation from './components/ExponentialApproximation';
import PolynomialApproximation from './components/PolynomialApproximation';
import LinearizationApproximation from './components/LinearizationApproximation';
import Header from './components/Header';
import s from './App.module.css'

// eslint-disable-next-line complexity
function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedXColumnIndex, setSelectedXColumnIndex] = useState(null);
  const [selectedYColumnIndex, setSelectedYColumnIndex] = useState(null);
  const [approxType, setApproxType] = useState('');
  const [degree, setDegree] = useState(2);
  const [lambdas, setLambdas] = useState([-0.5, -0.1]);

  const handleExcelData = (newData) => {
    setData(newData);
    setColumns(newData[0] || []);
  };

  return (
    <div className={s.container}>
      <Header/>

      {approxType && (
        <div className={s.selectContainer}>
          <label>Значения для X и Y</label>
          <Select
            placeholder="Выберите X"
            value={selectedXColumnIndex}
            onChange={(value) => setSelectedXColumnIndex(value)}
            options={columns.map((col, index) => ({
              label: col,
              value: col,
            }))}
          />
          <Select
            placeholder="Выберите Y"
            value={selectedYColumnIndex}
            onChange={(value) => setSelectedYColumnIndex(value)}
            options={columns.map((col, index) => ({
              label: col,
              value: col,
            }))}
          />
        </div>
      )}

      {approxType === 'polynomial' && (
        <div className={s.selectDegreeContainer}>
          <label>Степень полинома:</label>
          <Input type="number" value={degree} min="1" max="6" onChange={(e) => setDegree(Number(e.target.value))}/>
        </div>
      )}

      {approxType === 'polynomial' && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
        <PolynomialApproximation
          data={data}
          degree={degree}
          selectedXColumnIndex={selectedXColumnIndex}
          selectedYColumnIndex={selectedYColumnIndex}
        />
      )}

      {approxType === 'exponential' && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
        <ExponentialApproximation
          data={data}
          lambdas={lambdas}
          setLambdas={setLambdas}
          selectedXColumnIndex={selectedXColumnIndex}
          selectedYColumnIndex={selectedYColumnIndex}
        />
      )}

      {approxType === 'linearization' && data.length > 0 && selectedXColumnIndex !== null && selectedYColumnIndex !== null && (
        <LinearizationApproximation
          data={data}
          selectedXColumnIndex={selectedXColumnIndex}
          selectedYColumnIndex={selectedYColumnIndex}
        />
      )}
      <ExcelReaderWithTable data={data} onDataLoad={handleExcelData} approxType={approxType}
                            setApproxType={setApproxType}/>
    </div>
  );
}

export default App;

