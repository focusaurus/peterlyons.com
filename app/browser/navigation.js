var selector = "nav a[href='" + document.location.pathname + "']";
[].forEach.call(document.querySelectorAll(selector), function(el) {
  el.classList.add("current");
});
