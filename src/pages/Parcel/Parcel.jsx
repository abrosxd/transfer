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
