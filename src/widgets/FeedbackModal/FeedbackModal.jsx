import React, { useState, useEffect } from "react";
import { useSettings } from "../../utils/Settings";
import "./FeedbackModal.scss";

export default function FeedbackModal({ isOpen, onClose }) {
  const { webhook } = useSettings();
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    socialLink: "",
    message: "",
    interests: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFormValid = () => {
    const { name, email, phone, socialLink, interests } = formData;
    return name && email && phone && socialLink && interests.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData(initialFormState);
        setTimeout(onClose, 5000);
      } else {
        console.error("Ошибка при отправке данных на Webhook");
      }
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prevData.interests, value]
            : prevData.interests.filter((interest) => interest !== value)
          : value,
    }));
  };

  useEffect(() => {
    if (!isOpen) setIsSubmitted(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const { name, email, phone, socialLink, message, interests } = formData;

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
            <img src="/assets/star-like.gif" alt="Thank you" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Номер телефона:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="socialLink">Ссылка на соц.сеть:</label>
              <input
                type="text"
                id="socialLink"
                name="socialLink"
                value={socialLink}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Вас интересует:</label>
              <div className="interests">
                {["Трансфер", "Посылки", "Обмен"].map((interest) => (
                  <label
                    key={interest}
                    className={interests.includes(interest) ? "active" : ""}
                  >
                    <input
                      type="checkbox"
                      value={interest}
                      name="interests"
                      checked={interests.includes(interest)}
                      onChange={handleChange}
                      required={interests.length === 0}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Сообщение:</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={handleChange}
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
