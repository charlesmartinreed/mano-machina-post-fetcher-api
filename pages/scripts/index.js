const divPostTitleEl = document.querySelector("#div__post__title");
const divPostBodyEl = document.querySelector("#div__post__body");
const btnSubmitEl = document.querySelector("#submit__post__button");
const btnsRichTextEls = document.querySelectorAll(".btn__richtext__ui");

let testingURL = "http://localhost:7000/api";
let pressedKeys = [];

btnSubmitEl.addEventListener("click", async (e) => {
  // e.preventDefault();
  // TESTING STATE
  // NOT CHECKING FOR VALID DATA, ETC
  let postTitle = divPostTitleEl.innerHTML;
  let postBody = divPostBodyEl.innerHTML;

  if (postTitle !== "" && postBody !== "") {
    let postJSON = JSON.stringify({
      postTitle,
      postBody,
    });

    try {
      let res = await fetch(testingURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postJSON,
      });

      // TODO: This should re-direct to the newly created post
      if (res.ok) console.log("posted successfully!");
    } catch (e) {
      console.error("Failed to submit post. Please try again.");
    }
  }
});

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

window.addEventListener("DOMContentLoaded", async () => {
  let storedPost = await recallPostFromLocalStorage();
  if (storedPost) {
    let { postTitle, postBody } = storedPost;
    divPostTitleEl.textContent = postTitle;
    divPostBodyEl.innerHTML = postBody;
  }

  if (!storedPost) {
    console.log("no local post found, using placeholders instead");
  }
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

divPostBodyEl.addEventListener("focus", (e) => {
  let typingTimer;
  let payload;

  divPostBodyEl.addEventListener("keydown", (e) => {
    if (typingTimer) window.clearTimeout(typingTimer);
  });

  divPostBodyEl.addEventListener("keyup", (e) => {
    if (typingTimer) window.clearTimeout(typingTimer);
    typingTimer = window.setTimeout(async () => {
      // console.log("payload is", payload);
      payload = {
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

async function writeToLocalStorage(dataToSave) {
  if (window.localStorage) {
    try {
      let JSONifiedData = JSON.stringify(dataToSave);

      displaySaveNoticeInDOM();
      console.log("saving data of post in local storage", JSONifiedData);
      window.localStorage.setItem("localPost", JSONifiedData);
    } catch (e) {
      console.error("could not store in local storage", e);
    }
  }
}

async function recallPostFromLocalStorage() {
  if (window.localStorage) {
    let retrievedPostLocal = window.localStorage.getItem("localPost");
    if (retrievedPostLocal) {
      return JSON.parse(retrievedPostLocal);
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
