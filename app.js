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

app.get("/", async (request, response) => {
  // response.send("Welcome to the music match API");
  //response.send(myScraper.ScrapeAndSave(BandsArr[i]));
  response.send(await myScraper.ScrapeAndSave("Beck"));
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
