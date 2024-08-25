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

// const data = {
//   dollar: { buy: null, sell: null, bankId: 127 },
//   euro: { buy: null, sell: null, bankId: 127 },
//   pln: { buy: null, sell: null, bankId: 127 },
//   sek: { buy: null, sell: 0, bankId: 262 },
// };

// const cachedBankRates = {};

// async function fetchCurrentRates(bankId) {
//   if (cachedBankRates[bankId]) {
//     return cachedBankRates[bankId];
//   }

//   const today = new Date().toISOString().split("T")[0];
//   const proxyUrl = "https://api.allorigins.win/get?url=";
//   const targetUrl = `https://www.sravni.ru/proxy-currencies-frontend/bank-rates?bankId=${bankId}&dateFrom=${today}`;

//   try {
//     console.log("Запрос к API:", proxyUrl + encodeURIComponent(targetUrl));
//     const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
//     if (!response.ok) {
//       throw new Error(`Ошибка HTTP: ${response.status}`);
//     }
//     const responseData = await response.json();
//     console.log("Полученные данные:", responseData);
//     const currentRates = JSON.parse(responseData.contents);
//     console.log("Разобранные данные:", currentRates);
//     cachedBankRates[bankId] = currentRates;
//     localStorage.setItem(
//       `cachedRates_${bankId}`,
//       JSON.stringify({ timestamp: Date.now(), rates: currentRates })
//     );
//     return currentRates;
//   } catch (error) {
//     console.error("Не удалось получить текущие курсы:", error);
//     const cachedRates = localStorage.getItem(`cachedRates_${bankId}`);
//     if (cachedRates) {
//       const parsedRates = JSON.parse(cachedRates);
//       const age = Date.now() - parsedRates.timestamp;
//       if (age < 86400000) {
//         return parsedRates.rates;
//       }
//     }
//     return null;
//   }
// }

// function getCurrencyRates(currentRates, currencyCode, today) {
//   const rate = currentRates.find(
//     (rate) =>
//       rate.currency.isoCode === currencyCode &&
//       rate.updateDate.startsWith(today)
//   );
//   return rate
//     ? { buy: rate.ask, sell: rate.bid, updateDate: rate.updateDate }
//     : { buy: 0, sell: 0, updateDate: null };
// }

// function calculateRates(currency, currentRate, rates) {
//   const adjustments = {
//     dollar: { buy: 5, sell: -4 },
//     euro: { buy: 5.4, sell: -5 },
//     pln: { buy: 2.5, sell: -2 },
//     sek: { buy: -0.87, sell: -1 },
//   };

//   const adjustment = adjustments[currency] || { buy: 0, sell: 0 };

//   const buyRate =
//     rates.buy !== null ? rates.buy : currentRate.buy + adjustment.buy;
//   const sellRate =
//     rates.sell !== null ? rates.sell : currentRate.sell + adjustment.sell;

//   return { buyRate, sellRate };
// }

// async function updateRates() {
//   const today = new Date().toISOString().split("T")[0];
//   const currencyMap = {
//     dollar: "USD",
//     euro: "EUR",
//     pln: "PLN",
//     sek: "SEK",
//   };

//   let latestUpdateTime = null;

//   for (const [currency, rates] of Object.entries(data)) {
//     const currentRates = await fetchCurrentRates(rates.bankId);

//     if (currentRates) {
//       const buyElement = document.getElementById(`buy-${currency}`);
//       const sellElement = document.getElementById(`sell-${currency}`);

//       const currentRate = getCurrencyRates(
//         currentRates,
//         currencyMap[currency],
//         today
//       );
//       console.log(
//         `Начальный курс ${currency}: Покупка - ${currentRate.buy}, Продажа - ${currentRate.sell}`
//       );

//       const { buyRate, sellRate } = calculateRates(
//         currency,
//         currentRate,
//         rates
//       );

//       console.log(
//         `Обновляем ${currency}: Покупка - ${buyRate}, Продажа - ${sellRate}`
//       );
//       buyElement.textContent = buyRate.toFixed(2);
//       sellElement.textContent = sellRate.toFixed(2);

//       if (currentRate.updateDate) {
//         const updateDate = new Date(currentRate.updateDate);
//         if (!latestUpdateTime || updateDate > latestUpdateTime) {
//           latestUpdateTime = updateDate;
//         }
//       }
//     } else {
//       console.log(`Не удалось обновить курсы для ${currency}`);
//     }
//   }

//   if (latestUpdateTime) {
//     const dateElement = document.querySelector(".date-upd-currency");
//     if (dateElement) {
//       dateElement.textContent = `${latestUpdateTime.toLocaleDateString()} ${latestUpdateTime.toLocaleTimeString()}`;
//     }
//   }
// }

// updateRates();

const corrections = {
  dollar: { buy: -4.8, sell: +5 },
  euro: { buy: -4.8, sell: +5.4 },
  pln: { buy: -2.6, sell: +2.3 },
  sek: { buy: -0.4, sell: null },
};

