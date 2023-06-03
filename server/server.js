const express = require("express");
const cors = require("cors");
const app = express();
const Post = require("../classes/Post");
const Page = require("../classes/Page");

const PORT = process.env.PORT || 7000;
app.use(express.static("pages"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile("landing.html", { root: "pages" });
});

app.get("/editor/:userMode", (req, res) => {
  let { userMode } = req.params;

  if (userMode === "userMode=guest") {
    // res.redirect("/editor");
    res.status(200).sendFile("editor.html", { root: "pages" });
  }
});

app.get("/api", (req, res) => {
  return res.status(200).json({ msg: "You made it to the endpoint" });
});

app.put("/api/:postId", (req, res) => {
  // TODO: Post ID lookup
  console.log("looking up post id", req.params.postId);
  return res.status(200);
});

app.post("/api", async (req, res) => {
  if (req.body) {
    try {
      let { createdPage, createdPost } = await storeNewPost(req);

      let postId = createdPost.getPostId();
      let pageHTML = createdPage.html();

      return res.status(200).json({
        postId,
        pageHTML,
      });
    } catch (e) {
      throw new Error(e);
    }
  } else {
    return res.sendStatus(500);
  }
});

async function storeNewPost(req) {
  let defaultStyles = [`./pages/styles/post.css`];
  let defaultScripts = [`./pages/scripts/post.js`];

  let { postBody, postTitle } = req.body;

  let createdPost = new Post(postTitle, postBody);

  let createdPage = new Page(
    createdPost.postTitle,
    createdPost.postBody,
    defaultStyles,
    defaultScripts
  );

  // TODO: generatePostHTMLPage
  return { createdPost, createdPage };
}

app.listen(PORT, () => console.log(`Server now running on PORT ${PORT}`));
