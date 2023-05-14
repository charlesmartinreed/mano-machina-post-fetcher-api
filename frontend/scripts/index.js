let inputPostTitleEl = document.querySelector("#input__post__title");
let textareaPostBodyEl = document.querySelector("#textarea__post");
let formEl = document.querySelector("#form__new__edit__post");

let testingURL = "http://localhost:7000/";

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
