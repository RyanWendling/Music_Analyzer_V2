const express = require("express");
const path = require("path");
const app = express();
const port = process.env.port || 3000;
const session = require("express-session");
var favicon = require("serve-favicon");

app.use(
  session({
    secret: "ryans super secret thingy",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function(req, res, next) {
  if (!req.session.resultingArtists) {
    req.session.resultingArtists = {};
  }
  if (!req.session.resultingArtist) {
    req.session.resultingArtist = {};
  }

  next();
});

// The below path is available to all client requesters. Note that node serves these static files, the client can't directly acces them. You may also add links to external CDNs like bootstrap here.
app.use(express.static(path.join(__dirname, "/Public")));

app.use(favicon(path.join(__dirname, "Public/SavedImages", "favicon.ico")));

// Tell app we are going to use a template engine
app.set("views", "./Src/views");
app.set("view engine", "ejs");

const nav = [{ link: "/", title: "Upload new+" }, { link: "/ArtistResultsView", title: "Artist Results" }, { link: "/ArtistDetailsView", title: "Artist Details" }];
const myArtistRouter = require("./Src/routes/artistRoutes")(nav);

//myArtistRouter will be used for the "/" path, as well as all child paths.
app.use("/", myArtistRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
