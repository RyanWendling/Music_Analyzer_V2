const express = require("express");
const artistRouter = express.Router();

function router(nav) {
  const passedInArtists = [
    {
      name: "Kasabian",
      similarityScore: 0.55,
      url: "https//example.com"
    },
    {
      name: "Beck",
      similarityScore: 0.45,
      url: "https//example.com"
    },
    {
      name: "Black Keys",
      similarityScore: 0.72,
      url: "https//example.com"
    }
  ];

  artistRouter.route("/").get((request, response) => {
    response.render("ArtistResultsView", {
      nav,
      maTitle: "MaLibrarah",
      passedInArtists
    });
  });

  artistRouter.route("/:id").get((request, response) => {
    const { id } = request.params;
    response.render("ArtistDetailsView", {
      nav,
      maTitle: "MaLibrarah",
      passedInArtist: passedInArtists.find(x => x.name === id)
    });
  });
  return artistRouter;
}

module.exports = router;
