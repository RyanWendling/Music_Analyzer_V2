const express = require("express");

const app = express();
const port = process.env.port || 3000;
const musicRouter = express.Router();
const myAnalyzer = require("./SimilarArtistAnalyzer");

musicRouter.route("/artists").get((request, response) => {
  const responseValue = { hello: "This is my API yo" };
  response.json(responseValue);
});
app.use("/api", musicRouter);

app.get("/", async (request, response) => {
  // response.send("Welcome to the music match API");
  console.log("default path response");
  response.send(await myAnalyzer.AnalyzeMusic());
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
