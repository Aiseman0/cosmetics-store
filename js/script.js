document.addEventListener("DOMContentLoaded", function() {

  // ==========================================
  // 0. ТЁМНЫЙ / ДНЕВНОЙ РЕЖИМ И ПЕРЕКЛЮЧЕНИЕ ЯЗЫКА (EN / RU / KZ)
  // ==========================================
  var themeBtn = document.getElementById("theme-btn");
  if (localStorage.getItem("yello_theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeBtn) themeBtn.textContent = "☀️";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function() {
      var isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("yello_theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }

  var I18N = {
    t_glow: ["✨ Glow like the Sun, shine like the Moon!", "✨ Сияй как Солнце, свети как Луна!", "✨ Күндей жарқыра, Айдай сәуле шаш!"],
    t_ship2: ["🚚 Free shipping on orders over 15,000 ₸!", "🚚 Бесплатная доставка при заказе от 15 000 ₸!", "🚚 15 000 ₸-ден жоғары тапсырыстарға тегін жеткізу!"],
    t_welcome: ["💛 Welcome to Yello Beauty Store!", "💛 Добро пожаловать в Yello Beauty Store!", "💛 Yello Beauty дүкеніне қош келдіңіз!"],
    nav_home: ["Home", "Главная", "Басты бет"],
    nav_catalog: ["Catalog", "Каталог", "Каталог"],
    nav_about: ["About Us", "О нас", "Біз туралы"],
    nav_contact: ["Contact", "Контакты", "Байланыс"],
    sb_quick: ["Quick Navigation", "Быстрая навигация", "Жылдам шарлау"],
    a_nav_story: ["Our Story", "Наша история", "Біздің тарих"],
    a_nav_creators: ["Creators", "Создатели", "Құрушылар"],
    a_nav_ship: ["Shipping Options", "Доставка", "Жеткізу"],
    a_nav_faq: ["FAQ Accordion", "Частые вопросы", "Жиі қойылатын сұрақтар"],
    a_hero: ["About Our Brand", "О нашем бренде", "Біздің бренд туралы"],
    a_hero_lead: ["Glow like the Sun, shine like the Moon", "Сияй как Солнце, свети как Луна", "Күндей жарқыра, Айдай сәуле шаш"],
    a_story_title: ["The Story of Yello Beauty", "История Yello Beauty", "Yello Beauty тарихы"],
    a_story: [
      "The name Yello Beauty combines the warmth of sunlight (Yellow) and the aesthetics of its two creators — Sara and Aisulu. The name Aisulu translates to 'moon beauty,' and our brand was born at the intersection of two harmonies.",
      "Название Yello Beauty объединяет тепло солнечного света (Yellow) и эстетику двух создательниц — Сары и Айсулу. Имя Айсулу переводится как «лунная красавица», и наш бренд родился на стыке двух гармоний.",
      "Yello Beauty атауы күн сәулесінің жылуы (Yellow) мен оның екі негізін қалаушы — Сара мен Айсұлудың эстетикасын біріктіреді."
    ],
    rm_about_text: [
      "Our team believes that skincare should be simple, honest, and enjoyable. Every product in our catalog is picked by Sara and Aisulu personally.",
      "Наша команда верит, что уход за кожей должен быть простым, честным и приятным. Каждый продукт в каталоге подобран Сарой и Айсулу лично.",
      "Біздің команда тері күтімі қарапайым, адал және жағымды болуы керек деп санайды. Каталогтағы әрбір өнімді Сара мен Айсұлу жеке таңдаған."
    ],
    a_creators: ["Our Creators", "Наши создатели", "Біздің құрушылар"],
    a_sara_role: ["Co-Founder & Developer", "Сооснователь и разработчик", "Тең құрылтайшы және әзірлеуші"],
    a_sara_d: [
      "Sara designed the brand structure, feedback systems, and delivery network to make beauty ordering seamless.",
      "Сара разработала структуру бренда, систему обратной связи и логистику для удобного заказа косметики.",
      "Сара косметикаға тапсырыс беруді ыңғайлы ету үшін бренд құрылымын, кері байланыс жүйесін және жеткізу желісін жасады."
    ],
    a_ais_role: ["Co-Founder & Designer", "Сооснователь и дизайнер", "Тең құрылтайшы және дизайнер"],
    a_ais_d: [
      "Aisulu curated the yellow-pearl aesthetic, layout structure, and catalog experience for every visitor.",
      "Айсулу создала солнечно-жемчужную эстетику, дизайн страниц и подборку каталога для каждого гостя.",
      "Айсұлу әрбір келушіге арналған сары-інжу эстетикасын, бет дизайнын және каталог тәжірибесін жасады."
    ],
    a_ship_title: ["Shipping & Delivery Options", "Варианты доставки", "Жеткізу түрлері"],
    th1: ["Delivery Method", "Способ доставки", "Жеткізу әдісі"],
    th2: ["Estimated Time", "Срок доставки", "Мерзімі"],
    th3: ["Coverage Area", "Зона покрытия", "Аймақ"],
    th4: ["Price (₸)", "Цена (₸)", "Бағасы (₸)"],
    r1c1: ["Standard Courier", "Стандартный курьер", "Стандартты курьер"],
    r1c2: ["2-3 Business Days", "2-3 рабочих дня", "2-3 жұмыс күні"],
    r1c3: ["Astana & Almaty", "Астана и Алматы", "Астана және Алматы"],
    r2c1: ["Express Shipping", "Экспресс-доставка", "Экспресс жеткізу"],
    r2c2: ["Same Day Delivery", "В день заказа", "Тапсырыс күні"],
    r2c3: ["Astana City", "г. Астана", "Астана қ."],
    r3c1: ["Regional Kazpost", "Казпочта по регионам", "Аймақтарға Қазпошта"],
    r3c2: ["4-7 Business Days", "4-7 рабочих дней", "4-7 жұмыс күні"],
    r3c3: ["All Regions of Kazakhstan", "Все регионы Казахстана", "Қазақстанның барлық аймақтары"],
    faq_title: ["Frequently Asked Questions", "Часто задаваемые вопросы", "Жиі қойылатын сұрақтар"],
    faq_ph: ["🔍 Search in FAQ...", "🔍 Поиск по вопросам...", "🔍 Сұрақтардан іздеу..."],
    q1: ["Are all products 100% original?", "Вся продукция на 100% оригинальная?", "Барлық өнімдер 100% түпнұсқа ма?"],
    a1: ["Yes! We source cosmetics directly from official brand distributors in South Korea, USA, and Europe.", "Да! Мы закупаем косметику напрямую у официальных дистрибьюторов в Южной Корее, США и Европе.", "Иә! Біз косметиканы Оңтүстік Корея, АҚШ және Еуропадағы ресми дистрибьюторлардан тікелей аламыз."],
    q2: ["How can I track my shipment?", "Как отследить мой заказ?", "Тапсырысымды қалай бақылауға болады?"],
    a2: ["Once your order is dispatched, you will receive a tracking number via SMS or email.", "После отправки заказа вы получите трек-номер по SMS или на электронную почту.", "Тапсырысыңыз жіберілгеннен кейін SMS немесе электрондық пошта арқылы бақылау нөмірін аласыз."],
    q3: ["What skin type are these cosmetics suitable for?", "Для какого типа кожи подходит косметика?", "Бұл косметика қандай тері түріне сәйкес келеді?"],
    a3: ["Our store offers dedicated product lines for dry, sensitive, oily, combination, and normal skin types.", "В нашем магазине есть линейки для сухой, чувствительной, жирной, комбинированной и нормальной кожи.", "Біздің дүкенде құрғақ, сезімтал, майлы, аралас және қалыпты тері түрлеріне арналған желілер бар."],
    foot_rights: ["© 2026 Yello Beauty Cosmetics. All rights reserved.", "© 2026 Yello Beauty Cosmetics. Все права защищены.", "© 2026 Yello Beauty Cosmetics. Барлық құқықтар қорғалған."],
    foot_team: ["Team Members: Aisulu Amanzhol, Sara Nauash (Group SE-2506)", "Команда: Айсулу Аманжол, Сара Науаш (Группа SE-2506)", "Топ мүшелері: Айсұлу Аманжол, Сара Науаш (SE-2506 тобы)"]
  };

  function applySiteLanguage(lang) {
    localStorage.setItem("yello_lang", lang);
    var idx = lang === "ru" ? 1 : lang === "kz" ? 2 : 0;

    document.querySelectorAll("[data-i18n]").forEach(function(el) {
      var key = el.getAttribute("data-i18n");
      if (I18N[key]) el.textContent = I18N[key][idx];
    });

    document.querySelectorAll("[data-i18n-ph]").forEach(function(el) {
      var key = el.getAttribute("data-i18n-ph");
      if (I18N[key]) el.placeholder = I18N[key][idx];
    });

    document.querySelectorAll(".site-lang-btn").forEach(function(btn) {
      btn.classList.toggle("active-lang", btn.getAttribute("data-lang") === lang);
    });

    var greetingElem = document.getElementById("time-greeting");
    if (greetingElem && window.yelloT) {
      var hour = new Date().getHours();
      var gKey = hour < 12 ? "greet_m" : hour < 18 ? "greet_a" : "greet_e";
      greetingElem.innerText = window.yelloT(gKey);
    }
  }

  var currentLang = localStorage.getItem("yello_lang") || "en";
  applySiteLanguage(currentLang);

  document.querySelectorAll(".site-lang-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      applySiteLanguage(this.getAttribute("data-lang"));
    });
  });

  // --- Read More кнопка в About Us ---
  document.querySelectorAll(".read-more-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var target = document.getElementById(this.getAttribute("data-target"));
      if (!target) return;
      var hidden = target.style.display === "none";
      target.style.display = hidden ? "block" : "none";
      this.textContent = hidden ? "Show Less" : "Read More";
    });
  });

  // --- FAQ поиск ---
  var faqSearch = document.getElementById("faq-search");
  if (faqSearch) {
    faqSearch.addEventListener("input", function() {
      var q = this.value.toLowerCase().trim();
      document.querySelectorAll(".accordion-item-custom").forEach(function(item) {
        item.style.display = item.textContent.toLowerCase().indexOf(q) > -1 ? "block" : "none";
      });
    });
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
        if (window.yelloMsg) window.yelloMsg("Please fill in all required fields!");
        else alert("Please fill in all required fields!");
        return;
      }

      if (username.length < 3) {
        if (window.yelloMsg) window.yelloMsg("Name must be at least 3 characters long!");
        else alert("Name must be at least 3 characters long!");
        return;
      }

      if (!emailPattern.test(email)) {
        if (window.yelloMsg) window.yelloMsg("Please enter a valid email address format (e.g., example@mail.com).");
        else alert("Please enter a valid email address format (e.g., example@mail.com).");
        return;
      }

      if (window.yelloMsg) window.yelloMsg("Thank you! Your message has been successfully verified and sent.");
      else alert("Thank you! Your message has been successfully verified and sent.");
      contactForm.reset();
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
        if (window.yelloMsg) window.yelloMsg("Please enter your email address!");
        else alert("Please enter your email address!");
        return;
      }

      if (!emailPattern.test(emailVal)) {
        if (window.yelloMsg) window.yelloMsg("Please enter a valid email address format (e.g., example@mail.com).");
        else alert("Please enter a valid email address format (e.g., example@mail.com).");
        return;
      }

      if (window.yelloMsg) window.yelloMsg("Thank you for subscribing!");
      else alert("Thank you for subscribing!");
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

  if (savedColor && !document.body.classList.contains("dark-mode")) {
    document.body.style.setProperty("background-color", savedColor, "important");
  }

  if (bgColorBtn) {
    var colorIndex = savedIndex ? parseInt(savedIndex) : 0;
    bgColorBtn.addEventListener("click", function() {
      if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("yello_theme", "light");
        if (themeBtn) themeBtn.textContent = "🌙";
      }
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
  var cart = JSON.parse(localStorage.getItem("yello_cart") || "[]");
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
          if (window.yelloMsg) window.yelloMsg("🛒 " + title + " added to cart!");
        }
      }
    });
  });

  function updateCartUI() {
    localStorage.setItem("yello_cart", JSON.stringify(cart));
    if (!cartCountElem || !cartItemsList || !cartTotalElem) return;

    cartCountElem.innerText = cart.length;

    if (cart.length === 0) {
      cartItemsList.innerHTML = "<li>Cart is empty</li>";
      cartTotalElem.innerText = "0";
      return;
    }

    var html = "";
    var total = 0;

    cart.forEach(function(item) {
      total += item.price;
      html += `<li class="d-flex justify-content-between align-items-center mb-1">
                 <span>${item.title}</span>
                 <span class="fw-bold">${item.price.toLocaleString()} ₸</span>
               </li>`;
    });

    cartItemsList.innerHTML = html;
    cartTotalElem.innerText = total.toLocaleString();
  }

  updateCartUI();

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      if (cart.length === 0) {
        if (window.yelloMsg) window.yelloMsg("Your cart is empty!");
        else alert("Your cart is empty!");
        return;
      }
      if (window.yelloMsg) window.yelloMsg("Thank you for your order! Total amount: " + cartTotalElem.innerText + " ₸");
      else alert("Thank you for your order! Total amount: " + cartTotalElem.innerText + " ₸");
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

});
