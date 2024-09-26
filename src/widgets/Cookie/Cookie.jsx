import React, { useState, useEffect } from "react";
import "./Cookie.scss";
import Button from "../../partials/Button/Button";

const Cookie = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      initializeGoogleAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    initializeGoogleAnalytics();
  };

  const initializeGoogleAnalytics = () => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-SPHVK0BY9H";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-SPHVK0BY9H");
    };
  };

  if (!showBanner) return null;

  return (
    <div className="cookie">
      <p>Да, это куки и мы тоже их используем.</p>
      <Button onClick={handleAccept} className="cookie-set" text="Ok" />
    </div>
  );
};

export default Cookie;
