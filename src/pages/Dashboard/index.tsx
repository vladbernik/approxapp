import { useState } from 'react';
import { Select } from 'antd';
import PolynomialApproximation from '../../components/PolynomialApproximation';
import ExcelReaderWithTable from '../../components/ExcelReaderWithTable';
import PolymerLinearization from '../../components/LinearizationApproximation';
import ExponentialApproximation from '../../components/ExponentialApproximation';
import s from './Dashboard.module.css'

// eslint-disable-next-line complexity
export default function Dashboard() {
  const [data, setData] = useState<[] | null>(null);
  const [columns, setColumns] = useState([]);
  const [selectedXColumn, setSelectedXColumn] = useState(null);
  const [selectedYColumn, setSelectedYColumn] = useState(null);
  const [approxType, setApproxType] = useState('');
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

  console.log(selectedXColumn)
  return (
    <div className={s.app}>
      {data && approxType && <div className={s.calculateInfo}>
        {approxType && (
          <div className={s.selectContainer}>
            <h2>Значения для X и Y</h2>
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

      {approxType === 'polynomial' && data.length > 0 && selectedXColumn?.value !== null && selectedYColumn?.value !== null && (
        <PolynomialApproximation
          data={data}
          selectedXColumnIndex={selectedXColumn?.index}
          selectedYColumnIndex={selectedYColumn?.index}
        />
      )}

      {approxType === 'linearization' && data.length > 0 && selectedXColumn?.value !== null && selectedYColumn?.value !== null && (
        <PolymerLinearization
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

