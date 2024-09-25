import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "../../utils/Settings";
import "./Transfer.scss";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import Select from "react-select";
import debounce from "lodash.debounce";

export default function Transfer() {
  const { apiKey, baseId, tableTransfer, fetchTableData } = useSettings();
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

  useEffect(() => {
    const loadTransfer = async () => {
      try {
        const fetchedTransfer = await fetchTableData(
          apiKey,
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
  }, [apiKey, baseId, tableTransfer, fetchTableData]);

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
          `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`
        );

        if (response.data.routes.length > 0) {
          const route = response.data.routes[0];
          const routeDistance = Math.round(route.distance / 1000);
          setDistance(routeDistance);
          const formattedDuration = formatDuration(route.duration);
          setDuration(formattedDuration);
          const calculatedPrice = calculatePrice(routeDistance);
          setPrice(calculatedPrice.toFixed(2));
          setRouteData(route.geometry);
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

  useEffect(() => {
    if (startLocation && endLocation) {
      fetchRouteData();
    }
  }, [startLocation, endLocation]);

  const searchAddress = useCallback(
    debounce(async (query, setOptions) => {
      if (query) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}&limit=5`
          );
          const options = response.data.map((result) => ({
            label: formatAddress(result),
            value: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon),
              display_name: result.display_name,
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

  const formatAddress = (result) => {
    const { house_number, road, city, town, village, country } =
      result.address || {};
    return [house_number, road, city || town || village, country]
      .filter(Boolean)
      .join(", ");
  };

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
    setStartLocation(validateOption(selectedOption));
  };

  const handleEndChange = (selectedOption) => {
    setEndLocation(validateOption(selectedOption));
  };

  const validateOption = (option) => {
    if (
      option &&
      typeof option.label === "string" &&
      typeof option.value === "object" &&
      typeof option.value.lat === "number" &&
      typeof option.value.lng === "number"
    ) {
      return option;
    }
    return null;
  };

  const customFilterOption = (option, rawInput) => {
    if (!option.label || typeof option.label !== "string") {
      return false;
    }
    if (!rawInput || typeof rawInput !== "string") {
      return false;
    }
    return option.label.toLowerCase().includes(rawInput.toLowerCase());
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
        <div className="input-container">
          <label>Откуда:</label>
          <Select
            value={startLocation}
            onChange={handleStartChange}
            onInputChange={handleStartInputChange}
            options={startOptions}
            placeholder="Введите адрес"
            isClearable
            filterOption={customFilterOption}
            styles={customStyles}
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
            filterOption={customFilterOption}
            styles={customStyles}
          />
        </div>
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
