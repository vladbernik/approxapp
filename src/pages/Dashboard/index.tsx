import { useState } from 'react';
import { useCalculationContext } from '../../contexts/CalculationContext';
import s from './Dashboard.module.css';
import {
  ExcelReaderWithTable,
  PolynomialApproximation,
  PolymerLinearization,
  ExponentialApproximation,
} from '@/components';

export default function Dashboard() {
  const { currentModel } = useCalculationContext();

  const [data, setData] = useState<[] | null>(null);

  const handleExcelData = (newData) => {
    setData(newData);
  };

  return (
    <div className={s.app}>
      {data && currentModel && (
        <div className={s.calculateInfo}>
          {currentModel === 'exponential' && <ExponentialApproximation data={data} />}
        </div>
      )}

      {currentModel === 'polynomial' && data && <PolynomialApproximation data={data} />}

      {currentModel === 'linearization' && data && <PolymerLinearization data={data} />}
      <ExcelReaderWithTable
        setData={setData}
        data={data}
        handleExcelData={handleExcelData}
        approxType={currentModel}
      />
    </div>
  );
}
