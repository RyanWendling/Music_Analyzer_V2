// IMPORTS
const request = require("request");
// const ryanModule = require("./myModule.js");
const myDash_ = require("lodash");
const httpObj = require("http");
const appWebServerObj = httpObj.createServer();
const fileServer = require("fs");
const convert = require("xml-js");
const xml = require("xml-parse");

function traverse(jsonObj, matchingString, resultingArray) {
  for (var i in jsonObj) {
    //func.apply(this,[i,o[i]]);
    if (jsonObj[i] !== null && typeof jsonObj[i] == "object") {
      if (jsonObj[i].name == "dict") {
        //console.log(i, jsonObj[i]);
        resultingArray.push(jsonObj[i]);
      }
      //going one step down in the object tree!!
      traverse(jsonObj[i], matchingString, resultingArray);
    }
  }
}

// READ IN DEMO LIBRARY
function readInLibrary() {
  return new Promise(resolve => {
    fileServer.readFile("./GuitarBrah.xml", "utf-8", (err, data) => {
      /*var xmlSongsRoot = new xml.DOM(xml.parse(data));
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
      }*/

      var jsonSongs = convert.xml2json(data, { compact: false, spaces: 4 });
      var jsonSongsObj = JSON.parse(jsonSongs);
      var dictArray = [];
      traverse(jsonSongsObj, "dict", dictArray); //.document.getElementsByTagName("dict");
      var jsonArtistValueMap = new Map();

      for (let k = 2; k < dictArray.length; k++) {
        let jsonCurrentSongDict = dictArray[k];
        for (let i = 0; i < jsonCurrentSongDict.elements.length; i++) {
          if (jsonCurrentSongDict.elements[i].hasOwnProperty("elements")) {
            var textualValueForCurrentNestedElement = jsonCurrentSongDict.elements[i].elements[0].text;
            if (textualValueForCurrentNestedElement == "Artist") {
              let jsonArtistValue = jsonCurrentSongDict.elements[i + 1].elements[0].text;
              if (jsonArtistValueMap.has(jsonArtistValue)) {
                jsonArtistValueMap.set(jsonArtistValue, jsonArtistValueMap.get(jsonArtistValue) + 1);
              } else {
                jsonArtistValueMap.set(jsonArtistValue, 1);
              }
            }
          }
        }
      }

      resolve(jsonArtistValueMap);
    });
  });
}

// MAIN FUNCTION FOR THIS MODULE
async function AnalyzeMusic() {
  const ArtistsMap = await readInLibrary();
  //console.log("result: ", resultYo);
  for (let [key, value] of ArtistsMap) {
    console.log(key + " = " + value);
  }
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
