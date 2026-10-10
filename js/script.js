document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Form Validation ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("useremail").value.trim();
      const message = document.getElementById("message").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!username || !email || !message) {
        alert("Please fill in all required fields!");
        return;
      }
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address format.");
        return;
      }
      alert("Thank you! Your message has been successfully validated.");
      contactForm.reset();
    });
  }

  // --- 2. Accordion for FAQs or Content Sections ---
  const accordionHeaders = document.querySelectorAll(".accordion-header-custom");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("active");
    });
  });

  // --- 3. Popup Subscription or Contact Form ---
  const popupOverlay = document.getElementById("popup-overlay");
  const openPopupBtn = document.getElementById("open-popup-btn");
  const closePopupBtn = document.getElementById("close-popup-btn");

  if (openPopupBtn && popupOverlay) {
    openPopupBtn.addEventListener("click", () => {
      popupOverlay.style.display = "flex";
    });
  }
  if (closePopupBtn && popupOverlay) {
    closePopupBtn.addEventListener("click", () => {
      popupOverlay.style.display = "none";
    });
  }
  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });
  }

  // --- 4. Change Background Color with JavaScript & localStorage ---
  const bgColorBtn = document.getElementById("bg-color-btn");
  const colors = ["#FFFAED", "#FFF3C4", "#FFE866", "#FFF8E7", "#FFF0F5"];

  let savedColor = localStorage.getItem("yello_bg_color");
  let savedIndex = localStorage.getItem("yello_bg_index");

  if (savedColor) {
    document.body.style.setProperty("background-color", savedColor, "important");
  }

  if (bgColorBtn) {
    let colorIndex = savedIndex ? parseInt(savedIndex) : 0;
    bgColorBtn.addEventListener("click", () => {
      colorIndex = (colorIndex + 1) % colors.length;
      let chosenColor = colors[colorIndex];
      document.body.style.setProperty("background-color", chosenColor, "important");
      localStorage.setItem("yello_bg_color", chosenColor);
      localStorage.setItem("yello_bg_index", colorIndex);
    });
  }

  // --- 5. Display Current Date and Time ---
  const datetimeDisplay = document.getElementById("datetime-display");
  if (datetimeDisplay) {
    function updateDateTime() {
      const now = new Date();
      const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      datetimeDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // --- 6. Custom Pure JS Carousel ---
  const carouselItems = document.querySelectorAll(".carousel-item");
  const prevBtn = document.querySelector(".carousel-control-prev");
  const nextBtn = document.querySelector(".carousel-control-next");
  const indicators = document.querySelectorAll(".carousel-indicators button");

  if (carouselItems.length > 0) {
    let currentIndex = 0;

    function showSlide(index) {
      carouselItems.forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
      if (indicators.length > 0) {
        indicators.forEach((btn, i) => {
          btn.classList.toggle("active", i === index);
        });
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
      });
    }

    indicators.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        currentIndex = index;
        showSlide(currentIndex);
      });
    });
  }
});
