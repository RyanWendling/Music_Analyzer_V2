const express = require("express");
const artistRouter = express.Router();
const artistController = require("../controllers/ArtistController");

function router(nav) {
  const { GetAllArtists, GetAdditionalInfo } = artistController(nav);
  const passedInArtists = [
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

  // Show additional info about an artist after all artists have been loaded in.
  artistRouter.route("/:id").get((request, response) => {
    GetAdditionalInfo(request, response, passedInArtists);
  });

  return artistRouter;
}

module.exports = router;
