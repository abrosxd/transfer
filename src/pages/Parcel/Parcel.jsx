import React from "react";
import "./Parcel.scss";

export default function Parcel() {
  return (
    <main className="parcel">
      <div className="status">
        <h1>Посылки</h1>
        <div className="items">
          <h3 className="title">Направления доставок</h3>
          <div className="container">
            <div className="item">
              <div className="card">
                <h3>Польша</h3>
                <h3>Калининград</h3>
              </div>
              <h4>пункт выдачи находиться в центре Калининграда</h4>
            </div>
            <div className="item">
              <div className="card">
                <h3>Калининград</h3>
                <h3>Польша</h3>
              </div>
              <h4>далее из Польши можем отправить службой DHL или DPD</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="sticker">
        <img src="/assets/pup-parcel.gif" />
      </div>
      <div className="info">
        <div className="card">
          <h3>Оценка стоимости доставки товаров:</h3>
          <ul className="price">
            <li>До 200€ или до 900zl - Доставка:60€</li>
            <li>До 1000€ или до 4.500zl - Доставка 25%</li>
            <li>До 2.000€ или до 9.000zl - Доставка 20%</li>
            <li>Свыше 2.000€ или 9.000zl - Доставка 15%</li>
          </ul>
        </div>
        <div className="card">
          <h3>
            Чтобы узнать стоимость услуги просим предоставить следующую
            информацию:
          </h3>
          <ul className="price">
            <li>размер посылки</li>
            <li>вес</li>
            <li>опись товара</li>
            <li>стоимость</li>
          </ul>
        </div>
        <div className="card">
          <h4>Не знаешь как сделать заказ из брендовых магазинов?</h4>
          <h4>
            Есть трудности с оплатой товаров и их доставки из EU в Россию?
          </h4>
          <h3>Мы готовы взять на себя решение этих вопросов!</h3>
        </div>
      </div>
    </main>
  );
}
