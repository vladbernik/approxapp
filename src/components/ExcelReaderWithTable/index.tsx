import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Table, Upload, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ApproximationSelector from '../ApproximationSelector';
import s from './s.module.css'

interface ExcelReaderProps {
  onDataLoad: any
  approxType: string | null
  setApproxType: (approxType: string | null) => void
  data: any
}

const { Dragger } = Upload;

// eslint-disable-next-line max-lines-per-function
function ExcelReaderWithTable({ onDataLoad, setApproxType, approxType, data }: ExcelReaderProps) {
  const [excelData, setExcelData] = useState(null);
  const [displayedRows, setDisplayedRows] = useState(25);
  const [showTable, setShowTable] = useState(true);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getColumns = (headers: any[]) =>
    headers.map((header, index) => ({
      title: header,
      dataIndex: `col${index}`,
      key: `col${index}`,
    }));

  const getDataSource = (rows: any[][]) =>
    rows.map((row, rowIndex) => {
      const rowData: Record<string, any> = { key: rowIndex };
      row.forEach((cell, cellIndex) => {
        rowData[`col${cellIndex}`] = cell;
      });
      return rowData;
    });

  console.log(approxType)

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    onChange(info) {
      let newFileList = [...info.fileList];

      newFileList = newFileList.slice(-1);

      setFileList(newFileList);

      const file = info.file.originFileObj;

      if (file && info.file.status !== 'removed') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryString = event.target?.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setExcelData(data);
          onDataLoad(data);
        };
        reader.readAsBinaryString(file);
      }
    },
    onRemove() {
      setFileList([]);
      setApproxType(null)
      setExcelData(null);
      return true;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    accept: '.xlsx,.xls,.csv',
  };

  return (
    <div className={s.tableContainer}>
      <Dragger {...props} className={(approxType || excelData) && s.hideDragger}>
        <p className="ant-upload-drag-icon">
          <PlusOutlined />
        </p>
        <p className="ant-upload-text">Кликните или перетащите файл в эту область</p>
        <p className="ant-upload-hint">Поддерживаются файлы формата .xls, .xlsx, .csv</p>
      </Dragger>

      {excelData && (
        <>
          <div className={s.tableControls}>
            <Button onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Скрыть данные' : 'Показать данные'}
            </Button>
            <ApproximationSelector setApproxType={setApproxType}/>
          </div>

          {showTable && (
            <Table
              style={{ marginTop: 16 }}
              columns={getColumns(excelData[0])}
              dataSource={getDataSource(excelData.slice(1, displayedRows))}
              pagination={false}
              scroll={{ x: 'max-content' }}
              bordered
            />
          )}

          {excelData.length > displayedRows && showTable && <div className={s.showMoreBtnContainer}>
              <Button className={s.showMoreBtn} onClick={() => setDisplayedRows(displayedRows + 25)}>
                  Показать больше строк
              </Button>
          </div>
          }
        </>
      )}
    </div>
  );
}

export default ExcelReaderWithTable;
