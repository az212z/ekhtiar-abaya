/* ============================================================
   الأختيار المُبهِر للعبايات — main.js (vanilla)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Sticky header shrink ---------- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Full-screen mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var mmClose = document.getElementById("mmClose");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (mmClose) mmClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll(".mm-links a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  /* ---------- Scroll reveal (IntersectionObserver + fallback) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  function showAll() {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // hard fallback: ensure everything visible after 1.2s no matter what
    setTimeout(showAll, 1200);
  } else {
    showAll();
  }
  // safety: if load never fires properly
  window.addEventListener("load", function () { setTimeout(showAll, 200); });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = document.getElementById("lbClose");

  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || "عرض مكبّر";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (!menu || !menu.classList.contains("open")) document.body.style.overflow = "";
  }
  document.querySelectorAll(".gal-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var full = item.getAttribute("data-full");
      var img = item.querySelector("img");
      openLightbox(full, img ? img.alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastMsg = document.getElementById("toastMsg");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    if (toastMsg && msg) toastMsg.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---------- Order form → WhatsApp + localStorage ---------- */
  var WA_NUMBER = "966562727808";
  var form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.name.value || "").trim();
      var phone = (form.phone.value || "").trim();
      var service = (form.service.value || "").trim();
      var size = (form.size.value || "").trim();
      var notes = (form.notes.value || "").trim();

      if (!name || !phone || !service) {
        showToast("فضلًا أكمل الاسم والجوال والصنف المطلوب.");
        return;
      }

      // build WhatsApp message
      var lines = [
        "السلام عليكم 👋 أرغب في طلب من *الأختيار المُبهِر للعبايات*",
        "",
        "• الاسم: " + name,
        "• الجوال: " + phone,
        "• الصنف: " + service
      ];
      if (size) lines.push("• المقاس: " + size);
      if (notes) lines.push("• ملاحظات: " + notes);
      var text = encodeURIComponent(lines.join("\n"));

      // save to localStorage (demo)
      try {
        var store = JSON.parse(localStorage.getItem("ekhtiar_orders") || "[]");
        store.push({ name: name, phone: phone, service: service, size: size, notes: notes, at: new Date().toISOString() });
        localStorage.setItem("ekhtiar_orders", JSON.stringify(store));
      } catch (err) { /* ignore storage errors */ }

      showToast("تم تجهيز طلبك — يُفتح واتساب الآن.");
      var url = "https://wa.me/" + WA_NUMBER + "?text=" + text;
      setTimeout(function () { window.open(url, "_blank", "noopener"); }, 600);
      form.reset();
    });
  }

  /* ---------- Footer year safety (already 2026, but keep dynamic-safe) ---------- */
})();
