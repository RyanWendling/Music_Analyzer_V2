const Scraper = require("images-scraper");
const fs = require("fs");
const request = require("request");

// TODO: check hashmap / filesystem to see if image has already been saved for currentArtist

function download(uri, filename, callback) {
  console.log(filename);
  request.head(uri, function(err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri)
      .pipe(fs.createWriteStream(`${__dirname}/SavedImages/${filename}`))
      .on("close", callback);
  });
}

function ScrapeAndSave(theCurrentArtist) {
  // Below used to be seperate setup
  const google = new Scraper.Google({
    keyword: theCurrentArtist,
    limit: 2,
    puppeteer: {
      headless: true
    },
    tbs: {
      // every possible tbs search option, some examples and more info: http://jwebnet.net/advancedgooglesearch.html
      isz: undefined, // options: l(arge), m(edium), i(cons), etc.
      itp: undefined, // options: clipart, face, lineart, news, photo
      ic: undefined, // options: color, gray, trans
      sur: undefined // options: fmc (commercial reuse with modification), fc (commercial reuse), fm (noncommercial reuse with modification), f (noncommercial reuse)
    }
  });
  (async () => {
    const results = await google.start();
    try {
      let EndOfFileNumm = 0;
      // Create folder for images, if folder doesn't yet exist
      if (!fs.existsSync(`${__dirname}/SavedImages/`)) {
        fs.mkdirSync(`${__dirname}/SavedImages/`, { recursive: true }, err => {
          if (err) throw err;
        });
      }
      results.forEach(item => {
        EndOfFileNumm += 1;
        //let url = item.url;
        //const name = url.lastIndexOf("/");
        //const filename = url.substring(name + 1);
        //console.log(filename);
        download(item.url, `filename${EndOfFileNumm}.jpg`, function() {
          console.log("done");
        });
      });
    } catch (err) {
      console.log("err", err);
    }
    //console.log("results", results);
  })();
}

ScrapeAndSave("pikachu");

//module.exports = ImageScrapeAndSave;
