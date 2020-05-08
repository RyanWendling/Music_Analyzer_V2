const express = require("express");
const artistRouter = express.Router();
const path = require("path");
const myMulter = require("multer");
var upload = myMulter({
  dest: "/uploads",
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
}).single("playlist_xml");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /xml/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only XML files are allowed."));
  }
}
const artistController = require("../controllers/ArtistController");
const artistAnalyzerService = require("../services/SimilarArtistAnalyzer");

function router(nav) {
  const { GetUploadForm, PostFormAndGenerateAllArtists, GetAllArtists, GetAdditionalInfo } = artistController(artistAnalyzerService, nav);
  let passedInArtists = [["Kasabian", 0.55], ["Beck", 0.45], ["Black Keys", 0.72]];

  // Get File upload form
  artistRouter.route("/").get((request, response, next) => {
    GetUploadForm(request, response);
  });

  // Calculate uploaded XML file and load main page with results.
  artistRouter.route("/ArtistResultsView").post((request, response, next) => {
    upload(request, response, (err) => {
      if (err) return response.status(500).send({ success: false, message: "File is not valid XML." });
      const file = request.file;
      if (!file) {
        return response.status(500).send({ success: false, message: "Please upload a file." });
      }
      PostFormAndGenerateAllArtists(request, response, passedInArtists);
    });
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
