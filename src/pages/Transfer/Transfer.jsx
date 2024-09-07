import React, { useState, useEffect } from "react";
import { useSettings } from "../../utils/Settings";
import "./Transfer.scss";

// Функция для обработки переносов строк
const formatTextWithLineBreaks = (text) => {
  return text.split("\n").map((str, index) => (
    <React.Fragment key={index}>
      {str}
      <br />
    </React.Fragment>
  ));
};

const formatTextAsList = (text) => {
  return (
    <ul>
      {text.split("\n").map((str, index) => (
        <li key={index}>{str}</li>
      ))}
    </ul>
  );
};

const TransferCard = ({
  city1,
  city2,
  price,
  timing,
  configuration,
  description,
}) => (
  <div className="card">
    <h3>
      {city1} - {city2}
    </h3>
    <div className="grid">
      {price && (
        <div className="price">
          <h5>💰 Стоимость:</h5>
          <h5>{formatTextWithLineBreaks(price)}</h5>
        </div>
      )}
      {timing && (
        <div className="timing">
          <h5>⌚ Время в пути:</h5>
          <h5>{timing}</h5>
        </div>
      )}
      {configuration && (
        <div className="configuration">
          <h5>📋 Конфигурация:</h5>
          {formatTextAsList(configuration)}
        </div>
      )}
      {description && (
        <div className="description">
          <h5>📝 Примечания:</h5>
          <h5>{formatTextWithLineBreaks(description)}</h5>
        </div>
      )}
      <div className="info">
        <h6>
          Заказать и обсудить детали трансфера можно нажав по кнопке "Обратная
          связь" и заполнив форму обратной связи или по контактам находящимся в
          меню сайта.
        </h6>
      </div>
    </div>
  </div>
);

export default function Transfer() {
  const { apiKey, baseId, tableTransfer, fetchTableData } = useSettings();
  const [transferData, setTransferData] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", passengers: 1 });

  // Получаем уникальный список городов из city1 и city2
  const getUniqueCities = (transfers) => {
    const citySet = new Set();

    transfers.forEach((record) => {
      if (record.city1) citySet.add(record.city1);
      if (record.city2) citySet.add(record.city2);
    });

    return Array.from(citySet);
  };

  useEffect(() => {
    const loadTransfer = async () => {
      try {
        const fetchedTransfer = await fetchTableData(
          apiKey,
          baseId,
          tableTransfer
        );

        console.log("Данные из Airtable:", fetchedTransfer);

        const transferData = fetchedTransfer.map((record) => ({
          city1: record.Город1 || "",
          city2: record.Город2 || "",
          priceSedan: record.СтоимостьСедан || "",
          priceBus: record.СтоимостьБус || "",
          timing: record.ВремяПути || "",
          configuration: record.Конфигурация || "",
          description: record.Примечания || "",
        }));

        setTransferData(transferData);

        // Получаем уникальные города для фильтров
        const uniqueCities = getUniqueCities(transferData);
        setCities(uniqueCities);
      } catch (error) {
        console.error("Ошибка при загрузке данных из Airtable:", error);
      }
    };

    loadTransfer();
  }, [apiKey, baseId, tableTransfer, fetchTableData]);

  // Функция для изменения фильтров
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Фильтруем данные на основе выбранных городов и количества пассажиров
  const filteredTransfers = transferData.filter((transfer) => {
    const isFromMatch = filters.from
      ? transfer.city1 === filters.from || transfer.city2 === filters.from
      : false;
    const isToMatch = filters.to
      ? transfer.city1 === filters.to || transfer.city2 === filters.to
      : false;
    const hasPrice =
      (filters.passengers >= 1 &&
        filters.passengers <= 3 &&
        transfer.priceSedan) ||
      (filters.passengers >= 4 && filters.passengers <= 8 && transfer.priceBus);
    return isFromMatch && isToMatch && hasPrice;
  });

  // Определяем цену в зависимости от количества пассажиров
  const getPrice = (transfer) => {
    const passengers = Number(filters.passengers);
    if (passengers >= 1 && passengers <= 3) {
      return transfer.priceSedan;
    } else if (passengers >= 4 && passengers <= 8) {
      return transfer.priceBus;
    }
    return null;
  };

  return (
    <main className="transfer">
      <div className="status">
        <h1>Трансферы</h1>
        <div className="items">
          <div className="search">
            <div className="filter from">
              <label htmlFor="fromFilter">Откуда</label>
              <select
                id="fromFilter"
                name="from"
                value={filters.from}
                onChange={handleFilterChange}
              >
                <option value="">Выберите город</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter to">
              <label htmlFor="toFilter">Куда</label>
              <select
                id="toFilter"
                name="to"
                value={filters.to}
                onChange={handleFilterChange}
              >
                <option value="">Выберите город</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter passengers">
              <label htmlFor="passengersFilter">Количество пассажиров</label>
              <select
                id="passengersFilter"
                name="passengers"
                value={filters.passengers}
                onChange={handleFilterChange}
              >
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="container">
            {filteredTransfers.length > 0 ? (
              filteredTransfers.map((transfer, index) => (
                <TransferCard
                  key={index}
                  city1={transfer.city1}
                  city2={transfer.city2}
                  price={getPrice(transfer)}
                  timing={transfer.timing}
                  configuration={transfer.configuration}
                  description={transfer.description}
                />
              ))
            ) : (
              <h3 className="none">
                Выберите фильтры для отображения трансферов
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className="sticker">
        <img src="/assets/all-transfer.gif" alt="Transfer" />
      </div>
    </main>
  );
}
