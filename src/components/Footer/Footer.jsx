import React from "react";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer>
      <div className="info">
        <p>
          Мы стремимся к высочайшим стандартам обслуживания, чтобы каждый наш
          клиент ощутил заботу и индивидуальный подход. Tip Top Transfer – это
          выбор тех, кто ценит качество, комфорт и надежность во всех аспектах
          путешествий и финансовых операций.
        </p>
        <ul>
          <li>Трансферы с комфортом и на высоком уровне.</li>
          <li>Обмен валют по выгодным курсам.</li>
          <li>Оплата счетов, товаров и услуг.</li>
          <li>Отправка и доставка посылок.</li>
        </ul>
      </div>
      <div className="copyright">
        <h6>
          &copy; 2024 Все права защищены. Копирование материалов с сайта
          запрещено без указания ссылки на источник.
        </h6>
        <a href="https://abros.dev" target="_blank">
          сайт разработан Daniel Abros
          <img src="/assets/ded.gif" />
        </a>
      </div>
    </footer>
  );
}
