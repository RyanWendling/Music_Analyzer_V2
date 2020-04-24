function ArtistController(artistAnalyzerService, nav) {
  // Get all artists
  function GetAllArtists(request, response, passedInArtists) {
    (async () => {
      passedInArtists = await artistAnalyzerService.AnalyzeMusic();
      response.render("ArtistResultsView", {
        nav,
        maTitle: "MaLibrarah",
        passedInArtists,
        formatArtistNameHandler: "formatArtistNameForAlbumArt();",
      });
    })();
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
