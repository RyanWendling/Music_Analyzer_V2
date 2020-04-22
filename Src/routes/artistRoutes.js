const express = require("express");
const artistRouter = express.Router();
const artistController = require("../controllers/ArtistController");
const artistAnalyzerService = require("../services/SimilarArtistAnalyzer");

function router(nav) {
  const { GetAllArtists, GetAdditionalInfo } = artistController(artistAnalyzerService, nav);
  let passedInArtists = [
    {
      name: "Kasabian",
      similarityScore: 0.55,
      url: "https//example.com",
    },
    {
      name: "Beck",
      similarityScore: 0.45,
      url: "https//example.com",
    },
    {
      name: "Black Keys",
      similarityScore: 0.72,
      url: "https//example.com",
    },
  ];

  // Get all artists
  artistRouter.route("/").get((request, response) => {
    GetAllArtists(request, response, passedInArtists);
  });

  // TODO: make passedInArtists Data from above call CACHED!
  // Show additional info about an artist after all artists have been loaded in.
  artistRouter.route("/:id").get((request, response) => {
    GetAdditionalInfo(request, response, passedInArtists);
  });

  return artistRouter;
}

module.exports = router;
