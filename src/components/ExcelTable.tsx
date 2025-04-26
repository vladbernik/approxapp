import React from 'react';
import { useState, useEffect } from 'react';

import "../styles/ExcelTable.css"
const ExcelTable = ({
  excelData,
  editMode,
  setEditMode,
  handleDeleteColumn,
  handleCellChange,
  handleDeleteRow,
  handleSave,
  onParamSelection,
  onMachineParamsSubmit
}) => {
  const [selectedColumnA, setSelectedColumnA] = useState(null);
  const [selectedColumnB, setSelectedColumnB] = useState(null);
  const [showSelectA, setShowSelectA] = useState(false);
  const [showSelectB, setShowSelectB] = useState(false);
  const [mode, setMode] = useState('params'); // 'params' or 'machine'
  const [machineParams, setMachineParams] = useState({
    crossSectionArea: '',
    sampleLength: '',
    forceData: '',
    timeData: '',
    displacementData: ''
  });

  const handleSetA = (index) => {
    setSelectedColumnA(index);
  };

  const handleSetB = (index) => {
    setSelectedColumnB(index);
  };

  const handleSubmit = () => {
    if (selectedColumnA !== null && selectedColumnB !== null) {
      onParamSelection(selectedColumnA, selectedColumnB);
    } else {
      alert('Please select columns for both parameters a and b.');
    }
  };

  const handleMachineParamsChange = (e) => {
    const { name, value } = e.target;
    setMachineParams({ ...machineParams, [name]: value });
  };

  const handleMachineParamsSubmit = () => {
    onMachineParamsSubmit(machineParams);
  };

  return (
    <div>
      <table className="excel-table">
        <thead>
          <tr>
            {excelData[0].map((col, index) => (
              <th key={index} className="column-header">
                {col}
                {editMode && <button className="custom-file-upload" onClick={() => handleDeleteColumn(index)}>Delete Column</button>}
                {showSelectA && (
                  <button onClick={() => handleSetA(index)} className={`custom-file-upload ${index === selectedColumnA ? 'selected-a' : ''}`}>
                    Set a
                  </button>
                )}
                {showSelectB && (
                  <button onClick={() => handleSetB(index)} className={`custom-file-upload ${index === selectedColumnB ? 'selected-b' : ''}`}>
                    Set b
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {excelData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {editMode ? (
                    <input
                      value={cell}
                      onChange={(e) => handleCellChange(e, rowIndex + 1, cellIndex)}
                    />
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {editMode && <button className="custom-file-upload" onClick={() => handleDeleteRow(rowIndex + 1)}>Delete Row</button>}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && <button className="custom-file-upload" onClick={handleSave}>Save</button>}
      <div>
        <button className="custom-file-upload" onClick={() => setShowSelectA(!showSelectA)}>
          {showSelectA ? 'Скрыть a' : 'Показать a'}
        </button>
        <button className="custom-file-upload" onClick={() => setShowSelectB(!showSelectB)}>
          {showSelectB ? 'Скрыть b' : 'Показать b'}
        </button>
      </div>
      {/* <div>
        <button className="custom-file-upload" onClick={handleSubmit}>Установить параметры</button>
      </div>

      <div>
        <button onClick={() => setMode('params')} className="custom-file-upload">Установить параметры Н/Д</button>
        <button onClick={() => setMode('machine')} className="custom-file-upload">Напряжение-деформация</button>
      </div> */}

      {/* {mode === 'machine' && (
        <div className="machine-params">
          <label>
            Площадь поперечного сечения (mm²):
            <input
              type="number"
              name="crossSectionArea"
              value={machineParams.crossSectionArea}
              onChange={handleMachineParamsChange}
            />
          </label>
          <label>
            Длина образца (mm):
            <input
              type="number"
              name="sampleLength"
              value={machineParams.sampleLength}
              onChange={handleMachineParamsChange}
            />
          </label>
          <label>
            Сила:
            <select
              name="forceData"
              value={machineParams.forceData}
              onChange={handleMachineParamsChange}
            >
              <option value="">Выберите столбец</option>
              {excelData[0].map((col, index) => (
                <option key={index} value={index}>
                  {col}
                </option>
              ))}
            </select>
          </label>
          <label>
            Время:
            <select
              name="timeData"
              value={machineParams.timeData}
              onChange={handleMachineParamsChange}
            >
              <option value="">Выберите столбец</option>
              {excelData[0].map((col, index) => (
                <option key={index} value={index}>
                  {col}
                </option>
              ))}
            </select>
          </label>
          <label>
            Изменение длины:
            <select
              name="displacementData"
              value={machineParams.displacementData}
              onChange={handleMachineParamsChange}
            >
              <option value="">Выберите столбец</option>
              {excelData[0].map((col, index) => (
                <option key={index} value={index}>
                  {col}
                </option>
              ))}
            </select>
          </label>
          <button className="custom-file-upload" onClick={handleMachineParamsSubmit}>Построить график</button>
        </div>
      )} */}
    </div>
  );
};

export default ExcelTable;