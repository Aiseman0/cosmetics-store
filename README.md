# Yello Beauty — Cosmetics Web Store

Yello Beauty is a responsive, multi-language e-commerce web application for an online cosmetics store. The project features skincare, makeup, and lip care products with an intuitive user interface, real-time external API integrations, interactive filtering, shopping cart with promo codes, and user account management.

Created as part of the Front-End Web Development course final project (Group SE-2506).

**Target audience:** young adults in Kazakhstan who buy skincare and makeup online and want a simple store with delivery information, a cart and a personal account.

---

## 🔗 Live Demo & Links

- **Live Website (GitHub Pages):** [https://aiseman0.github.io/cosmetics-store/](https://aiseman0.github.io/cosmetics-store/)
- **Repository:** [https://github.com/Aiseman0/cosmetics-store](https://github.com/Aiseman0/cosmetics-store)

---

## 👥 Team Members & Contribution

Our team designed and developed a full 8-page web application with modular JavaScript architecture:

| Student Name | Role | Created Pages & Modules | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Aisulu Amanzhol** | Front-End Developer, Designer | `index.html`, `catalog.html`, `cart.html`, `catalog.js`, `cart.js`, `weather.js` | Home page & carousel, 42-item catalog with multi-criteria filtering & sorting, Open Beauty Facts & Open-Meteo API integrations, shopping cart, promo code checkout (`YELLO15`), theme & CSS styling. |
| **Sara Nauash** | Front-End Developer | `about.html`, `contact.html`, `login.html`, `signup.html`, `account.html`, `auth.js`, `script.js` | Brand story, shipping rates, interactive FAQ with live search highlighting, user authentication & profile management (`localStorage`), form validations, EN/RU/KZ localization, and jQuery UX effects. |

### Work division

| Area | Responsible |
| :--- | :--- |
| Design, color palette, CSS and dark theme | Aisulu Amanzhol |
| Home, catalog, cart and checkout pages | Aisulu Amanzhol |
| External APIs (Open-Meteo, Open Beauty Facts) | Aisulu Amanzhol |
| About, Contact, Login, Sign Up and Profile pages | Sara Nauash |
| Authentication, form validation and order history | Sara Nauash |
| Localization (EN/RU/KZ) and jQuery UX effects | Sara Nauash |
| Testing, hosting on GitHub Pages, documentation | Both team members |

---

## 📄 Project Structure & Pages

1. **`index.html` (Home Page)**
  - Hero banner with dynamic time-of-day greetings and animated promotional ticker (`@keyframes marquee`).
  - **Live Skin Weather Widget (`weather.js`)**: Fetches real-time temperature, humidity, and UV index in Astana via Open-Meteo API to provide tailored daily SPF and hydration advice.
  - Core brand guarantees, Featured Brand section (SKIN1004), interactive store star rating, and animated statistics counters.
  - Interactive product showcase carousel and newsletter subscription modal.

2. **`catalog.html` (Products Catalog)**
  - Sticky sidebar navigation and multi-criteria filtering (by category, price range, and ascending/descending price sorting) saved automatically in `localStorage`.
  - Real-time search bar with visual autocomplete suggestions and lazy-loaded product images.
  - **Global Makeup Explorer (`catalog.js`)**: Integrates the Open Beauty Facts API to fetch real cosmetics from around the world (highlighting CIS brands) with offline caching.

3. **`cart.html` (Shopping Cart & Checkout)**
  - Dynamic cart management (add items, adjust quantities, remove items, live subtotal calculation) with Web Audio API sound feedback.
  - Interactive checkout modal with input masks (16-digit card number, `MM/YY` expiry, 3-digit CVV), delivery address validation, and live promo code discount (`YELLO15` for -15%).

4. **`login.html`, `signup.html`, & `account.html` (User Authentication & Profile)**
  - Client-side registration and login system with strict regex validation (name, email, `+7` phone format, password complexity) and password hashing.
  - Personal profile dashboard displaying user details, saved store rating, last catalog search filters, active cart count, and full **Order History**.

5. **`about.html` (About Us)**
  - Brand origin story ("Yello Beauty") and co-founders showcase.
  - Responsive delivery options table across Kazakhstan.
  - Interactive FAQ accordion with live keyword highlighting (`<mark>`).

6. **`contact.html` (Contact Us)**
  - Store location in Astana, working hours, and one-click "Copy to Clipboard" buttons.
  - Contact form pre-filled for logged-in users with inline validation and loading spinner state.

---

## 🛠️ Technical Stack & Features

- **HTML5 & CSS3:** Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), CSS custom properties, Flexbox/Grid layouts, and responsive mobile-first design.
- **JavaScript (ES6+) & jQuery 4.0:** Modular architecture split into functional scripts, `localStorage` state persistence, `AbortController` API timeouts, and smooth DOM animations.
- **Localization & Themes:** Instant switching between **English (EN)**, **Russian (RU)**, and **Kazakh (KZ)** across all pages, plus persistent **Light / Dark Mode**.
- **External APIs:**
  - [Open-Meteo API](https://open-meteo.com/) — Live meteorological data for skincare recommendations.
  - [Open Beauty Facts API](https://world.openbeautyfacts.org/) — Open cosmetics database for global product discovery.

---

## ✅ Project Requirements Checklist

| Requirement | Where it is implemented |
| :--- | :--- |
| 6+ connected pages | 8 pages, linked through the navigation bar |
| Responsiveness | Flexbox, CSS Grid and media queries in `css/style.css` |
| Light / Dark mode | Toggle button, saved in `localStorage` (`yello_theme`) on every page |
| Authentication simulation | `signup.html`, `login.html`, `account.html` (`localStorage`) |
| Form validation | `js/auth.js` and `js/cart.js`: email, phone, password, required fields; errors shown on the page, forms use `novalidate` |
| Search / filtering | Catalog search, category, price and sorting; last filters saved in `localStorage` |
| Animations and hover effects | Buttons, cards, ticker, counters and carousel |
| External API | Open-Meteo and Open Beauty Facts with loading state and error handling |

> Note: the demo store does not process real payments. Card data is only validated and never saved (only the last 4 digits are kept in the order history).

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
├── img/                # Team photos 
└── README.md           # Project Documentation
