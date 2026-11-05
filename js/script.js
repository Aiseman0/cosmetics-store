document.addEventListener("DOMContentLoaded", function() {

  // helper: text from the shared EN/RU/KZ dictionary (auth.js)
  function L(key, fallback) {
    return window.yelloT ? window.yelloT(key) : fallback;
  }

  // --- 1. Form validation (Форма контактов) ---
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
      event.preventDefault();

      var username = document.getElementById("username").value.trim();
      var email = document.getElementById("useremail").value.trim();
      var message = document.getElementById("message").value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (username === "" || email === "" || message === "") {
        yelloMsg(L("m_fill", "Please fill in all required fields!"));
        return;
      }

      if (username.length < 3) {
        yelloMsg(L("m_name3", "Name must be at least 3 characters long!"));
        return;
      }

      if (!emailPattern.test(email)) {
        yelloMsg(L("m_email", "Please enter a valid email address."));
        return;
      }

      var phoneEl = document.getElementById("userphone");
      if (phoneEl && !/^(\+7|8)\d{10}$/.test(phoneEl.value.replace(/[\s()\-]/g, ""))) {
        yelloMsg(L("e_phone", "Invalid phone number"));
        return;
      }

      // Assignment 6: jQuery code (bottom of file) shows spinner, toast and resets the form
      $("#contact-form").trigger("formOk");
    });
  }

  // --- 2. Simple FAQ Accordion ---
  var headers = document.querySelectorAll(".accordion-header-custom");
  for (var i = 0; i < headers.length; i++) {
    headers[i].addEventListener("click", function() {
      var item = this.parentElement;
      var body = item.querySelector(".accordion-body-custom");

      if (item.classList.contains("active")) {
        item.classList.remove("active");
        body.style.maxHeight = "0px";
        body.style.padding = "0px 14px";
      } else {
        item.classList.add("active");
        body.style.maxHeight = "200px";
        body.style.padding = "10px 14px";
      }
    });
  }

  // --- 3. Popup modal control + Email Validation ---
  var popupOverlay = document.getElementById("popup-overlay");
  var openPopupBtn = document.getElementById("open-popup-btn");
  var closePopupBtn = document.getElementById("close-popup-btn");
  var popupSubscribeBtn = document.getElementById("popup-subscribe-btn");
  var popupEmailInput = document.getElementById("popup-email");

  if (openPopupBtn && popupOverlay) {
    openPopupBtn.addEventListener("click", function() {
      popupOverlay.style.display = "flex";
    });
  }

  if (closePopupBtn && popupOverlay) {
    closePopupBtn.addEventListener("click", function() {
      popupOverlay.style.display = "none";
    });
  }

  if (popupSubscribeBtn && popupEmailInput) {
    popupSubscribeBtn.addEventListener("click", function() {
      var emailVal = popupEmailInput.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailVal === "") {
        yelloMsg(L("m_sub_empty", "Please enter your email address!"));
        return;
      }

      if (!emailPattern.test(emailVal)) {
        yelloMsg(L("m_email", "Please enter a valid email address."));
        return;
      }

      yelloMsg(L("m_thanks", "Thank you for subscribing!"));
      popupEmailInput.value = "";
      if (popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });
  }

  // --- 4. Background color change with localStorage ---
  var bgColorBtn = document.getElementById("bg-color-btn");
  var colors = ["#FFFAED", "#FFF3C4", "#FFE866", "#FFF8E7", "#FFF0F5"];
  var savedColor = localStorage.getItem("yello_bg_color");
  var savedIndex = localStorage.getItem("yello_bg_index");

  if (savedColor) {
    document.body.style.setProperty("background-color", savedColor, "important");
  }

  if (bgColorBtn) {
    var colorIndex = savedIndex ? parseInt(savedIndex) : 0;
    bgColorBtn.addEventListener("click", function() {
      colorIndex = colorIndex + 1;
      if (colorIndex >= colors.length) {
        colorIndex = 0;
      }
      var chosenColor = colors[colorIndex];
      document.body.style.setProperty("background-color", chosenColor, "important");
      localStorage.setItem("yello_bg_color", chosenColor);
      localStorage.setItem("yello_bg_index", colorIndex);
    });
  }

  // --- 5. Live Clock ---
  var datetimeDisplay = document.getElementById("datetime-display");
  if (datetimeDisplay) {
    function showTime() {
      var d = new Date();
      var loc = { en: "en-GB", ru: "ru-RU", kz: "kk-KZ" }[localStorage.getItem("yello_lang") || "en"];
      datetimeDisplay.innerText = d.toLocaleDateString(loc) + " " + d.toLocaleTimeString(loc);
    }
    showTime();
    setInterval(showTime, 1000);
  }





  // --- 6. Product Carousel ---
  var items = document.querySelectorAll(".carousel-item");
  var nextBtn = document.querySelector(".carousel-control-next");
  var prevBtn = document.querySelector(".carousel-control-prev");
  var indicators = document.querySelectorAll(".carousel-indicators button");
  var currentIndex = 0;

  function updateCarousel() {
    for (var j = 0; j < items.length; j++) {
      items[j].classList.remove("active");
    }
    if (items[currentIndex]) {
      items[currentIndex].classList.add("active");
    }

    for (var k = 0; k < indicators.length; k++) {
      indicators[k].classList.remove("active");
    }
    if (indicators[currentIndex]) {
      indicators[currentIndex].classList.add("active");
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function() {
      currentIndex = currentIndex + 1;
      if (currentIndex >= items.length) {
        currentIndex = 0;
      }
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function() {
      currentIndex = currentIndex - 1;
      if (currentIndex < 0) {
        currentIndex = items.length - 1;
      }
      updateCarousel();
    });
  }

  for (let i = 0; i < indicators.length; i++) {
    indicators[i].addEventListener("click", function() {
      currentIndex = i;
      updateCarousel();
    });
  }

  // ==========================================
  // ASSIGNMENT 5: ADVANCED JS & DOM FEATURES
  // ==========================================

  // A. JavaScript Objects & Dynamic Greeting by Time of Day
  var storeInfo = {
    name: "Yello Beauty",
    founders: ["Sara Nauash", "Aisulu Amanzhol"],
    group: "SE-2506",
    getGreeting: function() {
      var hour = new Date().getHours();
      if (hour < 12) return L("greet_m", "Good Morning!");
      if (hour < 18) return L("greet_a", "Good Afternoon!");
      return L("greet_e", "Good Evening!");
    }
  };

  var greetingElem = document.getElementById("time-greeting");
  if (greetingElem) {
    greetingElem.innerText = storeInfo.getGreeting();
  }

  // B. Switch Statement for Welcome Message Selector (About Us page)
  var langButtons = document.querySelectorAll(".lang-btn");
  var welcomeMsg = document.getElementById("welcome-message");

  function getLocalizedWelcome(lang) {
    var z = "";
    switch (lang) {
      case "ru":
        z = "Добро пожаловать в Yello Beauty!";
        break;
      case "kz":
        z = "Yello Beauty дүкеніне қош келдіңіз!";
        break;
      default:
        z = "Welcome to Yello Beauty!";
    }
    return z;
  }

  langButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var lang = this.getAttribute("data-lang");
      if (welcomeMsg) {
        welcomeMsg.innerText = getLocalizedWelcome(lang);
      }
    });
  });

  // C. Interactive Shopping Cart & Add-to-Cart Logic with Sound & Animation
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem("yello_cart") || "[]"); } catch (e) { cart = []; }
  var cartCountElem = document.getElementById("cart-count");
  var cartItemsList = document.getElementById("cart-items-list");
  var cartTotalElem = document.getElementById("cart-total");
  var checkoutBtn = document.getElementById("checkout-btn");

  var cartButtons = document.querySelectorAll(".product-card .btn, .add-to-cart-btn");

  cartButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      this.style.transform = "scale(0.92)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);

      playNotificationSound();

      var productCard = this.closest(".product-card") || this.closest(".card");
      if (productCard) {
        var titleElem = productCard.querySelector(".card-title");
        var priceElem = productCard.querySelector(".product-price") || productCard.querySelector(".card-body p.fw-bold");

        if (titleElem && priceElem) {
          var title = titleElem.innerText;
          var priceText = priceElem.innerText.replace(" ₸", "").replace(",", "").trim();
          var price = parseInt(priceText) || 0;

          cart.push({ title: title, price: price });
          updateCartUI();
        }
      }
    });
  });

  function updateCartUI() {
    if (!cartCountElem || !cartItemsList || !cartTotalElem) return;
    localStorage.setItem("yello_cart", JSON.stringify(cart));

    cartCountElem.innerText = cart.length;

    if (cart.length === 0) {
      cartItemsList.innerHTML = "<li>" + L("m_cart_li", "Cart is empty") + "</li>";
      cartTotalElem.innerText = "0";
      return;
    }

    var html = "";
    var total = 0;

    cart.forEach(function(item) {
      total += item.price;
      var safeTitle = String(item.title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html += '<li class="cart-line"><span>' + safeTitle + '</span>' +
              '<span class="fw-bold">' + item.price.toLocaleString() + ' ₸</span></li>';
    });

    cartItemsList.innerHTML = html;
    cartTotalElem.innerText = total.toLocaleString();
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        yelloMsg(L("m_cart_empty", "Your cart is empty!"));
        return;
      }
      yelloMsg(L("m_order", "Thank you for your order! Total amount:") + " " + cartTotalElem.innerText + " ₸");
      cart = [];
      updateCartUI();
    });
  }

  updateCartUI();

  // D. Play Sounds (Web Audio API)
  function playNotificationSound() {
    try {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = audioCtx.createOscillator();
      var gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio context blocked or unsupported");
    }
  }

  // E. Keyboard Event Handling (Arrow navigation + Enter to open page)
  var navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  var currentFocusIndex = 0;

  document.addEventListener("keydown", function(event) {
    var tag = document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || navLinks.length === 0) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      if (event.key === "ArrowRight") {
        currentFocusIndex = (currentFocusIndex + 1) % navLinks.length;
      } else if (event.key === "ArrowLeft") {
        currentFocusIndex = (currentFocusIndex - 1 + navLinks.length) % navLinks.length;
      }

      navLinks[currentFocusIndex].focus();
      event.preventDefault();
    }

    if (event.key === "Enter") {
      var focusedElement = document.activeElement;
      if (focusedElement.classList.contains("nav-link")) {
        window.location.href = focusedElement.getAttribute("href");
      }
    }
  });

  // F. Star rating is handled (and saved) in auth.js

  // ==========================================
  // NEW: DARK / LIGHT THEME
  // ==========================================
  var themeBtn = document.getElementById("theme-btn");
  var currentTheme = localStorage.getItem("yello_theme") || "light";

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      document.body.style.setProperty("background-color", "#121212", "important");
      if (themeBtn) {
        themeBtn.innerText = "☀️";
      }
    } else {
      document.body.classList.remove("dark-mode");
      var oldColor = localStorage.getItem("yello_bg_color");
      if (oldColor) {
        document.body.style.setProperty("background-color", oldColor, "important");
      } else {
        document.body.style.removeProperty("background-color");
      }
      if (themeBtn) {
        themeBtn.innerText = "🌙";
      }
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function() {
      if (currentTheme === "dark") {
        currentTheme = "light";
      } else {
        currentTheme = "dark";
      }
      localStorage.setItem("yello_theme", currentTheme);
      applyTheme(currentTheme);
    });
  }

  // If user clicks "Change BG Color" in dark mode, keep the dark background
  if (bgColorBtn) {
    bgColorBtn.addEventListener("click", function() {
      if (currentTheme === "dark") {
        document.body.style.setProperty("background-color", "#121212", "important");
      }
    });
  }

  applyTheme(currentTheme);

  // ==========================================
  // NEW: SITE LANGUAGE (EN / RU / KZ)
  // ==========================================
  var translations = {
    ru: {
      nav_home: "Главная", nav_catalog: "Каталог", nav_about: "О нас", nav_contact: "Контакты",
      sb_quick: "Быстрая навигация",
      foot_rights: "© 2026 Yello Beauty Cosmetics. Все права защищены.",
      foot_team: "Участники команды: Aisulu Amanzhol, Sara Nauash (Группа SE-2506)",

      t_promo: "✨ Получите скидку -15% по промокоду YELLO15!",
      t_orig: "💄 100% оригинальная косметика!",
      t_ship: "🚚 Бесплатная доставка по Казахстану при заказе от 15 000 ₸!",
      t_glow: "✨ Сияй как солнце, свети как луна!",
      t_ship2: "🚚 Бесплатная доставка при заказе от 15 000 ₸!",
      t_welcome: "💛 Добро пожаловать в магазин Yello Beauty!",
      t_touch: "Свяжитесь с нами для персональных советов по красоте! 💛",

      s_why: "Почему мы", s_highlights: "О магазине", s_featured: "Бренд месяца", s_showcase: "Все товары",
      btn_bg: "🎨 Сменить цвет фона", btn_popup: "🎁 Спецпредложение",
      h_title: "Сияние солнца для вашей красоты",
      h_lead: "100% оригинальная косметика от лучших мировых брендов",
      i_why: "Почему выбирают Yello Beauty",
      f1_t: "100% оригинал", f1_d: "Гарантия качества на все товары",
      f2_t: "Модный ассортимент", f2_d: "Только топовые бренды и бестселлеры",
      f3_t: "Быстрая доставка", f3_d: "Отправка в день заказа по всей стране",
      g_title: "Наши главные гарантии",
      g_desc: "Мы тщательно отбираем каждый товар, чтобы ваша кожа получала мягкий, эффективный и безопасный уход.",
      g1_t: "Проверено дерматологами", g1_d: "Разработано и протестировано для чувствительной кожи.",
      g2_t: "Чистые формулы", g2_d: "Средства без тестирования на животных с мягкими натуральными ингредиентами.",
      g3_t: "Глубокое увлажнение", g3_d: "Целевое увлажнение для сияющего и здорового барьера кожи.",
      rm_home_text: "Каждое средство в нашем каталоге проходит проверку подлинности перед поступлением в магазин. Мы работаем только с официальными дистрибьюторами и регулярно обновляем ассортимент трендовыми новинками из Кореи, США и Европы.",
      fb_title: "Бренд месяца: SKIN1004",
      fb_desc: "Откройте линию ухода с мадагаскарской центеллой азиатской для глубокого успокоения и увлажнения.",
      fb_btn1: "Смотреть линейку", fb_btn2: "Спросить консультанта",
      r_title: "Оцените наш магазин", r_desc: "Нажмите на звёзды, чтобы поставить оценку:",
      car_title: "Витрина всех товаров",
      p_title: "✨ Скидка -15% на первый заказ!",
      p_desc: "Вступайте в клуб Yello Beauty: советы по уходу и промокоды придут на вашу почту.",
      p_ph: "Введите ваш email...", p_btn: "Подписаться",

      c_cats: "Категории", c_all: "Вся косметика (42)", c_skin: "Уход и сыворотки (14)",
      c_face: "Макияж лица и глаз (14)", c_lip: "Уход за губами и тинты (14)",
      cart_title: "Ваша корзина", cart_total: "Итого:", cart_checkout: "Оформить заказ",
      cat_hero: "Каталог косметики",
      h_skin: "Уход и сыворотки", h_face: "Макияж лица и глаз", h_lip: "Уход за губами и тинты",
      add_cart: "В корзину",
      pd1: "Глубокое увлажнение и успокаивающий уход с чистой центеллой азиатской.",
      pd2: "Гидрофильное масло для глубокого очищения пор с натуральным экстрактом.",
      pd3: "Органический солнцезащитный крем SPF 50+ с рисовыми отрубями.",
      pd4: "Очищающий тонер для гладкой текстуры кожи.",
      pd5: "Успокаивающий крем для проблемной и чувствительной кожи.",
      pd6: "Насыщенные матовые и мерцающие оттенки.",
      pd7: "Эффект идеальной кожи и стойкое покрытие.",
      pd8: "Стойкий жидкий пигмент, который легко растушевывается.",
      pd9: "Полный объём и длина с любого ракурса.",
      pd10: "Стойкий кушон с сияющим финишем.",
      pd11: "Роскошный блеск и увлажнение для естественного сияния каждый день.",
      pd12: "Интенсивное ночное питание для мягких и пухлых губ.",
      pd13: "Глянцевый тинт для губ с яркой стойкой пигментацией.",
      pd14: "Бархатный тинт для губ с высокой пигментацией.",
      pd15: "Блеск для губ с эффектом взрывного сияния и питательным маслом ши.",
      pd16: "Лёгкая эссенция с 96% муцина улитки для восстановления и увлажнения.",
      pd17: "Успокаивающий тонер с 77% экстракта хауттюйнии для чувствительной кожи.",
      pd18: "Мягкий увлажняющий тонер с морской водой Токто и нежным отшелушиванием.",
      pd19: "Сыворотка с гиалуроновой кислотой разной молекулярной массы для глубокого увлажнения.",
      pd20: "Очищающие пэды, сужающие поры и выравнивающие текстуру кожи.",
      pd21: "Насыщенный крем, который удерживает влагу в коже весь день.",
      pd22: "Нежный тонер с гиалуроновой кислотой для упругой и увлажнённой кожи.",
      pd23: "Питательная сыворотка с семенами зелёного чая для сияния и баланса кожи.",
      pd24: "Сыворотка с ниацинамидом и цинком для жирной кожи и расширенных пор.",
      pd25: "Стойкая тональная основа с матовым финишем и плотным покрытием.",
      pd26: "Кремовый консилер, скрывающий круги под глазами и несовершенства.",
      pd27: "Матовая тональная основа для естественного покрытия каждый день.",
      pd28: "Рассыпчатая пудра для стойкого макияжа без блеска.",
      pd29: "Тушь для объёма и подкручивания ресниц с эффектом накладных.",
      pd30: "Палетка теней тёплых оттенков для дневного и вечернего макияжа.",
      pd31: "Матовая бронзирующая пудра для лёгкого эффекта загара.",
      pd32: "Тонкий карандаш для бровей со щёточкой для естественного эффекта.",
      pd33: "Яркая палетка теней с лёгкой текстурой для повседневного макияжа.",
      pd34: "Культовая красная помада с матовым финишем и насыщенным цветом.",
      pd35: "Нежно-розовая помада с кремовой текстурой и сатиновым финишем.",
      pd36: "Матовый крем для губ с лёгкой бархатистой текстурой.",
      pd37: "Блеск для губ с эффектом объёма и гладким глянцевым покрытием.",
      pd38: "Питательный бальзам для губ с мягким сиянием.",
      pd39: "Полупрозрачная помада медового оттенка, подстраивающаяся под цвет губ.",
      pd40: "Водно-гелевый тинт для губ с лёгким цветом и свежим финишем.",
      pd41: "Бархатный тинт для губ с насыщенным и стойким цветом.",
      pd42: "Классический бальзам для губ с пчелиным воском для ежедневного ухода.",

      a_nav_story: "Наша история", a_nav_creators: "Создатели", a_nav_ship: "Варианты доставки", a_nav_faq: "Частые вопросы",
      a_lang: "Выберите язык",
      a_hero: "О нашем бренде", a_hero_lead: "Сияй как солнце, свети как луна",
      a_story_title: "История Yello Beauty",
      a_story: "Название <strong>Yello Beauty</strong> объединяет тепло солнечного света (<em>Yellow</em>) и эстетику двух его создательниц — Сары и Айсулу. Имя Айсулу переводится как «лунная красавица», и наш бренд родился на пересечении двух гармоний: дневного сияния солнца и ночного очарования луны. Мы создаём уход, который помогает вашей коже сиять в любое время суток!",
      rm_about_text: "Наша команда верит, что уход за кожей должен быть простым, честным и приятным. Каждый товар в каталоге лично выбирают Сара и Айсулу, поэтому вы можете доверять тому, что наносите на кожу.",
      a_creators: "Наши создатели",
      a_sara_role: "Сооснователь и разработчик",
      a_sara_d: "Сара разработала структуру бренда, системы обратной связи и сеть доставки, чтобы заказ косметики был удобным.",
      a_ais_role: "Сооснователь и дизайнер",
      a_ais_d: "Айсулу создала жёлто-жемчужную эстетику, структуру макета и каталог для каждого посетителя.",
      a_ship_title: "Варианты доставки",
      th1: "Способ доставки", th2: "Ориентировочный срок", th3: "Зона покрытия", th4: "Цена (₸)",
      r1c1: "Стандартный курьер", r1c2: "2-3 рабочих дня", r1c3: "Астана и Алматы",
      r2c1: "Экспресс-доставка", r2c2: "В день заказа", r2c3: "Город Астана",
      r3c1: "Региональная Казпочта", r3c2: "4-7 рабочих дней", r3c3: "Все регионы Казахстана",
      faq_title: "Часто задаваемые вопросы",
      q1: "Вся продукция на 100% оригинальна?",
      a1: "Да! Мы закупаем косметику напрямую у официальных дистрибьюторов брендов в Южной Корее, США и Европе с полным соблюдением норм безопасности.",
      q2: "Как отследить мою посылку?",
      a2: "После отправки заказа вы получите трек-номер по SMS или email, чтобы следить за посылкой в реальном времени.",
      q3: "Для какого типа кожи подходит косметика?",
      a3: "В магазине есть отдельные линии для сухой, чувствительной, жирной, комбинированной и нормальной кожи. Используйте фильтры каталога или напишите нам через форму!",

      ct_loc_nav: "Адрес магазина", ct_msg_nav: "Отправить сообщение",
      ct_hero: "Свяжитесь с нами",
      ct_lead: "Мы готовы ответить на ваши вопросы и помочь выбрать лучший уход",
      ct_loc_title: "Адрес и данные магазина",
      ct_addr: "Адрес:", ct_phone: "Телефон:", ct_email: "Email:", ct_hours: "Часы работы:",
      ct_hours_val: "Пн - Вс: 09:00 - 21:00",
      ct_form_title: "Отправьте нам сообщение",
      ct_name: "Ваше полное имя:", ct_name_ph: "Введите ваше полное имя",
      ct_mail: "Адрес электронной почты:",
      ct_skin: "Выберите ваш тип кожи:",
      ct_opt1: "Сухая / чувствительная кожа", ct_opt2: "Жирная / комбинированная кожа", ct_opt3: "Нормальная кожа",
      ct_color: "Предпочтительный цвет упаковки:",
      ct_msg_label: "Сообщение / запрос товара:", ct_msg_ph: "Напишите ваше сообщение здесь...",
      ct_submit: "Отправить сообщение",
      ct_instant: "Нужна срочная помощь? Свяжитесь с нами напрямую:",
      ct_call: "Позвонить",

      srch_ph: "🔍 Поиск товаров...", srch_none: "Нет в наличии",
      faq_ph: "🔍 Поиск по вопросам...",
      promo_title: "Промокод:", promo_hint: "Скидка -15% на заказ",
      st_title: "Yello Beauty в цифрах", st1: "Довольных клиентов", st2: "Товаров в каталоге",
      st3: "Доставленных заказов", st4: "Оригинальной продукции"
    },

    kz: {
      nav_home: "Басты бет", nav_catalog: "Каталог", nav_about: "Біз туралы", nav_contact: "Байланыс",
      sb_quick: "Жылдам навигация",
      foot_rights: "© 2026 Yello Beauty Cosmetics. Барлық құқықтар қорғалған.",
      foot_team: "Команда мүшелері: Aisulu Amanzhol, Sara Nauash (SE-2506 тобы)",

      t_promo: "✨ YELLO15 промокоды бойынша -15% жеңілдік алыңыз!",
      t_orig: "💄 100% түпнұсқа косметика!",
      t_ship: "🚚 15 000 ₸-ден асатын тапсырыстарға Қазақстан бойынша тегін жеткізу!",
      t_glow: "✨ Күндей жарқыра, айдай нұр шаш!",
      t_ship2: "🚚 15 000 ₸-ден асатын тапсырыстарға тегін жеткізу!",
      t_welcome: "💛 Yello Beauty дүкеніне қош келдіңіз!",
      t_touch: "Жеке сұлулық кеңестері үшін бізбен байланысыңыз! 💛",

      s_why: "Неге біз", s_highlights: "Дүкен ерекшеліктері", s_featured: "Айдың бренді", s_showcase: "Барлық тауарлар",
      btn_bg: "🎨 Фон түсін өзгерту", btn_popup: "🎁 Арнайы ұсыныс",
      h_title: "Сұлулығыңызға арналған күн шуағы",
      h_lead: "Әлемнің үздік брендтерінің 100% түпнұсқа косметикасы",
      i_why: "Неге Yello Beauty таңдайды",
      f1_t: "100% түпнұсқа", f1_d: "Барлық тауарға сапа кепілдігі",
      f2_t: "Трендтегі таңдау", f2_d: "Тек үздік брендтер мен бестселлерлер",
      f3_t: "Жылдам жеткізу", f3_d: "Бүкіл ел бойынша тапсырыс күні жөнелту",
      g_title: "Біздің негізгі кепілдіктеріміз",
      g_desc: "Теріңіз жұмсақ, тиімді және қауіпсіз күтім алуы үшін әр тауарды мұқият таңдаймыз.",
      g1_t: "Дерматологтар тексерген", g1_d: "Сезімтал теріге арналып жасалған және тексерілген.",
      g2_t: "Таза формулалар", g2_d: "Жануарларда сыналмаған, жұмсақ табиғи ингредиенттері бар өнімдер.",
      g3_t: "Терең ылғалдандыру", g3_d: "Тері тосқауылының сәулелі әрі сау болуына арналған мақсатты ылғалдандыру.",
      rm_home_text: "Каталогтағы әр өнім дүкенге түспес бұрын түпнұсқалығына тексеріледі. Біз тек ресми дистрибьюторлармен жұмыс істейміз және ассортиментті Корея, АҚШ және Еуропадағы трендтегі жаңалықтармен үнемі жаңартамыз.",
      fb_title: "Айдың бренді: SKIN1004",
      fb_desc: "Терең тыныштандыру мен ылғалдандыруға арналған мадагаскарлық центелла азиатика күтім сериясын ашыңыз.",
      fb_btn1: "Сериясын көру", fb_btn2: "Кеңесшіден сұрау",
      r_title: "Дүкенімізді бағалаңыз", r_desc: "Баға қою үшін жұлдыздарды басыңыз:",
      car_title: "Барлық тауарлар витринасы",
      p_title: "✨ Алғашқы тапсырысқа -15% жеңілдік!",
      p_desc: "Yello Beauty клубына қосылыңыз: күтім кеңестері мен промокодтар поштаңызға келеді.",
      p_ph: "Email-ыңызды енгізіңіз...", p_btn: "Жазылу",

      c_cats: "Санаттар", c_all: "Барлық косметика (42)", c_skin: "Күтім және сарысулар (14)",
      c_face: "Бет пен көз макияжы (14)", c_lip: "Ерін күтімі және тинттер (14)",
      cart_title: "Себетіңіз", cart_total: "Барлығы:", cart_checkout: "Тапсырыс беру",
      cat_hero: "Косметика каталогы",
      h_skin: "Күтім және сарысулар", h_face: "Бет пен көз макияжы", h_lip: "Ерін күтімі және тинттер",
      add_cart: "Себетке",
      pd1: "Таза центелла азиатикамен терең ылғалдандыру және тыныштандыратын күтім.",
      pd2: "Табиғи сығындысы бар тесіктерді терең тазартатын тазартқыш майы.",
      pd3: "Күріш кебегі суы бар органикалық SPF 50+ күннен қорғайтын крем.",
      pd4: "Тері бедерін тегістейтін тазартқыш тоник.",
      pd5: "Проблемалы және сезімтал теріге арналған тыныштандыратын крем.",
      pd6: "Пигменті жоғары мат және жылтыр реңктер.",
      pd7: "Мінсіз тері әсері және ұзақ сақталатын жабын.",
      pd8: "Оңай жағылатын ұзаққа төзімді сұйық пигмент.",
      pd9: "Кез келген бұрыштан толық көлем және ұзындық.",
      pd10: "Жарқыраған әсер беретін ұзаққа төзімді кушон.",
      pd11: "Күнделікті табиғи жарқырау үшін сәнді нұр және ылғалдандыру.",
      pd12: "Жұмсақ әрі толық еріндерге арналған түнгі қарқынды қоректендіру.",
      pd13: "Жарқын әрі тұрақты түсі бар жылтыр ерін тинті.",
      pd14: "Пигменті жоғары барқыт ерін тинті.",
      pd15: "Ши майы бар, күшті жарқырау беретін ерін жылтыры.",
      pd16: "Жараларды қалпына келтіру және ылғалдандыру үшін 96% ұлу муцині бар жеңіл эссенция.",
      pd17: "Сезімтал теріге арналған 77% хауттюйния сығындысы бар тыныштандыратын тоник.",
      pd18: "Токто теңіз суы бар, жұмсақ пилингі бар жұмсақ ылғалдандыратын тоник.",
      pd19: "Терең ылғалдандыруға арналған әртүрлі молекулалық салмақты гиалурон қышқылы бар сарысу.",
      pd20: "Тесіктерді тарылтып, тері бедерін тегістейтін тазартқыш педтер.",
      pd21: "Ылғалды күні бойы теріде сақтайтын қою ылғалдандыратын крем.",
      pd22: "Серпінді әрі ылғалды теріге арналған гиалурон қышқылы бар нәзік тоник.",
      pd23: "Теріні жарқыратып, теңестіретін жасыл шай тұқымы бар қоректік сарысу.",
      pd24: "Майлы теріге және кеңейген тесіктерге арналған ниацинамид пен мырыш сарысуы.",
      pd25: "Мат әсері бар, жабу қабілеті жоғары тұрақты тональды негіз.",
      pd26: "Көз астындағы көгерулер мен кемшіліктерді жасыратын кремді консилер.",
      pd27: "Күнделікті табиғи жабу үшін матты тональды негіз.",
      pd28: "Жылтырсыз ұзақ макияжға арналған борпылдақ пудра.",
      pd29: "Кірпіктерге көлем беріп, бүгетін, жалған кірпік әсері бар тушь.",
      pd30: "Күндізгі және кешкі макияжға арналған жылы реңкті көлеңке палеткасы.",
      pd31: "Жеңіл қараған тері әсері үшін матты бронзер пудра.",
      pd32: "Қасқа табиғи әсер беретін щеткасы бар жіңішке қас қарындашы.",
      pd33: "Күнделікті макияжға арналған жеңіл құрылымды жарқын көлеңке палеткасы.",
      pd34: "Мат әсері бар, түсі қанық культтік қызыл далап.",
      pd35: "Кремді құрылымы мен сатин әсері бар нәзік қызғылт далап.",
      pd36: "Жеңіл барқыт құрылымды матты ерін кремі.",
      pd37: "Ерінге көлем беретін, тегіс жылтыр жабатын ерін жылтыры.",
      pd38: "Жұмсақ жарқырауы бар қоректік ерін бальзамы.",
      pd39: "Ерін түсіне бейімделетін бал реңкті жартылай мөлдір далап.",
      pd40: "Жеңіл түсті әрі балғын әсерлі су-гельді ерін тинті.",
      pd41: "Қанық әрі тұрақты түсті барқыт ерін тинті.",
      pd42: "Күнделікті күтімге арналған ара балауызы бар классикалық ерін бальзамы.",

      a_nav_story: "Біздің тарихымыз", a_nav_creators: "Авторлар", a_nav_ship: "Жеткізу түрлері", a_nav_faq: "Жиі қойылатын сұрақтар",
      a_lang: "Тілді таңдаңыз",
      a_hero: "Біздің бренд туралы", a_hero_lead: "Күндей жарқыра, айдай нұр шаш",
      a_story_title: "Yello Beauty тарихы",
      a_story: "<strong>Yello Beauty</strong> атауы күн сәулесінің жылуын (<em>Yellow</em>) және екі авторының — Сара мен Айсұлудың эстетикасын біріктіреді. Айсұлу есімі «айдай сұлу» дегенді білдіреді, ал біздің брендіміз екі үйлесімнің тоғысында туды: күннің күндізгі жарқырауы мен айдың түнгі сиқыры. Біз теріңіз тәуліктің кез келген уақытында жарқырауына көмектесетін күтім жасаймыз!",
      rm_about_text: "Біздің команда терінің күтімі қарапайым, адал әрі ұнамды болуы керек деп санайды. Каталогтағы әр өнімді Сара мен Айсұлу жеке өзі таңдайды, сондықтан теріңізге жағатын затқа сене аласыз.",
      a_creators: "Біздің авторлар",
      a_sara_role: "Тең құрылтайшы және әзірлеуші",
      a_sara_d: "Сара брендтің құрылымын, кері байланыс жүйелерін және жеткізу желісін әзірледі, сонда косметикаға тапсырыс беру ыңғайлы болды.",
      a_ais_role: "Тең құрылтайшы және дизайнер",
      a_ais_d: "Айсұлу сары-інжу эстетикасын, макет құрылымын және әр келушіге арналған каталогты жасады.",
      a_ship_title: "Жеткізу түрлері",
      th1: "Жеткізу әдісі", th2: "Шамамен уақыты", th3: "Қамту аймағы", th4: "Бағасы (₸)",
      r1c1: "Стандартты курьер", r1c2: "2-3 жұмыс күні", r1c3: "Астана және Алматы",
      r2c1: "Жедел жеткізу", r2c2: "Сол күні жеткізу", r2c3: "Астана қаласы",
      r3c1: "Өңірлік Қазпошта", r3c2: "4-7 жұмыс күні", r3c3: "Қазақстанның барлық өңірлері",
      faq_title: "Жиі қойылатын сұрақтар",
      q1: "Барлық өнім 100% түпнұсқа ма?",
      a1: "Иә! Біз косметиканы Оңтүстік Корея, АҚШ және Еуропадағы бренд-дистрибьюторлардан тікелей, қауіпсіздік талаптарын толық сақтай отырып аламыз.",
      q2: "Жөнелтімімді қалай қадағалай аламын?",
      a2: "Тапсырыс жөнелтілген соң, жөнелтімді нақты уақытта бақылау үшін SMS немесе email арқылы трек-нөмір аласыз.",
      q3: "Бұл косметика терінің қай түріне жарайды?",
      a3: "Дүкенде құрғақ, сезімтал, майлы, аралас және қалыпты теріге арналған жеке сериялар бар. Каталог сүзгілерін қолданыңыз немесе байланыс формасы арқылы жазыңыз!",

      ct_loc_nav: "Дүкен мекенжайы", ct_msg_nav: "Хабарлама жіберу",
      ct_hero: "Бізбен байланысыңыз",
      ct_lead: "Сұрақтарыңызға жауап беруге және ең жақсы күтімді таңдауға көмектесуге дайынбыз",
      ct_loc_title: "Дүкен мекенжайы мен деректері",
      ct_addr: "Мекенжайы:", ct_phone: "Телефон:", ct_email: "Email:", ct_hours: "Жұмыс уақыты:",
      ct_hours_val: "Дс - Жс: 09:00 - 21:00",
      ct_form_title: "Бізге хабарлама жіберіңіз",
      ct_name: "Толық аты-жөніңіз:", ct_name_ph: "Толық аты-жөніңізді енгізіңіз",
      ct_mail: "Электрондық пошта мекенжайы:",
      ct_skin: "Тері түріңізді таңдаңыз:",
      ct_opt1: "Құрғақ / сезімтал тері", ct_opt2: "Майлы / аралас тері", ct_opt3: "Қалыпты тері",
      ct_color: "Қаптаманың қалаулы түсі:",
      ct_msg_label: "Хабарлама / тауарға сұраныс:", ct_msg_ph: "Хабарламаңызды осында жазыңыз...",
      ct_submit: "Хабарлама жіберу",
      ct_instant: "Шұғыл көмек керек пе? Бізбен тікелей байланысыңыз:",
      ct_call: "Қоңырау шалу",

      srch_ph: "🔍 Тауарларды іздеу...", srch_none: "Қолда жоқ",
      faq_ph: "🔍 Сұрақтардан іздеу...",
      promo_title: "Промокод:", promo_hint: "Тапсырысқа -15% жеңілдік",
      st_title: "Yello Beauty сандармен", st1: "Риза клиенттер", st2: "Каталогтағы тауарлар",
      st3: "Жеткізілген тапсырыстар", st4: "Түпнұсқа өнім"
    }
  };

  // Texts for the "Read More" buttons: [closed text, opened text]
  var readMoreTexts = {
    en: ["Read More", "Read Less"],
    ru: ["Читать далее", "Свернуть"],
    kz: ["Толығырақ", "Жасыру"]
  };

  var currentLang = localStorage.getItem("yello_lang") || "en";
  var siteLangButtons = document.querySelectorAll(".site-lang-btn");
  var readMoreButtons = document.querySelectorAll(".read-more-btn");

  function updateReadMoreButtons() {
    readMoreButtons.forEach(function(btn) {
      var target = document.getElementById(btn.getAttribute("data-target"));
      if (target && target.style.display === "block") {
        btn.innerText = readMoreTexts[currentLang][1];
      } else {
        btn.innerText = readMoreTexts[currentLang][0];
      }
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("yello_lang", lang);

    // Translate all texts
    var textElements = document.querySelectorAll("[data-i18n]");
    textElements.forEach(function(el) {
      if (!el.getAttribute("data-en")) {
        el.setAttribute("data-en", el.innerHTML);
      }
      var key = el.getAttribute("data-i18n");
      if (lang !== "en" && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      } else {
        el.innerHTML = el.getAttribute("data-en");
      }
    });

    // Translate placeholders
    var phElements = document.querySelectorAll("[data-i18n-ph]");
    phElements.forEach(function(el) {
      if (!el.getAttribute("data-en-ph")) {
        el.setAttribute("data-en-ph", el.placeholder);
      }
      var key = el.getAttribute("data-i18n-ph");
      if (lang !== "en" && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      } else {
        el.placeholder = el.getAttribute("data-en-ph");
      }
    });

    siteLangButtons.forEach(function(btn) {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active-tool");
      } else {
        btn.classList.remove("active-tool");
      }
    });

    updateReadMoreButtons();
    if (greetingElem) greetingElem.innerText = storeInfo.getGreeting();
    updateCartUI();
  }

  siteLangButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      setLanguage(this.getAttribute("data-lang"));
    });
  });

  // ==========================================
  // NEW: READ MORE BUTTON (style.display)
  // ==========================================
  readMoreButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var target = document.getElementById(this.getAttribute("data-target"));
      if (target.style.display === "none") {
        target.style.display = "block";
      } else {
        target.style.display = "none";
      }
      updateReadMoreButtons();
    });
  });

  setLanguage(currentLang);

});


