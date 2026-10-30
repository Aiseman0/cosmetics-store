document.addEventListener("DOMContentLoaded", function() {

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
        alert("Please fill in all required fields!");
        return;
      }

      if (username.length < 3) {
        alert("Name must be at least 3 characters long!");
        return;
      }

      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address format (e.g., example@mail.com).");
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
        alert("Please enter your email address!");
        return;
      }

      if (!emailPattern.test(emailVal)) {
        alert("Please enter a valid email address format (e.g., example@mail.com).");
        return;
      }

      alert("Thank you for subscribing!");
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
      datetimeDisplay.innerText = d.toLocaleDateString() + " " + d.toLocaleTimeString();
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
      if (hour < 12) return "Good Morning! ☀️ Discover fresh morning skincare.";
      if (hour < 18) return "Good Afternoon! ✨ Glow with our bestsellers.";
      return "Good Evening! 🌙 Pamper your skin with night care.";
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

    cartCountElem.innerText = cart.length;

    if (cart.length === 0) {
      cartItemsList.innerHTML = "<li>Cart is empty</li>";
      cartTotalElem.innerText = "0";
      return;
    }

    var html = "";
    var total = 0;

    cart.forEach(function(item, index) {
      total += item.price;
      html += `<li class="d-flex justify-content-between align-items-center mb-1">
                 <span>${item.title}</span>
                 <span class="fw-bold">${item.price.toLocaleString()} ₸</span>
               </li>`;
    });

    cartItemsList.innerHTML = html;
    cartTotalElem.innerText = total.toLocaleString();
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert("Thank you for your order! Total amount: " + cartTotalElem.innerText + " ₸");
      cart = [];
      updateCartUI();
    });
  }

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
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
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

  // F. Interactive Star Rating
  var ratingStars = document.querySelectorAll(".rating-star");
  if (ratingStars.length > 0) {
    ratingStars.forEach(function(star, index) {
      star.addEventListener("click", function() {
        ratingStars.forEach((s, i) => {
          if (i <= index) {
            s.style.color = "#ffc107";
          } else {
            s.style.color = "#ccc";
          }
        });
      });
    });
  }

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

      c_cats: "Категории", c_all: "Вся косметика (15)", c_skin: "Уход и сыворотки (5)",
      c_face: "Макияж лица и глаз (5)", c_lip: "Уход за губами и тинты (5)",
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

      c_cats: "Санаттар", c_all: "Барлық косметика (15)", c_skin: "Күтім және сарысулар (5)",
      c_face: "Бет пен көз макияжы (5)", c_lip: "Ерін күтімі және тинттер (5)",
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

    // Highlight the active language button
    siteLangButtons.forEach(function(btn) {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active-tool");
      } else {
        btn.classList.remove("active-tool");
      }
    });

    updateReadMoreButtons();
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

  // Short messages in 3 languages (the site language is saved in localStorage)
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

  // Get a message in the current language
  function t(key) {
    var lang = localStorage.getItem("yello_lang") || "en";
    return messages[lang][key];
  }


  // ----------------------------------------------------------
  // Task 1. Real-time search and live filter (catalog page)
  // ----------------------------------------------------------
  $("#product-search").on("keyup", function() {
    var text = $(this).val().toLowerCase().trim();

    var columns = $(".product-card").closest(".col-md-4");

    columns.hide();
    columns.filter(function() {
      var cardText = $(this).find(".card-title, .card-text").text().toLowerCase();
      return cardText.indexOf(text) > -1;
    }).show();

    $(".category-heading").each(function() {
      var row = $(this).next(".row");
      var visibleCount = row.find(".col-md-4:visible").length;
      $(this).toggle(visibleCount > 0);
      row.toggle(visibleCount > 0);
    });

    $("#no-results").toggle($(".product-card:visible").length === 0);

    loadVisibleImages();
  });


  // ----------------------------------------------------------
  // Task 2. Autocomplete search suggestions (catalog page)
  // ----------------------------------------------------------

  // collect all products (name + picture) in one array
  var products = [];
  $(".product-card").each(function() {
    products.push({
      name: $(this).find(".card-title").text(),
      picture: $(this).find("img")
    });
  });

  $("#product-search").on("keyup", function() {
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
        list.append(
          '<li data-name="' + products[i].name + '">' +
            '<img src="' + link + '" alt="">' +
            '<span>' + products[i].name + '</span>' +
          '</li>'
        );
        count++;
      }
    }

    if (count === 0) {
      list.append('<li class="not-found">😔 ' + t("unavailable") + '</li>');
    }

    list.show();
  });

  $("#suggestions").on("click", "li", function() {
    if ($(this).hasClass("not-found")) {
      return;
    }
    $("#product-search").val($(this).attr("data-name")).trigger("keyup");
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

  // copy text: modern way, and old way if the modern one is not available
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

  function loadVisibleImages() {
    var windowBottom = $(window).scrollTop() + $(window).height();

    $("img[data-src]").each(function() {
      var img = $(this);

      if (!img.is(":visible")) {
        return;
      }

      if (img.offset().top < windowBottom + 100) {
        img.on("load error", function() {
          img.addClass("loaded");
        });
        img.attr("src", img.attr("data-src"));
        img.removeAttr("data-src");
      }
    });
  }

  $(window).on("scroll resize", loadVisibleImages);
  loadVisibleImages();

});
