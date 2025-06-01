import { useState } from 'react';
import './s.module.css';

export function ExcelTable({
  excelData,
  editMode,
  handleDeleteColumn,
  handleCellChange,
  handleDeleteRow,
  handleSave,
}) {
  const [selectedColumnA, setSelectedColumnA] = useState(null);
  const [selectedColumnB, setSelectedColumnB] = useState(null);
  const [showSelectA, setShowSelectA] = useState(false);
  const [showSelectB, setShowSelectB] = useState(false);

  const handleSetA = (index) => {
    setSelectedColumnA(index);
  };

  const handleSetB = (index) => {
    setSelectedColumnB(index);
  };

  return (
    <div>
      <table className="excel-table">
        <thead>
          <tr>
            {excelData[0].map((col, index) => (
              <th key={index} className="column-header">
                {col}
                {editMode && (
                  <button className="custom-file-upload" onClick={() => handleDeleteColumn(index)}>
                    Delete Column
                  </button>
                )}
                {showSelectA && (
                  <button
                    onClick={() => handleSetA(index)}
                    className={`custom-file-upload ${index === selectedColumnA ? 'selected-a' : ''}`}
                  >
                    Set a
                  </button>
                )}
                {showSelectB && (
                  <button
                    onClick={() => handleSetB(index)}
                    className={`custom-file-upload ${index === selectedColumnB ? 'selected-b' : ''}`}
                  >
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
              {editMode && (
                <button
                  className="custom-file-upload"
                  onClick={() => handleDeleteRow(rowIndex + 1)}
                >
                  Delete Row
                </button>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {editMode && (
        <button className="custom-file-upload" onClick={handleSave}>
          Save
        </button>
      )}
      <div>
        <button className="custom-file-upload" onClick={() => setShowSelectA(!showSelectA)}>
          {showSelectA ? 'Скрыть a' : 'Показать a'}
        </button>
        <button className="custom-file-upload" onClick={() => setShowSelectB(!showSelectB)}>
          {showSelectB ? 'Скрыть b' : 'Показать b'}
        </button>
      </div>
    </div>
  );
}
