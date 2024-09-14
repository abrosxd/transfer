import React, { useState, useEffect } from "react";
import { useSettings } from "../../utils/Settings";
import "./FeedbackModal.scss";

export default function FeedbackModal({ isOpen, onClose }) {
  const { webhook } = useSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [interests, setInterests] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !socialLink || interests.length === 0) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    const formData = {
      name,
      email,
      phone,
      socialLink,
      interests: interests.join(","),
      message,
    };

    const queryParams = new URLSearchParams(formData).toString();
    const requestUrl = `${webhook}?${queryParams}`;

    try {
      const response = await fetch(requestUrl, {
        method: "GET",
      });

      if (response.ok) {
        setIsSubmitted(true);
        setName("");
        setEmail("");
        setPhone("");
        setSocialLink("");
        setMessage("");
        setInterests([]);

        setTimeout(() => {
          if (isOpen) {
            onClose();
          }
        }, 5000);
      } else {
        console.error("Ошибка при отправке данных на Webhook");
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setInterests((prevInterests) =>
      prevInterests.includes(value)
        ? prevInterests.filter((interest) => interest !== value)
        : [...prevInterests, value]
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>
          &times;
        </button>
        <h2>Обратная связь</h2>
        {isSubmitted ? (
          <div className="thank-you-message">
            <h3>
              Отлично! Ваше сообщение отправлено. Теперь нужно только подождать,
              когда мы с вами свяжемся.
            </h3>
            <img src="/public/assets/star-like.gif" alt="Thank you" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Номер телефона:</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="socialLink">Ссылка на соц.сеть:</label>
              <input
                type="text"
                id="socialLink"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Вас интересует:</label>
              <div className="interests">
                <label
                  className={interests.includes("Трансфер") ? "active" : ""}
                >
                  <input
                    type="checkbox"
                    value="Трансфер"
                    checked={interests.includes("Трансфер")}
                    onChange={handleCheckboxChange}
                    required={interests.length === 0}
                  />
                  Трансфер
                </label>
                <label
                  className={interests.includes("Посылки") ? "active" : ""}
                >
                  <input
                    type="checkbox"
                    value="Посылки"
                    checked={interests.includes("Посылки")}
                    onChange={handleCheckboxChange}
                  />
                  Посылки
                </label>
                <label className={interests.includes("Обмен") ? "active" : ""}>
                  <input
                    type="checkbox"
                    value="Обмен"
                    checked={interests.includes("Обмен")}
                    onChange={handleCheckboxChange}
                  />
                  Обмен валюты
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Сообщение:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Отправить
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
