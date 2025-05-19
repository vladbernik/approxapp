import { useState } from 'react';

function DataDivider({ columns, data, onDivide }) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleCellToggle = (rowIndex, cellIndex) => {
    const cell = `${rowIndex}-${cellIndex}`;
    if (selectedCells.includes(cell)) {
      setSelectedCells(selectedCells.filter(selectedCell => selectedCell !== cell));
    } else {
      setSelectedCells([...selectedCells, cell]);
    }
  };

  const handleDivide = () => {
    const dividedData = data.map(row => {
      const newRow = [];
      selectedColumns.forEach(colIndex => {
        newRow.push(row[colIndex]);
      });
      return newRow;
    });
    onDivide(dividedData);
  };

  return (
    <div>
      <h3>Select Columns:</h3>
      {columns.map((column, index) => (
        <div key={index}>
          <input
            type="checkbox"
            checked={selectedColumns.includes(index)}
            onChange={() => handleColumnToggle(index)}
          />
          <label>{column}</label>
        </div>
      ))}
      <h3>Select Cells:</h3>
      {data.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <span
              key={cellIndex}
              style={{
                marginRight: '5px',
                backgroundColor: selectedCells.includes(`${rowIndex}-${cellIndex}`) ? 'lightblue' : 'transparent'
              }}
              onClick={() => handleCellToggle(rowIndex, cellIndex)}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
      <button onClick={handleDivide}>Divide Data</button>
    </div>
  );
}

export default DataDivider;
