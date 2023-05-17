const inputPostTitleEl = document.querySelector("#input__post__title");
const textareaPostBodyEl = document.querySelector("#textarea__post");
const formEl = document.querySelector("#form__new__edit__post");

const btnsRichTextEls = document.querySelectorAll(".btn__richtext__ui");
let richTextButtonState = {
  set_bold: false,
  set_emphasis: false,
  set_underline: false,
  set_strike: false,
};

let testingURL = "http://localhost:7000/";
let textAreaBody = "";

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
  richTextButtonState[operation] = updatedState;

  console.log(richTextButtonState);
}

// textareaPostBodyEl.addEventListener("focus", (e) => {
//   textareaPostBodyEl.addEventListener("keydown", (e) => {
//     textAreaBody = e.target.value;
//     console.log("current textareabody", textAreaBody);
//   });
// });
