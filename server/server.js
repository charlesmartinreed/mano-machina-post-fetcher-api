const express = require("express");
const cors = require("cors");
const app = express();
const Post = require("../classes/Post");

const PORT = process.env.PORT || 7000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "You made it to the endpoint" });
});

app.post("/", (req, res) => {
  if (req.body) {
    // console.log("form data looks like this", JSON.parse(req.body));
    let { postBody, postTitle } = req.body;
    console.log("postbody is", postBody);
    console.log("posttitle is", postTitle);
    res.sendStatus(200);
  } else {
    return res.sendStatus(500);
  }

  //   return res.status(200);
  //   res.end();
});

app.listen(PORT, () => console.log(`Server now running on PORT ${PORT}`));
