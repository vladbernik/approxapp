import { Typography } from 'antd';
import s from './About.module.css';

const { Title, Paragraph, Text } = Typography;

export default function About() {
  return (
    <div className={s.about}>
      <Typography>
        <Title className={s.title} level={1}>
          О сервисе
        </Title>

        <Paragraph className={s.text}>
          Наш сервис предназначен для удобного анализа экспериментальных данных с помощью различных
          методов аппроксимации и линеаризации. Загрузите ваш Excel-файл и выберите нужные колонки
          для X и Y — всё остальное мы сделаем за вас.
        </Paragraph>

        <Paragraph>
          <Title level={2}>Что умеет сервис:</Title>
          <ul className={s.list}>
            <li>
              <Text>
                📊 <strong>Загрузка данных из Excel</strong> — просто перетащите файл и сразу
                увидите таблицу.
              </Text>
            </li>
            <li>
              <Text>
                🔢 <strong>Выбор переменных</strong> — укажите, какие столбцы использовать в
                качестве X и Y.
              </Text>
            </li>
            <li>
              <Text>
                📈 <strong>Полиномиальная аппроксимация</strong> — настройте степень полинома и
                получите график вместе с коэффициентами.
              </Text>
            </li>
            <li>
              <Text>
                📉 <strong>Экспоненциальная аппроксимация</strong> — подберите параметры λ и
                визуализируйте результат.
              </Text>
            </li>
            <li>
              <Text>
                🧪 <strong>Линеаризация моделей</strong> — поддержка моделей вида экспоненциальной,
                степенной и модели Максвелла для упрощения анализа.
              </Text>
            </li>
            <li>
              <Text>
                📋 <strong>Интерактивные графики</strong> — результаты отображаются наглядно и
                удобно для дальнейшего анализа и отчётности.
              </Text>
            </li>
          </ul>
        </Paragraph>

        <Paragraph className={s.text}>
          Сервис подходит как для студентов и исследователей, так и для инженеров и специалистов по
          обработке данных. Всё, что вам нужно — это ваши данные.
        </Paragraph>
      </Typography>
    </div>
  );
}
