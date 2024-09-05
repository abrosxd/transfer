import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Navigation.scss";
import Button from "../../partials/Button/Button";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeIcon, setThemeIcon] = useState(
    <i className="fa-solid fa-sun"></i>
  );
  const [themeText, setThemeText] = useState("Светлая");
  const menuRef = useRef(null);
  const barsRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    closeMenu();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        barsRef.current &&
        !barsRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setThemeIcon(<i className="fa-solid fa-moon"></i>);
      setThemeText("Тёмная");
    } else {
      setThemeIcon(<i className="fa-solid fa-sun"></i>);
      setThemeText("Светлая");
    }
  }, []);

  const switchTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    setThemeIcon(
      isDark ? (
        <i className="fa-solid fa-moon"></i>
      ) : (
        <i className="fa-solid fa-sun"></i>
      )
    );
    setThemeText(isDark ? "Тёмная" : "Светлая");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <nav className="navigation">
      <Button
        onClick={toggleMenu}
        className={"bars"}
        icon={
          menuOpen ? (
            <i className="fa-solid fa-xmark"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )
        }
        ref={barsRef}
      />
      <div ref={menuRef} className={`menu ${menuOpen ? "open" : ""}`}>
        <Button to="/" text="Главная" icon={<i className="fa fa-house"></i>} />
        <Button
          to="/transfer"
          text="Трансферы"
          icon={<i className="fa fa-route"></i>}
        />
        <Button
          to="/parcel"
          text="Посылки"
          icon={<i className="fa fa-boxes-packing"></i>}
        />
        <Button
          to="/currency"
          text="Валюты"
          icon={<i className="fa fa-money-bill-transfer"></i>}
        />
        <h4>Тема</h4>
        <Button text={themeText} onClick={switchTheme} icon={themeIcon} />
        <h4>Ссылки</h4>
        <div className="links">
          <Button
            href="https://t.me/TipTopTransfer"
            text="Группа"
            icon={<i className="fa-brands fa-telegram"></i>}
          />
          <Button
            href="https://t.me/TipTopDriver"
            text="Евгений"
            icon={<i className="fa-brands fa-telegram"></i>}
          />
        </div>
      </div>
    </nav>
  );
}
