import * as Navbar from "../scripts/navbar.js";
import * as LocalStore from "./localStore.js";

const darkModeToggleEl = document.getElementById("btn__dark__mode__toggle");

const divPostTitleEl = document.querySelector("#div__post__title");
const divPostBodyEl = document.querySelector("#div__post__body");
const btnSubmitEl = document.querySelector("#btn__publish__post");
const btnsRichTextEls = document.querySelectorAll(".btn__richtext__ui");

let pressedKeys = [];

async function init() {
  Navbar.toggleDarkModeClassesOnElements();
  Navbar.checkCurrentCredentials();
  Navbar.createUserPostsLink();

  let storedPost = await LocalStore.recallPostFromLocalStorage();
  if (storedPost) {
    let { postTitle, postBody } = storedPost;
    divPostTitleEl.textContent = postTitle;
    divPostBodyEl.innerHTML = postBody;
  }

  if (!storedPost) {
    setDefaultPostFieldValues(divPostTitleEl, divPostBodyEl);
    console.log("no local post found, using placeholders instead");
  }
}

/*

=====================
METHODS : POST SAVING LOGIC
=====================

*/

function displaySaveNoticeInDOM() {
  console.log("displaying saving notification");

  let notification = document.createElement("span");
  notification.textContent = "Saving...";
  notification.classList.add("notification__displaying");
  document.querySelector("#container__page").appendChild(notification);
}

function setDefaultPostFieldValues(...elements) {
  elements.forEach((elem) => {
    let placeholder = elem.getAttribute("placeholder");
    placeholder !== ""
      ? (elem.textContent = placeholder)
      : (elem.textContent = "You've got the mic");
  });
}

async function storePostRemotely() {
  let res;

  try {
    let postToSave = window.localStorage.getItem("postData");
    let postId = JSON.parse(postToSave).postId;

    if (postToSave && !postId) {
      let URL = `${window.location.host}/api`;
      let postData = (res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postToSave,
      }));

      if (res.ok) {
        let { postId, pageHTML } = await res.json();

        console.log("successfully posted stored data to remote server");

        console.log("post created, id is", postId);
        console.log("page created, html is", pageHTML);
        await LocalStore.writeToLocalStorage({ ...postToSave, postId: postId });
      }
    } else if (postToSave && postId) {
      let updateURLPath = `${window.location.host}/api/${postId}`;
      res = await fetch(updateURLPath, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: postToSave,
      });
    } else {
      return;
    }
  } catch (e) {
    throw new Error(`Failed to submit post to remote server: ${e}`);
  }

  return res;
}

/*

=====================
METHODS : RICH TEXT OPTIONS LOGIC
=====================

*/

function triggerRichTextOperationFor(eventTarget) {
  let richTextButtonState = {
    set_bold: { state: false, style: "font-weight: 900" },
    set_emphasis: { state: false, style: "font-style: italic" },
    set_underline: {
      state: false,
      style: "border-bottom: 2px solid rgba(24, 24, 24, 1)",
    },
    set_strike: { state: false, style: "text-decoration: line-through" },
  };

  eventTarget.classList.toggle("active");
  let updatedState = eventTarget.classList.contains("active");
  eventTarget.setAttribute("data-is-active", updatedState);

  let operation = eventTarget.getAttribute("data-rich-text-operation");

  let { style } = richTextButtonState[operation];
  richTextButtonState[operation].state = updatedState;

  if (updatedState === true) {
    const eventRichTextBtnEnabled = new CustomEvent("richTextBtnEnabled", {
      detail: style,
    });

    window.dispatchEvent(eventRichTextBtnEnabled);
  }

  // richTextButtonState[operation].state === false
  if (updatedState === false) {
    const eventRichTextBtnDisabled = new CustomEvent("richTextBtnDisabled", {
      detail: style,
    });
    window.dispatchEvent(eventRichTextBtnDisabled);
  }
}

function checkForOpenRichTextClasses() {
  return Array.from(btnsRichTextEls).filter(
    (btnEl) => btnEl.getAttribute("data-is-active") === "true"
  );
}

function openRichTextPortion(cssClass) {
  console.log("opening rich text tags");
  console.log("active classes", checkForOpenRichTextClasses());
}

function closeRichTextPortion(cssClass) {
  console.log("closing rich text tags");
  console.log("active classes", checkForOpenRichTextClasses());
}

/*

=====================
EVENT LISTENERS
=====================

*/

window.addEventListener("DOMContentLoaded", async () => {
  await init();
});

window.addEventListener("richTextBtnEnabled", (e) => {
  openRichTextPortion(e.detail);
});

window.addEventListener("richTextBtnDisabled", (e) => {
  closeRichTextPortion(e.detail);
});

window.addEventListener("keydown", (e) => {
  console.log("keydown detected");

  if (pressedKeys.length === 2) {
    pressedKeys[0] = pressedKeys.pop();
  }

  pressedKeys.push(e.key);

  let [keyA, keyB] = pressedKeys;

  if (keyA !== "Control") {
    return;
  }

  // Both ctrl+u & ctrl+s have browser/OS specific behavior
  // that I wouldn't normally override, but I'll make an exception for this project
  if (keyA === "Control" && pressedKeys.length === 2) {
    let btn;

    switch (keyB) {
      case "b":
      case "B":
        btn = document.querySelector("#btn__set__bold");
        break;
      case "i":
      case "I":
        btn = document.querySelector("#btn__set__emphasis");
        break;
      case "u":
      case "U":
        e.preventDefault();
        btn = document.querySelector("#btn__set__underline");
        break;
      case "s":
      case "S":
        e.preventDefault();
        btn = document.querySelector("#btn__set__strikethrough");
        break;
      default:
        break;
    }
    triggerRichTextOperationFor(btn);
  } else {
    return;
  }
});

btnsRichTextEls.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    triggerRichTextOperationFor(btn);
  });
});

divPostBodyEl.addEventListener("input", (e) => {
  let typingTimer;
  let payload;

  divPostBodyEl.addEventListener("keydown", (e) => {
    console.log("timer started");
    if (typingTimer) window.clearTimeout(typingTimer);
  });

  divPostBodyEl.addEventListener("keyup", (e) => {
    if (typingTimer) window.clearTimeout(typingTimer);
    typingTimer = window.setTimeout(async () => {
      // console.log("payload is", payload);
      payload = {
        postId: defaultPostID,
        postTitle:
          divPostTitleEl.textContent === ""
            ? divPostTitleEl.getAttribute("placeholder")
            : divPostTitleEl.textContent,
        postBody:
          divPostBodyEl.innerHTML === ""
            ? divPostBodyEl.getAttribute("placeholder")
            : divPostBodyEl.innerHTML,
      };
      await LocalStore.writeToLocalStorage(payload);
    }, 1000);
  });
});

btnSubmitEl.addEventListener("click", async (e) => {
  if (JSON.parse(window.location.getItem("userMode")) === "guest") {
    return;
  }
  try {
    await storePostRemotely();
  } catch (e) {
    console.error("Error caught, failed to save post to remote server", e);
  }
});
