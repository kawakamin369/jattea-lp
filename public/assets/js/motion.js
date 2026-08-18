/* ============================================================
   JATTEA LP — モーション
   目的は装飾ではなく「CTAまで読ませて、押させる」こと。
   ・数値のカウントアップ（投資回収・利益率などの主要指標）
   ・スクロールに応じた段階表示（読む順序を作る）
   ・投資回収バーの伸長（比較優位を体感させる）
   ・FAQの開閉（縦を詰めてCTAまでの距離を短くする）
   ・追従CTAをFV通過後にスライドイン
   JSが無効でも内容はすべて表示される（初期状態はJSが付与）。
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 共通：一度だけ発火する監視 ---------- */
  function observe(els, cb, ratio) {
    if (!("IntersectionObserver" in window)) {
      els.forEach(cb);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cb(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: ratio || 0.25, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     1. 数値のカウントアップ
     ============================================================ */
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));

  counters.forEach(function (el) {
    var raw = el.textContent.trim();
    el.dataset.target = raw;
    if (!reduce) el.textContent = raw.replace(/[0-9]/g, "0");
  });

  function runCount(el) {
    var raw = el.dataset.target || el.textContent;
    var hasComma = raw.indexOf(",") >= 0;
    var target = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(target)) return;
    var dot = raw.indexOf(".");
    var decimals = dot >= 0 ? raw.length - dot - 1 : 0;

    if (reduce) { el.textContent = raw; return; }

    var dur = 1100;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      var v = target * eased;
      var out = decimals ? v.toFixed(decimals) : String(Math.round(v));
      if (hasComma) out = Number(out).toLocaleString("ja-JP");
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = raw;                    // 端数のズレを最後に補正
    }
    requestAnimationFrame(frame);
  }

  observe(counters, runCount, 0.4);

  /* ============================================================
     2. スクロールでの段階表示
     ============================================================ */
  var revealSel = [
    ".sec-title", ".target__title", ".target__col",
    ".profit__cards li", ".payback__row", ".profit__invest",
    ".reasons__grid li", ".compare-sec .table-wrap", ".compare-sec__honest",
    ".terms__grid li", ".support li", ".flow li",
    ".fc__grid li", ".member", ".qa__item",
    ".docs-page", ".docs-sec__list li", ".steps li",
    ".hero__checks li", ".cta__head", ".cta__title"
  ].join(",");

  if (!reduce) {
    [].slice.call(document.querySelectorAll(revealSel)).forEach(function (el) {
      el.classList.add("rv");
      // 同じ親の中での順番を stagger の遅延に使う
      var idx = 0;
      var sib = el.previousElementSibling;
      while (sib) { idx++; sib = sib.previousElementSibling; }
      el.style.setProperty("--rv-delay", Math.min(idx, 7) * 70 + "ms");
    });

    observe([].slice.call(document.querySelectorAll(".rv")), function (el) {
      el.classList.add("rv-in");
    }, 0.15);

    // 保険：何らかの理由で監視が発火しなかった要素を、画面内に入っていれば表示する
    var safety = function () {
      [].slice.call(document.querySelectorAll(".rv:not(.rv-in)")).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2) el.classList.add("rv-in");
      });
    };
    window.addEventListener("load", function () { setTimeout(safety, 400); });
    window.addEventListener("scroll", safety, { passive: true });
  }

  /* ============================================================
     3. 投資回収バー
     ============================================================ */
  observe([].slice.call(document.querySelectorAll(".payback__bar")), function (el) {
    el.classList.add("is-on");
  }, 0.4);

  /* ============================================================
     4. FAQ の開閉
     ============================================================ */
  var items = [].slice.call(document.querySelectorAll(".qa__item"));
  items.forEach(function (item, i) {
    var q = item.querySelector(".qa__q");
    var a = item.querySelector(".qa__a");
    if (!q || !a) return;

    var id = "qa-a-" + (i + 1);
    a.id = id;
    q.setAttribute("role", "button");
    q.setAttribute("tabindex", "0");
    q.setAttribute("aria-controls", id);
    item.classList.add("is-toggleable");

    function set(open) {
      item.classList.toggle("is-open", open);
      q.setAttribute("aria-expanded", open ? "true" : "false");
    }
    set(i === 0);   // 最初の1問だけ開いておく

    function toggle() { set(!item.classList.contains("is-open")); }
    q.addEventListener("click", toggle);
    q.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ============================================================
     5. 追従CTA：FVを抜けたら出す
     ============================================================ */
  var bar = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  if (bar && hero) {
    bar.classList.add("is-hidden");
    var trigger = function () {
      var passed = window.scrollY > hero.offsetHeight * 0.75;
      bar.classList.toggle("is-hidden", !passed);
    };
    trigger();
    window.addEventListener("scroll", trigger, { passive: true });
  }
})();
