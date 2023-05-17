const inputPostTitleEl = document.querySelector("#input__post__title");
const textareaPostBodyEl = document.querySelector("#textarea__post");
const formEl = document.querySelector("#form__new__edit__post");
const btnsRichTextEls = document.querySelectorAll(".btn__richtext__ui");

let richTextButtonState = {
  set_bold: { state: false, cssClass: "text-is-bolded" },
  set_emphasis: { state: false, cssClass: "text-is-emphasized" },
  set_underline: { state: false, cssClass: "text-is-underlined" },
  set_strike: { state: false, cssClass: "text-is-stricken" },
};

let richTextActiveClasses = ``;
let testingURL = "http://localhost:7000/api";
let textAreaBody = ``;

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  // TESTING STATE
  // NOT CHECKING FOR VALID DATA, ETC
  let postTitle = inputPostTitleEl.value;
  let postBody = textareaPostBodyEl.value;

  if (postTitle !== "" && postBody !== "") {
    // let data = new FormData(formEl);

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
    btn.classList.toggle("active");

    btn.setAttribute("data-is-active", btn.classList.contains("active"));

    updateRichTextOperation(
      btn.getAttribute("data-rich-text-operation"),
      btn.classList.contains("active")
    );
  });
});

function updateRichTextOperation(operation, updatedState) {
  let { cssClass } = richTextButtonState[operation];

  richTextButtonState[operation].state = updatedState;

  // console.log(cssClass);
  console.log(richTextButtonState[operation]);

  if (richTextButtonState[operation].state === true)
    openRichTextPortion(cssClass);

  if (richTextButtonState[operation].state === false) closeRichTextPortion();

  console.log("current textbody", textAreaBody);
}

function openRichTextPortion(cssClass) {
  richTextActiveClasses += `${cssClass} `;

  let spanNodes = Array.from(textareaPostBodyEl.children).filter((node) =>
    node.classList.contains("span__rich__text__container")
  );

  if (spanNodes.length === 0) {
  }

  // for (const children of textareaPostBodyEl) {
  //   if (children.length === 0) {
  //     let openTag = document.querySelector(`#span__rich__text__container__0`)
  //   } else {
  //     let childCount
  //   }
  // }

  // let openTag = document.querySelector('#span__rich__text__container') ??
  // let openTag = `<span id="span__rich__text__container" class=${richTextActiveClasses}>`;
}

function closeRichTextPortion() {
  let closeTag = `</span>`;
  textAreaBody += closeTag;
}

textareaPostBodyEl.addEventListener("focus", (e) => {
  textareaPostBodyEl.addEventListener("keydown", (e) => {
    if (e.code.includes("Key")) {
      textAreaBody += e.key;
      console.log("current textareabody html", textAreaBody);
    }
  });
});
