import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "../../utils/Settings";
import "./Transfer.scss";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";
import Button from "../../partials/Button/Button";

export default function Transfer() {
  const { airtableKey, baseId, tableTransfer, fetchTableData } = useSettings();
  const [transferData, setTransferData] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(0);
  const [startOptions, setStartOptions] = useState([]);
  const [endOptions, setEndOptions] = useState([]);
  const polylineRef = useRef(null);

  const ORS_API_KEY =
    "5b3ce3597851110001cf624834bbaaf7a2704a3c96c29240a35d5f9c";

  useEffect(() => {
    const loadTransfer = async () => {
      try {
        const fetchedTransfer = await fetchTableData(
          airtableKey,
          baseId,
          tableTransfer
        );
        const transferData = fetchedTransfer.map((record) => ({
          configuration: record.Конфигурация || "",
          description: record.Примечания || "",
        }));
        setTransferData(transferData);
      } catch (error) {
        console.error("Ошибка при загрузке данных из Airtable:", error);
      }
    };
    loadTransfer();
  }, [airtableKey, baseId, tableTransfer, fetchTableData]);

  const calculatePrice = (distance) => {
    if (distance <= 500) {
      return distance * 1.1;
    } else if (distance > 500 && distance <= 1000) {
      return distance * 1.2;
    } else {
      return distance * 1.3;
    }
  };

  const fetchRouteData = async () => {
    try {
      if (startLocation && endLocation) {
        const startCoords = startLocation.value;
        const endCoords = endLocation.value;

        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving-car?start=${startCoords.lng},${startCoords.lat}&end=${endCoords.lng},${endCoords.lat}`,
          {
            headers: {
              Authorization: `Bearer ${ORS_API_KEY}`,
            },
          }
        );

        if (
          response.data &&
          response.data.features &&
          response.data.features.length > 0
        ) {
          const route = response.data.features[0];
          const routeDistance = Math.round(
            route.properties.segments[0].distance / 1000
          );
          setDistance(routeDistance);

          const formattedDuration = formatDuration(
            route.properties.segments[0].duration
          );
          setDuration(formattedDuration);

          const calculatedPrice = calculatePrice(routeDistance);
          setPrice(calculatedPrice.toFixed(2));

          setRouteData(route.geometry);
        } else {
          console.error("Ошибка: ответ не содержит данных о маршруте.");
        }
      }
    } catch (error) {
      console.error("Ошибка при получении данных маршрута:", error);
    }
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.round((durationInSeconds % 3600) / 60);
    return `${hours} ч ${minutes} мин`;
  };

  const searchAddress = useCallback(
    debounce(async (query, setOptions) => {
      if (query) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}&limit=5`
          );
          const options = response.data.map((result) => ({
            label: result.display_name,
            value: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
            },
          }));
          setOptions(options);
        } catch (error) {
          console.error("Ошибка при поиске адреса:", error);
        }
      } else {
        setOptions([]);
      }
    }, 300),
    []
  );

  const handleStartInputChange = (value) => {
    if (typeof value === "string") {
      searchAddress(value, setStartOptions);
    }
  };

  const handleEndInputChange = (value) => {
    if (typeof value === "string") {
      searchAddress(value, setEndOptions);
    }
  };

  const handleStartChange = (selectedOption) => {
    setStartLocation(selectedOption);
  };

  const handleEndChange = (selectedOption) => {
    setEndLocation(selectedOption);
  };

  const RoutePolyline = ({ route }) => {
    const map = useMap();

    useEffect(() => {
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }

      if (route) {
        const polyline = L.polyline(
          route.coordinates.map((c) => [c[1], c[0]]),
          { color: "blue" }
        );
        polyline.addTo(map);
        polylineRef.current = polyline;
        map.fitBounds(polyline.getBounds());
      }
    }, [route, map]);

    return null;
  };

  const formatTextWithLinks = (text) => {
    const urlRegex = /((https?:\/\/[^\s]+))/g;
    const phoneRegex = /(\+?\d[\d\s-]{9,})/g;

    return text.split(/(\s+)/).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      } else if (phoneRegex.test(part)) {
        return (
          <a key={index} href={`tel:${part.replace(/\s+/g, "")}`}>
            {part}
          </a>
        );
      } else {
        return part;
      }
    });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "var(--hover-color)",
      color: "var(--text-color)",
      borderColor: "var(--shadow-color)",
      "&:hover": {
        borderColor: "var(--shadow-color)",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--text-color)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--text-color)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "var(--hover-color)"
        : "var(--hover-color)",
      color: "var(--text-color)",
      "&:hover": {
        backgroundColor: "var(--shadow-color)",
        color: "var(--text-color)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      color: "var(--text-color)",
      backgroundColor: "var(--bg-color)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--text-color)",
    }),
  };

  return (
    <main className="transfer">
      <h1>Трансферы</h1>
      <div className="data">
        <div className="section">
          <div className="input-container">
            <label>Откуда:</label>
            <Select
              value={startLocation}
              onChange={handleStartChange}
              onInputChange={handleStartInputChange}
              options={startOptions}
              placeholder="Введите адрес"
              isClearable
              styles={customStyles}
              noOptionsMessage={() => "Нет опций"}
              filterOption={() => true}
            />
          </div>
          <div className="input-container">
            <label>Куда:</label>
            <Select
              value={endLocation}
              onChange={handleEndChange}
              onInputChange={handleEndInputChange}
              options={endOptions}
              placeholder="Введите адрес"
              isClearable
              styles={customStyles}
              noOptionsMessage={() => "Нет опций"}
              filterOption={() => true}
            />
          </div>
        </div>
        <Button
          onClick={fetchRouteData}
          className={"calc"}
          text="Рассчитать"
          icon={<i className="fa-solid fa-route"></i>}
        />
      </div>
      <div className="map-container">
        {distance > 0 && (
          <div className="route-info">
            <p>Расстояние: {distance} км</p>
            <p>Время в пути: ≈{duration}</p>
            <p>Цена: ≈{price} €</p>
          </div>
        )}
        <MapContainer center={[51.505, -0.09]} zoom={13} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {routeData && <RoutePolyline route={routeData} />}
        </MapContainer>
      </div>
      <div className="transfer-details">
        <h2>Детали трансфера</h2>
        {transferData.map((item, index) => (
          <div key={index} className="transfer-item">
            <p>
              <strong>Конфигурация:</strong> <br />
              {item.configuration.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p>
              <strong>Примечания:</strong> <br />
              {item.description.split("\n").map((line, i) => (
                <span key={i}>
                  {formatTextWithLinks(line)}
                  <br />
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
      <div className="sticker">
        <img src="/assets/all-transfer.gif" alt="Transfer" />
      </div>
    </main>
  );
}
