import { useNavigate } from 'react-router-dom';
import s from './s.module.css';
import logo from '/logo.jpg';

export function Header() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('dashboard');
  };
  return (
    <div className={s.container}>
      <span>
        <img onClick={goHome} className={s.logo} src={logo} alt="Approx" />
      </span>
      <span onClick={goHome} className={s.projName}>
        APPROX
      </span>
      <span className={s.aboutLink} onClick={() => navigate('/about')}>
        О проекте
      </span>
    </div>
  );
}
