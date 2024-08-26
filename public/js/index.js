//! Active Navbar Item

const navItems = document.querySelectorAll(".nav-item");
const contentItems = document.querySelectorAll(".block-content");

function handleNavClick(event) {
  navItems.forEach((item) => {
    item.classList.remove("active");
  });
  event.currentTarget.classList.add("active");
  contentItems.forEach((content) => {
    content.style.display = "none";
  });

  const contentId =
    event.currentTarget.querySelector("a").getAttribute("href").substring(1) +
    "-content";
  document.getElementById(contentId).style.display = "block";
}
navItems.forEach((item) => {
  item.addEventListener("click", handleNavClick);
});

const initialHash = window.location.hash;
if (initialHash) {
  const initialNavItem = document.querySelector(
    `.nav-item a[href="${initialHash}"]`
  ).parentElement;
  if (initialNavItem) {
    initialNavItem.click();
  }
} else {
  const firstNavItem = navItems[0];
  if (firstNavItem) {
    firstNavItem.click();
  }
}

//! Light/Dark Mode

const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
const toggle = document.querySelector(".toggle");

function switchTheme() {
  document.body.classList.toggle("darkmode");

  if (document.body.classList.contains("darkmode")) {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    localStorage.setItem("theme", "dark");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    localStorage.setItem("theme", "light");
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("darkmode");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    document.body.classList.remove("darkmode");
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

loadTheme();

//! Currency

const corrections = {
  usd: { buy: -4.8, sell: +5 },
  eur: { buy: -4.8, sell: +5.4 },
  pln: { buy: -2.6, sell: +2.3 },
  sek: { buy: -0.15, sell: null },
};

const proxyUrl = "https://api.allorigins.win/get?url=";
const currencyUrl = `https://ru.myfin.by/bank/energotransbank/currency?nocache=${new Date().getTime()}`;
const sekUrl = `https://ru.myfin.by/currency/cb-rf/sek?conv_sek=1&nocache=${new Date().getTime()}`;

// Функция для форматирования валюты с учётом коррекции
function formatCurrency(value, correction) {
  if (value === "**.**") {
    return "**.**";
  }
  if (isNaN(value)) {
    console.error(`Некорректное значение валюты: ${value}`);
    return "-";
  }
  return correction === null ? "-" : (value + correction).toFixed(2);
}

// Функция для обновления данных на странице
function updateCurrencyElements(currency, buyPrice, sellPrice) {
  const buyElement = document.getElementById(`buy-${currency}`);
  const sellElement = document.getElementById(`sell-${currency}`);

  if (buyElement && sellElement) {
    buyElement.textContent = formatCurrency(
      buyPrice,
      corrections[currency].buy
    );
    sellElement.textContent = formatCurrency(
      sellPrice,
      corrections[currency].sell
    );
  }
}

// Функция для обновления даты на странице
function updateDate(dateText) {
  const dateElement = document.querySelector(".date-upd-currency");
  if (dateElement) {
    dateElement.textContent = dateText;
  }
}

// Функция для парсинга HTML и получения курса валюты
async function fetchCurrency(url, selector, callback) {
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(url));
    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();

    const parser = new DOMParser();
    const doc = parser.parseFromString(result.contents, "text/html");

    const element = doc.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      console.error("Элемент не найден по селектору:", selector);
    }
  } catch (error) {
    console.error("Ошибка при получении данных валюты:", error);
  }
}

// Функция для получения и коррекции данных SEK
async function fetchSekCurrency() {
  await fetchCurrency(sekUrl, ".col-xs-6.no-padding.value p.h1", (element) => {
    let sekRate = parseFloat(element.textContent.trim()) / 10;
    if (isNaN(sekRate)) {
      console.error("Некорректные данные для SEK:", sekRate);
      return;
    }
    const buySek = sekRate + corrections.sek.buy;
    const sellSek = sekRate + corrections.sek.sell;

    updateCurrencyElements("sek", buySek, sellSek);
  });
}

