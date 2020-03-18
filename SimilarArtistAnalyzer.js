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

async function downloadFile(url, path) {
  const res = await fetch(url);
  const fileStream = fileServer.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", err => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
}

// TODO: ADD FUNCTIONALITY() TO GET IMAGES VIA DEEZER API. WILL PERFORM CHECK BEFOREHAND TO SEE IF IMAGES EXIST IN IMAGE FOLDER.
async function DownloadAndCheckArtistArtwork(anArtistName) {
  if (fileServer.existsSync(`./SavedImages/${anArtistName}250`)) {
    return true;
  }
  try {
    const anAPIResponse = await fetch(`https://api.deezer.com/artist/${anArtistName}`);
    const anAPIResponseJSON = await anAPIResponse.json();
    const downloadFileResponse = downloadFile(anAPIResponseJSON.picture_medium, `./SavedImages/${anArtistName}250.jpg`);
  } catch (e) {
    console.log(`${e} error downloading image`);
    return false;
  }
  return true;
}

// Will take API response, parse out artist name and similarity rating, compare to importedArtists map to see if artist already exists (remove whitespace, make lowercase).
// If new artist doesn't exist within importedArtists map, artistname and similarity rating will then be added to resultsMap. resultsMap will be used after API calls are complete for additional calculations.
async function CalculateAPIResults(apiResponse, importedArtists, resultsMap = new Map(), multiplier) {
  console.log("in calculateAPIResults");
  apiResponse.similarartists.artist.forEach(async curArtist => {
    // console.log(curArtist.name);
    if (!importedArtists.has(curArtist.name.toLowerCase())) {
      if (!resultsMap.has(curArtist.name)) {
        const artworkExists = await DownloadAndCheckArtistArtwork(curArtist.name);
        resultsMap.set(curArtist.name, parseFloat(curArtist.match) * multiplier);
      } else {
        resultsMap.set(curArtist.name, resultsMap.get(curArtist.name) + parseFloat(curArtist.match) * multiplier);
      }
    }
  });
  return resultsMap;
}

// READ IN DEMO LIBRARY
function readInLibrary() {
  return new Promise(resolve => {
    fileServer.readFile("./SavedPlaylists/testPlaylist.xml", "utf-8", (err, data) => {
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
              const jsonArtistValue = jsonCurrentSongDict.elements[i + 1].elements[0].text.toLowerCase();
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
  const artistsMap = await readInLibrary();
  const resultsFromCalculateAPIResults = new Map();
  // ASGFAWGTAERGAEWGE
  const resultttt = await DownloadAndCheckArtistArtwork("Gorillaz");
  for (let [key, value] of artistsMap) {
    console.log(key + " = " + value);
    const anAPIResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURI(key)}&autocorrect=1&api_key=f28c377cc9c4485831f3bcf5b9e1670a&format=json`);
    const anAPIResponseJSON = await anAPIResponse.json();
    if (anAPIResponseJSON.hasOwnProperty("error")) {
      continue;
    }
    //console.log(anAPIResponseJSON);
    CalculateAPIResults(anAPIResponseJSON, artistsMap, resultsFromCalculateAPIResults, value);
  }
  // const sortedResults = new Map([...resultsFromCalculateAPIResults.entries()].sort((a, b) => b[1] - a[1]));
  const sortedResults = [...resultsFromCalculateAPIResults.entries()].sort((a, b) => b[1] - a[1]);
  console.log(sortedResults.slice(0, 50));
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
