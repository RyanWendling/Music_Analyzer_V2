const express = require("express");
const path = require("path");

const app = express();
const port = process.env.port || 3000;
const musicRouter = express.Router();
const myAnalyzer = require("./SimilarArtistAnalyzer");

musicRouter.route("/artists").get((request, response) => {
  const responseValue = { hello: "This is my API yo" };
  response.json(responseValue);
});
app.use("/api", musicRouter);
// The below path is available to all client requesters. Note that node serves these static files, the client can't directly acces them. You may also add links to external CDNs like bootstrap here.
app.use(express.static(path.join(__dirname, "/Public")));
// Tell app we are going to use a template engine
app.set("views", "./Src/views");
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  // response.send("Welcome to the music match API");
  // render will generate the index file by looking within Src / Views and pass in any declared data.
  response.render("SrcIndex", { maTitle: "MaLibrarah" });
  console.log("default path response bruh");
  // response.sendFile(path.join(__dirname, "Views", "index.html"));
  // response.send(await myAnalyzer.AnalyzeMusic());
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
