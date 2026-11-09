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
    e_noacc: ["No account with this email yet. Please sign up first.", "Аккаунта с таким email ещё нет. Сначала зарегистрируйтесь.", "Бұл email-мен аккаунт әлі жоқ. Алдымен тіркеліңіз."],
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
    api_desc: ["Real make-up with photos from the Open Beauty Facts open database, including brands from Russia and Belarus.", "Реальная косметика с фото из открытой базы Open Beauty Facts, включая бренды России и Беларуси.", "Open Beauty Facts ашық базасындағы фотосы бар нақты косметика, Ресей мен Беларусь брендтерін қоса."],
    api_type: ["Product type", "Тип товара", "Тауар түрі"],
    ty_lipstick: ["Lipstick", "Помада", "Далап"],
    ty_foundation: ["Foundation", "Тональная основа", "Тональды негіз"],
    ty_mascara: ["Mascara", "Тушь", "Тушь"],
    ty_eyeliner: ["Eyeliner", "Подводка", "Көз сызғышы"],
    ty_blush: ["Blush", "Румяна", "Бетқызыл"],
    ty_eyeshadow: ["Eyeshadow", "Тени", "Көлеңке"],
    api_load: ["Loading products...", "Загрузка товаров...", "Тауарлар жүктелуде..."],
    api_err: ["Could not load products. Check your connection and try again.", "Не удалось загрузить товары. Проверьте соединение и повторите.", "Тауарларды жүктеу мүмкін болмады. Байланысты тексеріп, қайталаңыз."],
    api_cached: ["Offline: showing the last saved products.", "Нет связи: показаны последние сохранённые товары.", "Байланыс жоқ: соңғы сақталған тауарлар көрсетілді."],
    api_credit: ["Product data and photos: Open Beauty Facts (open database, photos under CC BY-SA, data under ODbL).", "Данные и фото товаров: Open Beauty Facts (открытая база, фото по лицензии CC BY-SA, данные по ODbL).", "Тауар деректері мен фотолар: Open Beauty Facts (ашық база, фотолар CC BY-SA, деректер ODbL лицензиясымен)."],
    api_cis: ["CIS brand", "Бренд СНГ", "ТМД бренді"],
    api_retry: ["Try again", "Повторить", "Қайталау"],
    api_view: ["View product", "Открыть товар", "Тауарды ашу"],
    api_empty: ["No make-up of this type with photos was found. Try another type.", "Косметика этого типа с фото не найдена. Попробуйте другой тип.", "Бұл түрдегі фотосы бар косметика табылмады. Басқа түрді таңдаңыз."],
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
    e_msg: ["Message must be at least 10 characters.", "Сообщение должно содержать минимум 10 символов.", "Хабарлама кемінде 10 таңба болуы керек."],
    w_nav: ["Skin Weather", "Погода для кожи", "Тері ауа райы"],
    w_title: ["Skin Weather in Astana", "Погода для кожи в Астане", "Астанадағы тері үшін ауа райы"],
    w_desc: ["Live weather from the Open-Meteo API and what it means for your skincare today.", "Актуальная погода из Open-Meteo API и что она значит для вашего ухода сегодня.", "Open-Meteo API-дегі өзекті ауа райы және бүгінгі күтімге әсері."],
    w_load: ["Loading weather...", "Загрузка погоды...", "Ауа райы жүктелуде..."],
    w_err: ["Could not load the weather. Check your connection and try again.", "Не удалось загрузить погоду. Проверьте соединение и повторите.", "Ауа райын жүктеу мүмкін болмады. Байланысты тексеріп, қайталаңыз."],
    w_cached: ["Offline: showing the last saved weather.", "Нет связи: показана последняя сохранённая погода.", "Байланыс жоқ: соңғы сақталған ауа райы көрсетілді."],
    w_ok: ["Updated just now from Open-Meteo.", "Только что обновлено из Open-Meteo.", "Open-Meteo-дан жаңа ғана жаңартылды."],
    w_temp: ["Temperature", "Температура", "Температура"],
    w_hum: ["Humidity", "Влажность", "Ылғалдылық"],
    w_uv: ["UV index (max today)", "УФ-индекс (макс. сегодня)", "УК индексі (бүгін макс.)"],
    w_uv_low: ["Low UV: a light moisturizer with SPF 15 is enough.", "Низкий УФ: достаточно лёгкого крема с SPF 15.", "УК төмен: SPF 15 бар жеңіл крем жеткілікті."],
    w_uv_mid: ["Moderate UV: apply SPF 30 in the morning.", "Умеренный УФ: утром нанесите SPF 30.", "УК орташа: таңертең SPF 30 жағыңыз."],
    w_uv_high: ["High UV: SPF 50, reapply every 2-3 hours.", "Высокий УФ: SPF 50, обновляйте каждые 2-3 часа.", "УК жоғары: SPF 50, әр 2-3 сағат сайын жаңартыңыз."],
    w_uv_xhigh: ["Very high UV: SPF 50+, sunglasses and shade at midday.", "Очень высокий УФ: SPF 50+, очки и тень в полдень.", "УК өте жоғары: SPF 50+, көзілдірік және түсте көлеңке."],
    w_h_dry: ["Dry air: add a hydrating serum and a rich cream.", "Сухой воздух: добавьте увлажняющую сыворотку и плотный крем.", "Құрғақ ауа: ылғалдандыратын сарысу мен қою крем қосыңыз."],
    w_h_ok: ["Comfortable humidity: your usual routine works well.", "Комфортная влажность: подойдёт привычный уход.", "Ылғалдылық қолайлы: әдеттегі күтім жарайды."],
    w_h_wet: ["Humid air: choose light gel textures.", "Влажный воздух: выбирайте лёгкие гелевые текстуры.", "Ауа ылғалды: жеңіл гель құрылымын таңдаңыз."],
    w_cold: ["Cold weather: protect your skin barrier with a balm.", "Холодно: защитите барьер кожи бальзамом.", "Суық: тері тосқауылын бальзаммен қорғаңыз."],
    pf_menu: ["Menu", "Меню", "Мәзір"],
    // ---- cart / checkout / orders ----
    c_sub: ["Review your selected cosmetics before checkout", "Проверьте выбранную косметику перед оформлением", "Тапсырыс беру алдында таңдалған косметиканы тексеріңіз"],
    c_empty: ["Your cart is empty.", "Ваша корзина пуста.", "Себетіңіз бос."],
    c_remove: ["Remove", "Удалить", "Жою"],
    c_clear: ["Clear cart", "Очистить корзину", "Себетті тазалау"],
    c_added: ["added to cart", "добавлен в корзину", "себетке қосылды"],
    c_login_first: ["Please log in to add items to your cart!", "Пожалуйста, войдите в аккаунт, чтобы добавлять товары в корзину!", "Себетке тауар қосу үшін аккаунтқа кіріңіз!"],
    c_login_pay: ["Please log in to place an order.", "Войдите в аккаунт, чтобы оформить заказ.", "Тапсырыс беру үшін аккаунтқа кіріңіз."],
    p_to_cart: ["Go to Cart", "Перейти в корзину", "Себетке өту"],
    ck_title: ["Checkout", "Оформление заказа", "Тапсырысты рәсімдеу"],
    ck_address: ["Delivery address", "Адрес доставки", "Жеткізу мекенжайы"],
    ck_address_ph: ["Astana, Mangilik El Ave 55", "г. Астана, пр. Мангилик Ел, 55", "Астана қ., Мәңгілік Ел даңғ., 55"],
    ck_promo: ["Promo code", "Промокод", "Промокод"],
    ck_promo_ph: ["e.g. YELLO15", "Например, YELLO15", "Мысалы, YELLO15"],
    ck_apply: ["Apply", "Применить", "Қолдану"],
    ck_promo_hint: ["Enter YELLO15 for a 15% discount", "Введите YELLO15 для скидки 15%", "15% жеңілдік үшін YELLO15 енгізіңіз"],
    ck_promo_ok: ["✅ Promo code applied: -15%", "✅ Промокод применён: -15%", "✅ Промокод қолданылды: -15%"],
    ck_promo_bad: ["❌ Promo code not found", "❌ Промокод не найден", "❌ Промокод табылмады"],
    ck_card: ["Card number", "Номер банковской карты", "Банк картасының нөмірі"],
    ck_exp: ["Expiry (MM/YY)", "Срок (ММ/ГГ)", "Мерзімі (АА/ЖЖ)"],
    ck_cvv: ["CVV", "CVV", "CVV"],
    ck_sub: ["Subtotal:", "Сумма:", "Сомасы:"],
    ck_disc: ["Discount:", "Скидка:", "Жеңілдік:"],
    ck_total: ["Total to pay:", "Итого к оплате:", "Төленетін сома:"],
    ck_pay: ["Confirm and pay", "Подтвердить и оплатить", "Растау және төлеу"],
    ck_processing: ["Processing...", "Обработка...", "Өңделуде..."],
    ck_demo: ["Demo store: no real payment is made and card data is never saved.", "Учебный магазин: реальная оплата не производится, данные карты не сохраняются.", "Оқу дүкені: нақты төлем жасалмайды, карта деректері сақталмайды."],
    ck_e_addr: ["Enter a delivery address (at least 5 characters).", "Введите адрес доставки (минимум 5 символов).", "Жеткізу мекенжайын енгізіңіз (кемінде 5 таңба)."],
    ck_e_card: ["Card number must have 16 digits.", "Номер карты должен содержать 16 цифр.", "Карта нөмірі 16 саннан тұруы керек."],
    ck_e_exp: ["Enter a valid expiry date, e.g. 12/28.", "Введите корректный срок, например 12/28.", "Дұрыс мерзімін енгізіңіз, мысалы 12/28."],
    ck_e_exp_old: ["The card has expired.", "Срок действия карты истёк.", "Картаның мерзімі өткен."],
    ck_e_cvv: ["CVV must have 3 digits.", "CVV должен содержать 3 цифры.", "CVV 3 саннан тұруы керек."],
    ck_done: ["🎉 Order placed! Total:", "🎉 Заказ оформлен! Сумма:", "🎉 Тапсырыс рәсімделді! Сомасы:"],
    ord_title: ["Order history", "История заказов", "Тапсырыстар тарихы"],
    ord_none: ["You have no orders yet.", "У вас пока нет оформленных заказов.", "Сізде әлі тапсырыс жоқ."],
    ord_n: ["Order", "Заказ", "Тапсырыс"],
    ord_addr: ["Address:", "Адрес:", "Мекенжайы:"],
    ord_card: ["Card:", "Карта:", "Карта:"],
    ord_promo: ["Promo code:", "Промокод:", "Промокод:"],
    ord_status: ["Status:", "Статус:", "Күйі:"],
    ord_paid: ["Paid", "Оплачен", "Төленді"],
    ord_total: ["Total:", "Итого:", "Барлығы:"]
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
    var box = document.getElementById("toast-container");
    if (!box) { box = document.createElement("div"); box.id = "toast-container"; box.className = "toast-container"; document.body.appendChild(box); }
    var t = document.createElement("div");
    t.className = "toast-msg"; t.style.display = "block"; t.style.opacity = "0"; t.style.transition = "opacity .3s";
    t.textContent = message;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "1"; }, 10);
    setTimeout(function () { t.style.opacity = "0"; }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3100);
  };

  // ---------- redirect guard (prevents endless login <-> profile loops) ----------
  function go(url) {
    try {
      var now = Date.now(), log = JSON.parse(sessionStorage.getItem("yello_redirects") || "[]")
        .filter(function (t) { return now - t < 5000; });
      if (log.length >= 3) { sessionStorage.removeItem("yello_redirects"); localStorage.removeItem("yello_current"); return false; }
      log.push(now); sessionStorage.setItem("yello_redirects", JSON.stringify(log));
    } catch (e) { /* ignore */ }
    location.replace(url);
    return true;
  }

  // ---------- users ----------
  function users() { return load("yello_users", []); }
  function currentUser() {
    var email = localStorage.getItem("yello_current");
    if (!email) return null;
    var found = users().filter(function (u) { return u.email === email; })[0] || null;
    if (!found) localStorage.removeItem("yello_current"); // stale key (user no longer exists)
    return found;
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
        var known = users().filter(function (u) { return u.email === email; })[0];
        if (!known) return fail(f.email, "e_noacc");
        var user = known.pass === h ? known : null;
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
    if (!user) { go("login.html"); return; }
    function val(id, text) { document.getElementById(id).textContent = text; }
    function render() {
      user = currentUser() || user;
      val("pf-name", user.name);
      val("pf-email", user.email);
      val("pf-phone", user.phone || tr("p_none"));
      val("pf-since", new Date(user.created).toLocaleDateString());
      var r = load("yello_ratings", {})[user.email];
      r = Math.max(0, Math.min(5, parseInt(r, 10) || 0));
      val("pf-rating", r ? "★".repeat(r) + "☆".repeat(5 - r) + "  (" + r + "/5)" : tr("p_none"));
      var fl = load("yello_filters", null), parts = [];
      if (fl) {
        if (fl.q) parts.push("“" + fl.q + "”");
        if (fl.cat && fl.cat !== "all") parts.push(fl.cat.replace(/-/g, " "));
        if (fl.price && fl.price !== "all") parts.push(tr("pr_" + fl.price));
      }
      val("pf-filters", parts.length ? parts.join(" · ") : tr("p_none"));
      var cartList = load("yello_cart", []);
      val("pf-cart", String(Array.isArray(cartList) ? cartList.reduce(function (n, i) { return n + (i && i.title ? (parseInt(i.qty, 10) || 1) : 0); }, 0) : 0));
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
      else {
        a.href = "login.html"; a.setAttribute("data-t", "n_login"); a.textContent = tr("n_login");
        var s2 = document.createElement("a");
        s2.className = "nav-tool-btn auth-link"; s2.style.textDecoration = "none";
        s2.href = "signup.html"; s2.setAttribute("data-t", "l_link"); s2.textContent = tr("l_link");
        tools.insertBefore(s2, tools.firstChild);
      }
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

  // ---------- contact form: inline validation (no alerts) ----------
  function initContactForm(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      var f = form.elements, ok = true;
      var name = f.username.value.trim(), email = f.useremail.value.trim(), phone = cleanPhone(f.userphone.value), msg = f.message.value.trim();
      if (!name) ok = fail(f.username, "e_req"); else if (!RE.name.test(name)) ok = fail(f.username, "e_name");
      if (!email) ok = fail(f.useremail, "e_req"); else if (!RE.email.test(email)) ok = fail(f.useremail, "e_email");
      if (!phone) ok = fail(f.userphone, "e_req"); else if (!RE.phone.test(phone)) ok = fail(f.userphone, "e_phone");
      if (!msg) ok = fail(f.message, "e_req"); else if (msg.length < 10) ok = fail(f.message, "e_msg");
      if (!ok) return;
      // keep a copy of the sent message (simple "saved results" in localStorage)
      var sent = load("yello_messages", []);
      sent.push({ name: name, email: email, phone: phone, skin: f.skintype.value, message: msg, date: new Date().toISOString() });
      save("yello_messages", sent);
      // the jQuery handler in script.js shows the spinner + success toast and resets the form
      if (window.jQuery) window.jQuery(form).trigger("formOk");
    });
  }

  // ---------- newsletter popup form (home page) ----------
  function initSubscribe(form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors(form);
      var input = form.elements.popupemail, value = input.value.trim().toLowerCase();
      if (!value) return fail(input, "e_req");
      if (!RE.email.test(value)) return fail(input, "e_email");
      var list = load("yello_subscribers", []);
      if (list.indexOf(value) < 0) { list.push(value); save("yello_subscribers", list); }
      window.yelloMsg("💌 " + tr("m_thanks"));
      input.value = "";
      document.getElementById("popup-overlay").style.display = "none";
    });
  }

  // remove an error message as soon as the user edits that field
  function liveClear(form) {
    form.addEventListener("input", function (e) {
      var box = e.target.closest(".mb-3");
      if (!box) return;
      e.target.classList.remove("is-invalid");
      box.querySelectorAll(".field-error").forEach(function (n) { n.remove(); });
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

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    var su = document.getElementById("signup-form"), li = document.getElementById("login-form");
    if (su || li) {
      if (currentUser()) { go("account.html"); return; }
      if (su) initSignup(su);
      if (li) initLogin(li);
    }
    if (document.getElementById("profile-box")) initProfile();
    var cf = document.getElementById("contact-form"), sf = document.getElementById("subscribe-form");
    if (cf) initContactForm(cf);
    if (sf) initSubscribe(sf);
    [su, li, cf, sf].forEach(function (f) { if (f) liveClear(f); });
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