// ==========================================================
// ASSIGNMENT 6: jQuery
// ==========================================================
$(document).ready(function() {

  // ----------------------------------------------------------
  // Task 0. Setup
  // ----------------------------------------------------------
  console.log("jQuery is ready!");


  var messages = {
    en: {
      added: "added to cart",
      wait: "Please wait...",
      sent: "Your message was sent successfully!",
      copied: "Copied to clipboard!",
      unavailable: "Not available"
    },
    ru: {
      added: "добавлен в корзину",
      wait: "Пожалуйста, подождите...",
      sent: "Сообщение успешно отправлено!",
      copied: "Скопировано в буфер обмена!",
      unavailable: "Нет в наличии"
    },
    kz: {
      added: "себетке қосылды",
      wait: "Күте тұрыңыз...",
      sent: "Хабарлама сәтті жіберілді!",
      copied: "Буферге көшірілді!",
      unavailable: "Қолда жоқ"
    }
  };

  function t(key) {
    var lang = localStorage.getItem("yello_lang") || "en";
    return messages[lang][key];
  }

  function makePlaceholder(name) {
    name = (name || "").substring(0, 30).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120">' +
      '<rect width="200" height="120" fill="#FFF3C4"/>' +
      '<text x="100" y="55" font-size="34" text-anchor="middle">💄</text>' +
      '<text x="100" y="90" font-size="11" font-family="Arial" font-weight="bold" fill="#212529" text-anchor="middle">' + name + '</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Any broken photo (hotlinked thumbnails can expire) -> friendly placeholder
  document.addEventListener("error", function(e) {
    var img = e.target;
    if (!img || img.tagName !== "IMG" || img.getAttribute("data-fallback")) return;
    if ($(img).closest(".api-img, .suggestions-list").length) return;
    img.setAttribute("data-fallback", "1");
    img.src = makePlaceholder(img.alt);
    $(img).addClass("loaded");
  }, true);

  // ----------------------------------------------------------
  // PRODUCT PHOTOS

  var productPhotos = {
    "COSRX Snail 96 Mucin Essence": "",
    "Anua Heartleaf 77% Toner": "",
    "Round Lab 1025 Dokdo Toner": "",
    "Torriden DIVE-IN Serum": "",
    "Medicube Zero Pore Pad": "",
    "Laneige Water Bank Cream": "",
    "Isntree Hyaluronic Acid Toner": "",
    "Innisfree Green Tea Seed Serum": "",
    "The Ordinary Niacinamide 10%": "",
    "Fenty Beauty Pro Filt'r Foundation": "",
    "NARS Radiant Creamy Concealer": "",
    "Maybelline Fit Me Matte Foundation": "",
    "Huda Beauty Easy Bake Powder": "",
    "Too Faced Better Than Sex Mascara": "",
    "Urban Decay Naked Heat Palette": "",
    "Benefit Hoola Bronzer": "",
    "Anastasia Brow Wiz": "",
    "Etude Play Color Eyes": "",
    "MAC Ruby Woo Lipstick": "",
    "Charlotte Tilbury Pillow Talk": "",
    "Rare Beauty Lip Souffle": "",
    "Maybelline Lifter Gloss": "",
    "Summer Fridays Lip Butter Balm": "",
    "Clinique Black Honey Lipstick": "",
    "Etude Dear Darling Water Tint": "",
    "3CE Velvet Lip Tint": "",
    "Burt's Bees Beeswax Lip Balm": "",
  };

  function simple(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function cleanLink(link) {
    link = link.trim();
    if (link.indexOf("imgurl=") > -1) {
      link = decodeURIComponent(link.split("imgurl=")[1].split("&")[0]);
    }
    return link.replace("http://", "https://");
  }

  var photoLinks = {};
  for (var photoName in productPhotos) {
    photoLinks[simple(photoName)] = productPhotos[photoName];
  }

  $(".product-card").each(function() {
    var key = simple($(this).find(".card-title").text());
    if (photoLinks[key]) {
      $(this).find("img").attr("data-src", cleanLink(photoLinks[key]));
    }
  });


  // ==========================================================
  // PART 1. jQuery SEARCH
  // ==========================================================

  // Task 1 (live search + filters) now lives in catalog.js


  // ----------------------------------------------------------
  // Task 2. Autocomplete search suggestions (catalog page)
  // ----------------------------------------------------------

  var products = [];
  $(".product-card").each(function() {
    products.push({
      name: $(this).find(".card-title").text(),
      picture: $(this).find("img")
    });
  });

  $("#product-search").on("keyup input", function() {
    var text = $(this).val().toLowerCase().trim();
    var list = $("#suggestions");
    list.empty();

    if (text === "") {
      list.hide();
      return;
    }

    var count = 0;
    for (var i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase().indexOf(text) > -1 && count < 5) {
        var link = products[i].picture.attr("data-src") || products[i].picture.attr("src");
        var item = $("<li></li>").attr("data-name", products[i].name);
        item.append($('<img referrerpolicy="no-referrer">').attr("src", link).attr("alt", products[i].name));
        item.append($("<span></span>").text(products[i].name));
        list.append(item);
        count++;
      }
    }

    list.find("img").one("error", function() {
      $(this).attr("src", makePlaceholder($(this).attr("alt")));
    });

    if (count === 0) {
      list.append($('<li class="not-found"></li>').text("😔 " + t("unavailable")));
    }

    list.show();
  });

  $("#suggestions").on("click", "li", function() {

    if ($(this).hasClass("not-found")) {
      return;
    }
    $("#product-search").val($(this).attr("data-name")).trigger("input");
    $("#suggestions").hide();
  });

  $(document).on("click", function(event) {
    if ($(event.target).closest(".search-wrap").length === 0) {
      $("#suggestions").hide();
    }
  });


  // ----------------------------------------------------------
  // Task 3. Search highlighting (FAQ on the About page)
  // ----------------------------------------------------------
  $("#faq-search").on("keyup", function() {
    var word = $(this).val().trim();

    var texts = $(".accordion-header-custom span:first-child, .accordion-body-custom p");

    texts.each(function() {
      var oldHtml = $(this).html();
      $(this).html(oldHtml.replace(/<mark class="highlight">(.*?)<\/mark>/g, "$1"));
    });

    if (word === "") {
      return;
    }

    var safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    var regex = new RegExp("(" + safeWord + ")(?![^<]*>)", "gi");

    texts.each(function() {
      var html = $(this).html();
      $(this).html(html.replace(regex, '<mark class="highlight">$1</mark>'));
    });

    $(".accordion-item-custom").each(function() {
      var item = $(this);
      if (item.find("mark").length > 0 && !item.hasClass("active")) {
        item.find(".accordion-header-custom")[0].click();
      }
    });
  });


  // ==========================================================
  // PART 2. UX ENGAGEMENT ELEMENTS
  // ==========================================================

  // ----------------------------------------------------------
  // Task 4. Colorful scroll progress bar (all pages)
  // ----------------------------------------------------------
  $("body").prepend('<div class="scroll-progress"><div class="scroll-progress-bar"></div></div>');

  $(window).on("scroll", function() {
    var scrollTop = $(window).scrollTop();
    var maxScroll = $(document).height() - $(window).height();
    var percent = 0;

    if (maxScroll > 0) {
      percent = (scrollTop / maxScroll) * 100;
    }

    $(".scroll-progress-bar").css("width", percent + "%");
  });


  // ----------------------------------------------------------
  // Task 5. Animated number counter (home page)
  // ----------------------------------------------------------
  var countersStarted = false;

  function startCounters() {
    if (countersStarted || $("#stats").length === 0) {
      return;
    }

    var sectionTop = $("#stats").offset().top;
    var windowBottom = $(window).scrollTop() + $(window).height();

    if (windowBottom > sectionTop + 50) {
      countersStarted = true;

      $(".counter").each(function() {
        var element = $(this);
        var target = parseInt(element.attr("data-target"));
        var suffix = element.attr("data-suffix") || "";

        $({ count: 0 }).animate({ count: target }, {
          duration: 2000,
          step: function(now) {
            element.text(Math.floor(now).toLocaleString() + suffix);
          },
          complete: function() {
            element.text(target.toLocaleString() + suffix);
          }
        });
      });
    }
  }

  $(window).on("scroll", startCounters);
  startCounters();


  // ----------------------------------------------------------
  // Task 6. Loading spinner on submit (contact form)
  // The old code validates the form and then triggers "formOk"
  // ----------------------------------------------------------
  $("#contact-form").on("formOk", function() {
    var form = $(this);
    var button = form.find("button[type=submit]");
    var oldContent = button.html();

    button.html('<span class="spinner"></span>' + t("wait"));
    button.prop("disabled", true);

    setTimeout(function() {
      button.html(oldContent);
      button.prop("disabled", false);
      form[0].reset();
      showToast("✅ " + t("sent"));
    }, 2000);
  });


  // ==========================================================
  // PART 3. IMPROVE WEB APP FUNCTIONALITY
  // ==========================================================

  // ----------------------------------------------------------
  // Task 7. Notification system (toast that fades out)
  // ----------------------------------------------------------
  function showToast(message) {

    if ($("#toast-container").length === 0) {
      $("body").append('<div id="toast-container" class="toast-container"></div>');
    }

    var toast = $('<div class="toast-msg"></div>').text(message);
    $("#toast-container").append(toast);

    toast.fadeIn(300).delay(2500).fadeOut(500, function() {
      $(this).remove();
    });
  }

  $(".add-to-cart-btn").on("click", function() {
    var title = $(this).closest(".product-card").find(".card-title").text();
    showToast("🛒 " + title + " — " + t("added"));
  });


  // ----------------------------------------------------------
  // Task 8. "Copy to clipboard" button
  // ----------------------------------------------------------

  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var temp = $("<textarea></textarea>").val(text).appendTo("body");
      temp.select();
      document.execCommand("copy");
      temp.remove();
      done();
    }
  }

  $(".copy-btn").on("click", function() {
    var button = $(this);
    var text = button.closest("p, .promo-strip").find(".copy-text").text();

    copyText(text, function() {

      button.find(".copy-icon").text("✔");

      var tooltip = $('<span class="copy-tooltip"></span>').text(t("copied"));
      button.append(tooltip);
      tooltip.fadeIn(200);

      showToast("📋 " + t("copied"));

      setTimeout(function() {
        button.find(".copy-icon").text("📋");
        tooltip.fadeOut(200, function() {
          tooltip.remove();
        });
      }, 1500);
    });
  });

  $(".copy-text").on("copy", function() {
    showToast("📋 " + t("copied"));
  });


  // ----------------------------------------------------------
  // Task 9. Image lazy loading (catalog page)
  // Images have the real link in data-src. We move it to src
  // only when the image comes into view.
  // ----------------------------------------------------------
  function loadVisibleImages() {
    var windowBottom = $(window).scrollTop() + $(window).height();

    $("img[data-src]").each(function() {
      var img = $(this);

      if (!img.is(":visible")) {
        return;
      }

      if (img.offset().top < windowBottom + 100) {
        var link = img.attr("data-src");
        img.removeAttr("data-src");

        // the link was pasted into src by hand -> nothing to load
        if ((img.attr("src") || "").indexOf("data:") !== 0) {
          img.addClass("loaded");
          img.one("error", function() { img.attr("src", makePlaceholder(img.attr("alt"))); });
          return;
        }

        img.attr("referrerpolicy", "no-referrer");

        img.on("load", function() {
          img.addClass("loaded");
        });

        img.one("error", function() {
          console.warn("Photo did not load, check this link:", link);
          img.attr("src", makePlaceholder(img.attr("alt")));
        });

        img.attr("src", link);
      }
    });
  }

  $(window).on("scroll resize", loadVisibleImages);
  loadVisibleImages();

});


