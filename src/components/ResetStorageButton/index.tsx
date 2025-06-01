import cn from 'classnames';
import { Button, message } from 'antd';
import s from './s.module.css';
import { useCalculationContext } from '@/contexts/CalculationContext';

interface ResetStorageButtonProps {
  className?: string;
}

export function ResetStorageButton({ className }: ResetStorageButtonProps) {
  const {
    history,
    currentModel,
    setLinearizationHistory,
    setPolynomialHistory,
    setExponentialHistory,
  } = useCalculationContext();

  const handleResetStorageButton = () => {
    try {
      switch (currentModel) {
        case 'polynomial':
          const filteredPolynomialHistory = history.filter((item) => item?.degree === undefined);
          setPolynomialHistory(filteredPolynomialHistory);
          break;
        case 'linearization':
          const filteredLinearizationHistory = history.filter((item) => !item?.modelType);
          setLinearizationHistory(filteredLinearizationHistory);
          break;
        case 'exponential':
          const filteredApproximationHistory = history.filter(
            (item) => item?.useLinearizedModel === undefined,
          );
          setExponentialHistory(filteredApproximationHistory);
          break;
      }
      message.success(`${currentModel} storage cleared`);
    } catch (e) {
      message.error('error due storage clear');
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleResetStorageButton}
      className={cn(s.container, className)}
    >
      Очистить историю (тек. модель)
    </Button>
  );
}
