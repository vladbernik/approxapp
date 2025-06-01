import { Select } from 'antd';
import s from './s.module.css';
import { useCalculationContext } from '@/contexts/CalculationContext.tsx';

export function ApproximationSelector() {
  const { handleChangeModel, currentModel } = useCalculationContext();
  return (
    <div className={s.container}>
      <span className={s.title}>Модель</span>
      <Select
        placeholder="Тип аппроксимации"
        onChange={handleChangeModel}
        value={currentModel}
        options={[
          { value: 'polynomial', label: 'Полиномиальная' },
          { value: 'exponential', label: 'Экспоненциальная' },
          { value: 'linearization', label: 'Линеаризация' },
        ]}
      />
    </div>
  );
}