/* ===== auth.js ===== */
/* Yello Beauty — auth.js
   Sign Up / Log In / Profile (localStorage), form validation, saved rating,
   mobile menu, toast helper and EN/RU/KZ texts for the new features.
   Loaded after js/script.js on every page. */
(function () {
  "use strict";

  // ---------- storage helpers ----------
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  // ---------- texts: key -> [EN, RU, KZ] ----------
  var D = {
    n_login: ["Log In", "Войти", "Кіру"],
    n_menu: ["Menu", "Меню", "Мәзір"],
    f_name: ["Full Name", "Полное имя", "Толық аты-жөні"],
    f_email: ["Email Address", "Электронная почта", "Электрондық пошта"],
    f_phone: ["Phone Number:", "Номер телефона:", "Телефон нөмірі:"],
    f_phone2: ["Phone Number", "Номер телефона", "Телефон нөмірі"],
    f_pass: ["Password", "Пароль", "Құпиясөз"],
    f_pass2: ["Confirm Password", "Подтвердите пароль", "Құпиясөзді растаңыз"],
    l_title: ["Log In", "Вход", "Кіру"],
    l_lead: ["Welcome back to Yello Beauty", "С возвращением в Yello Beauty", "Yello Beauty-ге қайта қош келдіңіз"],
    l_btn: ["Log In", "Войти", "Кіру"],
    l_no: ["Don't have an account?", "Нет аккаунта?", "Аккаунтыңыз жоқ па?"],
    l_link: ["Sign Up", "Регистрация", "Тіркелу"],
    s_title: ["Create Account", "Создать аккаунт", "Аккаунт жасау"],
    s_lead: ["Join Yello Beauty and save your favourites", "Присоединяйтесь к Yello Beauty и сохраняйте любимое", "Yello Beauty-ге қосылыңыз"],
    s_btn: ["Sign Up", "Зарегистрироваться", "Тіркелу"],
    s_have: ["Already have an account?", "Уже есть аккаунт?", "Аккаунтыңыз бар ма?"],
    s_hint: ["At least 8 characters with an uppercase letter, a lowercase letter and a digit.", "Минимум 8 символов: заглавная, строчная буква и цифра.", "Кемінде 8 таңба: бас әріп, кіші әріп және сан."],
    e_req: ["This field is required.", "Это поле обязательно.", "Бұл өріс міндетті."],
    e_name: ["Name must have at least 2 letters (letters, spaces and - only).", "Имя: минимум 2 буквы (только буквы, пробелы и -).", "Аты: кемінде 2 әріп (тек әріп, бос орын және -)."],
    e_email: ["Enter a valid email, e.g. example@mail.com.", "Введите корректный email, например example@mail.com.", "Дұрыс email енгізіңіз, мысалы example@mail.com."],
    e_phone: ["Invalid phone. Use +7 777 123 45 67.", "Неверный телефон. Формат: +7 777 123 45 67.", "Телефон қате. Пішім: +7 777 123 45 67."],
    e_plen: ["Password must be at least 8 characters.", "Пароль должен быть не короче 8 символов.", "Құпиясөз кемінде 8 таңба болуы керек."],
    e_pcx: ["Password needs an uppercase letter, a lowercase letter and a digit.", "Пароль должен содержать заглавную, строчную букву и цифру.", "Құпиясөзде бас әріп, кіші әріп және сан болуы керек."],
    e_match: ["Passwords do not match.", "Пароли не совпадают.", "Құпиясөздер сәйкес келмейді."],
    e_exists: ["An account with this email already exists.", "Аккаунт с таким email уже существует.", "Бұл email-мен аккаунт бар."],
    e_bad: ["Wrong email or password.", "Неверный email или пароль.", "Email немесе құпиясөз қате."],
    ok_signup: ["Account created! Opening your profile...", "Аккаунт создан! Открываем профиль...", "Аккаунт жасалды! Профиль ашылуда..."],
    ok_login: ["Welcome back,", "С возвращением,", "Қош келдіңіз,"],
    ok_logout: ["You have been logged out.", "Вы вышли из аккаунта.", "Сіз аккаунттан шықтыңыз."],
    p_title: ["My Profile", "Мой профиль", "Менің профилім"],
    p_lead: ["Your account details", "Данные вашего аккаунта", "Аккаунт деректері"],
    p_name: ["Name", "Имя", "Аты-жөні"],
    p_email: ["Email", "Email", "Email"],
    p_phone: ["Phone", "Телефон", "Телефон"],
    p_since: ["Member since", "Дата регистрации", "Тіркелген күні"],
    p_rating: ["Your store rating", "Ваша оценка магазина", "Дүкенге қойған бағаңыз"],
    p_filters: ["Last catalog search", "Последний поиск в каталоге", "Каталогтағы соңғы іздеу"],
    p_cart: ["Items in cart", "Товаров в корзине", "Себеттегі тауарлар"],
    p_logout: ["Log Out", "Выйти", "Шығу"],
    p_shop: ["Go to Catalog", "Перейти в каталог", "Каталогқа өту"],
    p_none: ["not set", "не задано", "көрсетілмеген"],
    r_saved: ["Your rating is saved:", "Ваша оценка сохранена:", "Бағаңыз сақталды:"],
    f_cat: ["Category", "Категория", "Санат"],
    f_allcat: ["All categories", "Все категории", "Барлық санаттар"],
    f_price: ["Price", "Цена", "Бағасы"],
    pr_all: ["Any price", "Любая цена", "Кез келген баға"],
    pr_1: ["Under 7,000 ₸", "До 7 000 ₸", "7 000 ₸-ге дейін"],
    pr_2: ["7,000 – 12,000 ₸", "7 000 – 12 000 ₸", "7 000 – 12 000 ₸"],
    pr_3: ["Over 12,000 ₸", "Свыше 12 000 ₸", "12 000 ₸-ден жоғары"],
    f_sort: ["Sort by", "Сортировка", "Сұрыптау"],
    so_def: ["Default order", "По умолчанию", "Әдепкі"],
    so_asc: ["Price: low to high", "Цена: по возрастанию", "Баға: өсу бойынша"],
    so_desc: ["Price: high to low", "Цена: по убыванию", "Баға: кему бойынша"],
    f_reset: ["Reset filters", "Сбросить фильтры", "Сүзгілерді тазарту"],
    f_saved: ["Your search and filters are saved automatically.", "Поиск и фильтры сохраняются автоматически.", "Іздеу мен сүзгілер автоматты түрде сақталады."],
    api_title: ["More Makeup from Around the World", "Больше косметики со всего мира", "Әлемнің түкпір-түкпірінен косметика"],
    api_desc: ["Live products from the Makeup API (prices in USD).", "Актуальные товары из Makeup API (цены в USD).", "Makeup API-дегі өзекті тауарлар (бағасы USD)."],
    api_type: ["Product type", "Тип товара", "Тауар түрі"],
    ty_lipstick: ["Lipstick", "Помада", "Далап"],
    ty_foundation: ["Foundation", "Тональная основа", "Тональды негіз"],
    ty_mascara: ["Mascara", "Тушь", "Тушь"],
    ty_eyeliner: ["Eyeliner", "Подводка", "Көз сызғышы"],
    ty_blush: ["Blush", "Румяна", "Бетқызыл"],
    ty_eyeshadow: ["Eyeshadow", "Тени", "Көлеңке"],
    api_load: ["Loading products...", "Загрузка товаров...", "Тауарлар жүктелуде..."],
    api_err: ["Could not load products. Check your connection and try again.", "Не удалось загрузить товары. Проверьте соединение и повторите.", "Тауарларды жүктеу мүмкін болмады. Байланысты тексеріп, қайталаңыз."],
    api_retry: ["Try again", "Повторить", "Қайталау"],
    api_view: ["View product", "Открыть товар", "Тауарды ашу"],
    api_empty: ["No products found for this type.", "Товары этого типа не найдены.", "Бұл түрдегі тауар табылмады."],
    api_count: ["products", "товаров", "тауар"],
    m_fill: ["Please fill in all required fields!", "Пожалуйста, заполните все обязательные поля!", "Барлық міндетті өрістерді толтырыңыз!"],
    m_name3: ["Name must be at least 3 characters long!", "Имя должно содержать минимум 3 символа!", "Аты кемінде 3 таңбадан тұруы керек!"],
    m_email: ["Please enter a valid email address (e.g., example@mail.com).", "Введите корректный email (например, example@mail.com).", "Дұрыс email енгізіңіз (мысалы, example@mail.com)."],
    m_sub_empty: ["Please enter your email address!", "Пожалуйста, введите ваш email!", "Email-ыңызды енгізіңіз!"],
    m_thanks: ["Thank you for subscribing!", "Спасибо за подписку!", "Жазылғаныңыз үшін рахмет!"],
    m_cart_empty: ["Your cart is empty!", "Ваша корзина пуста!", "Себетіңіз бос!"],
    m_cart_li: ["Cart is empty", "Корзина пуста", "Себет бос"],
    m_order: ["Thank you for your order! Total amount:", "Спасибо за заказ! Общая сумма:", "Тапсырысыңыз үшін рахмет! Жалпы сомасы:"],
    greet_m: ["Good Morning! ☀️ Discover fresh morning skincare.", "Доброе утро! ☀️ Откройте для себя утренний уход.", "Қайырлы таң! ☀️ Таңғы күтімді ашыңыз."],
    greet_a: ["Good Afternoon! ✨ Glow with our bestsellers.", "Добрый день! ✨ Сияйте с нашими бестселлерами.", "Қайырлы күн! ✨ Бестселлерлерімен жарқырай беріңіз."],
    greet_e: ["Good Evening! 🌙 Pamper your skin with night care.", "Добрый вечер! 🌙 Побалуйте кожу ночным уходом.", "Қайырлы кеш! 🌙 Теріңізді түнгі күтіммен еркелетіңіз."],
    api_popular: ["Popular picks", "Популярные продукты", "Танымал өнімдер"],
    api_live: ["More from Makeup API", "Ещё из Makeup API", "Makeup API-дегі басқа тауарлар"],
    api_pop_note: ["Popular picks: prices are approximate, USD.", "Популярные продукты: цены примерные, в USD.", "Танымал өнімдер: бағалары шамамен, USD."],
    pf_menu: ["Menu", "Меню", "Мәзір"]
  };
  function langIndex() { var l = localStorage.getItem("yello_lang") || "en"; return l === "ru" ? 1 : l === "kz" ? 2 : 0; }
  function tr(key) { return D[key] ? D[key][langIndex()] : key; }
  window.yelloT = tr;

  function applyTexts() {
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = tr(el.getAttribute("data-t")); });
    document.querySelectorAll("[data-t-ph]").forEach(function (el) { el.placeholder = tr(el.getAttribute("data-t-ph")); });
    var tg = document.querySelector(".nav-toggler");
    if (tg) tg.setAttribute("aria-label", tr("n_menu"));
  }

  // ---------- toast (replaces alert) ----------
  window.yelloMsg = function (message) {
    if (!window.jQuery) { window.alert(message); return; }
    var $ = window.jQuery;
    if ($("#toast-container").length === 0) $("body").append('<div id="toast-container" class="toast-container"></div>');
    var toast = $('<div class="toast-msg"></div>').text(message);
    $("#toast-container").append(toast);
    toast.fadeIn(300).delay(3000).fadeOut(500, function () { $(this).remove(); });
  };

  // ---------- users ----------
  function users() { return load("yello_users", []); }
  function currentUser() {
    var email = localStorage.getItem("yello_current");
    if (!email) return null;
    return users().filter(function (u) { return u.email === email; })[0] || null;
  }
  function hash(text) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      });
    }
    var h = 5381; for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return Promise.resolve("x" + h);
  }

  // ---------- validation ----------
  var RE = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^(\+7|8)\d{10}$/,
    name: /^[A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ][A-Za-zА-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүІіҺһ\s-]+$/
  };
  function cleanPhone(v) { return v.replace(/[\s()\-]/g, ""); }

  function clearErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (n) { n.remove(); });
    form.querySelectorAll(".is-invalid").forEach(function (n) { n.classList.remove("is-invalid"); });
  }
  function fail(input, key) {
    input.classList.add("is-invalid");
    var box = input.closest(".mb-3") || input.parentNode;
    var msg = document.createElement("div");
    msg.className = "field-error";
    msg.setAttribute("data-t", key);
    msg.textContent = tr(key);
    box.appendChild(msg);
    return false;
  }
  function checkPassword(input) {
    var v = input.value;
    if (!v) return fail(input, "e_req");
    if (v.length < 8) return fail(input, "e_plen");
    if (!/[a-zа-яёәғқңөұүі]/.test(v) || !/[A-ZА-ЯЁӘҒҚҢӨҰҮІ]/.test(v) || !/\d/.test(v)) return fail(input, "e_pcx");
    return true;
  }

  // ---------- page logic ----------
  function initSignup(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      var f = form.elements, ok = true;
      var name = f.name.value.trim(), email = f.email.value.trim().toLowerCase(), phone = cleanPhone(f.phone.value);
      if (!name) ok = fail(f.name, "e_req"); else if (!RE.name.test(name)) ok = fail(f.name, "e_name");
      if (!email) ok = fail(f.email, "e_req"); else if (!RE.email.test(email)) ok = fail(f.email, "e_email");
      if (!phone) ok = fail(f.phone, "e_req"); else if (!RE.phone.test(phone)) ok = fail(f.phone, "e_phone");
      if (!checkPassword(f.password)) ok = false;
      if (!f.password2.value) ok = fail(f.password2, "e_req");
      else if (f.password2.value !== f.password.value) ok = fail(f.password2, "e_match");
      if (!ok) return;
      var list = users();
      if (list.some(function (u) { return u.email === email; })) return fail(f.email, "e_exists");
      hash(email + ":" + f.password.value).then(function (h) {
        list.push({ name: name, email: email, phone: phone.replace(/^8/, "+7"), pass: h, created: new Date().toISOString() });
        save("yello_users", list);
        localStorage.setItem("yello_current", email); // log in right after sign up
        window.yelloMsg("✅ " + tr("ok_signup"));
        setTimeout(function () { location.href = "account.html"; }, 1000);
      });
    });
  }

  function initLogin(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      var f = form.elements, ok = true, email = f.email.value.trim().toLowerCase();
      if (!email) ok = fail(f.email, "e_req"); else if (!RE.email.test(email)) ok = fail(f.email, "e_email");
      if (!f.password.value) ok = fail(f.password, "e_req");
      if (!ok) return;
      hash(email + ":" + f.password.value).then(function (h) {
        var user = users().filter(function (u) { return u.email === email && u.pass === h; })[0];
        if (!user) return fail(f.password, "e_bad");
        localStorage.setItem("yello_current", user.email);
        window.yelloMsg("👋 " + tr("ok_login") + " " + user.name.split(" ")[0] + "!");
        setTimeout(function () { location.href = "account.html"; }, 900);
      });
    });
  }

  function ratingKey() { var u = currentUser(); return u ? u.email : "guest"; }

  function initProfile() {
    var user = currentUser();
    if (!user) { location.replace("login.html"); return; }
    function val(id, text) { document.getElementById(id).textContent = text; }
    function render() {
      user = currentUser() || user;
      val("pf-name", user.name);
      val("pf-email", user.email);
      val("pf-phone", user.phone || tr("p_none"));
      val("pf-since", new Date(user.created).toLocaleDateString());
      var r = load("yello_ratings", {})[user.email];
      val("pf-rating", r ? "★".repeat(r) + "☆".repeat(5 - r) + "  (" + r + "/5)" : tr("p_none"));
      var fl = load("yello_filters", null), parts = [];
      if (fl) {
        if (fl.q) parts.push("“" + fl.q + "”");
        if (fl.cat && fl.cat !== "all") parts.push(fl.cat.replace(/-/g, " "));
        if (fl.price && fl.price !== "all") parts.push(tr("pr_" + fl.price));
      }
      val("pf-filters", parts.length ? parts.join(" · ") : tr("p_none"));
      val("pf-cart", String(load("yello_cart", []).length));
      document.getElementById("pf-avatar").textContent = user.name.charAt(0).toUpperCase();
    }
    render();
    document.getElementById("logout-btn").addEventListener("click", function () {
      localStorage.removeItem("yello_current");
      window.yelloMsg("👋 " + tr("ok_logout"));
      setTimeout(function () { location.href = "index.html"; }, 900);
    });
    document.querySelectorAll(".site-lang-btn").forEach(function (b) { b.addEventListener("click", render); });
  }

  // ---------- navbar: login/profile link + mobile menu ----------
  function initNav() {
    var tools = document.querySelector(".nav-tools");
    if (tools) {
      var user = currentUser(), a = document.createElement("a");
      a.className = "nav-tool-btn auth-link";
      a.style.textDecoration = "none";
      if (user) { a.href = "account.html"; a.textContent = "👤 " + user.name.split(" ")[0]; }
      else { a.href = "login.html"; a.setAttribute("data-t", "n_login"); a.textContent = tr("n_login"); }
      tools.insertBefore(a, tools.firstChild);
    }
    var box = document.querySelector(".navbar-container");
    if (box) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "nav-toggler"; btn.textContent = "☰";
      btn.setAttribute("aria-label", tr("n_menu")); btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        var open = box.classList.toggle("nav-open");
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "✕" : "☰";
      });
      var brand = box.querySelector(".navbar-brand");
      brand.parentNode.insertBefore(btn, brand.nextSibling);
    }
  }

  // ---------- rating saved in localStorage ----------
  function initRating() {
    var stars = document.querySelectorAll(".rating-star");
    if (!stars.length) return;
    var note = document.createElement("p");
    note.className = "rating-note small text-muted mb-0 mt-1";
    stars[0].parentNode.parentNode.appendChild(note);
    function paint(v) {
      stars.forEach(function (s, i) { s.style.color = i < v ? "#ffc107" : "#ccc"; });
      note.textContent = v ? tr("r_saved") + " " + v + "/5" : "";
    }
    var ratings = load("yello_ratings", {});
    paint(ratings[ratingKey()] || 0);
    stars.forEach(function (s, i) {
      s.addEventListener("click", function () {
        ratings = load("yello_ratings", {});
        ratings[ratingKey()] = i + 1;
        save("yello_ratings", ratings);
        paint(i + 1);
      });
    });
    document.querySelectorAll(".site-lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { paint(load("yello_ratings", {})[ratingKey()] || 0); });
    });
  }

  // ---------- contact form: prefill for logged-in users ----------
  function initContact() {
    var user = currentUser();
    if (!user || !document.getElementById("contact-form")) return;
    [["username", user.name], ["useremail", user.email], ["userphone", user.phone]].forEach(function (p) {
      var el = document.getElementById(p[0]); if (el && !el.value && p[1]) el.value = p[1];
    });
  }

  // If account.html is a wrong (stale) file, build the profile page right here
  function ensureAccountPage() {
    if (!/account\.html$/i.test(location.pathname) || document.getElementById("profile-box")) return;
    var main = document.querySelector("main");
    if (!main) return;
    document.title = "Yello Beauty — My Profile";
    main.innerHTML =
      '<div class="auth-wrap">' +
      '<section class="hero-banner text-center mb-4"><h1 class="hero-title" data-t="p_title">My Profile</h1>' +
      '<p class="hero-lead" data-t="p_lead">Your account details</p></section>' +
      '<section class="content-box" id="profile-box"><div class="profile-avatar" id="pf-avatar">?</div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_name">Name</span><span class="profile-value" id="pf-name"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_email">Email</span><span class="profile-value" id="pf-email"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_phone">Phone</span><span class="profile-value" id="pf-phone"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_since">Member since</span><span class="profile-value" id="pf-since"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_rating">Your store rating</span><span class="profile-value" id="pf-rating"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_filters">Last catalog search</span><span class="profile-value" id="pf-filters"></span></div>' +
      '<div class="profile-row"><span class="profile-label" data-t="p_cart">Items in cart</span><span class="profile-value" id="pf-cart"></span></div>' +
      '<div class="profile-actions"><a href="catalog.html" class="btn btn-warning" data-t="p_shop">Go to Catalog</a>' +
      '<button type="button" id="logout-btn" class="btn btn-dark" style="width:auto;" data-t="p_logout">Log Out</button></div>' +
      '</section></div>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    ensureAccountPage();
    var su = document.getElementById("signup-form"), li = document.getElementById("login-form");
    if (su || li) {
      if (currentUser()) { location.replace("account.html"); return; }
      if (su) initSignup(su);
      if (li) initLogin(li);
    }
    if (document.getElementById("profile-box")) initProfile();
    initRating();
    initContact();
    applyTexts();
    document.querySelectorAll(".site-lang-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        applyTexts();
        document.querySelectorAll(".field-error").forEach(function (n) { n.textContent = tr(n.getAttribute("data-t")); });
      });
    });
  });
})();


