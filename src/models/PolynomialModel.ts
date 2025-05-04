import * as math from 'mathjs';
import { ApproximationModel } from './BaseModal';

export const PolynomialModel: ApproximationModel = {
  name: 'polynomial',

  getInputs: () => [
    {
      name: 'degree',
      label: 'Степень полинома',
      type: 'number',
      defaultValue: 2,
    },
  ],

  compute: (inputs, rawData) => {
    const { degree } = inputs;
    const xValues = rawData.map((row) => row.x);
    const yValues = rawData.map((row) => row.y);

    const A = xValues.map((x) =>
      Array.from({ length: degree + 1 }, (_, i) => Math.pow(x, i))
    );

    const AT = math.transpose(A);
    const ATA = math.multiply(AT, A);
    const ATY = math.multiply(AT, yValues);
    const solution = math.lusolve(ATA, ATY);

    const coefficients: number[] = solution.map((val: number[]) => val[0]);

    const resultData = xValues.map((x, idx) => {
      const y = coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
      return { x, y };
    });

    return {
      data: resultData,
      metadata: {
        coefficients,
        original: rawData,
      },
    };
  },
};
