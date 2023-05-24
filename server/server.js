const express = require("express");
const cors = require("cors");
const app = express();
const Post = require("../classes/Post");

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
  // TODO: generatePostHTMLPage
  return createdPost.getPostId();
}

app.post("/api", async (req, res) => {
  if (req.body) {
    // console.log("form data looks like this", JSON.parse(req.body));
    try {
      let postId = await storeNewPost(req);
      console.log("post created, id is", postId);
      return res.status(200);
    } catch (e) {
      throw new Error(e);
    }
  } else {
    return res.sendStatus(500);
  }

  //   return res.status(200);
  //   res.end();
});

app.listen(PORT, () => console.log(`Server now running on PORT ${PORT}`));
