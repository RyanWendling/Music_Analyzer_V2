const express = require("express");
const artistRouter = express.Router();
const myMulter = require("multer");
var upload = myMulter({ dest: "/uploads" });
const artistController = require("../controllers/ArtistController");
const artistAnalyzerService = require("../services/SimilarArtistAnalyzer");

function router(nav) {
  const { GetUploadForm, PostFormAndGenerateAllArtists, GetAllArtists, GetAdditionalInfo } = artistController(artistAnalyzerService, nav);
  let passedInArtists = [["Kasabian", 0.55], ["Beck", 0.45], ["Black Keys", 0.72]];

  // Get File upload form
  artistRouter.route("/").get((request, response, next) => {
    GetUploadForm(request, response);
  });

  artistRouter.route("/ArtistResultsView").post(upload.single("playlist_xml"), (request, response, next) => {
    PostFormAndGenerateAllArtists(request, response, passedInArtists);
  });

  // Get all artists
  artistRouter.route("/ArtistResultsView").get((request, response, next) => {
    GetAllArtists(request, response, passedInArtists);
  });

  // Show additional info about an artist after all artists have been loaded in.
  artistRouter.route("/:id").get((request, response, next) => {
    GetAdditionalInfo(request, response, request.session.resultingArtists);
  });

  return artistRouter;
}

module.exports = router;
