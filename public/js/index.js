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
  dollar: { buy: null, sell: null, bankId: 127 },
  euro: { buy: null, sell: null, bankId: 127 },
  pln: { buy: null, sell: null, bankId: 127 },
  sek: { buy: null, sell: 0, bankId: 262 },
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
  return rate
    ? { buy: rate.ask, sell: rate.bid, updateDate: rate.updateDate }
    : { buy: 0, sell: 0, updateDate: null };
}

function calculateRates(currency, currentRate, rates) {
  const adjustments = {
    dollar: { buy: 5, sell: -4 },
    euro: { buy: 5.4, sell: -5 },
    pln: { buy: 2.5, sell: -2 },
    sek: { buy: -0.87, sell: -1 },
  };

  const adjustment = adjustments[currency] || { buy: 0, sell: 0 };

  const buyRate =
    rates.buy !== null ? rates.buy : currentRate.buy + adjustment.buy;
  const sellRate =
    rates.sell !== null ? rates.sell : currentRate.sell + adjustment.sell;

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

  let latestUpdateTime = null;

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

      if (currentRate.updateDate) {
        const updateDate = new Date(currentRate.updateDate);
        if (!latestUpdateTime || updateDate > latestUpdateTime) {
          latestUpdateTime = updateDate;
        }
      }
    } else {
      console.log(`Не удалось обновить курсы для ${currency}`);
    }
  }

  if (latestUpdateTime) {
    const dateElement = document.querySelector(".date-upd-currency");
    if (dateElement) {
      dateElement.textContent = `${latestUpdateTime.toLocaleDateString()} ${latestUpdateTime.toLocaleTimeString()}`;
    }
  }
}

updateRates();
