const render = require("./render-post");
const debounce = require("lodash.debounce");

function dom(selector) {
  return document.querySelector(`.create-post ${selector}`);
}

/* global document window */
function init() {
  const input = {
    content: dom("textarea.content"),
    saveButton: dom(".save"),
    title: dom("input[name=title]"),
    password: dom("input[name=password]")
  };
  const draftJson = window.localStorage.postDraft;
  let postDraft;
  if (draftJson) {
    try {
      postDraft = JSON.parse(draftJson);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Invalid draft json in localStorage", error);
    }
  }
  if (postDraft) {
    input.content.value = postDraft.content;
    input.title.value = postDraft.title;
  }
  const display = {
    content: dom(".preview"),
    error: dom(".error"),
    link: dom(".link"),
    saved: dom(".saved"),
    title: dom(".title")
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

  function save() {
    input.saveButton.disabled = true;
    const reqBody = postBody();
    window.localStorage.postDraft = JSON.stringify({
      title: reqBody.title,
      content: reqBody.content
    });
    window
      .fetch("", {
        method: "POST",
        headers: new window.Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(reqBody)
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
  }
  input.title.addEventListener("input", checkValid);
  input.content.addEventListener("input", checkValid);
  input.password.addEventListener("input", checkValid);
  input.password.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      save();
    }
  });
  input.saveButton.addEventListener("click", save);
}

module.exports = init;
