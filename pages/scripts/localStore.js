const defaultPostID = "0123456789";

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

export { writeToLocalStorage, recallPostFromLocalStorage };
