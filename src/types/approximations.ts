import { RefObject } from 'react';

export interface ExponentialApproximationProps {
  data: any;
}

export interface ApproximationParams {
  type: 'standard' | 'linearized';
  a0: number;
  a_i: number[];
  b_i?: number[];
  E?: number
}

export interface ColumnSelection {
  index: number | null;
  label: string;
}

export interface ApproximationData {
  params: ApproximationParams | number[];
  lambdas: number[];
  xIndex: number | null;
  yIndex: number | null;
  xLabel: string;
  yLabel: string;
  xValues: number[];
  yValues: number[];
  useLinearizedModel?: boolean;
  timestamp: number;
  relativeErrors?: number[];
  avgRelativeError?: number;
}

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
};

export type HistoryItemProps = {
  item: {
    params: ApproximationParams | number[];
    lambdas: number[];
    xValues: number[];
    yValues: number[];
    xLabel: string;
    yLabel: string;
    timestamp: number;
  };
  onSave: (ref: RefObject<HTMLDivElement>, date: string) => void;
};
