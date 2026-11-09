# Yello Beauty — Cosmetics Web Store

Yello Beauty is a responsive, multi-language e-commerce web application for an online cosmetics store. The project features skincare, makeup, and lip care products with an intuitive user interface, real-time external API integrations, interactive filtering, shopping cart with promo codes, and user account management.

Created as part of the Front-End Web Development course project (Group SE-2506)[cite: 12, 13, 14, 15].

---

## 🔗 Live Demo & Links

- **GitHub Pages (Live Site):** [https://aiseman0.github.io/cosmetics-store/]
- **Repository:** [https://github.com/Aiseman0/cosmetics-store.git]

---

## 👥 Team Members & Contribution

Our team designed and developed a full 8-page web application with modular JavaScript architecture:

| Student Name | Role | Created Pages & Modules | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Aisulu Amanzhol** | Front-End Developer | `index.html`, `catalog.html`, `cart.html`, `catalog.js`, `cart.js`, `weather.js` | Home page & carousel, 42-item catalog with multi-criteria filtering & sorting, Open Beauty Facts & Open-Meteo API integrations, shopping cart, promo code checkout (`YELLO15`), theme & CSS styling[cite: 14, 16, 17, 18, 20]. |
| **Sara Nauash** | Front-End Developer | `about.html`, `contact.html`, `login.html`, `signup.html`, `account.html`, `auth.js`, `script.js` | Brand story, shipping rates, interactive FAQ with live search highlighting, user authentication & profile management (`localStorage`), form validations, EN/RU/KZ localization, and jQuery UX effects[cite: 12, 13, 15, 19, 20]. |

---

## 📄 Project Structure & Pages

1. **`index.html` (Home Page)**
  - Hero banner with dynamic time-of-day greetings and animated promotional ticker (`@keyframes marquee`)[cite: 12, 20].
  - **Live Skin Weather Widget (`weather.js`)**: Fetches real-time temperature, humidity, and UV index in Astana via Open-Meteo API to provide tailored daily SPF and hydration advice[cite: 16].
  - Core brand guarantees, Featured Brand section (SKIN1004), interactive store star rating, and animated statistics counters[cite: 19, 20].
  - Interactive product showcase carousel and newsletter subscription modal[cite: 19, 20].

2. **`catalog.html` (Products Catalog)**
  - Sticky sidebar navigation and multi-criteria filtering (by category, price range, and ascending/descending price sorting) saved automatically in `localStorage`[cite: 17].
  - Real-time search bar with visual autocomplete suggestions and lazy-loaded product images[cite: 17, 20].
  - **Global Makeup Explorer (`catalog.js`)**: Integrates the Open Beauty Facts API to fetch real cosmetics from around the world (highlighting CIS brands) with offline caching[cite: 17].

3. **`cart.html` (Shopping Cart & Checkout)**
  - Dynamic cart management (add items, adjust quantities, remove items, live subtotal calculation) with Web Audio API sound feedback[cite: 14, 18].
  - Interactive checkout modal with input masks (16-digit card number, `MM/YY` expiry, 3-digit CVV), delivery address validation, and live promo code discount (`YELLO15` for -15%)[cite: 14, 18].

4. **`login.html`, `signup.html`, & `account.html` (User Authentication & Profile)**
  - Client-side registration and login system with strict regex validation (name, email, `+7` phone format, password complexity) and password hashing[cite: 12, 13, 19].
  - Personal profile dashboard displaying user details, saved store rating, last catalog search filters, active cart count, and full **Order History**[cite: 15, 18, 19].

5. **`about.html` (About Us)**
  - Brand origin story ("Yello Beauty") and co-founders showcase[cite: 20].
  - Responsive delivery options table across Kazakhstan[cite: 20].
  - Interactive FAQ accordion with live keyword highlighting (`<mark>`)[cite: 20].

6. **`contact.html` (Contact Us)**
  - Store location in Astana, working hours, and one-click "Copy to Clipboard" buttons[cite: 20].
  - Contact form pre-filled for logged-in users with inline validation and loading spinner state[cite: 19, 20].

---

## 🛠️ Technical Stack & Features

- **HTML5 & CSS3:** Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), CSS custom properties, Flexbox/Grid layouts, and responsive mobile-first design[cite: 12, 13, 14, 15].
- **JavaScript (ES6+) & jQuery 4.0:** Modular architecture split into functional scripts, `localStorage` state persistence, `AbortController` API timeouts, and smooth DOM animations[cite: 12, 16, 17, 20].
- **Localization & Themes:** Instant switching between **English (EN)**, **Russian (RU)**, and **Kazakh (KZ)** across all pages, plus persistent **Light / Dark Mode**[cite: 12, 19, 20].
- **External APIs:**
  - [Open-Meteo API](https://open-meteo.com/) — Live meteorological data for skincare recommendations[cite: 16].
  - [Open Beauty Facts API](https://world.openbeautyfacts.org/) — Open cosmetics database for global product discovery[cite: 17].

---

## 📁 Repository File Structure

```text
cosmetics-store/
├── index.html          # Main Landing Page & Skin Weather Widget
├── catalog.html        # Product Catalog, Filters & Open Beauty Facts API
├── cart.html           # Shopping Cart & Checkout Modal
├── login.html          # User Login Page
├── signup.html         # User Registration Page
├── account.html        # User Profile Dashboard & Order History
├── about.html          # Brand Story, Shipping Table & Searchable FAQ
├── contact.html        # Contact Form & Store Location
├── css/
│   └── style.css       # Custom Stylesheet, Dark Mode & Responsive Rules
├── js/
│   ├── script.js       # Core UI, i18n (EN/RU/KZ), Theme, Carousel & jQuery UX
│   ├── auth.js         # Authentication, Profile, Form Validation & Ratings
│   ├── catalog.js      # Catalog Filtering, Sorting & Open Beauty Facts API
│   ├── cart.js         # Cart State, Checkout Validation & Order History
│   └── weather.js      # Open-Meteo Weather API & Skincare Tips
├── img/                # Team photos and product assets
└── README.md           # Project Documentation
