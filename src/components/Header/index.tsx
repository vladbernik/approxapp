import { Button } from 'antd'
import s from './s.module.css'
import logo from '/logo.jpg'

export default function Header() {
  return <div className={s.container}>
    <span>
      <img className={s.logo} src={logo} alt="Approx"/>
    </span>
    <span className={s.projName}>APPROX</span>
    <span>
      <Button>
      О проекте
      </Button>
    </span>
  </div>
}

