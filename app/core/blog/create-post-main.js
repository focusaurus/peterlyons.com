const render = require("./render-post");
const debounce = require("lodash.debounce");

/* global document window */
/* eslint-disable no-console */

function dom(selector) {
  return document.querySelector(`.create-post ${selector}`);
}

function postBody(input) {
  return {
    content: input.content.value,
    title: input.title.value,
    password: input.password.value
  };
}

function checkValid(input) {
  const body = postBody(input);
  const valid = Object.keys(body).every(key => body[key].length > 0);
  // eslint-disable-next-line no-param-reassign
  input.saveButton.disabled = !valid;
}

function loadDraft() {
  try {
    const draftJson = window.localStorage.postDraft;
    if (draftJson) {
      return JSON.parse(draftJson);
    }
  } catch (error) {
    console.warn("Error loading draft from localStorage", error);
  }
  return null;
}

function saveDraft(input) {
  const draft = postBody(input);
  try {
    window.localStorage.postDraft = JSON.stringify({
      title: draft.title,
      content: draft.content
    });
  } catch (error) {
    console.warn("Error saving post draft to localStorage", error);
  }
}

function init() {
  const input = {
    content: dom("textarea.content"),
    saveButton: dom(".save"),
    title: dom("input[name=title]"),
    password: dom("input[name=password]")
  };

  const display = {
    content: dom(".preview"),
    error: dom(".error"),
    link: dom(".link"),
    saved: dom(".saved"),
    title: dom(".title")
  };

  function onInput(event) {
    display.content.innerHTML = render(event.target.value);
    saveDraft(input);
  }

  const postDraft = loadDraft();
  if (postDraft) {
    input.content.value = postDraft.content;
    input.title.value = postDraft.title;
    onInput({target: {value: input.content.value}});
  }
  input.content.addEventListener("input", debounce(onInput, 1250));

  input.title.addEventListener("input", event => {
    display.title.innerText = event.target.value;
  });

  function save() {
    input.saveButton.disabled = true;
    const reqBody = postBody(input);

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
  const boundCheckValid = checkValid.bind(null, input);
  input.title.addEventListener("input", boundCheckValid);
  input.content.addEventListener("input", boundCheckValid);
  input.password.addEventListener("input", boundCheckValid);
  input.password.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      save();
    }
  });
  input.saveButton.addEventListener("click", save);
}

module.exports = init;
