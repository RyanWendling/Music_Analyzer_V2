function ArtistController(artistAnalyzerService, nav) {
  // Get upload playlist form
  function GetUploadForm(request, response) {
    (async () => {
      response.render("FileUploadView", {
        nav,
        maTitle: "Upload here yo",
      });
    })();
  }

  // post playlist form and generate all artists
  function PostFormAndGenerateAllArtists(request, response) {
    (async () => {
      let passedInArtists = await artistAnalyzerService.AnalyzeMusic(request.file);
      request.session.resultingArtists = passedInArtists;
      response.render("ArtistResultsView", {
        nav,
        maTitle: "MaLibrarah",
        passedInArtists,
      });
    })();
  }

  // Get all artists
  function GetAllArtists(request, response, passedInArtists) {
    (async () => {
      //passedInArtists = await artistAnalyzerService.AnalyzeMusic();
      //request.session.resultingArtists = passedInArtists;
      passedInArtists = request.session.resultingArtists;
      response.render("ArtistResultsView", {
        nav,
        maTitle: "MaLibrarah",
        passedInArtists,
      });
    })();
  }

  // Show additional info about an artist after all artists have been loaded in.
  function GetAdditionalInfo(request, response, passedInArtists) {
    const { id } = request.params;
    if (id !== "ArtistDetailsView" || id === "") {
      request.session.resultingArtist = passedInArtists.find((curArtistArr) => curArtistArr[0] === id);
      if (request.session.resultingArtist === undefined) {
        request.session.resultingArtist = {};
      }
    }

    response.render("ArtistDetailsView", {
      nav,
      maTitle: "MaDetails",
      passedInArtist: request.session.resultingArtist,
    });
  }
  return {
    GetAllArtists,
    PostFormAndGenerateAllArtists,
    GetAdditionalInfo,
    GetUploadForm,
  };
}

module.exports = ArtistController;
