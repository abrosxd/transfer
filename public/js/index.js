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
    morningImage.classList.add("hidden");
    nightImage.classList.remove("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    morningImage.classList.remove("hidden");
    nightImage.classList.add("hidden");
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
  dollar: { buy: 0, sell: 0 },
  euro: { buy: 0, sell: 0 },
  pln: { buy: 0, sell: 0 },
  sek: { buy: 0, sell: 0 },
};

async function fetchCurrentRates() {
  const today = new Date().toISOString().split("T")[0];
  const proxyUrl = "https://api.allorigins.win/get?url=";
  const targetUrl = `https://www.sravni.ru/proxy-currencies-frontend/bank-rates?bankId=127&dateFrom=${today}`;

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
    localStorage.setItem(
      "cachedRates",
      JSON.stringify({ timestamp: Date.now(), rates: currentRates })
    );
    return currentRates;
  } catch (error) {
    console.error("Не удалось получить текущие курсы:", error);
    const cachedRates = localStorage.getItem("cachedRates");
    if (cachedRates) {
      const parsedRates = JSON.parse(cachedRates);
      const age = Date.now() - parsedRates.timestamp;
      if (age < 86400000) {
        // Используем кэшированные данные в течение суток
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
  return rate ? { buy: rate.bid, sell: rate.ask } : { buy: 0, sell: 0 };
}

function updateRates(currentRates) {
  const today = new Date().toISOString().split("T")[0];
  const currencyMap = {
    dollar: "USD",
    euro: "EUR",
    pln: "PLN",
    sek: "SEK",
  };

  for (const [currency, rates] of Object.entries(data)) {
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

    let buyRate;
    let sellRate;

    switch (currency) {
      case "dollar":
        buyRate = rates.buy !== 0 ? rates.buy : currentRate.buy + 5;
        sellRate = rates.sell !== 0 ? rates.sell : currentRate.sell - 4;
        break;
      case "euro":
        buyRate = rates.buy !== 0 ? rates.buy : currentRate.buy + 5;
        sellRate = rates.sell !== 0 ? rates.sell : currentRate.sell - 4;
        break;
      case "pln":
        buyRate = rates.buy !== 0 ? rates.buy : currentRate.buy + 2;
        sellRate = rates.sell !== 0 ? rates.sell : currentRate.sell - 2;
        break;
      case "sek":
        buyRate = rates.buy !== 0 ? rates.buy : currentRate.buy + 1;
        sellRate = rates.sell !== 0 ? rates.sell : currentRate.sell - 1;
        break;
      default:
        buyRate = rates.buy;
        sellRate = rates.sell;
    }

    console.log(
      `Обновляем ${currency}: Покупка - ${buyRate}, Продажа - ${sellRate}`
    );
    buyElement.textContent = buyRate.toFixed(2);
    sellElement.textContent = sellRate.toFixed(2);
  }
}

async function init() {
  const currentRates = await fetchCurrentRates();
  if (currentRates) {
    updateRates(currentRates);
  } else {
    console.log("Используются стандартные курсы.");
  }
}

init();