const proxyUrl = "https://api.allorigins.win/get?url=";
const currencyUrl = "https://ru.myfin.by/bank/energotransbank/currency";
const sekUrl = "https://ru.myfin.by/currency/cb-rf/sek?conv_sek=1";

function formatCurrency(value, correction) {
  if (correction === null) {
    return "-";
  } else {
    return value.toFixed(2);
  }
}

// Функция для получения данных о SEK и коррекции их
async function fetchSekCurrency() {
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(sekUrl));
    const result = await response.json();

    // Парсим HTML для SEK
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.contents, "text/html");

    // Находим элемент с курсом шведской кроны
    const sekElement = doc.querySelector(".col-xs-6.no-padding.value p.h1");

    if (sekElement) {
      let sekRate = parseFloat(sekElement.textContent.trim());

      // Разделяем на 10 и корректируем данные
      sekRate = sekRate / 10;
      const buySek = sekRate + corrections.sek.buy;
      const sellSek = sekRate + corrections.sek.sell;

      console.log("Крона: Покупка:", buySek, "Продажа:", sellSek);

      // Форматируем с учётом коррекции
      const buySekElement = document.getElementById("buy-sek");
      const sellSekElement = document.getElementById("sell-sek");

      if (buySekElement && sellSekElement) {
        buySekElement.textContent = formatCurrency(buySek, corrections.sek.buy);
        sellSekElement.textContent = formatCurrency(
          sellSek,
          corrections.sek.sell
        );
      } else {
        console.error("Элементы для SEK не найдены.");
      }
    } else {
      console.error("Курс SEK не найден");
    }
  } catch (error) {
    console.error("Ошибка при получении данных SEK:", error);
  }
}

// Функция для получения данных с сайта через прокси
async function fetchCurrencyData() {
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(currencyUrl));
    const result = await response.json();

    // Парсинг HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.contents, "text/html");

    // Находим таблицу с данными
    const table = doc.querySelector("#w0 .table-best tbody");

    if (table) {
      const rows = table.querySelectorAll("tr");

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        if (cells.length >= 5) {
          const currencyName = cells[0]?.textContent?.trim();
          const buyPrice = parseFloat(cells[1]?.textContent?.trim());
          const sellPrice = parseFloat(cells[2]?.textContent?.trim());

          // console.log(
          //   "Валюта:",
          //   currencyName,
          //   "Покупка:",
          //   buyPrice,
          //   "Продажа:",
          //   sellPrice
          // );

          if (currencyName === "Доллар") {
            const buyDollar = buyPrice + corrections.dollar.buy;
            const sellDollar = sellPrice + corrections.dollar.sell;
            console.log("Доллар: Покупка:", buyDollar, "Продажа:", sellDollar);

            const buyDollarElement = document.getElementById("buy-dollar");
            const sellDollarElement = document.getElementById("sell-dollar");

            if (buyDollarElement && sellDollarElement) {
              buyDollarElement.textContent = formatCurrency(
                buyDollar,
                corrections.dollar.buy
              );
              sellDollarElement.textContent = formatCurrency(
                sellDollar,
                corrections.dollar.sell
              );
            } else {
              console.error("Элементы для доллара не найдены.");
            }
          } else if (currencyName === "Евро") {
            const buyEuro = buyPrice + corrections.euro.buy;
            const sellEuro = sellPrice + corrections.euro.sell;
            console.log("Евро: Покупка:", buyEuro, "Продажа:", sellEuro);

            const buyEuroElement = document.getElementById("buy-euro");
            const sellEuroElement = document.getElementById("sell-euro");

            if (buyEuroElement && sellEuroElement) {
              buyEuroElement.textContent = formatCurrency(
                buyEuro,
                corrections.euro.buy
              );
              sellEuroElement.textContent = formatCurrency(
                sellEuro,
                corrections.euro.sell
              );
            } else {
              console.error("Элементы для евро не найдены.");
            }
          } else if (currencyName === "Злотый") {
            const buyPln = buyPrice + corrections.pln.buy;
            const sellPln = sellPrice + corrections.pln.sell;
            console.log("Злотый: Покупка:", buyPln, "Продажа:", sellPln);

            const buyPlnElement = document.getElementById("buy-pln");
            const sellPlnElement = document.getElementById("sell-pln");

            if (buyPlnElement && sellPlnElement) {
              buyPlnElement.textContent = formatCurrency(
                buyPln,
                corrections.pln.buy
              );
              sellPlnElement.textContent = formatCurrency(
                sellPln,
                corrections.pln.sell
              );
            } else {
              console.error("Элементы для злотого не найдены.");
            }
          }

          // Обновляем дату на странице
          const dateUpdate = cells[4]?.textContent?.trim();
          document.querySelector(".date-upd-currency").textContent = dateUpdate;
        }
      });
    } else {
      console.error("Таблица с данными не найдена.");
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

// Вызываем функции при загрузке страницы
async function fetchData() {
  await fetchCurrencyData();
  await fetchSekCurrency();
}

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
