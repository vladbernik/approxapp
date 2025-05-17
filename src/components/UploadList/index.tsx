import { DeleteOutlined, FileExcelOutlined } from '@ant-design/icons';
import s from './s.module.css'

interface UploadListProps {
  fileName: string
  onDrop: () => void
}

export default function UploadList({ fileName, onDrop }: UploadListProps) {
  return <div className={s.container} onClick={onDrop}>
    <div className={s.leftPull}>
      <FileExcelOutlined style={{ fontSize: 24 }} />
      <span>{fileName}</span>
    </div>
    <DeleteOutlined style={{ fontSize: 24 }} />
  </div>
}