/* ===== catalog.js ===== */
/* Yello Beauty — catalog.js
   1) Search + category + price filter + sorting, saved in localStorage
   2) External API: Makeup API (https://makeup-api.herokuapp.com) */
$(function () {
  var $q = $("#product-search");
  if ($q.length === 0) return;

  var tr = window.yelloT || function (k) { return k; };

  // ================= 1. FILTERS =================
  var KEY = "yello_filters";
  var $cat = $("#cat-filter"), $price = $("#price-filter"), $sort = $("#sort-filter");
  var ranges = { all: [0, 1e9], "1": [0, 6999], "2": [7000, 12000], "3": [12001, 1e9] };

  $(".product-card").closest(".col-md-4").each(function (i) { $(this).attr("data-idx", i); });

  function priceOf($col) { return parseInt($col.find(".product-price").text().replace(/[^\d]/g, ""), 10) || 0; }

  function applyFilters() {
    var text = $q.val().toLowerCase().trim();
    var cat = $cat.val(), priceKey = $price.val(), sort = $sort.val();
    var range = ranges[priceKey] || ranges.all;

    $(".category-heading").each(function () {
      var $h = $(this), $row = $h.next(".row");
      var cols = $row.children(".col-md-4").get();

      cols.sort(function (a, b) {
        if (sort === "asc") return priceOf($(a)) - priceOf($(b));
        if (sort === "desc") return priceOf($(b)) - priceOf($(a));
        return $(a).attr("data-idx") - $(b).attr("data-idx");
      });
      $.each(cols, function (_, c) { $row.append(c); });

      var catOk = cat === "all" || cat === this.id, visible = 0;
      $row.children(".col-md-4").each(function () {
        var $c = $(this), p = priceOf($c);
        var content = $c.find(".card-title, .card-text").text().toLowerCase();
        var show = catOk && content.indexOf(text) > -1 && p >= range[0] && p <= range[1];
        $c.toggle(show);
        if (show) visible++;
      });
      $h.toggle(visible > 0);
      $row.toggle(visible > 0);
    });

    $("#no-results").toggle($(".product-card:visible").length === 0);
    localStorage.setItem(KEY, JSON.stringify({ q: $q.val(), cat: cat, price: priceKey, sort: sort }));
    $(window).trigger("scroll"); // lets lazy images load
  }

    $q.on("keyup input", applyFilters);
  $cat.add($price).add($sort).on("change", applyFilters);

  $("#reset-filters").on("click", function () {
    $q.val(""); $cat.val("all"); $price.val("all"); $sort.val("default");
    $("#suggestions").hide();
    applyFilters();
  });

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) {
      $q.val(saved.q || ""); $cat.val(saved.cat || "all");
      $price.val(saved.price || "all"); $sort.val(saved.sort || "default");
    }
  } catch (e) { /* ignore broken data */ }
  applyFilters();

  // ================= 2. POPULAR PICKS + MAKEUP API =================
  var API = "https://makeup-api.herokuapp.com/api/v1/products.json?product_type=";
  var TYPE_KEY = "yello_api_type";
  var $type = $("#api-type"), $grid = $("#api-grid"), $status = $("#api-status"), $retry = $("#api-retry");
  var lastList = null, apiState = "loading";

  // popular products for every product type (prices are approximate, USD)
  var POPULAR = {
    lipstick: [
      { brand: "Rare Beauty", by: "Selena Gomez", name: "Kind Words Matte Lipstick", price: 20, color: "#b5445a" },
      { brand: "Rhode", by: "Hailey Bieber", name: "Peptide Lip Treatment", price: 16, color: "#c97b84" },
      { brand: "Fenty Beauty", by: "Rihanna", name: "Gloss Bomb Universal Lip Luminizer", price: 22, color: "#e0899a" },
      { brand: "Kylie Cosmetics", by: "Kylie Jenner", name: "Matte Liquid Lipstick", price: 20, color: "#a3364b" }
    ],
    foundation: [
      { brand: "Rare Beauty", by: "Selena Gomez", name: "Liquid Touch Weightless Foundation", price: 30, color: "#e3b48f" },
      { brand: "Fenty Beauty", by: "Rihanna", name: "Pro Filt'r Soft Matte Foundation", price: 40, color: "#d9a07a" },
      { brand: "Haus Labs", by: "Lady Gaga", name: "Triclone Skin Tech Foundation", price: 49, color: "#e8c4a0" },
      { brand: "Maybelline", by: "Bestseller", name: "Fit Me Matte + Poreless Foundation", price: 9, color: "#dcae8a" }
    ],
    mascara: [
      { brand: "Rare Beauty", by: "Selena Gomez", name: "Perfect Strokes Volumizing Mascara", price: 20, color: "#7a3b8f" },
      { brand: "Fenty Beauty", by: "Rihanna", name: "Full Frontal Volume, Lift & Curl Mascara", price: 26, color: "#d1357a" },
      { brand: "Too Faced", by: "Bestseller", name: "Better Than Sex Mascara", price: 29, color: "#e0507a" },
      { brand: "Maybelline", by: "Bestseller", name: "Lash Sensational Sky High", price: 13, color: "#2f6fd1" }
    ],
    eyeliner: [
      { brand: "Kylie Cosmetics", by: "Kylie Jenner", name: "Kyliner Gel Pencil", price: 18, color: "#6b3fa0" },
      { brand: "Fenty Beauty", by: "Rihanna", name: "Flypencil Longwear Pencil Eyeliner", price: 22, color: "#222222" },
      { brand: "Stila", by: "Bestseller", name: "Stay All Day Liquid Eye Liner", price: 24, color: "#3a2a22" },
      { brand: "Maybelline", by: "Bestseller", name: "Tattoo Studio Gel Pencil", price: 10, color: "#1f4fa3" }
    ],
    blush: [
      { brand: "Rare Beauty", by: "Selena Gomez", name: "Soft Pinch Liquid Blush", price: 23, color: "#e86f8f" },
      { brand: "Rhode", by: "Hailey Bieber", name: "Pocket Blush", price: 22, color: "#d98a86" },
      { brand: "Fenty Beauty", by: "Rihanna", name: "Cheeks Out Freestyle Cream Blush", price: 25, color: "#e9788b" },
      { brand: "Dior", by: "Bestseller", name: "Rosy Glow Blush", price: 38, color: "#f08aa5" }
    ],
    eyeshadow: [
      { brand: "Fenty Beauty", by: "Rihanna", name: "Snap Shadows Mix & Match Palette", price: 25, color: "#c98a5a" },
      { brand: "Huda Beauty", by: "Huda Kattan", name: "Obsessions Eyeshadow Palette", price: 29, color: "#b36b55" },
      { brand: "Kylie Cosmetics", by: "Kylie Jenner", name: "Bronze Eyeshadow Palette", price: 30, color: "#a8683f" },
      { brand: "Urban Decay", by: "Bestseller", name: "Naked Heat Palette", price: 54, color: "#d0703c" }
    ]
  };

  // "&trade;" -> "™" etc.
  function decodeHtml(str) {
    var t = document.createElement("textarea");
    t.innerHTML = String(str || "");
    return t.value;
  }

  // Product picture drawn in SVG: always visible, no internet needed
  function drawProduct(type, color) {
    color = /^#[0-9a-f]{3,8}$/i.test(color || "") ? color : "#c0475f";
    var b = "";
    if (type === "lipstick") {
      b = '<rect x="72" y="104" width="56" height="10" rx="2" fill="#d4af37"/>' +
          '<rect x="75" y="112" width="50" height="62" rx="5" fill="#2b2b2b"/>' +
          '<path d="M82 106 V58 L118 40 V106 Z" fill="' + color + '"/>';
    } else if (type === "foundation") {
      b = '<rect x="94" y="40" width="12" height="22" rx="2" fill="#d4af37"/>' +
          '<rect x="86" y="60" width="28" height="30" rx="3" fill="#2b2b2b"/>' +
          '<rect x="68" y="88" width="64" height="88" rx="10" fill="' + color + '"/>' +
          '<rect x="78" y="118" width="44" height="30" rx="3" fill="#ffffff" opacity="0.85"/>';
    } else if (type === "mascara") {
      b = '<rect x="82" y="34" width="36" height="40" rx="7" fill="' + color + '"/>' +
          '<rect x="88" y="72" width="24" height="104" rx="6" fill="#2b2b2b"/>' +
          '<rect x="88" y="120" width="24" height="14" fill="' + color + '"/>';
    } else if (type === "eyeliner") {
      b = '<g transform="rotate(-35 100 100)">' +
          '<rect x="91" y="26" width="18" height="122" rx="3" fill="' + color + '"/>' +
          '<rect x="91" y="40" width="18" height="12" fill="#d4af37"/>' +
          '<polygon points="91,148 109,148 100,176" fill="#f1d3b0"/>' +
          '<polygon points="96,165 104,165 100,176" fill="#222222"/></g>';
    } else if (type === "blush") {
      b = '<circle cx="100" cy="104" r="66" fill="#2b2b2b"/>' +
          '<circle cx="100" cy="104" r="52" fill="' + color + '"/>' +
          '<circle cx="100" cy="104" r="30" fill="#ffffff" opacity="0.25"/>';
    } else if (type === "eyeshadow") {
      var cols = [color, "#e8c9a0", "#8a5a44", "#f4e1c7", "#5b3a4a", color], i, x, y;
      b = '<rect x="36" y="58" width="128" height="92" rx="9" fill="#2b2b2b"/>';
      for (i = 0; i < 6; i++) {
        x = 66 + (i % 3) * 34; y = 90 + Math.floor(i / 3) * 34;
        b += '<circle cx="' + x + '" cy="' + y + '" r="14" fill="' + cols[i] + '"/>';
      }
    } else {
      b = '<rect x="70" y="70" width="60" height="100" rx="10" fill="' + color + '"/>' +
          '<rect x="88" y="44" width="24" height="28" rx="3" fill="#2b2b2b"/>';
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="#FFF3C4"/>' + b + '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // one product card (real photo if it loads, otherwise the drawn picture)
  function makeCard(o) {
    var fallback = drawProduct(o.type, o.color);
    var $card = $('<article class="api-card"></article>');
    var $imgBox = $('<div class="api-img"></div>');
    var $img = $('<img referrerpolicy="no-referrer">').attr("alt", o.name)
      .one("error", function () { $(this).attr("src", fallback); });
    $img.attr("src", o.img || fallback);
    $imgBox.append($img);

    var $body = $('<div class="api-body"></div>');
    if (o.by) $body.append($('<span class="api-badge"></span>').text("⭐ " + o.by));
    $body.append($('<p class="api-brand"></p>').text(String(o.brand || "").toUpperCase()));
    $body.append($('<h3 class="api-name"></h3>').text(o.name));
    $body.append($('<p class="api-price"></p>').text(o.priceText));
    if (o.rating) $body.append($('<p class="api-rating"></p>').text("★ " + o.rating));
    if (o.link && /^https?:\/\//.test(o.link)) {
      $body.append($('<a class="btn btn-warning btn-sm w-100" target="_blank" rel="noopener noreferrer"></a>')
        .attr("href", o.link).text(tr("api_view")));
    }
    return $card.append($imgBox, $body);
  }

  function setStatus() {
    if (apiState === "loading") $status.text(tr("api_load"));
    else if (apiState === "error") $status.text(tr("api_err"));
    else if (apiState === "empty") $status.text(tr("api_empty"));
    else $status.text(lastList.length + " " + tr("api_count") + " · " + tr("api_pop_note"));
  }

  function render() {
    var type = $type.val();
    $grid.empty();

    $grid.append($('<h3 class="api-subtitle"></h3>').text("⭐ " + tr("api_popular")));
    (POPULAR[type] || []).forEach(function (p) {
      $grid.append(makeCard({
        type: type, color: p.color, brand: p.brand, by: p.by, name: p.name,
        priceText: "~$" + p.price.toFixed(2),
        link: "https://www.google.com/search?q=" + encodeURIComponent(p.brand + " " + p.name)
      }));
    });

    if (lastList && lastList.length) {
      $grid.append($('<h3 class="api-subtitle"></h3>').text("🌍 " + tr("api_live")));
      lastList.forEach(function (p) {
        var price = parseFloat(p.price);
        var hex = p.product_colors && p.product_colors[0] && p.product_colors[0].hex_value;
        $grid.append(makeCard({
          type: type, color: hex, brand: decodeHtml(p.brand), name: decodeHtml(p.name),
          img: p.image_link ? String(p.image_link).replace(/^http:/, "https:") : "",
          priceText: "$" + (isNaN(price) ? "—" : price.toFixed(2)),
          rating: p.rating, link: p.product_link
        }));
      });
    }
  }

  function loadApi() {
    var type = $type.val();
    localStorage.setItem(TYPE_KEY, type);
    $retry.hide();
    lastList = null; apiState = "loading";
    render(); setStatus();            // popular picks show immediately

    fetch(API + encodeURIComponent(type))
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (list) {
        lastList = list.filter(function (p) { return parseFloat(p.price) > 0; }).slice(0, 8);
        apiState = lastList.length ? "ok" : "empty";
        render(); setStatus();
      })
      .catch(function () {
        lastList = null; apiState = "error";
        render(); setStatus();
        $retry.show();
      });
  }

  var savedType = localStorage.getItem(TYPE_KEY);
  if (savedType && $type.find('option[value="' + savedType + '"]').length) $type.val(savedType);
  $type.on("change", loadApi);
  $retry.on("click", loadApi);
  $(".site-lang-btn").on("click", function () { setTimeout(function () { render(); setStatus(); }, 0); });
  loadApi();
});
