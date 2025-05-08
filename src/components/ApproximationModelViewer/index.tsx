import { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { ExponentialModel } from '../../models/ExponentialModel';
import { PolynomialModel } from '../../models/PolynomialModel';
import { ComputationResult } from '../../models/BaseModal';
import { ChartRenderer } from '../ChartRenderer';

const models = [PolynomialModel, ExponentialModel];

interface Props {
  data: { x: number; y: number }[];
  defaultModel?: string;
}

export default function ApproximationModelViewer({ data, defaultModel }: Props) {
  const [selectedModel, setSelectedModel] = useState(() =>
    models.find((m) => m.name === defaultModel) || models[0]
  );

  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const fields = selectedModel.getInputs();
    const initialValues: Record<string, number> = {};
    fields.forEach((f) => {
      initialValues[f.name] = f.defaultValue ?? 0;
    });
    return initialValues;
  });

  const [result, setResult] = useState<ComputationResult | null>(null);

  useEffect(() => {
    if (inputs && data) {
      const computed = selectedModel.compute(inputs, data);
      setResult(computed);
    }
  }, [inputs, selectedModel, data]);

  return (
    <div>
      <h3>{selectedModel.name}</h3>

      <Select
        style={{ width: 300, marginBottom: 16 }}
        value={selectedModel.name}
        onChange={(val) => {
          const model = models.find((m) => m.name === val)!;
          setSelectedModel(model);

          const newInputs: Record<string, number> = {};
          model.getInputs().forEach((f) => {
            newInputs[f.name] = f.defaultValue ?? 0;
          });
          setInputs(newInputs);
        }}
        options={models.map((m) => ({ label: m.name, value: m.name }))}
      />

      {selectedModel.getInputs().map((field) => (
        <div key={field.name} style={{ marginBottom: 8 }}>
          <Input
            type={field.type}
            value={inputs[field.name]}
            onChange={(e) => setInputs({ ...inputs, [field.name]: +e.target.value })}
            placeholder={field.label}
          />
        </div>
      ))}

      {result && (
        <ChartRenderer
          original={result.metadata.original}
          approximation={result.data}
          approxLabel={selectedModel.name}
        />
      )}
    </div>
  );
}
