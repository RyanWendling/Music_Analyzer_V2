// IMPORTS
const request = require("request");
// const ryanModule = require("./myModule.js");
const myDash_ = require("lodash");
const httpObj = require("http");
const appWebServerObj = httpObj.createServer();
const fileServer = require("fs");
const convert = require("xml-js");
const xml = require("xml-parse");

const iterate = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == "Artist") {
      console.log(`key: ${key}, value: ${obj[key]}`);
    }
    if (typeof obj[key] === "object") {
      iterate(obj[key]);
    }
  });
};

// READ IN DEMO LIBRARY
function readInLibrary() {
  return new Promise(resolve => {
    fileServer.readFile("./testPlaylist.xml", "utf-8", (err, data) => {
      var xmlSongsRoot = new xml.DOM(xml.parse(data));
      var xmlSongsDicts = xmlSongsRoot.document.getElementsByTagName("dict");
      var xmlArtistValueMap = new Map();

      for (let k = 2; k < xmlSongsDicts.length; k++) {
        let xmlCurrentSongDict = xmlSongsDicts[k];
        for (let i = 0; i < xmlCurrentSongDict.childNodes.length; i++) {
          if (xmlCurrentSongDict.childNodes[i].innerXML == "Artist") {
            let xmlArtistValue = xmlCurrentSongDict.childNodes[i + 1].innerXML;
            if (xmlArtistValueMap.has(xmlArtistValue)) {
              xmlArtistValueMap.set(
                xmlArtistValue,
                xmlArtistValueMap.get(xmlArtistValue) + 1
              );
            } else {
              xmlArtistValueMap.set(xmlArtistValue, 1);
            }
          }
        }
      }

      //console.log("wut");
      //var jsonSongs = convert.xml2json(data, { compact: false, spaces: 4 });
      //var jsonSongsObj = JSON.parse(jsonSongs);
      //iterate(jsonSongsObj);
      resolve(xmlArtistValueMap);
    });
  });
}

// MAIN FUNCTION FOR THIS MODULE
async function AnalyzeMusic() {
  const resultYo = await readInLibrary();
  //console.log("result: ", resultYo);
  console.log("result: ", Object.keys(resultYo));
}

// SERVER SETUP TEST
appWebServerObj
  .on("request", (request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello World");
    response.end();
  })
  .listen(3001);

AnalyzeMusic();

// TEST MODULE IMPORT
// console.log(ryanModule.myText);

request(
  "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=radiohead&track=paranoid+android&api_key=f28c377cc9c4485831f3bcf5b9e1670a&format=json",
  { json: true },
  (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    //console.log(JSON.stringify(body));
  }
);

console.log("close server");
appWebServerObj.close();

// 0. Get server up and running (host HTML landing page & API fuctions())
// 1. Read in XML library, either through filesystem or front-end API PUT request
// 2. Save XML in JSON / JS object song(module?) format
// 3. Access Spotify API and run algorithm
// 4. print / return results.
// later: save results to DB. Spruce up front-end with React.
// NEW IDEA: GET SIMILAR ARTISTS FROM ONES THAT DONT EXIST IN PLAYLIST, DISPLAY HIGHEST RETURNED COUNT

/*request('http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=Kasabian&api_key=f28c377cc9c4485831f3bcf5b9e1670a&format=json',
	{ json: true }, (error, response, body) => {
		if (error) {
			return console.log(error);
		}
		console.log(JSON.stringify(body));
	});*/