// Функция для получения данных с основной таблицы и коррекции
async function fetchCurrencyData() {
  await fetchCurrency(currencyUrl, "#w0", (table) => {
    const rows = table.querySelectorAll("tr");

    if (rows.length >= 4) {
      const usdCells = rows[1].querySelectorAll("td");
      const usdBuyPrice = parseFloat(usdCells[1].textContent.trim());
      const usdSellPrice = parseFloat(usdCells[2].textContent.trim());
      updateCurrencyElements("usd", usdBuyPrice, usdSellPrice);

      const eurCells = rows[2].querySelectorAll("td");
      const eurBuyPrice = parseFloat(eurCells[1].textContent.trim());
      const eurSellPrice = parseFloat(eurCells[2].textContent.trim());
      updateCurrencyElements("eur", eurBuyPrice, eurSellPrice);

      const plnCells = rows[3].querySelectorAll("td");
      const plnBuyPrice = parseFloat(plnCells[1].textContent.trim());
      const plnSellPrice = parseFloat(plnCells[2].textContent.trim());
      updateCurrencyElements("pln", plnBuyPrice, plnSellPrice);
    }

    const updateDateElement = table.querySelector(".date_update");
    if (updateDateElement) {
      const updateDateText = updateDateElement.textContent.trim();
      updateDate(updateDateText);
    } else {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;

      updateDate(formattedDate);
    }
  });
}

// Функция для параллельного выполнения запросов
async function fetchData() {
  // Добавляем класс "updating" к элементам
  document
    .querySelectorAll(".event-number.card .grid, .date-upd-currency")
    .forEach((el) => {
      el.classList.add("updating");
    });

  // Выполняем обновление данных
  await Promise.all([fetchCurrencyData(), fetchSekCurrency()]);

  // Убираем класс "updating" после завершения обновления данных
  document
    .querySelectorAll(".event-number.card .grid, .date-upd-currency")
    .forEach((el) => {
      el.classList.remove("updating");
    });
}

// Обработчик для кнопки обновления
const reloadButton = document.querySelector(".reload-currency");
if (reloadButton) {
  reloadButton.addEventListener("click", async () => {
    updateCurrencyElements("usd", "**.**", "**.**");
    updateCurrencyElements("eur", "**.**", "**.**");
    updateCurrencyElements("pln", "**.**", "**.**");
    updateCurrencyElements("sek", "**.**", "**.**");
    updateDate("**:** **.**.****");

    fetchData();
  });
}

// Вызываем функции при загрузке страницы
fetchData();

// Swiper Reviews
const API_KEY =
  "patZs0xLRQaVH0yJo.6b37088cccb3ce09e6abf49e350c39d5011e0e8f7cb478fa33d47eaa6667e8be";
const BASE_ID = "appSNMO8drd0jsR3F";
const TABLE_NAME = "Article";

async function fetchReviews() {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();
  return data.records;
}

function createReviewCard(reviewData) {
  const card = document.createElement("div");
  card.classList.add("swiper-slide", "card", "review-card");

  const reviewHtml = `
      <h2>${reviewData.fields.Name}</h2>
      <div class="ratings">
        ${getRatingStars(reviewData.fields.Rating)}
      </div>
      <p>${reviewData.fields.Review}</p>
    `;

  card.innerHTML = reviewHtml;
  return card;
}

function getRatingStars(rating) {
  let stars = "";
  for (let i = 0; i < Math.floor(rating); i++) {
    stars += '<i class="fa fa-star"></i>';
  }
  if (rating % 1 !== 0) {
    stars += '<i class="fa fa-star-half-stroke"></i>';
  }
  return stars;
}

async function renderReviews() {
  const reviewContainer = document.querySelector(".swiper-wrapper");
  const reviews = await fetchReviews();

  reviews.forEach((reviewData) => {
    const reviewCard = createReviewCard(reviewData);
    reviewContainer.appendChild(reviewCard);
  });

  const swiper = new Swiper(".swiper-reviews", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      1200: {
        slidesPerView: 2,
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", renderReviews);
