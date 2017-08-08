const nav = document.querySelector("nav.site");
const content = document.querySelector(".content");

function toggleNav() {
  nav.classList.toggle("open");
  content.classList.toggle("navOpen");
}

function closeNav() {
  nav.classList.remove("open");
  content.classList.remove("navOpen");
}

document.querySelector(".navMenuButton").addEventListener("click", toggleNav);
document.querySelector("nav.site .close").addEventListener("click", closeNav);

const selector = `nav a[href='${document.location.pathname}']`;
const navEls = document.querySelectorAll(selector);
Array.prototype.forEach.call(navEls, el => {
  el.classList.add("current");
});
