import { useState } from 'react';
import { Input, Select } from 'antd';
import PolynomialApproximation from '../../components/PolynomialApproximation';
import LinearizationApproximation from '../../components/LinearizationApproximation';
import ExcelReaderWithTable from '../../components/ExcelReaderWithTable';
import s from './Dashboard.module.css'
import ExponentialApproximation from '@/components/ExponentialApproximation';

// eslint-disable-next-line complexity
export default function Dashboard() {
  const [data, setData] = useState<[] | null>(null);
  const [columns, setColumns] = useState([]);
  const [selectedXColumn, setSelectedXColumn] = useState(null);
  const [selectedYColumn, setSelectedYColumn] = useState(null);
  const [approxType, setApproxType] = useState('');
  const [degree, setDegree] = useState(2);
  const [lambdas, setLambdas] = useState([-0.5, -0.1]);

  const handleExcelData = (newData) => {
    setData(newData);
    setColumns(newData[0] || []);
  };

  const handleSelectedXColumnChange = (_, options) => {
    setSelectedXColumn(options)
  }

  const handleSelectedYColumnChange = (_, options) => {
    setSelectedYColumn(options)
  }

  console.log(data)

  return (
    <div className={s.app}>
      {data && approxType && <div className={s.calculateInfo}>
        {approxType && (
          <div className={s.selectContainer}>
            <label>Значения для X и Y</label>
            <Select
              placeholder="Выберите X"
              value={selectedXColumn?.label}
              onChange={handleSelectedXColumnChange}
              options={columns.map((col, index) => ({
                label: col,
                value: col,
                index
              }))}
            />
            <Select
              placeholder="Выберите Y"
              value={selectedYColumn?.label}
              onChange={handleSelectedYColumnChange}
              options={columns.map((col, index) => ({
                label: col,
                value: col,
                index
              }))}
            />
          </div>
        )}

        {approxType === 'exponential' && data.length > 0 && selectedXColumn?.value !== null && selectedYColumn?.value !== null && (
          <ExponentialApproximation
            data={data}
            lambdas={lambdas}
            setLambdas={setLambdas}
            selectedXColumnIndex={selectedXColumn?.index}
            selectedYColumnIndex={selectedYColumn?.index}
          />
        )}
      </div>}

      {approxType === 'polynomial' && (
        <div className={s.selectDegreeContainer}>
          <label>Степень полинома:</label>
          <Input type="number" value={degree} min="1" max="6" onChange={(e) => setDegree(Number(e.target.value))}/>
        </div>
      )}

      {approxType === 'polynomial' && data.length > 0 && selectedXColumn?.value !== null && selectedYColumn?.value !== null && (
        <PolynomialApproximation
          data={data}
          degree={degree}
          selectedXColumnIndex={selectedXColumn?.index}
          selectedYColumnIndex={selectedYColumn?.index}
        />
      )}

      {approxType === 'linearization' && data.length > 0 && selectedXColumn?.value !== null && selectedYColumn?.value !== null && (
        <LinearizationApproximation
          data={data}
          selectedXColumnIndex={selectedXColumn?.index}
          selectedYColumnIndex={selectedYColumn?.index}
        />
      )}
      <ExcelReaderWithTable setData={setData} data={data} handleExcelData={handleExcelData} approxType={approxType}
                            setApproxType={setApproxType}/>
    </div>

  );
}

