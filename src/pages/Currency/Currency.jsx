import React, { useState, useEffect } from "react";
import { useSettings } from "../../utils/Settings";
import "./Currency.scss";

function formatCurrency(value) {
  return isNaN(value) ? "-" : value.toFixed(2);
}

async function fetchCentralBankData() {
  const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
  const data = await response.json();
  return data;
}

const CurrencyCard = ({ buyPrice, sellPrice, icon, name }) => (
  <div className="card">
    <div className="grid">
      <h4>Покупка</h4>
      <p>{buyPrice || "**.**"}</p>
    </div>
    <div className="grid">
      <h4>Продажа</h4>
      <p>{sellPrice || "**.**"}</p>
    </div>
    <h4 className="name">{name}</h4>
    {icon}
  </div>
);

export default function Currency() {
  const { apiKey, baseId, tableCurrency, fetchTableData } = useSettings();
  const [currencyData, setCurrencyData] = useState({
    usd: { buy: null, sell: null },
    eur: { buy: null, sell: null },
    pln: { buy: null, sell: null },
    sek: { buy: null, sell: null },
    updateDate: null,
  });

  const currencyMap = {
    USD: "доллар",
    EUR: "евро",
    PLN: "польский злотый",
    SEK: "шведская крона",
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  };

  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        const cbData = await fetchCentralBankData();
        const fetchedRecords = await fetchTableData(
          apiKey,
          baseId,
          tableCurrency
        );
        const correctionData = fetchedRecords.reduce((acc, record) => {
          const currencyKey = record.Name.toLowerCase();
          acc[currencyKey] = {
            buy: isNaN(parseFloat(record.Покупка))
              ? "-"
              : parseFloat(record.Покупка),
            sell: isNaN(parseFloat(record.Продажа))
              ? "-"
              : parseFloat(record.Продажа),
          };
          return acc;
        }, {});

        const newCurrencyData = {
          usd: {
            buy:
              correctionData["доллар"]?.buy === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.USD.Value + correctionData["доллар"]?.buy
                  ),
            sell:
              correctionData["доллар"]?.sell === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.USD.Value + correctionData["доллар"]?.sell
                  ),
          },
          eur: {
            buy:
              correctionData["евро"]?.buy === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.EUR.Value + correctionData["евро"]?.buy
                  ),
            sell:
              correctionData["евро"]?.sell === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.EUR.Value + correctionData["евро"]?.sell
                  ),
          },
          pln: {
            buy:
              correctionData["польский злотый"]?.buy === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.PLN?.Value / cbData.Valute.PLN?.Nominal +
                      correctionData["польский злотый"]?.buy
                  ),
            sell:
              correctionData["польский злотый"]?.sell === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.PLN?.Value / cbData.Valute.PLN?.Nominal +
                      correctionData["польский злотый"]?.sell
                  ),
          },
          sek: {
            buy:
              correctionData["шведская крона"]?.buy === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.SEK?.Value / cbData.Valute.SEK?.Nominal +
                      correctionData["шведская крона"]?.buy
                  ),
            sell:
              correctionData["шведская крона"]?.sell === "-"
                ? "-"
                : formatCurrency(
                    cbData.Valute.SEK?.Value / cbData.Valute.SEK?.Nominal +
                      correctionData["шведская крона"]?.sell
                  ),
          },
          updateDate: formatDateTime(cbData.Date),
        };

        setCurrencyData(newCurrencyData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    loadCurrencyData();
  }, [apiKey, baseId, tableCurrency, fetchTableData]);

  return (
    <main className="currency">
      <div className="status">
        <h1>Валюты</h1>
        <div className="items">
          <h3 className="date">
            курс на{" "}
            <span className="date-vault">
              {currencyData.updateDate || "**.**.****"}
            </span>
          </h3>
          <div className="container">
            <CurrencyCard
              buyPrice={currencyData.usd.buy}
              sellPrice={currencyData.usd.sell}
              name="Доллар"
              icon={<i className="bx bx-dollar"></i>}
            />
            <CurrencyCard
              buyPrice={currencyData.eur.buy}
              sellPrice={currencyData.eur.sell}
              name="Евро"
              icon={<i className="bx bx-euro"></i>}
            />
            <CurrencyCard
              buyPrice={currencyData.pln.buy}
              sellPrice={currencyData.pln.sell}
              name="Польский злотый"
              icon={
                <svg viewBox="0 0 425.409 425.409">
                  <polygon points="356.498,254.317 342.816,216.729 314.683,226.969 314.683,0 274.683,0 274.683,241.528 232.867,256.748 246.549,294.336 274.683,284.096 274.683,425.409 314.683,425.409 314.683,269.537 "></polygon>
                  <polygon points="255.204,120.57 255.204,85.656 68.911,85.656 68.911,125.656 207.405,125.656 68.911,390.496 68.911,425.409 255.204,425.409 255.204,385.409 116.71,385.409 "></polygon>
                </svg>
              }
            />
            <CurrencyCard
              buyPrice={currencyData.sek.buy}
              sellPrice={currencyData.sek.sell}
              name="Шведская крона"
              icon={
                <svg viewBox="0 0 122.88 95.78">
                  <path d="M18,58.35l8.19-10.46L45.45,27H66.63L39.32,56.82l29,39H46.63L26.82,67.89l-8.06,6.47V95.78H0V0H18.76V42.72l-1,15.63Zm98.52-32.64a31,31,0,0,1,6.34.55l-1.41,17.6a22,22,0,0,0-5.54-.61q-9,0-14,4.62t-5,12.92v35H78.16V27H92.38l2.75,11.59h.93a26.15,26.15,0,0,1,8.65-9.32,21.27,21.27,0,0,1,11.83-3.53Z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
      <div className="sticker">
        <img src="/assets/pup-money.gif" />
      </div>
      <div className="info">
        <div className="card">
          <h3>Какие услуги мы можем оказывать:</h3>
          <ul className="services">
            <li>
              перевод денежных средств из России в Европу, а так же обратно.
            </li>
            <li>оплата счетов</li>
            <li>оплата инвойсов</li>
            <li>оплата товаров (доставка до Калининграда)</li>
            <li>оплата обучения в вузах</li>
          </ul>
        </div>
        <div className="card">
          <h3>Как происходит перевод из Европы в Россию:</h3>
          <ul className="eu-ru">
            <li>Согласовываем курс</li>
            <li>Вы делаете перевод</li>
            <li>Присылаете подтверждение перевода</li>
            <li>Как только деньги поступили, мы делаем перевод Вам</li>
            <li>Мы присылаем подтверждение перевода</li>
          </ul>
        </div>
        <div className="card">
          <h3>Как происходит перевод из России в Европу:</h3>
          <ul className="ru-eu">
            <li>Согласовываем курс</li>
            <li>Вы делаете перевод на российскую карту</li>
            <li>Присылаете нам скрин платежа</li>
            <li>
              Мы делаем вам перевод по Европе (перевод идет до 2 рабочих дней)
            </li>
            <li>Мы присылаем вам скрин платежа</li>
          </ul>
        </div>
        <div className="card">
          <h3>Какие платежные системы мы используем:</h3>
          <ul className="pay-system">
            <li>iBAN</li>
            <li>Blik</li>
            <li>Revolut</li>
            <li>PayPal</li>
            <li>USDT</li>
            <li>Bitcoin</li>
          </ul>
        </div>
      </div>
    </main>
  );
}