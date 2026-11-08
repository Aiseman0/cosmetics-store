/* ===== catalog.js ===== */
/* Yello Beauty — catalog.js
   1) Search + category + price filter + sorting, saved in localStorage
   2) External API: Open Beauty Facts (https://world.openbeautyfacts.org) */
$(function () {
  var $q = $("#product-search");
  if ($q.length === 0) return;

  var tr = window.yelloT || function (k) { return k; };

  // ================= 1. FILTERS =================
  var KEY = "yello_filters";
  var $cat = $("#cat-filter"), $price = $("#price-filter"), $sort = $("#sort-filter");
  var ranges = { all: [0, 1e9], "1": [0, 6999], "2": [7000, 12000], "3": [12001, 1e9] };

  $(".product-card").closest(".col-md-4").each(function (i) { $(this).attr("data-idx", i); });

  function priceOf($col) { return parseInt($col.find(".product-price").text().replace(/[^\d]/g, ""), 10) || 0; }

  function applyFilters() {
    var text = $q.val().toLowerCase().trim();
    var cat = $cat.val(), priceKey = $price.val(), sort = $sort.val();
    var range = ranges[priceKey] || ranges.all;

    $(".category-heading").each(function () {
      var $h = $(this), $row = $h.next(".row");
      var cols = $row.children(".col-md-4").get();

      cols.sort(function (a, b) {
        if (sort === "asc") return priceOf($(a)) - priceOf($(b));
        if (sort === "desc") return priceOf($(b)) - priceOf($(a));
        return $(a).attr("data-idx") - $(b).attr("data-idx");
      });
      $.each(cols, function (_, c) { $row.append(c); });

      var catOk = cat === "all" || cat === this.id, visible = 0;
      $row.children(".col-md-4").each(function () {
        var $c = $(this), p = priceOf($c);
        var content = $c.find(".card-title, .card-text").text().toLowerCase();
        var show = catOk && content.indexOf(text) > -1 && p >= range[0] && p <= range[1];
        $c.toggle(show);
        if (show) visible++;
      });
      $h.toggle(visible > 0);
      $row.toggle(visible > 0);
    });

    $("#no-results").toggle($(".product-card:visible").length === 0);
    localStorage.setItem(KEY, JSON.stringify({ q: $q.val(), cat: cat, price: priceKey, sort: sort }));
    $(window).trigger("scroll"); // lets lazy images load
  }

    $q.on("keyup input", applyFilters);
  $cat.add($price).add($sort).on("change", applyFilters);

  $("#reset-filters").on("click", function () {
    $q.val(""); $cat.val("all"); $price.val("all"); $sort.val("default");
    $("#suggestions").hide();
    applyFilters();
  });

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) {
      $q.val(saved.q || ""); $cat.val(saved.cat || "all");
      $price.val(saved.price || "all"); $sort.val(saved.sort || "default");
    }
  } catch (e) { /* ignore broken data */ }
  applyFilters();

  // ================= 2. EXTERNAL API: Open Beauty Facts =================
  // Open database of cosmetics (https://world.openbeautyfacts.org).
  // Product photos are published under the CC BY-SA licence and the data under ODbL,
  // so they may be reused with attribution (credit line under the grid).
  // The search is loose (it can return perfume, shampoo...), so every result is checked:
  //   - the product name must match the chosen type (EN + RU words)
  //   - names / categories with "perfume, shampoo, deodorant..." are rejected
  //   - it must have a real photo, no duplicates, at most one product per brand
  //   - brands from Russia, Belarus, Ukraine, Kazakhstan etc. are shown first
  var API = "https://world.openbeautyfacts.org/cgi/search.pl";
  var TYPE_KEY = "yello_api_type";
  var CACHE_PREFIX = "yello_api2_cache_";
  var MAX_CARDS = 12;
  var FIELDS = "code,product_name,generic_name,brands,categories,countries_tags,image_front_small_url,image_front_url,url";

  // search words per type + words that must appear in the product name
  // (a leading space = "word starts with", so " туш" matches "тушь" but not "потушить")
  var TYPES = {
    lipstick:   { terms: ["lipstick", "помада"],
                  words: [" lipstick", " lip stick", " помад", " губная"] },
    foundation: { terms: ["foundation", "тональный крем"],
                  words: [" foundation", " тональн", " bb cream", " cc cream", " bb крем", " сс крем"] },
    mascara:    { terms: ["mascara", "тушь для ресниц"],
                  words: [" mascara", " тушь", " туши "] },
    eyeliner:   { terms: ["eyeliner", "подводка для глаз"],
                  words: [" eyeliner", " eye liner", " eye pencil", " kajal", " подводк", " карандаш для глаз", " каял"] },
    blush:      { terms: ["blush", "румяна"],
                  words: [" blush", " румян"] },
    eyeshadow:  { terms: ["eyeshadow", "тени для век"],
                  words: [" eyeshadow", " eye shadow", " eye shadows", " тени для век", " тени для глаз", " тени ", " палетка теней"] }
  };

  // anything that is not make-up
  var EXCLUDE = [" perfume", " parfum", " eau de", " cologne", " fragrance", " body mist", " духи", " парфюм", " туалетная вода",
    " shampoo", " шампун", " conditioner", " hair", " волос", " deodorant", " дезодорант", " antiperspirant",
    " soap", " мыло", " shower", " гель для душа", " toothpaste", " зубная", " nail polish", " лак для ногтей",
    " body lotion", " sunscreen", " sun cream", " солнцезащит", " cleanser", " мицеллярн", " remover", " средство для снятия"];

  // make-up brands from Russia / Belarus / Ukraine / Kazakhstan that are searched by name
  var CIS_BRANDS = ["luxvisage", "relouis", "belita", "divage", "vivienne sabo", "art visage"];
  var CIS_COUNTRIES = ["en:russia", "en:belarus", "en:ukraine", "en:kazakhstan", "en:uzbekistan", "en:kyrgyzstan", "en:armenia", "en:azerbaijan", "en:georgia", "en:moldova"];
  var CIS_NAME_PARTS = CIS_BRANDS.concat(["vitex", "витэкс", "белита", "belor design", "белор", "influence beauty", "faberlic", "фаберлик", "mirra"]);

  var $type = $("#api-type"), $grid = $("#api-grid"), $status = $("#api-status"), $retry = $("#api-retry");
  var lastList = [], apiState = "loading"; // loading | ok | cached | empty | error
  var brandPool = null;                    // CIS brand results, loaded once and reused for every type

  function plain(text) { // lower case, only letters/digits, padded with spaces
    return " " + String(text || "").toLowerCase().replace(/[^a-zа-яёәғқңөұүі0-9]+/g, " ") + " ";
  }
  function hasAny(text, list) {
    for (var i = 0; i < list.length; i++) if (text.indexOf(list[i]) > -1) return true;
    return false;
  }
  function isCisProduct(p, brand) {
    var b = plain(brand);
    if (hasAny(b, CIS_NAME_PARTS.map(function (n) { return " " + n; }))) return true;
    return (p.countries_tags || []).some(function (t) { return CIS_COUNTRIES.indexOf(t) > -1; });
  }

  // ---- requests ----
  function search(term, size) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000); // never wait forever
    var url = API + "?search_terms=" + encodeURIComponent(term) + "&search_simple=1&action=process&json=1" +
              "&page_size=" + size + "&sort_by=unique_scans_n&fields=" + FIELDS;
    return fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (res) { clearTimeout(timer); if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (data) { return data.products || []; })
      .catch(function (e) { clearTimeout(timer); throw e; });
  }

  function loadBrandPool() {
    if (!brandPool) {
      brandPool = Promise.all(CIS_BRANDS.map(function (b) { return search(b, 60).catch(function () { return []; }); }))
        .then(function (parts) { return [].concat.apply([], parts); });
    }
    return brandPool;
  }

  // ---- filtering ----
  function pickRelevant(products, type) {
    var rule = TYPES[type], seenNames = {}, unique = [];
    (products || []).forEach(function (p) {
      var name = String(p.product_name || "").trim();
      var brand = String(p.brands || "").split(",")[0].trim();
      var img = p.image_front_small_url || p.image_front_url || "";
      var title = plain(name + " " + (p.generic_name || ""));
      var everything = plain(name + " " + (p.generic_name || "") + " " + (p.categories || ""));
      var key = name.toLowerCase().replace(/[^a-zа-яё0-9]/g, "");

      if (!name || !brand || !key || seenNames[key]) return;
      if (!/^https:\/\//.test(img)) return;                 // must have a real photo
      if (!hasAny(title, rule.words)) return;                // name must match the chosen type
      if (hasAny(everything, EXCLUDE)) return;               // perfume, shampoo, deodorant...
      seenNames[key] = true;
      unique.push({
        name: name, brand: brand, img: img, cis: isCisProduct(p, brand),
        link: /^https:\/\/world\.openbeautyfacts\.org\//.test(p.url || "")
          ? p.url : "https://world.openbeautyfacts.org/product/" + encodeURIComponent(p.code || "")
      });
    });

    // CIS brands first, then everything else; stable order inside each group
    unique = unique.filter(function (u) { return u.cis; }).concat(unique.filter(function (u) { return !u.cis; }));

    var seenBrands = {}, picked = [];
    unique.forEach(function (u) {                            // one product per brand
      var b = u.brand.toLowerCase();
      if (!seenBrands[b] && picked.length < MAX_CARDS) { seenBrands[b] = true; picked.push(u); }
    });
    return picked;
  }

  // ---- drawing ----
  function setStatus() {
    if (apiState === "loading") $status.text(tr("api_load"));
    else if (apiState === "error") $status.text(tr("api_err"));
    else if (apiState === "empty") $status.text(tr("api_empty"));
    else if (apiState === "cached") $status.text(tr("api_cached"));
    else $status.text($grid.children().length + " " + tr("api_count"));
  }

  // one card; if its photo does not load the card is removed (we show only products with photos)
  function makeCard(o) {
    var $card = $('<article class="api-card"></article>');
    var $img = $('<img referrerpolicy="no-referrer">').attr("alt", o.brand + " " + o.name);
    $img.on("error", function () {
      $card.remove();
      if ($grid.children().length === 0) { apiState = "empty"; }
      setStatus();
    });
    $img.attr("src", o.img);
    var $body = $('<div class="api-body"></div>');
    if (o.cis) $body.append($('<span class="api-badge"></span>').text("🌍 " + tr("api_cis")));
    $body.append($('<p class="api-brand"></p>').text(o.brand.toUpperCase()));
    $body.append($('<h3 class="api-name"></h3>').text(o.name));
    $body.append($('<a class="btn btn-warning btn-sm w-100" target="_blank" rel="noopener noreferrer"></a>')
      .attr("href", o.link).text(tr("api_view")));
    return $card.append($('<div class="api-img"></div>').append($img), $body);
  }

  function render() {
    $grid.empty();
    if (apiState === "ok" || apiState === "cached") lastList.forEach(function (p) { $grid.append(makeCard(p)); });
    setStatus();
  }

  function loadApi() {
    var type = $type.val(), rule = TYPES[type];
    localStorage.setItem(TYPE_KEY, type);
    $retry.hide();
    lastList = []; apiState = "loading"; render();

    Promise.all([
      search(rule.terms[0], 60).catch(function () { return null; }),   // English search
      search(rule.terms[1], 60).catch(function () { return null; }),   // Russian search
      loadBrandPool()                                                  // Russian / Belarusian brands
    ]).then(function (parts) {
      var en = parts[0], ru = parts[1], pool = parts[2];
      if (en === null && ru === null && pool.length === 0) { brandPool = null; throw new Error("offline"); }
      lastList = pickRelevant([].concat(pool, ru || [], en || []), type);
      if (!lastList.length) throw new Error("No matching products with photos");
      apiState = "ok";
      try { localStorage.setItem(CACHE_PREFIX + type, JSON.stringify(lastList)); } catch (e) { /* storage blocked */ }
      render();
    }).catch(function (err) {
      var cached = null;
      try { cached = JSON.parse(localStorage.getItem(CACHE_PREFIX + type) || "null"); } catch (e) { cached = null; }
      if (cached && cached.length) { lastList = cached; apiState = "cached"; }
      else if (err && err.message === "No matching products with photos") { lastList = []; apiState = "empty"; }
      else { lastList = []; apiState = "error"; }
      render();
      $retry.show();
    });
  }

  var savedType = localStorage.getItem(TYPE_KEY);
  if (savedType && $type.find('option[value="' + savedType + '"]').length) $type.val(savedType);
  $type.on("change", loadApi);
  $retry.on("click", loadApi);
  $(".site-lang-btn").on("click", function () { setTimeout(function () { $grid.empty(); render(); }, 0); });
  loadApi();
});
