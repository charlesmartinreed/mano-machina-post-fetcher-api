const express = require("express");
const app = express();

const PORT = process.env.PORT || 7000;
app.use(express.json());

app.listen(PORT, () => console.log(`Server now runnong on PORT ${PORT}`));
