// IMPORTS
const fetch = require("node-fetch");
const httpObj = require("http");
const fileServer = require("fs");
const convert = require("xml-js");

// const xml = require("xml-parse");
// const ryanModule = require("./myModule.js");

function traverse(jsonObj, matchingString, resultingArray) {
  for (var i in jsonObj) {
    if (jsonObj[i] !== null && typeof jsonObj[i] == "object") {
      if (jsonObj[i].name == matchingString) {
        resultingArray.push(jsonObj[i]);
      }
      // going one step down in the object tree!!
      traverse(jsonObj[i], matchingString, resultingArray);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Will take API response, parse out artist name and similarity rating, compare to importedArtists map to see if artist already exists (remove whitespace, make lowercase).
// If new artist doesn't exist within importedArtists map, artistname and similarity rating will then be added to resultsMap. resultsMap will be used after API calls are complete for additional calculations.
function CalculateAPIResults(apiResponse, resultsMap, importedArtists) {
  console.log("in calculateAPIResults");
}

// READ IN DEMO LIBRARY
function readInLibrary() {
  return new Promise(resolve => {
    fileServer.readFile("./testPlaylist.xml", "utf-8", (err, data) => {
      const jsonSongs = convert.xml2json(data, { compact: false, spaces: 4 });
      const jsonSongsObj = JSON.parse(jsonSongs);
      const dictArray = [];
      traverse(jsonSongsObj, "dict", dictArray);
      const jsonArtistValueMap = new Map();

      for (let k = 2; k < dictArray.length; k++) {
        const jsonCurrentSongDict = dictArray[k];
        for (let i = 0; i < jsonCurrentSongDict.elements.length; i++) {
          if (jsonCurrentSongDict.elements[i].hasOwnProperty("elements")) {
            const textualValueForCurrentNestedElement = jsonCurrentSongDict.elements[i].elements[0].text;
            if (textualValueForCurrentNestedElement == "Artist") {
              const jsonArtistValue = jsonCurrentSongDict.elements[i + 1].elements[0].text;
              if (jsonArtistValueMap.has(jsonArtistValue)) {
                jsonArtistValueMap.set(jsonArtistValue, jsonArtistValueMap.get(jsonArtistValue) + 1);
              } else {
                jsonArtistValueMap.set(jsonArtistValue, 1);
              }
            }
          }
        }
      }
      // sleep(10000).then(() => {
      //  console.log("World!");
      resolve(jsonArtistValueMap);
      // });
    });
  });
}

// MAIN FUNCTION FOR THIS MODULE -------------------------------------------------------------------------------------------------------------------------
async function AnalyzeMusic() {
  let resultsFromCalculateAPIResults;
  const artistsMap = await readInLibrary();
  for (let [key, value] of artistsMap) {
    console.log(key + " = " + value);
  }

  const anAPIResponse = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistsMap.keys().next().value}&api_key=f28c377cc9c4485831f3bcf5b9e1670a&format=json`
  );
  const anAPIResponseJSON = await anAPIResponse.json();
  console.log(anAPIResponseJSON);

  CalculateAPIResults(anAPIResponseJSON, resultsFromCalculateAPIResults, artistsMap);
}

// PROGRAM START
const appWebServerObj = httpObj.createServer();

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

console.log("close server");
appWebServerObj.close();
