import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button, Table, Upload, UploadFile, UploadProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';
import s from './s.module.css';
import { UploadList } from '@/components';
import { useCalculationContext } from '@/contexts/CalculationContext.tsx';

interface ExcelReaderProps {
  handleExcelData: any;
  approxType: string | null;
  data: any | null;
  setData: (data: any) => void;
}

const { Dragger } = Upload;

// eslint-disable-next-line complexity,max-lines-per-function
export function ExcelReaderWithTable({ handleExcelData, setData, data }: ExcelReaderProps) {
  const [displayedRows, setDisplayedRows] = useState(25);
  const [showTable, setShowTable] = useState(true);
  const { resetContext, setCurrentModel } = useCalculationContext();
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
          handleExcelData(data);
        };
        reader.readAsBinaryString(file);
      }
    },
    onRemove() {
      setFileList([]);
      setCurrentModel('polynomial');
      resetContext();
      setData(null);
      return true;
    },
    accept: '.xlsx,.xls,.csv',
  };

  const drop = () => {
    setData(null);
    setFileList([]);
    resetContext();
    setCurrentModel('polynomial');
  };

  return (
    <div className={s.tableContainer}>
      {fileList.length > 0 &&
        createPortal(
          <UploadList fileName={fileList[0]?.name} onDrop={drop} />,
          document.getElementById('appBody'),
        )}
      <Dragger {...props} className={data !== null && s.hideDragger}>
        <p className="ant-upload-drag-icon">
          <PlusOutlined />
        </p>
        <p className="ant-upload-text">Кликните или перетащите файл в эту область</p>
        <p className="ant-upload-hint">Поддерживаются файлы формата .xls, .xlsx, .csv</p>
      </Dragger>

      {data && (
        <>
          <div className={s.tableControls}>
            <Button onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Скрыть данные' : 'Показать данные'}
            </Button>
          </div>

          {showTable && data.length > 0 && (
            <Table
              style={{ marginTop: 16 }}
              columns={getColumns(data[0])}
              dataSource={getDataSource(data?.slice(1, displayedRows))}
              pagination={false}
              scroll={{ x: 'max-content' }}
              bordered
            />
          )}

          {data.length > displayedRows && showTable && (
            <div className={s.showMoreBtnContainer}>
              <Button
                className={s.showMoreBtn}
                onClick={() => setDisplayedRows(displayedRows + 25)}
              >
                Показать больше строк
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
