<<<<<<< HEAD
/* Yello Beauty - script.js
   Shared UI logic for every page: accordion, popup, carousel, cart, theme (light/dark),
   language (EN/RU/KZ), keyboard navigation and the jQuery UX effects.
   Loaded first; js/auth.js (forms, login, profile) and js/catalog.js (filters, API) come after it. */
/* ===== cart / checkout / orders (same code as js/cart.js, guarded against double loading) ===== */
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

  // ---------- helpers ----------
  function tr(key) { return window.yelloT ? window.yelloT(key) : key; }
  function toast(text) { if (window.yelloMsg) window.yelloMsg(text); else window.alert(text); }
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

  function init() { refreshAll(); renderOrders(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();


=======
>>>>>>> 066cdb454d3231a4405b1806ef1c9df9354cca99
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
      if (document.body.classList.contains("dark-mode")) return; // Не меняем цвет в темном режиме
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

<<<<<<< HEAD
  // C/D. Cart, checkout and order history now live in js/cart.js
=======
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
>>>>>>> 066cdb454d3231a4405b1806ef1c9df9354cca99

  // E. Keyboard Event Handling
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

<<<<<<< HEAD
  // F. Star rating is handled (and saved) in auth.js

  // ==========================================
  // NEW: DARK / LIGHT THEME
  // ==========================================
  var themeBtn = document.getElementById("theme-btn");
  var currentTheme = localStorage.getItem("yello_theme") || "light";

  function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
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

  // Images that already failed before the handler above was attached (e.g. no internet)
  document.querySelectorAll("img").forEach(function(img) {
    if (img.complete && img.naturalWidth === 0 && !img.getAttribute("data-fallback") &&
        !$(img).closest(".api-img, .suggestions-list").length) {
      img.setAttribute("data-fallback", "1");
      img.src = makePlaceholder(img.alt);
      $(img).addClass("loaded");
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
=======
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
>>>>>>> 066cdb454d3231a4405b1806ef1c9df9354cca99
          }
        });
      });
    });
  }

<<<<<<< HEAD
  // (add-to-cart toast is shown by js/cart.js)


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
=======
  // ==========================================
  // 7. ЛОГИКА ТЕМНОЙ ТЕМЫ И КНОПОК
  // ==========================================
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    if (localStorage.getItem("yello_theme") === "dark") {
      document.body.classList.add("dark-mode");
      themeBtn.innerText = "☀️";
>>>>>>> 066cdb454d3231a4405b1806ef1c9df9354cca99
    }

    themeBtn.addEventListener("click", function() {
      document.body.classList.toggle("dark-mode");
      var isDark = document.body.classList.contains("dark-mode");

      if (isDark) {
        localStorage.setItem("yello_theme", "dark");
        themeBtn.innerText = "☀️";
      } else {
        localStorage.setItem("yello_theme", "light");
        themeBtn.innerText = "🌙";
      }
    });
  }

  // --- 8. Кнопки выбора языка ---
  var siteLangButtons = document.querySelectorAll(".site-lang-btn");
  var savedLang = localStorage.getItem("yello_lang") || "en";

  siteLangButtons.forEach(function(btn) {
    if (btn.getAttribute("data-lang") === savedLang) {
      btn.classList.add("active-lang");
    }

    btn.addEventListener("click", function() {
      siteLangButtons.forEach(b => b.classList.remove("active-lang"));
      this.classList.add("active-lang");

      var selectedLang = this.getAttribute("data-lang");
      localStorage.setItem("yello_lang", selectedLang);

      if (window.yelloMsg) {
        window.yelloMsg("Language changed to: " + selectedLang.toUpperCase());
      }
    });
  });

  // --- 9. Розово-фиолетово-синяя линия прогресса скролла ---
  var scrollLine = document.getElementById("scroll-progress-line");
  if (!scrollLine) {
    scrollLine = document.createElement("div");
    scrollLine.id = "scroll-progress-line";
    scrollLine.style.position = "fixed";
    scrollLine.style.top = "0";
    scrollLine.style.left = "0";
    scrollLine.style.height = "4px";
    scrollLine.style.width = "0%";
    scrollLine.style.background = "linear-gradient(to right, #ff758c, #ff7eb3, #764ba2, #667eea)";
    scrollLine.style.zIndex = "99999";
    scrollLine.style.transition = "width 0.1s ease-out";
    document.body.prepend(scrollLine);
  }

  window.addEventListener("scroll", function() {
    var winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      var scrolled = (winScroll / height) * 100;
      scrollLine.style.width = scrolled + "%";
    }
  });

});
