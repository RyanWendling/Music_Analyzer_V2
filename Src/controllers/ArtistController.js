function ArtistController(artistAnalyzerService, nav) {
  // Get upload playlist form
  function GetUploadForm(request, response) {
    (async () => {
      response.render("FileUploadView", {
        nav,
        maTitle: "MusicMatch",
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

  // Get all artists. Unless uploading a new file, this will simply load the cached artists results. Includes logic to return artists 50 at a time, and to calculate album artwork, if program hasn't already done so (page isn't yet visited).
  function GetAllArtists(request, response, passedInArtists = []) {
    (async () => {
      let curPageVisited = request.query.page;
      if (curPageVisited == undefined || curPageVisited == null) {
        curPageVisited = 0;
      }

      curPageVisited = parseInt(curPageVisited);
      if (!Array.isArray(request.session.resultingArtists)) {
        request.session.resultingArtists = [];
      }

      let lowerRange = curPageVisited * 50;
      let upperRange = (curPageVisited + 1) * 50;
      passedInArtists = request.session.resultingArtists.slice(lowerRange, upperRange);

      if (request.session.resultsPageVisited[curPageVisited] != "true") {
        // Download artist artwork, 50 artists(one page) at a time
        await artistAnalyzerService.DownloadAndCheckMultipleArtistArtwork(passedInArtists);
      }
      request.session.resultsPageVisited[curPageVisited] = "true";

      response.render("ArtistResultsView", {
        nav,
        maTitle: "Artist Results",
        passedInArtists,
      });
    })();
  }

  // Show additional info about an artist after all artists have been loaded in.
  function GetAdditionalInfo(request, response, passedInArtists = []) {
    (async () => {
      const { id } = request.params;
      let numberOfArtistsPassedIn = Object.keys(passedInArtists).length;

      // Edge case where browser tries to find the favicon icon.
      if (id === "/favicon.ico") {
        r.writeHead(200, { "Content-Type": "Public/SavedImages/myIcon" });
        r.end();
        console.log("favicon requested");
        return;

        // Download large album artwork and fetch artist summary, assuming conditions are met.
      } else if (id !== "ArtistDetailsView" && id !== "" && numberOfArtistsPassedIn !== 0) {
        request.session.singleArtistInfo = "No band summary available.";
        request.session.resultingArtist = passedInArtists.find((curArtistArr) => curArtistArr[0] === id);
        if (request.session.resultingArtist === undefined) {
          request.session.resultingArtist = {};
        } else {
          request.session.singleArtistInfo = await artistAnalyzerService.AnalyzeInfoForSingleArtist(request.session.resultingArtist[0]);
          let singleArtistBigImageBoolean = await artistAnalyzerService.DownloadAndCheckArtistArtwork(request.session.resultingArtist[0], 500);
        }
      }

      response.render("ArtistDetailsView", {
        nav,
        maTitle: "Artist Details",
        passedInArtist: request.session.resultingArtist,
        singleArtistInfo: request.session.singleArtistInfo,
      });
    })();
  }

  return {
    GetAllArtists,
    PostFormAndGenerateAllArtists,
    GetAdditionalInfo,
    GetUploadForm,
  };
}

module.exports = ArtistController;
