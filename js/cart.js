/* Yello Beauty — cart.js
   Cart (add / change quantity / remove), checkout form with card details and promo code,
   order history in the profile. Loaded after js/script.js and js/auth.js on every page.
   Demo store: the card number and CVV are only validated, they are NEVER saved
   (only the last 4 digits are kept in the order). */
(function () {
  "use strict";
  if (window.__yelloCartLoaded) return;
  window.__yelloCartLoaded = true;
  console.log("Yello cart: loaded");

  var CART_KEY = "yello_cart";
  var ORDERS_KEY = "yello_orders";
  var USER_KEY = "yello_current";
  var PROMO_CODE = "YELLO15";
  var PROMO_RATE = 0.15;

  // texts used by the cart (own copy, so it works even without auth.js): key -> [EN, RU, KZ]
  var CD = {
    n_login: ["Log In", "Войти", "Кіру"],
    l_link: ["Sign Up", "Регистрация", "Тіркелу"],
    p_logout: ["Log Out", "Выйти", "Шығу"],
    p_shop: ["Go to Catalog", "Перейти в каталог", "Каталогқа өту"],
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

  // ---------- helpers ----------
  function tr(key) {
    if (CD[key]) { var l = localStorage.getItem("yello_lang") || "en"; return CD[key][l === "ru" ? 1 : l === "kz" ? 2 : 0]; }
    return window.yelloT ? window.yelloT(key) : key;
  }
  function toast(text) {
    var box = document.getElementById("toast-container");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-container"; box.className = "toast-container";
      document.body.appendChild(box);
    }
    var t = document.createElement("div");
    t.className = "toast-msg";
    t.style.display = "block";
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
    t.textContent = text;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "1"; }, 10);
    setTimeout(function () { t.style.opacity = "0"; }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3100);
  }
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }
  function money(n) { return (Number(n) || 0).toLocaleString("en-US") + " ₸"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function $id(id) { return document.getElementById(id); }
  function userEmail() { return localStorage.getItem(USER_KEY); }

  // ---------- cart data: [{title, price, qty}] ----------
  function getCart() {
    var raw = read(CART_KEY, []);
    if (!Array.isArray(raw)) return [];
    var map = {}, out = [];
    raw.forEach(function (it) {
      if (!it || !it.title) return;
      var title = String(it.title);
      var price = parseInt(it.price, 10) || 0;
      var qty = parseInt(it.qty, 10) || 1;       // old carts had no qty
      if (map[title]) { map[title].qty += qty; }
      else { map[title] = { title: title, price: price, qty: qty }; out.push(map[title]); }
    });
    return out;
  }
  function saveCart(cart) { write(CART_KEY, cart); refreshAll(); }
  function cartCount(cart) { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartSum(cart) { return cart.reduce(function (n, i) { return n + i.price * i.qty; }, 0); }

  function updateBadge() {
    var badge = $id("cart-count");
    if (badge) badge.textContent = String(cartCount(getCart()));
  }

  // ---------- sound ----------
  function beep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) { /* audio blocked */ }
  }

  // ---------- add to cart (works on every page, also for cards moved by filters) ----------
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".add-to-cart-btn, .product-card .btn");
    if (!btn) return;
    var card = btn.closest(".product-card");
    if (!card) return;

    var titleEl = card.querySelector(".card-title");
    var priceEl = card.querySelector(".product-price");
    if (!titleEl || !priceEl) return;
    var title = titleEl.textContent.trim();
    var price = parseInt(priceEl.textContent.replace(/[^\d]/g, ""), 10) || 0;

    btn.style.transform = "scale(0.92)";
    setTimeout(function () { btn.style.transform = ""; }, 150);
    beep();

    var cart = getCart(), found = null;
    cart.forEach(function (i) { if (i.title === title) found = i; });
    if (found) found.qty += 1; else cart.push({ title: title, price: price, qty: 1 });
    saveCart(cart);
    toast("🛒 " + title + " — " + tr("c_added"));
  });

  // ---------- cart page ----------
  var itemsBox = $id("cart-page-items");
  var totalBox = $id("cart-page-total");

  function renderCartPage() {
    if (!itemsBox) return;
    var cart = getCart();
    if (!cart.length) {
      itemsBox.innerHTML = '<div class="cart-empty"><p class="text-muted">' + esc(tr("c_empty")) +
        '</p><a href="catalog.html" class="btn btn-warning">' + esc(tr("p_shop")) + '</a></div>';
    } else {
      var html = "";
      cart.forEach(function (it, i) {
        html += '<div class="cart-row" data-index="' + i + '">' +
          '<div><span class="cart-name">' + esc(it.title) + '</span><span class="cart-unit">' + money(it.price) + '</span></div>' +
          '<div class="cart-qty">' +
            '<button type="button" class="qty-btn" data-act="dec" aria-label="−">−</button>' +
            '<span class="cart-qty-num">' + it.qty + '</span>' +
            '<button type="button" class="qty-btn" data-act="inc" aria-label="+">+</button>' +
          '</div>' +
          '<div class="cart-line-total">' + money(it.price * it.qty) + '</div>' +
          '<button type="button" class="btn btn-sm btn-outline-danger" data-act="remove">' + esc(tr("c_remove")) + '</button>' +
        '</div>';
      });
      itemsBox.innerHTML = html;
    }
    if (totalBox) totalBox.textContent = cartSum(cart).toLocaleString("en-US");
    var clearBtn = $id("clear-cart-btn");
    if (clearBtn) clearBtn.style.display = cart.length ? "" : "none";
  }

  if (itemsBox) {
    itemsBox.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var row = btn.closest(".cart-row");
      var idx = row ? parseInt(row.getAttribute("data-index"), 10) : -1;
      var cart = getCart();
      if (!cart[idx]) return;
      var act = btn.getAttribute("data-act");
      if (act === "inc") cart[idx].qty += 1;
      else if (act === "dec") { cart[idx].qty -= 1; if (cart[idx].qty <= 0) cart.splice(idx, 1); }
      else if (act === "remove") cart.splice(idx, 1);
      saveCart(cart);
    });
  }

  var clearBtn = $id("clear-cart-btn");
  if (clearBtn) clearBtn.addEventListener("click", function () { saveCart([]); });

  // ---------- checkout modal ----------
  var modal = $id("checkout-modal");
  var form = $id("checkout-form");
  var addressEl = $id("order-address"), promoEl = $id("order-promo"), cardEl = $id("order-card");
  var expEl = $id("order-exp"), cvvEl = $id("order-cvv"), hintEl = $id("promo-hint");

  function promoState() {
    var code = promoEl ? promoEl.value.trim().toUpperCase() : "";
    return { code: code, ok: code === PROMO_CODE };
  }
  function totals() {
    var sub = cartSum(getCart()), p = promoState();
    var discount = p.ok ? Math.round(sub * PROMO_RATE) : 0;
    return { sub: sub, discount: discount, total: sub - discount, promo: p.ok ? p.code : "" };
  }
  function updateTotals() {
    if (!modal) return;
    var t = totals(), p = promoState();
    $id("modal-subtotal").textContent = t.sub.toLocaleString("en-US");
    $id("modal-discount").textContent = t.discount.toLocaleString("en-US");
    $id("modal-final-total").textContent = t.total.toLocaleString("en-US");
    if (hintEl) {
      hintEl.classList.remove("ck-ok", "ck-bad");
      if (!p.code) { hintEl.setAttribute("data-t", "ck_promo_hint"); hintEl.textContent = tr("ck_promo_hint"); }
      else {
        hintEl.removeAttribute("data-t");
        hintEl.classList.add(p.ok ? "ck-ok" : "ck-bad");
        hintEl.textContent = tr(p.ok ? "ck_promo_ok" : "ck_promo_bad");
      }
    }
  }

  function clearErrors() {
    if (!form) return;
    form.querySelectorAll(".field-error").forEach(function (n) { n.remove(); });
    form.querySelectorAll(".is-invalid").forEach(function (n) { n.classList.remove("is-invalid"); });
  }
  function fail(input, key) {
    input.classList.add("is-invalid");
    var box = input.closest(".ck-field") || input.parentNode;
    var m = document.createElement("div");
    m.className = "field-error";
    m.setAttribute("data-t", key);
    m.textContent = tr(key);
    box.appendChild(m);
    return false;
  }

  function openModal() {
    var cart = getCart();
    if (!cart.length) { toast(tr("c_empty")); return; }
    if (!userEmail()) {
      toast(tr("c_login_pay"));
      setTimeout(function () { window.location.href = "login.html"; }, 1200);
      return;
    }
    clearErrors();
    updateTotals();
    modal.style.display = "flex";
    if (addressEl) addressEl.focus();
  }
  function closeModal() { if (modal) modal.style.display = "none"; }

  function resetForm() {
    if (form) form.reset();
    clearErrors();
    updateTotals();
  }

  if (modal && form) {
    var openBtn = $id("open-checkout-modal"), closeBtn = $id("close-checkout-modal");
    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    // input masks
    cardEl.addEventListener("input", function () {
      var d = this.value.replace(/\D/g, "").slice(0, 16);
      this.value = d.replace(/(.{4})/g, "$1 ").trim();
    });
    expEl.addEventListener("input", function () {
      var d = this.value.replace(/\D/g, "").slice(0, 4);
      this.value = d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
    });
    cvvEl.addEventListener("input", function () { this.value = this.value.replace(/\D/g, "").slice(0, 3); });

    // promo code (live + button)
    promoEl.addEventListener("input", updateTotals);
    var applyBtn = $id("apply-promo");
    if (applyBtn) applyBtn.addEventListener("click", function () {
      updateTotals();
      var p = promoState();
      if (p.code) toast(tr(p.ok ? "ck_promo_ok" : "ck_promo_bad"));
    });

    // remove the error as soon as the field is edited
    form.addEventListener("input", function (e) {
      var box = e.target.closest(".ck-field");
      if (!box) return;
      e.target.classList.remove("is-invalid");
      box.querySelectorAll(".field-error").forEach(function (n) { n.remove(); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      var ok = true;

      var address = addressEl.value.trim();
      if (address.length < 5) ok = fail(addressEl, "ck_e_addr");

      var digits = cardEl.value.replace(/\D/g, "");
      if (digits.length !== 16) ok = fail(cardEl, "ck_e_card");

      var m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expEl.value.trim());
      if (!m) ok = fail(expEl, "ck_e_exp");
      else if (new Date(2000 + parseInt(m[2], 10), parseInt(m[1], 10), 1) <= new Date()) ok = fail(expEl, "ck_e_exp_old");

      if (!/^\d{3}$/.test(cvvEl.value)) ok = fail(cvvEl, "ck_e_cvv");
      if (!ok) return;

      var email = userEmail();
      var cart = getCart();
      if (!email) { toast(tr("c_login_pay")); return; }
      if (!cart.length) { toast(tr("c_empty")); return; }

      var t = totals();
      var last4 = digits.slice(-4);
      var submit = form.querySelector("button[type=submit]");
      submit.disabled = true;
      submit.removeAttribute("data-t");
      submit.textContent = tr("ck_processing");

      setTimeout(function () {
        var all = read(ORDERS_KEY, {});
        if (!all || typeof all !== "object" || Array.isArray(all)) all = {};
        if (!Array.isArray(all[email])) all[email] = [];
        all[email].push({
          id: Date.now(),
          ts: new Date().toISOString(),
          items: cart.map(function (i) { return { title: i.title, price: i.price, qty: i.qty }; }),
          subtotal: t.sub,
          discount: t.discount,
          promo: t.promo,
          total: t.total,
          address: address,
          card: last4,                 // only the last 4 digits are stored
          status: "paid"
        });
        write(ORDERS_KEY, all);

        write(CART_KEY, []);
        resetForm();                   // wipes card number / CVV from the form
        closeModal();
        submit.disabled = false;
        submit.setAttribute("data-t", "ck_pay");
        submit.textContent = tr("ck_pay");
        refreshAll();
        toast(tr("ck_done") + " " + money(t.total));
        setTimeout(function () { window.location.href = "account.html"; }, 1500);
      }, 900);
    });
  }

  // ---------- order history (account page) ----------
  function fmtDate(o) {
    if (!o.ts) return o.date || "";
    var loc = { en: "en-GB", ru: "ru-RU", kz: "kk-KZ" }[localStorage.getItem("yello_lang") || "en"] || "en-GB";
    try { return new Date(o.ts).toLocaleString(loc); } catch (e) { return o.ts; }
  }

  function renderOrders() {
    var box = $id("orders-history-list");
    if (!box) return;
    var email = userEmail();
    var all = read(ORDERS_KEY, {});
    var list = (email && all && Array.isArray(all[email])) ? all[email] : [];
    if (!list.length) {
      box.innerHTML = '<p class="text-muted small">' + esc(tr("ord_none")) + '</p>';
      return;
    }
    var html = "";
    for (var i = list.length - 1; i >= 0; i--) {
      var o = list[i];
      var status = o.status === "paid" || !o.status ? tr("ord_paid") : o.status;
      html += '<div class="order-card">' +
        '<div class="order-head"><span>' + esc(tr("ord_n")) + ' #' + (i + 1) + '</span><span class="order-date">' + esc(fmtDate(o)) + '</span></div>' +
        '<div class="order-meta">' + esc(tr("ord_addr")) + ' ' + esc(o.address) + '</div>' +
        (o.card ? '<div class="order-meta">' + esc(tr("ord_card")) + ' •••• ' + esc(o.card) + '</div>' : '') +
        (o.promo ? '<div class="order-meta">' + esc(tr("ord_promo")) + ' ' + esc(o.promo) + ' (−' + money(o.discount) + ')</div>' : '') +
        '<ul class="order-items">';
      (o.items || []).forEach(function (it) {
        var qty = parseInt(it.qty, 10) || 1, price = parseInt(it.price, 10) || 0;
        html += '<li><span>' + esc(it.title) + ' × ' + qty + '</span><span>' + money(price * qty) + '</span></li>';
      });
      html += '</ul><div class="order-foot"><span>' + esc(tr("ord_status")) + ' <span class="order-status">' + esc(status) +
        '</span></span><span>' + esc(tr("ord_total")) + ' ' + money(o.total) + '</span></div></div>';
    }
    box.innerHTML = html;
  }

  // ---------- top bar: "Log In" + "Sign Up" (or the user name) ----------
  function ensureAuthLinks() {
    var tools = document.querySelector(".nav-tools");
    if (!tools || tools.querySelector(".auth-link")) return;
    var email = userEmail(), name = "";
    (read("yello_users", []) || []).forEach(function (u) { if (u.email === email) name = u.name; });
    function link(href, text) {
      var a = document.createElement("a");
      a.className = "nav-tool-btn auth-link"; a.style.textDecoration = "none";
      a.href = href; a.textContent = text; return a;
    }
    var first = tools.firstChild;
    if (email) tools.insertBefore(link("account.html", "👤 " + (name || email).split(" ")[0]), first);
    else {
      tools.insertBefore(link("signup.html", tr("l_link")), first);
      tools.insertBefore(link("login.html", tr("n_login")), tools.firstChild);
    }
  }

  // ---------- redraw everything ----------
  function refreshAll() {
    updateBadge();
    renderCartPage();
    if (modal && modal.style.display === "flex") updateTotals();
  }

  document.querySelectorAll(".site-lang-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      setTimeout(function () { refreshAll(); renderOrders(); updateTotals(); }, 0);
    });
  });
  window.addEventListener("storage", function () { refreshAll(); renderOrders(); }); // other tab changed the cart

  function init() { refreshAll(); renderOrders(); setTimeout(ensureAuthLinks, 0); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
