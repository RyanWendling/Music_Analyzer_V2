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
      request.session.resultsPageVisited = {};
      request.session.resultingArtists = passedInArtists;
      response.redirect("/ArtistResultsView");
    })();
  }

  // Get all artists. Unless uploading a new file, this will simply load the cached artists results.
  function GetAllArtists(request, response, passedInArtists) {
    (async () => {
      passedInArtists = request.session.resultingArtists;
      let curPageVisited = request.query.page;
      request.session.resultsPageVisited[curPageVisited] = "true";
      response.render("ArtistResultsView", {
        nav,
        maTitle: "Artist Results",
        passedInArtists,
      });
    })();
  }

  // Show additional info about an artist after all artists have been loaded in.
  function GetAdditionalInfo(request, response, passedInArtists) {
    const { id } = request.params;
    if (id === "/favicon.ico") {
      r.writeHead(200, { "Content-Type": "Public/SavedImages/myIcon" });
      r.end();
      console.log("favicon requested");
      return;
    } else if (id !== "ArtistDetailsView" || id === "") {
      request.session.resultingArtist = passedInArtists.find((curArtistArr) => curArtistArr[0] === id);
      if (request.session.resultingArtist === undefined) {
        request.session.resultingArtist = {};
      }
    }

    response.render("ArtistDetailsView", {
      nav,
      maTitle: "Artist Details",
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
