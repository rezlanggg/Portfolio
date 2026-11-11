// ===== Your email for the contact form =====
const MY_EMAIL = "rezbuidon@gmail.com";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Light/dark theme (remembered when storage is available)
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  else if (matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
} catch (e) {}
document.getElementById("themeBtn").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Highlight the current section in the nav
const links = [...document.querySelectorAll(".nav-links a")];
const sections = links.map(a => document.querySelector(a.getAttribute("href")));
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => s && spy.observe(s));

// Skill bars fill in when scrolled into view
const barObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.level + "%";
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll(".bar-fill").forEach(b => barObs.observe(b));

// Project filter
const filterBtns = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");
filterBtns.forEach(btn => btn.addEventListener("click", () => {
  filterBtns.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  cards.forEach(c => c.classList.toggle("hide", btn.dataset.filter !== "all" && c.dataset.category !== btn.dataset.filter));
}));

// Contact form (opens the visitor's email app)
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = encodeURIComponent("Portfolio message from " + f.get("name"));
  const body = encodeURIComponent(f.get("message") + "\n\nFrom: " + f.get("name") + " (" + f.get("email") + ")");
  window.location.href = "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
  document.getElementById("formNote").textContent = "Opening your email app to send the message.";
});