const express = require("express");
const path = require("path");
const app = express();
const port = process.env.port || 3000;

// The below path is available to all client requesters. Note that node serves these static files, the client can't directly acces them. You may also add links to external CDNs like bootstrap here.
app.use(express.static(path.join(__dirname, "/Public")));
// Tell app we are going to use a template engine
app.set("views", "./Src/views");
app.set("view engine", "ejs");

const nav = [{ link: "/", title: "Main Page" }, { link: "/ArtistDetailsView", title: "Artist Details" }];
const myArtistRouter = require("./Src/routes/artistRoutes")(nav);

//myArtistRouter will be used for the "/" path, as well as all child paths.
app.use("/", myArtistRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
