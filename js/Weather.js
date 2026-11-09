/* Yello Beauty - weather.js
   External API #2: Open-Meteo (https://open-meteo.com, free, no API key).
   Shows today's weather in Astana and turns it into skincare advice (SPF, hydration).
   Has a loading state, an 8 s timeout, error handling and an offline fallback from localStorage. */
(function () {
  "use strict";

  var grid = document.getElementById("weather-grid");
  if (!grid) return; // only the home page has this section

  var statusEl = document.getElementById("weather-status");
  var tipEl = document.getElementById("weather-tip");
  var retryBtn = document.getElementById("weather-retry");

  var URL = "https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45" +
    "&current=temperature_2m,relative_humidity_2m&daily=uv_index_max&timezone=auto&forecast_days=1";
  var CACHE_KEY = "yello_weather";

  var tr = function (key) { return window.yelloT ? window.yelloT(key) : key; };
  var weather = null;      // { temp, humidity, uv }
  var state = "loading";   // loading | ok | cached | error

  // ---- helpers ----
  function readCache() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { return null; }
  }

  function makeCard(icon, label, value) {
    var card = document.createElement("div");
    card.className = "weather-card";
    var i = document.createElement("div"); i.className = "weather-icon"; i.textContent = icon;
    var v = document.createElement("div"); v.className = "weather-value"; v.textContent = value;
    var l = document.createElement("div"); l.className = "weather-label"; l.textContent = label;
    card.appendChild(i); card.appendChild(v); card.appendChild(l);
    return card;
  }

  // weather numbers -> short skincare advice
  function buildTip(w) {
    var parts = [];
    if (w.uv >= 8) parts.push(tr("w_uv_xhigh"));
    else if (w.uv >= 6) parts.push(tr("w_uv_high"));
    else if (w.uv >= 3) parts.push(tr("w_uv_mid"));
    else parts.push(tr("w_uv_low"));

    if (w.humidity < 35) parts.push(tr("w_h_dry"));
    else if (w.humidity > 70) parts.push(tr("w_h_wet"));
    else parts.push(tr("w_h_ok"));

    if (w.temp < 0) parts.push(tr("w_cold"));
    return parts.join(" ");
  }

  // ---- draw the current state ----
  function render() {
    grid.innerHTML = "";
    retryBtn.style.display = "none";
    tipEl.style.display = "none";

    if (state === "loading") { statusEl.textContent = tr("w_load"); return; }

    if (state === "error") {
      statusEl.textContent = tr("w_err");
      retryBtn.style.display = "inline-block";
      return;
    }

    statusEl.textContent = state === "cached" ? tr("w_cached") : tr("w_ok");
    grid.appendChild(makeCard("🌡️", tr("w_temp"), Math.round(weather.temp) + " °C"));
    grid.appendChild(makeCard("💧", tr("w_hum"), Math.round(weather.humidity) + " %"));
    grid.appendChild(makeCard("☀️", tr("w_uv"), String(Math.round(weather.uv * 10) / 10)));
    tipEl.textContent = "✨ " + buildTip(weather);
    tipEl.style.display = "block";
    if (state === "cached") retryBtn.style.display = "inline-block";
  }

  // ---- request ----
  function load() {
    state = "loading";
    render();

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);

    fetch(URL, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data.current || !data.daily) throw new Error("Unexpected response");
        weather = {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          uv: (data.daily.uv_index_max || [0])[0] || 0
        };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(weather)); } catch (e) { /* storage full or blocked */ }
        state = "ok";
        render();
      })
      .catch(function () {
        clearTimeout(timer);
        var cached = readCache();
        if (cached) { weather = cached; state = "cached"; } else { state = "error"; }
        render();
      });
  }

  retryBtn.addEventListener("click", load);
  // re-draw texts when the language changes
  document.querySelectorAll(".site-lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { setTimeout(render, 0); });
  });

  load();
})();
