document.addEventListener("DOMContentLoaded", () => {

  const savedBgColor = localStorage.getItem("yello_bg_color");
  if (savedBgColor) {
    document.body.classList.remove("bg-light");
    document.body.style.setProperty("background-color", savedBgColor, "important");
  }

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
        alert("Please enter a valid email address format (e.g., example@mail.com).");
        return;
      }
      alert("Thank you! Your message has been successfully validated and sent.");
      contactForm.reset();
    });
  }


  const accordionHeaders = document.querySelectorAll(".accordion-header-custom");
  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      item.classList.toggle("active");
      const body = item.querySelector(".accordion-body-custom");

      if (item.classList.contains("active")) {
        body.style.maxHeight = body.scrollHeight + "px";
        body.style.padding = "10px 14px";
      } else {
        body.style.maxHeight = "0";
        body.style.padding = "0 14px";
      }
    });
  });


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

  const bgColorBtn = document.getElementById("bg-color-btn");
  if (bgColorBtn) {
    const colors = ["#FFFAED", "#FFF3C4", "#FFE866", "#FFF8E7", "#FFF0F5"];

    let colorIndex = parseInt(localStorage.getItem("yello_bg_index")) || 0;

    bgColorBtn.addEventListener("click", () => {

      colorIndex = (colorIndex + 1) % colors.length;
      let chosenColor = colors[colorIndex];

      document.body.classList.remove("bg-light");
      document.body.style.setProperty("background-color", chosenColor, "important");
      localStorage.setItem("yello_bg_color", chosenColor);
      localStorage.setItem("yello_bg_index", colorIndex);
    });
  }

  const datetimeDisplay = document.getElementById("datetime-display");
  if (datetimeDisplay) {
    function updateDateTime() {
      const now = new Date();
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      datetimeDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  const carousel = document.getElementById("beautyCarousel");
  if (carousel) {
    const items = carousel.querySelectorAll(".carousel-item");
    const indicators = carousel.querySelectorAll(".carousel-indicators button");
    const prevBtn = carousel.querySelector(".carousel-control-prev");
    const nextBtn = carousel.querySelector(".carousel-control-next");
    let currentIndex = 0;

    function showSlide(index) {
      items.forEach(item => item.classList.remove("active"));
      indicators.forEach(btn => btn.classList.remove("active"));

      items[index].classList.add("active");
      indicators[index].classList.add("active");
      currentIndex = index;
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        let next = (currentIndex + 1) % items.length;
        showSlide(next);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        let prev = (currentIndex - 1 + items.length) % items.length;
        showSlide(prev);
      });
    }

    indicators.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        showSlide(idx);
      });
    });
  }
});
