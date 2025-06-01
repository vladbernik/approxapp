import { Result } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import s from './s.module.css';

interface StartTextProps {
  calculationGoal: 'linearization' | 'polinomial' | 'approximation';
}

export function StartText({ calculationGoal }: StartTextProps) {
  const getCalculationGoalText = (calculationGoal: string) => {
    if (calculationGoal === 'approximation') {
      return <p>Вычислить аппроксимацию для построения графика</p>;
    }
    if (calculationGoal === 'polinomial') {
      return <p>Вычислить полином</p>;
    }
    if (calculationGoal === 'linearization') {
      return <p>Выполнить линеаризацию</p>;
    }
  };
  return (
    <div className={s.container}>
      <Result icon={<BarChartOutlined />} title={getCalculationGoalText(calculationGoal)} />
    </div>
  );
}
