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

      alert("Thank you! Your message has been successfully verified and sent.");
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

});
