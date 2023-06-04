const darkModeToggleEl = document.getElementById("btn__dark__mode__toggle");

const divPostTitleEl = document.querySelector("#div__post__title");
const divPostBodyEl = document.querySelector("#div__post__body");
const btnSubmitEl = document.querySelector("#submit__post__button");
const btnsRichTextEls = document.querySelectorAll(".btn__richtext__ui");

let pressedKeys = [];
const defaultPostID = "0123456789";

function userHasCredentials() {
  // TODO: Implement Credentials on the server side
  let guestMode = window.localStorage.getItem("userMode");

  if (guestMode) {
    return false;
  } else {
    return true;
  }
}

function enableGuestMode() {
  let userCredentialTextEl = document.getElementById("text__user__credentials");
  userCredentialTextEl.textContent = "Guest Mode";
}

function checkCurrentDarkModeStatus() {
  if (!window.localStorage) return undefined;

  if (window.localStorage) {
    if (!window.localStorage.getItem("preferredColorScheme")) {
      let preferredScheme =
        window.matchMedia("(prefers-color-scheme: dark)").matches === true
          ? "dark"
          : "light";
      window.localStorage.setItem("preferredColorScheme", preferredScheme);
    }
    return window.localStorage.getItem("preferredColorScheme");
  }
}

function toggleDarkMode() {
  if (checkCurrentDarkModeStatus()) {
    let toggledColorScheme =
      checkCurrentDarkModeStatus() === "dark" ? "light" : "dark";

    window.localStorage.setItem("preferredColorScheme", toggledColorScheme);
  }
}

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
        await writeToLocalStorage({ ...postToSave, postId: postId });
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

btnsRichTextEls.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    triggerRichTextOperationFor(btn);
  });
});

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

function openRichTextPortion(cssClass) {
  console.log("opening rich text tags");
  console.log("active classes", checkForOpenRichTextClasses());
}

function closeRichTextPortion(cssClass) {
  console.log("closing rich text tags");
  console.log("active classes", checkForOpenRichTextClasses());
}

function checkForOpenRichTextClasses() {
  return Array.from(btnsRichTextEls).filter(
    (btnEl) => btnEl.getAttribute("data-is-active") === "true"
  );
}

async function init() {
  console.log(
    "current stored dark mode status is",
    checkCurrentDarkModeStatus()
  );

  if (!userHasCredentials()) {
    enableGuestMode();
  }

  let storedPost = await recallPostFromLocalStorage();
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

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => toggleDarkMode());

window.addEventListener("DOMContentLoaded", async () => {
  await init();
});

function setDefaultPostFieldValues(...elements) {
  elements.forEach((elem) => {
    let placeholder = elem.getAttribute("placeholder");
    placeholder !== ""
      ? (elem.textContent = placeholder)
      : (elem.textContent = "You've got the mic");
  });
}

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
      await writeToLocalStorage(payload);
    }, 1000);
  });
});

darkModeToggleEl.addEventListener("click", (e) => toggleDarkMode());

async function writeToLocalStorage(dataToSave) {
  if (window.localStorage) {
    {
      try {
        let { postTitle, postBody, postId } = dataToSave;

        if (postId !== defaultPostID) {
          window.localStorage.removeItem("postData")[defaultPostID];
        }

        let postObj = {};

        postObj[postId] = {
          postTitle: postTitle,
          postBody: postBody,
        };

        let JSONifiedData = JSON.stringify(postObj);

        displaySaveNoticeInDOM();
        console.log("saving data of post in local storage", JSONifiedData);
        window.localStorage.setItem("postData", JSONifiedData);
        console.log("post data written successfully");
      } catch (e) {
        console.error("could not store in local storage", e);
      }
    }
  } else {
    return;
  }
}

async function recallPostFromLocalStorage(postID = defaultPostID) {
  if (window.localStorage) {
    let retrievedPostLocal = window.localStorage.getItem("postData");

    if (retrievedPostLocal) {
      let post = JSON.parse(retrievedPostLocal)[postID];

      return post;
    }
  } else {
    return;
  }
}

function displaySaveNoticeInDOM() {
  console.log("displaying saving notification");

  let notification = document.createElement("span");
  notification.textContent = "Saving...";
  notification.classList.add("notification__displaying");
  document.querySelector("#container__page").appendChild(notification);
}
