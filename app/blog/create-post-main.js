const render = require("./render-post");
const debounce = require("lodash.debounce");

/* global document window */
function init() {
  const input = {
    content: document.querySelector(".create-post textarea.content"),
    saveButton: document.querySelector(".create-post .save"),
    title: document.querySelector(".create-post input[name=title]"),
    password: document.querySelector(".create-post input[name=password]")
  };

  const display = {
    content: document.querySelector(".create-post .preview"),
    error: document.querySelector(".create-post .error"),
    link: document.querySelector(".create-post .link"),
    saved: document.querySelector(".create-post .saved"),
    title: document.querySelector(".create-post .title")
  };

  input.content.addEventListener(
    "input",
    debounce(event => {
      display.content.innerHTML = render(event.target.value);
    }, 1250)
  );

  input.title.addEventListener("input", event => {
    display.title.innerText = event.target.value;
  });

  function postBody() {
    return {
      content: input.content.value,
      title: input.title.value,
      password: input.password.value
    };
  }

  function checkValid() {
    const body = postBody();
    const valid = Object.keys(body).every(key => body[key].length > 0);
    input.saveButton.disabled = !valid;
  }

  input.title.addEventListener("input", checkValid);
  input.content.addEventListener("input", checkValid);
  input.password.addEventListener("input", checkValid);

  input.saveButton.addEventListener("click", () => {
    input.saveButton.disabled = true;
    window
      .fetch("", {
        method: "POST",
        headers: new window.Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(postBody())
      })
      .then(res => {
        if (res.status === 403) {
          throw new Error("Incorrect password");
        }
        if (res.status !== 200) {
          throw new Error(`Status: ${res.status}`);
        }
        return res.json();
      })
      .then(body => {
        display.link.href = body.uri;
        display.link.innerText = body.title;
        display.error.innerText = "";
        display.saved.style.display = "initial";
      })
      .catch(error => {
        display.saved.style.display = "none";
        display.error.innerText = `Borked! ${error.message}`;
      })
      .then(() => {
        input.saveButton.disabled = false;
      });
  });
}

module.exports = init;
