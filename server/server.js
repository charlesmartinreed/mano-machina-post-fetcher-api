const express = require("express");
const cors = require("cors");
const app = express();
const Post = require("../classes/Post");
const Page = require("../classes/Page");

const defaultStyles = [`./pages/styles/post.css`];
const defaultScripts = [`./pages/scripts/post.js`];

const PORT = process.env.PORT || 7000;
app.use(express.static("pages"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "pages" });
});

app.get("/api", (req, res) => {
  return res.status(200).json({ msg: "You made it to the endpoint" });
});

async function storeNewPost(req) {
  let { postBody, postTitle } = req.body;

  let createdPost = new Post(postTitle, postBody);

  // for now, use the default script and styles
  let createdPage = new Page(
    Post.postTitle,
    Post.postBody,
    defaultStyles,
    defaultScripts
  );

  // TODO: generatePostHTMLPage
  return { createdPost, createdPage };
}

app.post("/api", async (req, res) => {
  if (req.body) {
    try {
      let { createdPage, createdPost } = await storeNewPost(req);

      let postId = createdPost.getPostId();
      let pageHTML = createdPage.html;

      console.log("post created, id is", postId);
      console.log("page created, html is", pageHTML);

      return res.status(200);
    } catch (e) {
      throw new Error(e);
    }
  } else {
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Server now running on PORT ${PORT}`));
