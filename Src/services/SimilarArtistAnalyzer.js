// IMPORTS
const fetch = require("node-fetch");
// const httpObj = require("http");
const fileServer = require("fs");
const convert = require("xml-js");
const myLinkedListClass = require("./LinkedList.js");

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

async function downloadFile(url, path) {
  const res = await fetch(url);
  const fileStream = fileServer.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
}

// Will check if similar artist artwork already exists in local storage. Will download artwork if artwork doesn't exist via Deezer API.
async function DownloadAndCheckArtistArtwork(anArtistName) {
  console.log("inside DownloadAndCheckArtistArtwork");
  const formattedArtistName = anArtistName.replace(/[' .]/g, "-");
  const formattedArtistNameNoDups = myLinkedListClass.RemoveDuplicate(formattedArtistName, "-");
  if (fileServer.existsSync(`./Public/SavedImages/${formattedArtistNameNoDups}250`)) {
    return true;
  }
  try {
    const anAPIResponse = await fetch(`https://api.deezer.com/artist/${encodeURI(formattedArtistNameNoDups)}`);
    const anAPIResponseJSON = await anAPIResponse.json();
    //const downloadFileResponse = await downloadFile(anAPIResponseJSON.picture_medium, `./SavedImages/${formattedArtistNameNoDups}250.jpg`);
    const downloadFileResponse = await downloadFile(anAPIResponseJSON.picture_medium, `./Public/SavedImages/${anArtistName}250.jpg`);
  } catch (e) {
    console.log(`exception:${e}.  INFO:Error downloading image`);
    return false;
  }
  return true;
}

// Will take API response, parse out artist name and similarity rating, compare to importedArtists map to see if artist already exists (remove whitespace, make lowercase).
// If new artist doesn't exist within importedArtists map, artistname and similarity rating will then be added to resultsMap. resultsMap will be used after API calls are complete for additional calculations.
async function CalculateAPIResults(apiResponse, importedArtists, resultsMap = new Map(), multiplier) {
  console.log("in calculateAPIResults");

  const promises = apiResponse.similarartists.artist.map(async (curArtist) => {
    if (!importedArtists.has(curArtist.name.toLowerCase())) {
      if (!resultsMap.has(curArtist.name)) {
        const artworkExists = await DownloadAndCheckArtistArtwork(curArtist.name);
        // const artworkExists = await DownloadAndCheckArtistArtwork("foals");
        resultsMap.set(curArtist.name, parseFloat(curArtist.match) * multiplier);
      } else {
        resultsMap.set(curArtist.name, resultsMap.get(curArtist.name) + parseFloat(curArtist.match) * multiplier);
      }
    }
  });
  await Promise.all(promises);
  console.log("finished");
  return resultsMap;
}

// READ IN DEMO LIBRARY
function readInLibrary() {
  return new Promise((resolve) => {
    fileServer.readFile("./Public/SavedPlaylists/testPlaylist.xml", "utf-8", (err, data) => {
      const jsonSongs = convert.xml2json(data, { compact: false, spaces: 4 });
      const jsonSongsObj = JSON.parse(jsonSongs);
      const dictArray = [];
      traverse(jsonSongsObj, "dict", dictArray);
      const jsonArtistValueMap = new Map();

      for (let k = 2; k < dictArray.length; k += 1) {
        const jsonCurrentSongDict = dictArray[k];
        for (let i = 0; i < jsonCurrentSongDict.elements.length; i += 1) {
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
      resolve(jsonArtistValueMap);
    });
  });
}

// MAIN FUNCTION FOR THIS MODULE -------------------------------------------------------------------------------------------------------------------------
// Read in a specified xml itunes library file and output similar artists.
async function AnalyzeMusic() {
  const artistsMap = await readInLibrary();
  const resultsFromCalculateAPIResults = new Map();

  for (let [key, value] of artistsMap) {
    console.log(key + " = " + value);
    const anAPIResponse = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURI(key)}&autocorrect=1&api_key=f28c377cc9c4485831f3bcf5b9e1670a&format=json&limit=3`);
    const anAPIResponseJSON = await anAPIResponse.json();
    if (anAPIResponseJSON.hasOwnProperty("error")) {
      console.log("artist wasnt found in LastFM API");
      continue;
    }
    console.log("done fetching initial lastfm data for 1 artist");
    const promise = await CalculateAPIResults(anAPIResponseJSON, artistsMap, resultsFromCalculateAPIResults, value);
  }
  // const sortedResults = new Map([...resultsFromCalculateAPIResults.entries()].sort((a, b) => b[1] - a[1]));
  const sortedResults = [...resultsFromCalculateAPIResults.entries()].sort((a, b) => b[1] - a[1]);
  console.log(sortedResults.slice(0, 50));
  return sortedResults.slice(0, 50);
}

exports.AnalyzeMusic = AnalyzeMusic;
