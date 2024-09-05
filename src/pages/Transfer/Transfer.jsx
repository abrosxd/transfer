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
  direction,
  type,
  price,
  date,
  timing,
  configuration,
  description,
}) => (
  <div className="card">
    {direction && <h3>{direction}</h3>}
    <div className="grid">
      {type && (
        <div className="type">
          <h5>👤 Тип трансфера:</h5>
          <h5>{type}</h5>
        </div>
      )}
      {price && (
        <div className="price">
          <h5>💰 Стоимость:</h5>
          <h5>{formatTextWithLineBreaks(price)}</h5>
        </div>
      )}
      {date && (
        <div className="date">
          <h5>🗓️ Даты:</h5>
          <h5>{formatTextWithLineBreaks(date)}</h5>
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
    </div>
  </div>
);

export default function Transfer() {
  const { apiKey, baseId, tableTransfer, fetchTableData } = useSettings();

  const [transferData, setTransferData] = useState([]);

  useEffect(() => {
    const loadTransfer = async () => {
      try {
        const fetchedTransfer = await fetchTableData(
          apiKey,
          baseId,
          tableTransfer
        );

        // Логируем данные для проверки
        console.log("Данные из Airtable:", fetchedTransfer);

        // Преобразуем данные в массив для корректного рендеринга
        const transferData = fetchedTransfer.map((record) => ({
          direction: record.Направление || "",
          type: record.Тип || "",
          price: record.Стоимость || "",
          date: record.Даты || "",
          timing: record.ВремяПути || "",
          configuration: record.Конфигурация || "",
          description: record.Примечания || "",
        }));

        setTransferData(transferData); // Сохраняем как массив
      } catch (error) {
        console.error("Ошибка при загрузке данных из Airtable:", error);
      }
    };

    loadTransfer();
  }, [apiKey, baseId, tableTransfer, fetchTableData]);

  return (
    <main className="transfer">
      <div className="status">
        <h1>Трансферы</h1>
        <div className="items">
          <h3 className="title">Направления трансферов</h3>
          <div className="container">
            {transferData.length > 0 ? (
              transferData.map((transfer, index) => (
                <TransferCard key={index} {...transfer} />
              ))
            ) : (
              <p>Загрузка данных...</p>
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
