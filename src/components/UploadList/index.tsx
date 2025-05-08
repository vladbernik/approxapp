import { DeleteOutlined } from '@ant-design/icons';
import s from './s.module.css'

interface UploadListProps {
  fileName: string
  onDrop: () => void
}

export default function UploadList({ fileName, onDrop }: UploadListProps) {
  return <div className={s.container} onClick={onDrop}>{fileName} <DeleteOutlined/></div>
}
