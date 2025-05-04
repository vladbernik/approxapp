import * as math from 'mathjs';
import { ApproximationModel, ComputationResult } from './BaseModal';

export const ExponentialModel: ApproximationModel = {
  name: 'Экспоненциальная аппроксимация',
  getInputs: () => [
    { name: 'a0', label: 'Параметр A₀', type: 'number' },
    { name: 'a1', label: 'Параметр A₁', type: 'number' },
    { name: 'lambda1', label: 'λ₁', type: 'number' },
    { name: 'lambda2', label: 'λ₂', type: 'number' },
  ],

  compute: (inputs, rawData) => {
    const { a0, a1, lambda1, lambda2 } = inputs;

    // Извлекаем X
    const xValues = rawData.map((row) => row.x);

    // Строим аппроксимацию
    const data: ComputationResult['data'] = xValues.map((x, idx) => ({
      x,
      y:
        a0 +
        a1 * math.exp(lambda1 * x) +
        (inputs.a2 ?? 0) * math.exp(lambda2 * x), // можно расширить на больше параметров
    }));

    return {
      data,
      metadata: {
        original: rawData.map((row) => ({ x: row.x, y: row.y })),
      },
    };
  },
};
