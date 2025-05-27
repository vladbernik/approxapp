import { DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import Alert from 'antd/es/alert/Alert';
import s from './s.module.css'

interface UploadListProps {
  fileName: string
  onDrop: () => void
}

export default function UploadList({ fileName, onDrop }: UploadListProps) {
  return <Alert
                message={
                  <>
                    <div className={s.leftPull}>
                      <FileExcelOutlined style={{ fontSize: 24 }}/>
                      <span>{fileName}</span>
                    </div>
                    <DeleteOutlined onClick={onDrop} className={s.deleteButton}/>
                  </>}
                type="info"
                className={s.container}/>
}
