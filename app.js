const express = require("express");

const app = express();
const port = process.env.port || 3000;
const musicRouter = express.Router();
const myScraper = require("./imgscraper");

musicRouter.route("/artists").get((request, response) => {
  const responseValue = { hello: "This is my API yo" };
  response.json(responseValue);
});
app.use("/api", musicRouter);

app.get("/", (request, response) => {
  // response.send("Welcome to the music match API");
  response.send(myScraper.printYo());
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
