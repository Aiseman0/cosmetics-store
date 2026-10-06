# Yello Beauty — Cosmetics Web Store

Yello Beauty is a responsive e-commerce web application for an online cosmetics store. The project features skincare, makeup, and lip care products with an intuitive user interface, interactive category navigation, product showcases, and contact options.

Created as part of the Front-End Web Development course project (Group SE-2506).

---

## 🔗 Live Demo & Links

- **GitHub Pages (Live Site):** [https://aiseman0.github.io/cosmetics-store/]
- **Repository:** [https://github.com/Aiseman0/cosmetics-store.git]

---

## 👥 Team Members & Contribution

In accordance with course requirements (minimum 2 HTML pages per team member), our team built 4 complete pages:

| Student Name | Role | Created Pages | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Aisulu Amanzhol** | Front-End Developer | `index.html`, `catalog.html` | Home page layout, interactive product carousel, cosmetics catalog with category filters, design theme & CSS styling. |
| **Sara Nauash** | Front-End Developer | `about.html`, `contact.html` | Brand story, creators showcase, delivery pricing table, interactive contact form with validation, and direct channels. |

---

## 📄 Project Structure & Pages

1. **`index.html` (Home Page)**
   - Hero banner with promotional announcements.
   - Animated ticker banner (`@keyframes marquee`).
   - Core value highlights and brand guarantees.
   - Featured Brand section (SKIN1004).
   - Full 9-item interactive product carousel built with Bootstrap Carousel.

2. **`catalog.html` (Products Catalog)**
   - Sticky sidebar navigation for smooth scrolling to categories.
   - 15 products categorized into Skincare & Serums, Face & Eye Makeup, and Lip Care & Tints.
   - Product cards with hover effects and price details.

3. **`about.html` (About Us)**
   - Brand origin story ("Yello Beauty").
   - Co-founders presentation cards (Sara & Aisulu).
   - Responsive delivery options table with shipping rates across Kazakhstan.

4. **`contact.html` (Contact Us)**
   - Store address and working hours in Astana.
   - Functional contact form with native HTML5 validation (`required`, `type="email"`, `<select>`, `<input type="color">`).
   - Quick contact buttons (WhatsApp, Telegram, Direct Call).

---

## 🛠️ Technical Stack & Features

- **HTML5:** Semantic element architecture (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<footer>`).
- **CSS3 & Bootstrap 5.3:** Custom CSS variables, responsive typography using relative units (`rem`, `em`), custom Flexbox layouts, and Bootstrap framework utilities.
- **Responsiveness:** Full cross-device layout adaptation using mobile-first media queries (`@media (min-width: 768px)` and `@media (min-width: 992px)`).
- **Interactivity:** Custom CSS hover transformations, smooth scrolling (`scroll-behavior: smooth`), and Bootstrap JavaScript components (Collapsible Navbar, Carousel).

---

## 📁 Repository File Structure

```text
cosmetics-store/
├── index.html        # Main Landing Page
├── catalog.html      # Product Catalog Page
├── about.html        # Brand Story & Shipping Info Page
├── contact.html      # Contact Form & Location Page
├── css/
│   └── style.css     # Main Custom Stylesheet
├── img/              # Team member photos and project assets
└── README.md         # Project Documentation
