const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const session = require("express-session");
var MemoryStore = require("memorystore")(session);
var favicon = require("serve-favicon");
var compression = require("compression");
var helmet = require("helmet");

app.use(helmet());

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    secret: "ryans super secret thingy",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  if (!req.session.resultingArtists) {
    req.session.resultingArtists = {};
  }
  if (!req.session.resultingArtist) {
    req.session.resultingArtist = {};
  }
  // see if user has already visited a certain results page
  if (!req.session.resultsPageVisited) {
    req.session.resultsPageVisited = {};
  }
  if (!req.session.singleArtistInfo) {
    req.session.singleArtistInfo = {};
  }
  next();
});

// Compress all routes
app.use(compression());

// The below path is available to all client requesters. Note that node serves these static files, the client can't directly acces them. You may also add links to external CDNs like bootstrap here.
app.use(express.static(path.join(__dirname, "/Public")));

app.use(favicon(path.join(__dirname, "Public/SavedImages", "favicon.ico")));

// Tell app we are going to use a template engine
app.set("views", "./Src/views");
app.set("view engine", "ejs");

const nav = [
  { link: "/", title: "Upload new+" },
  { link: "/ArtistResultsView", title: "Artist Results" },
  { link: "/ArtistDetailsView", title: "Artist Details" },
];
const myArtistRouter = require("./Src/routes/artistRoutes")(nav);

//myArtistRouter will be used for the "/" path, as well as all child paths.
app.use("/", myArtistRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
