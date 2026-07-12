/*
  Логика расчета:

  1. Базовая стоимость и срок зависят от типа сайта:
     Лендинг = 50 000 ₽, 10 дней
     Корпоративный сайт = 120 000 ₽, 20 дней
     Интернет-магазин = 250 000 ₽, 35 дней

  2. Каждая дополнительная страница сверх первой:
     +5 000 ₽ и +1 день

  3. Дополнительные функции:
     Форма заявки = +10 000 ₽, +1 день
     Каталог = +30 000 ₽, +4 дня
     Онлайн-оплата = +40 000 ₽, +5 дней
     CRM = +35 000 ₽, +4 дня
     Мультиязычность = +25 000 ₽, +3 дня

  4. Срочность:
     Стандарт = x1.0 к стоимости, срок без изменений
     Быстрее обычного = x1.2 к стоимости, срок * 0.85
     Очень срочно = x1.5 к стоимости, срок * 0.7
*/

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

calculateBtn.addEventListener("click", () => {
  const siteType = document.getElementById("siteType").value;
  const pages = Math.max(
    1,
    parseInt(document.getElementById("pages").value) || 1
  );
  const urgency = document.getElementById("urgency").value;

  let cost = 0;
  let days = 0;
  let siteName = "";

  if (siteType === "landing") {
    cost = 50000;
    days = 10;
    siteName = "лендинг";
  }

  if (siteType === "corporate") {
    cost = 120000;
    days = 20;
    siteName = "корпоративный сайт";
  }

  if (siteType === "shop") {
    cost = 250000;
    days = 35;
    siteName = "интернет-магазин";
  }

  const extraPages = pages - 1;
  cost += extraPages * 5000;
  days += extraPages;

  const selectedOptions = [];

  const options = [
    {
      id: "leadForm",
      name: "форма заявки",
      cost: 10000,
      days: 1
    },
    {
      id: "catalog",
      name: "каталог",
      cost: 30000,
      days: 4
    },
    {
      id: "payment",
      name: "онлайн-оплата",
      cost: 40000,
      days: 5
    },
    {
      id: "crm",
      name: "интеграция с CRM",
      cost: 35000,
      days: 4
    },
    {
      id: "multilang",
      name: "мультиязычность",
      cost: 25000,
      days: 3
    }
  ];

  options.forEach(option => {
    if (document.getElementById(option.id).checked) {
      cost += option.cost;
      days += option.days;
      selectedOptions.push(option.name);
    }
  });

  let urgencyText = "стандартные сроки";

  if (urgency === "fast") {
    cost *= 1.2;
    days *= 0.85;
    urgencyText = "быстрее обычного";
  }

  if (urgency === "urgent") {
    cost *= 1.5;
    days *= 0.7;
    urgencyText = "очень срочно";
  }

  cost = Math.round(cost);
  days = Math.ceil(days);

  document.getElementById("price").textContent =
    cost.toLocaleString("ru-RU") + " ₽";

  document.getElementById("timeline").textContent =
    days + " дней";

  const optionsText =
    selectedOptions.length > 0
      ? selectedOptions.join(", ")
      : "без дополнительных функций";

  document.getElementById("explanation").textContent =
    `Это предварительный расчёт для проекта «${siteName}». Страниц: ${pages}. Выбранные функции: ${optionsText}. Срочность: ${urgencyText}. Итоговая стоимость и срок могут уточняться после обсуждения деталей проекта с командой.`;

  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

resetBtn.addEventListener("click", () => {
  document.getElementById("siteType").value = "landing";
  document.getElementById("pages").value = 1;
  document.getElementById("urgency").value = "standard";

  ["leadForm", "catalog", "payment", "crm", "multilang"].forEach(id => {
    document.getElementById(id).checked = false;
  });

  document.getElementById("result").style.display = "none";

  document.querySelector(".card").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// --- Modal: Связаться ---
const contactBtn = document.getElementById("contactBtn");
const contactModal = document.getElementById("contactModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCloseBtnBottom = document.getElementById("modalCloseBtnBottom");
const modalContactForm = document.getElementById("modalContactForm");

contactBtn.addEventListener("click", () => {
  contactModal.classList.add("is-open");
  document.body.style.overflow = "hidden";
});

function closeModal() {
  contactModal.classList.remove("is-open");
  document.body.style.overflow = "";
}

modalCloseBtn.addEventListener("click", closeModal);
modalCloseBtnBottom.addEventListener("click", closeModal);

contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && contactModal.classList.contains("is-open")) {
    closeModal();
  }
});

modalContactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("modalName").value.trim();
  const email = document.getElementById("modalEmail").value.trim();
  const phone = document.getElementById("modalPhone").value.trim();

  if (!name) {
    alert("Пожалуйста, введите имя");
    return;
  }

  const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone && phone.replace(/\D/g, "").length >= 10;

  if (!emailValid && !phoneValid) {
    alert("Укажите e-mail или телефон для связи");
    return;
  }

  const formData = new FormData(modalContactForm);

  fetch("https://formspree.io/f/mkolenkg", {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" }
  })
    .then((response) => {
      if (response.ok) {
        modalContactForm.innerHTML =
          '<div style="text-align:center;padding:32px 20px;">' +
          '<h3 style="font-size:20px;font-weight:700;margin-bottom:10px;color:var(--accent);">Заявка отправлена!</h3>' +
          '<p style="font-size:15px;color:var(--muted);line-height:1.6;">Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>' +
          "</div>";
      } else {
        alert("Произошла ошибка при отправке. Попробуйте ещё раз.");
      }
    })
    .catch(() => {
      alert("Произошла ошибка при отправке. Проверьте подключение к интернету.");
    });
});

