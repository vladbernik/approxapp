import { Select } from 'antd';

interface ApproximationSelectorProps {
  setApproxType: (approxType: string) => void
}

export default function ApproximationSelector({ setApproxType }: ApproximationSelectorProps) {
  return <Select
    placeholder="Тип аппроксимации"
    onChange={setApproxType}
    options={[
      { value: 'polynomial', label: 'Полиномиальная' },
      { value: 'exponential', label: 'Экспоненциальная' },
      { value: 'linearization', label: 'Линеаризация' },
    ]}
  />
}
