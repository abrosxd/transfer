//! Active Navbar Item

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((navItem, i) => {
  navItem.addEventListener("click", () => {
    navItems.forEach((item, j) => {
      item.className = "nav-item";
    });
    navItem.className = "nav-item active";
  });
});

//! Light/Dark Mode

const moonIcon = document.querySelector(".moon");
const sunIcon = document.querySelector(".sun");
const nightImage = document.querySelector(".night-img");
const morningImage = document.querySelector(".morning-img");
const toggle = document.querySelector(".toggle");

function switchTheme() {
  document.body.classList.toggle("darkmode");
  if (document.body.classList.contains("darkmode")) {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

//! Share Button Popup

const sharebtns = document.querySelectorAll(".share-btn");

sharebtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const popup = btn.closest(".event-footer").querySelector(".popup");

    btn.classList.toggle("active");
    popup.classList.toggle("active");

    event.stopPropagation();
  });
});

document.addEventListener("click", (event) => {
  const popups = document.querySelectorAll(".popup");

  popups.forEach((popup) => {
    if (popup.classList.contains("active") && !popup.contains(event.target)) {
      popup.classList.remove("active");

      const shareBtn = popup
        .closest(".event-footer")
        .querySelector(".share-btn");
      shareBtn.classList.remove("active");
    }
  });
});

//! Like Buttons

const likeBtns = document.querySelectorAll(".like-btn");

likeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", () => {
    if (likeBtn.classList.contains("bxs-heart")) {
      likeBtn.classList.remove("bxs-heart");
      likeBtn.classList.add("bx-heart");
      likeBtn.classList.remove("bounce-in");
    } else {
      likeBtn.classList.add("bxs-heart");
      likeBtn.classList.remove("bx-heart");
      likeBtn.classList.add("bounce-in");
    }
  });
});

//! Currency

const data = {
  dollar: { buy: 0, sell: 0, bankId: 127 },
  euro: { buy: 0, sell: 0, bankId: 127 },
  pln: { buy: 0, sell: 0, bankId: 127 },
  sek: { buy: 0, sell: "-", bankId: 262 },
};

const cachedBankRates = {};

async function fetchCurrentRates(bankId) {
  if (cachedBankRates[bankId]) {
    return cachedBankRates[bankId];
  }

  const today = new Date().toISOString().split("T")[0];
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = `https://www.sravni.ru/proxy-currencies-frontend/bank-rates?bankId=${bankId}&dateFrom=${today}`;

  try {
    console.log("Запрос к API:", proxyUrl + encodeURIComponent(targetUrl));
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const responseData = await response.json();
    console.log("Полученные данные:", responseData);
    const currentRates = JSON.parse(responseData.contents);
    console.log("Разобранные данные:", currentRates);
    cachedBankRates[bankId] = currentRates;
    localStorage.setItem(
      `cachedRates_${bankId}`,
      JSON.stringify({ timestamp: Date.now(), rates: currentRates })
    );
    return currentRates;
  } catch (error) {
    console.error("Не удалось получить текущие курсы:", error);
    const cachedRates = localStorage.getItem(`cachedRates_${bankId}`);
    if (cachedRates) {
      const parsedRates = JSON.parse(cachedRates);
      const age = Date.now() - parsedRates.timestamp;
      if (age < 86400000) {
        return parsedRates.rates;
      }
    }
    return null;
  }
}

function getCurrencyRates(currentRates, currencyCode, today) {
  const rate = currentRates.find(
    (rate) =>
      rate.currency.isoCode === currencyCode &&
      rate.updateDate.startsWith(today)
  );
  return rate ? { buy: rate.ask, sell: rate.bid } : { buy: 0, sell: 0 };
}

function calculateRates(currency, currentRate, rates) {
  const adjustments = {
    dollar: { buy: 5.28, sell: -3.78 },
    euro: { buy: 6.12, sell: -4.42 },
    pln: { buy: 2.6, sell: -2.1 },
    sek: { buy: -0.51, sell: -1 },
  };

  const adjustment = adjustments[currency] || { buy: 0, sell: 0 };

  const buyRate =
    rates.buy !== 0 ? rates.buy : currentRate.buy + adjustment.buy;
  const sellRate =
    rates.sell !== 0 ? rates.sell : currentRate.sell + adjustment.sell;

  return { buyRate, sellRate };
}

async function updateRates() {
  const today = new Date().toISOString().split("T")[0];
  const currencyMap = {
    dollar: "USD",
    euro: "EUR",
    pln: "PLN",
    sek: "SEK",
  };

  for (const [currency, rates] of Object.entries(data)) {
    const currentRates = await fetchCurrentRates(rates.bankId);

    if (currentRates) {
      const buyElement = document.getElementById(`buy-${currency}`);
      const sellElement = document.getElementById(`sell-${currency}`);

      const currentRate = getCurrencyRates(
        currentRates,
        currencyMap[currency],
        today
      );
      console.log(
        `Начальный курс ${currency}: Покупка - ${currentRate.buy}, Продажа - ${currentRate.sell}`
      );

      const { buyRate, sellRate } = calculateRates(
        currency,
        currentRate,
        rates
      );

      console.log(
        `Обновляем ${currency}: Покупка - ${buyRate}, Продажа - ${sellRate}`
      );
      buyElement.textContent = buyRate.toFixed(2);
      sellElement.textContent = sellRate.toFixed(2);
    } else {
      console.log(`Не удалось обновить курсы для ${currency}`);
    }
  }
}

updateRates();
