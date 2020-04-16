function ArtistController(nav) {
  // Get all artists
  function GetAllArtists(request, response, passedInArtists) {
    response.render("ArtistResultsView", {
      nav,
      maTitle: "MaLibrarah",
      passedInArtists,
    });
  }

  // Show additional info about an artist after all artists have been loaded in.
  function GetAdditionalInfo(request, response, passedInArtists) {
    const { id } = request.params;
    response.render("ArtistDetailsView", {
      nav,
      maTitle: "MaLibrarah",
      passedInArtist: passedInArtists.find((x) => x.name === id),
    });
  }
  return {
    GetAllArtists,
    GetAdditionalInfo,
  };
}

module.exports = ArtistController;
